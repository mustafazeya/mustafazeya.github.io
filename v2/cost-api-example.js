// Real Cloud Cost API Integration Examples

class CloudCostAPI {
    constructor() {
        this.awsUrl = 'https://ce.us-east-1.amazonaws.com';
        this.azureUrl = 'https://management.azure.com';
    }

    // AWS Cost Explorer API
    async getAWSCosts(accessKey, secretKey, region = 'us-east-1') {
        try {
            // This requires AWS SDK - for client-side, you'd need a backend proxy
            const AWS = require('aws-sdk'); // Server-side only
            
            AWS.config.update({
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
                region: region
            });

            const costExplorer = new AWS.CostExplorer();
            
            const params = {
                TimePeriod: {
                    Start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
                    End: new Date().toISOString().split('T')[0]
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
            return this.processAWSCostData(result);
        } catch (error) {
            console.error('AWS Cost API Error:', error);
            return this.getMockAWSData();
        }
    }

    // Azure Cost Management API
    async getAzureCosts(subscriptionId, accessToken) {
        try {
            const url = `${this.azureUrl}/subscriptions/${subscriptionId}/providers/Microsoft.CostManagement/query?api-version=2021-10-01`;
            
            const query = {
                type: "ActualCost",
                timeframe: "MonthToDate",
                dataset: {
                    granularity: "Daily",
                    aggregation: {
                        totalCost: {
                            name: "PreTaxCost",
                            function: "Sum"
                        }
                    },
                    grouping: [
                        {
                            type: "Dimension",
                            name: "ServiceName"
                        }
                    ]
                }
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)
            });

            const result = await response.json();
            return this.processAzureCostData(result);
        } catch (error) {
            console.error('Azure Cost API Error:', error);
            return this.getMockAzureData();
        }
    }

    // Google Cloud Billing API
    async getGCPCosts(projectId, apiKey) {
        try {
            const url = `https://cloudbilling.googleapis.com/v1/projects/${projectId}/billingInfo?key=${apiKey}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const result = await response.json();
            return this.processGCPCostData(result);
        } catch (error) {
            console.error('GCP Cost API Error:', error);
            return this.getMockGCPData();
        }
    }

    // Process and normalize AWS cost data
    processAWSCostData(data) {
        const services = {};
        let totalCost = 0;

        data.ResultsByTime.forEach(timeEntry => {
            timeEntry.Groups.forEach(group => {
                const serviceName = group.Keys[0];
                const cost = parseFloat(group.Metrics.BlendedCost.Amount);
                
                if (!services[serviceName]) {
                    services[serviceName] = 0;
                }
                services[serviceName] += cost;
                totalCost += cost;
            });
        });

        return {
            totalCost: totalCost.toFixed(2),
            services: Object.entries(services)
                .map(([name, cost]) => ({ name, cost: cost.toFixed(2), percentage: ((cost / totalCost) * 100).toFixed(1) }))
                .sort((a, b) => b.cost - a.cost)
                .slice(0, 10) // Top 10 services
        };
    }

    // Process Azure cost data
    processAzureCostData(data) {
        const services = {};
        let totalCost = 0;

        data.properties.rows.forEach(row => {
            const cost = row[0];
            const serviceName = row[1];
            
            if (!services[serviceName]) {
                services[serviceName] = 0;
            }
            services[serviceName] += cost;
            totalCost += cost;
        });

        return {
            totalCost: totalCost.toFixed(2),
            services: Object.entries(services)
                .map(([name, cost]) => ({ name, cost: cost.toFixed(2), percentage: ((cost / totalCost) * 100).toFixed(1) }))
                .sort((a, b) => b.cost - a.cost)
                .slice(0, 10)
        };
    }

    // Mock data for demonstration
    getMockAWSData() {
        return {
            totalCost: '2847.56',
            services: [
                { name: 'Amazon EC2', cost: '1245.32', percentage: '43.7' },
                { name: 'Amazon RDS', cost: '567.89', percentage: '19.9' },
                { name: 'Amazon S3', cost: '234.56', percentage: '8.2' },
                { name: 'AWS Lambda', cost: '123.45', percentage: '4.3' },
                { name: 'Amazon CloudFront', cost: '98.76', percentage: '3.5' }
            ]
        };
    }

    getMockAzureData() {
        return {
            totalCost: '3156.78',
            services: [
                { name: 'Virtual Machines', cost: '1389.45', percentage: '44.0' },
                { name: 'Azure SQL Database', cost: '631.36', percentage: '20.0' },
                { name: 'Storage Accounts', cost: '284.11', percentage: '9.0' },
                { name: 'App Service', cost: '189.41', percentage: '6.0' },
                { name: 'Azure Functions', cost: '126.27', percentage: '4.0' }
            ]
        };
    }
}

// Usage Example:
async function loadRealCostData() {
    const api = new CloudCostAPI();
    
    // Get configuration from localStorage
    const awsAccessKey = localStorage.getItem('aws_access_key');
    const awsSecretKey = localStorage.getItem('aws_secret_key');
    const azureSubscriptionId = localStorage.getItem('azure_subscription_id');
    const azureAccessToken = localStorage.getItem('azure_access_token');
    
    try {
        // Load AWS costs (if configured)
        if (awsAccessKey && awsSecretKey) {
            const awsCosts = await api.getAWSCosts(awsAccessKey, awsSecretKey);
            updateCostDashboard('aws', awsCosts);
        }
        
        // Load Azure costs (if configured)
        if (azureSubscriptionId && azureAccessToken) {
            const azureCosts = await api.getAzureCosts(azureSubscriptionId, azureAccessToken);
            updateCostDashboard('azure', azureCosts);
        }
        
    } catch (error) {
        console.error('Error loading cost data:', error);
        // Fallback to mock data
        updateCostDashboard('mock', api.getMockAWSData());
    }
}

// Backend Proxy Example (Node.js/Express)
/*
// server.js - Backend proxy for secure API calls
const express = require('express');
const AWS = require('aws-sdk');
const { DefaultAzureCredential } = require('@azure/identity');
const { CostManagementClient } = require('@azure/arm-costmanagement');

const app = express();
app.use(express.json());

// AWS Cost Proxy
app.post('/api/aws/costs', async (req, res) => {
    try {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'us-east-1'
        });

        const costExplorer = new AWS.CostExplorer();
        const result = await costExplorer.getCostAndUsage(req.body.params).promise();
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Azure Cost Proxy
app.post('/api/azure/costs', async (req, res) => {
    try {
        const credential = new DefaultAzureCredential();
        const client = new CostManagementClient(credential, subscriptionId);
        
        const result = await client.query(scope, req.body.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Cost API proxy running on port 3001');
});
*/
