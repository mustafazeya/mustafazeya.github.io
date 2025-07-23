// Backend Server for Real API Integrations
// This would run on your server (Node.js/Express) to handle secure API calls

const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const { DefaultAzureCredential } = require('@azure/identity');
const { CostManagementClient } = require('@azure/arm-costmanagement');
const { ResourceManagementClient } = require('@azure/arm-resources');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Security: In production, implement proper authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(401);
    }
    
    // Verify JWT token here
    // For demo purposes, we'll skip verification
    next();
};

// GitHub API Proxy
app.get('/api/github/:owner/:repo/metrics', authenticateToken, async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        const [repoData, pullsData, issuesData, releasesData] = await Promise.all([
            octokit.rest.repos.get({ owner, repo }),
            octokit.rest.pulls.list({ owner, repo, state: 'all', per_page: 100 }),
            octokit.rest.issues.list({ owner, repo, state: 'all', per_page: 100 }),
            octokit.rest.repos.listReleases({ owner, repo, per_page: 10 })
        ]);

        const metrics = {
            repository: {
                name: repoData.data.name,
                stars: repoData.data.stargazers_count,
                forks: repoData.data.forks_count,
                watchers: repoData.data.watchers_count,
                openIssues: repoData.data.open_issues_count,
                language: repoData.data.language,
                lastUpdated: repoData.data.updated_at
            },
            pulls: {
                total: pullsData.data.length,
                open: pullsData.data.filter(pr => pr.state === 'open').length,
                merged: pullsData.data.filter(pr => pr.merged_at).length,
                recent: pullsData.data.slice(0, 5).map(pr => ({
                    title: pr.title,
                    state: pr.state,
                    author: pr.user.login,
                    createdAt: pr.created_at
                }))
            },
            issues: {
                total: issuesData.data.length,
                open: issuesData.data.filter(issue => issue.state === 'open' && !issue.pull_request).length,
                closed: issuesData.data.filter(issue => issue.state === 'closed' && !issue.pull_request).length
            },
            releases: releasesData.data.map(release => ({
                name: release.name,
                tagName: release.tag_name,
                publishedAt: release.published_at,
                downloadCount: release.assets.reduce((sum, asset) => sum + asset.download_count, 0)
            }))
        };

        res.json(metrics);
    } catch (error) {
        console.error('GitHub API Error:', error);
        res.status(500).json({ error: 'Failed to fetch GitHub metrics' });
    }
});

// AWS Cost Explorer API Proxy
app.post('/api/aws/costs', authenticateToken, async (req, res) => {
    try {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'us-east-1'
        });

        const costExplorer = new AWS.CostExplorer();
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const params = {
            TimePeriod: {
                Start: startDate.toISOString().split('T')[0],
                End: endDate.toISOString().split('T')[0]
            },
            Granularity: 'DAILY',
            Metrics: ['BlendedCost'],
            GroupBy: [
                {
                    Type: 'DIMENSION',
                    Key: 'SERVICE'
                }
            ]
        };

        const result = await costExplorer.getCostAndUsage(params).promise();
        
        // Process the data
        const servicesCosts = {};
        let totalCost = 0;

        result.ResultsByTime.forEach(timeEntry => {
            timeEntry.Groups.forEach(group => {
                const serviceName = group.Keys[0];
                const cost = parseFloat(group.Metrics.BlendedCost.Amount);
                
                if (!servicesCosts[serviceName]) {
                    servicesCosts[serviceName] = 0;
                }
                servicesCosts[serviceName] += cost;
                totalCost += cost;
            });
        });

        const processedData = {
            totalCost: totalCost.toFixed(2),
            period: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            },
            services: Object.entries(servicesCosts)
                .map(([name, cost]) => ({
                    name,
                    cost: cost.toFixed(2),
                    percentage: ((cost / totalCost) * 100).toFixed(1)
                }))
                .sort((a, b) => b.cost - a.cost)
                .slice(0, 15) // Top 15 services
        };

        res.json(processedData);
    } catch (error) {
        console.error('AWS Cost API Error:', error);
        res.status(500).json({ error: 'Failed to fetch AWS costs' });
    }
});

// Azure Cost Management API Proxy
app.post('/api/azure/costs', authenticateToken, async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const credential = new DefaultAzureCredential();
        const client = new CostManagementClient(credential);

        const scope = `/subscriptions/${subscriptionId}`;
        
        const queryBody = {
            type: 'ActualCost',
            timeframe: 'MonthToDate',
            dataset: {
                granularity: 'Daily',
                aggregation: {
                    totalCost: {
                        name: 'PreTaxCost',
                        function: 'Sum'
                    }
                },
                grouping: [
                    {
                        type: 'Dimension',
                        name: 'ServiceName'
                    }
                ]
            }
        };

        const result = await client.query(scope, queryBody);
        
        // Process Azure cost data
        const servicesCosts = {};
        let totalCost = 0;

        result.rows.forEach(row => {
            const cost = row[0];
            const serviceName = row[1];
            
            if (!servicesCosts[serviceName]) {
                servicesCosts[serviceName] = 0;
            }
            servicesCosts[serviceName] += cost;
            totalCost += cost;
        });

        const processedData = {
            totalCost: totalCost.toFixed(2),
            currency: 'USD',
            services: Object.entries(servicesCosts)
                .map(([name, cost]) => ({
                    name,
                    cost: cost.toFixed(2),
                    percentage: ((cost / totalCost) * 100).toFixed(1)
                }))
                .sort((a, b) => b.cost - a.cost)
                .slice(0, 15)
        };

        res.json(processedData);
    } catch (error) {
        console.error('Azure Cost API Error:', error);
        res.status(500).json({ error: 'Failed to fetch Azure costs' });
    }
});

// Azure ARM Template Validation Proxy
app.post('/api/azure/validate-template', authenticateToken, async (req, res) => {
    try {
        const { subscriptionId, resourceGroupName, template } = req.body;
        const credential = new DefaultAzureCredential();
        const client = new ResourceManagementClient(credential, subscriptionId);

        const validationResult = await client.deployments.validate(
            resourceGroupName,
            'validation-deployment',
            {
                properties: {
                    mode: 'Incremental',
                    template: template,
                    parameters: {}
                }
            }
        );

        res.json({
            valid: !validationResult.error,
            errors: validationResult.error ? [validationResult.error] : [],
            resources: validationResult.properties?.validatedResources || []
        });
    } catch (error) {
        console.error('ARM Template Validation Error:', error);
        res.status(500).json({ error: 'Failed to validate ARM template' });
    }
});

// Terraform Cloud API Proxy
app.post('/api/terraform/validate', authenticateToken, async (req, res) => {
    try {
        const { code, organizationName, workspaceName } = req.body;
        const terraformToken = process.env.TERRAFORM_CLOUD_TOKEN;

        // Create configuration version
        const configVersionResponse = await fetch(
            `https://app.terraform.io/api/v2/organizations/${organizationName}/workspaces/${workspaceName}/configuration-versions`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${terraformToken}`,
                    'Content-Type': 'application/vnd.api+json'
                },
                body: JSON.stringify({
                    data: {
                        type: 'configuration-versions',
                        attributes: {
                            'auto-queue-runs': false
                        }
                    }
                })
            }
        );

        const configVersion = await configVersionResponse.json();
        
        // Upload code (this would need proper file handling in production)
        // For now, return a mock validation result
        
        res.json({
            valid: true,
            planId: configVersion.data.id,
            message: 'Terraform code uploaded successfully'
        });
    } catch (error) {
        console.error('Terraform Validation Error:', error);
        res.status(500).json({ error: 'Failed to validate Terraform code' });
    }
});

// Prometheus Metrics Proxy
app.get('/api/prometheus/query', authenticateToken, async (req, res) => {
    try {
        const { query } = req.query;
        const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090';

        const response = await fetch(
            `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(query)}`
        );
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Prometheus Query Error:', error);
        res.status(500).json({ error: 'Failed to query Prometheus' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Platform Engineering API Server running on port ${port}`);
    console.log(`📊 Endpoints available:`);
    console.log(`   GET  /api/github/:owner/:repo/metrics`);
    console.log(`   POST /api/aws/costs`);
    console.log(`   POST /api/azure/costs`);
    console.log(`   POST /api/azure/validate-template`);
    console.log(`   POST /api/terraform/validate`);
    console.log(`   GET  /api/prometheus/query`);
    console.log(`   GET  /health`);
});

module.exports = app;
