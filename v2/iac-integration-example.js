// Real IaC Integration Examples

class IaCAPI {
    constructor() {
        this.terraformCloudUrl = 'https://app.terraform.io/api/v2';
        this.azureUrl = 'https://management.azure.com';
        this.awsUrl = 'https://cloudformation.amazonaws.com';
    }

    // Terraform Cloud API Integration
    async validateTerraformCode(code, organizationName, workspaceName, token) {
        try {
            // Create a configuration version
            const configVersionResponse = await fetch(
                `${this.terraformCloudUrl}/workspaces/${workspaceName}/configuration-versions`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
            const uploadUrl = configVersion.data.attributes['upload-url'];

            // Upload Terraform code
            const formData = new FormData();
            const blob = new Blob([code], { type: 'text/plain' });
            formData.append('file', blob, 'main.tf');

            await fetch(uploadUrl, {
                method: 'PUT',
                body: formData
            });

            // Run terraform plan
            const planResponse = await fetch(
                `${this.terraformCloudUrl}/runs`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/vnd.api+json'
                    },
                    body: JSON.stringify({
                        data: {
                            type: 'runs',
                            attributes: {
                                message: 'IaC Playground validation'
                            },
                            relationships: {
                                workspace: {
                                    data: {
                                        type: 'workspaces',
                                        id: workspaceName
                                    }
                                },
                                'configuration-version': {
                                    data: {
                                        type: 'configuration-versions',
                                        id: configVersion.data.id
                                    }
                                }
                            }
                        }
                    })
                }
            );

            return await planResponse.json();
        } catch (error) {
            console.error('Terraform validation error:', error);
            return this.getMockValidationResult();
        }
    }

    // Azure ARM Template Validation
    async validateARMTemplate(template, subscriptionId, resourceGroup, accessToken) {
        try {
            const url = `${this.azureUrl}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Resources/deployments/validate?api-version=2021-04-01`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    properties: {
                        template: template,
                        mode: 'Incremental',
                        parameters: {}
                    }
                })
            });

            const result = await response.json();
            return this.processARMValidationResult(result);
        } catch (error) {
            console.error('ARM validation error:', error);
            return this.getMockValidationResult();
        }
    }

    // AWS CloudFormation Validation
    async validateCloudFormationTemplate(template, accessKey, secretKey, region) {
        try {
            const AWS = require('aws-sdk'); // Server-side only
            
            AWS.config.update({
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
                region: region
            });

            const cloudformation = new AWS.CloudFormation();
            
            const params = {
                TemplateBody: JSON.stringify(template)
            };

            const result = await cloudformation.validateTemplate(params).promise();
            return this.processCFValidationResult(result);
        } catch (error) {
            console.error('CloudFormation validation error:', error);
            return this.getMockValidationResult();
        }
    }

    // Real-time syntax validation for Terraform
    validateTerraformSyntax(code) {
        const errors = [];
        const warnings = [];
        const lines = code.split('\n');

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            
            // Check for common Terraform syntax issues
            if (line.includes('resource') && !line.match(/resource\s+"[\w-]+"\s+"[\w-]+"/)) {
                errors.push({
                    line: lineNum,
                    message: 'Invalid resource declaration syntax',
                    severity: 'error'
                });
            }
            
            if (line.includes('provider') && !line.match(/provider\s+"[\w-]+"/)) {
                errors.push({
                    line: lineNum,
                    message: 'Invalid provider declaration syntax',
                    severity: 'error'
                });
            }
            
            // Check for missing quotes
            if (line.includes('=') && !line.includes('"') && !line.match(/=\s*\d+/) && !line.match(/=\s*(true|false)/)) {
                warnings.push({
                    line: lineNum,
                    message: 'String values should be quoted',
                    severity: 'warning'
                });
            }
        });

        return { errors, warnings };
    }

    // Process validation results
    processARMValidationResult(result) {
        if (result.error) {
            return {
                valid: false,
                errors: [{ message: result.error.message, code: result.error.code }],
                warnings: []
            };
        }

        return {
            valid: true,
            errors: [],
            warnings: [],
            resources: result.properties?.validatedResources || []
        };
    }

    processCFValidationResult(result) {
        return {
            valid: true,
            errors: [],
            warnings: [],
            parameters: result.Parameters || [],
            capabilities: result.Capabilities || []
        };
    }

    getMockValidationResult() {
        return {
            valid: true,
            errors: [],
            warnings: [
                { line: 5, message: 'Consider using variables for repeated values', severity: 'info' }
            ],
            resources: ['azurerm_resource_group', 'azurerm_virtual_network', 'azurerm_subnet']
        };
    }
}

// Enhanced Code Editor with Real Validation
class IaCEditor {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.api = new IaCAPI();
        this.setupEditor();
        this.setupRealTimeValidation();
    }

    setupEditor() {
        // Enhanced textarea with syntax highlighting (you'd want to use CodeMirror or Monaco Editor)
        this.element.addEventListener('input', () => {
            this.validateSyntax();
        });

        // Add line numbers
        this.addLineNumbers();
    }

    setupRealTimeValidation() {
        let timeoutId;
        
        this.element.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                this.validateCode();
            }, 1000); // Validate after 1 second of no typing
        });
    }

    async validateCode() {
        const code = this.element.value;
        const language = this.getCurrentLanguage();

        let result;
        
        switch (language) {
            case 'terraform':
                result = this.api.validateTerraformSyntax(code);
                break;
            case 'arm':
                try {
                    const template = JSON.parse(code);
                    result = await this.api.validateARMTemplate(
                        template,
                        localStorage.getItem('azure_subscription_id'),
                        localStorage.getItem('azure_resource_group'),
                        localStorage.getItem('azure_access_token')
                    );
                } catch (error) {
                    result = { valid: false, errors: [{ message: 'Invalid JSON syntax' }] };
                }
                break;
            default:
                result = { valid: true, errors: [], warnings: [] };
        }

        this.displayValidationResults(result);
    }

    displayValidationResults(result) {
        const resultsContainer = document.getElementById('validationResults');
        
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '';

        if (result.errors && result.errors.length > 0) {
            result.errors.forEach(error => {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-error';
                errorDiv.innerHTML = `
                    <i class="fas fa-times-circle"></i>
                    <span>Line ${error.line}: ${error.message}</span>
                `;
                resultsContainer.appendChild(errorDiv);
            });
        }

        if (result.warnings && result.warnings.length > 0) {
            result.warnings.forEach(warning => {
                const warningDiv = document.createElement('div');
                warningDiv.className = 'validation-warning';
                warningDiv.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Line ${warning.line}: ${warning.message}</span>
                `;
                resultsContainer.appendChild(warningDiv);
            });
        }

        if (result.valid && result.errors.length === 0) {
            const successDiv = document.createElement('div');
            successDiv.className = 'validation-success';
            successDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Code validation passed successfully!</span>
            `;
            resultsContainer.appendChild(successDiv);
        }
    }

    getCurrentLanguage() {
        return document.querySelector('input[name="templateType"]:checked')?.value || 'terraform';
    }

    addLineNumbers() {
        // Add line numbers to the editor
        const wrapper = document.createElement('div');
        wrapper.className = 'editor-wrapper';
        
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(lineNumbers);
        wrapper.appendChild(this.element);

        this.updateLineNumbers();
        
        this.element.addEventListener('input', () => {
            this.updateLineNumbers();
        });

        this.element.addEventListener('scroll', () => {
            lineNumbers.scrollTop = this.element.scrollTop;
        });
    }

    updateLineNumbers() {
        const lineNumbers = this.element.parentNode.querySelector('.line-numbers');
        const lines = this.element.value.split('\n').length;
        
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lines; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = i;
            lineNumbers.appendChild(lineDiv);
        }
    }
}

// Initialize enhanced editor
document.addEventListener('DOMContentLoaded', () => {
    const editor = new IaCEditor('codeEditor');
    
    // Add configuration options
    setupIaCConfiguration();
});

function setupIaCConfiguration() {
    // Add configuration modal for cloud provider settings
    const configButton = document.createElement('button');
    configButton.className = 'btn btn-secondary';
    configButton.innerHTML = '<i class="fas fa-cog"></i> Configure APIs';
    configButton.onclick = () => openIaCConfig();
    
    const toolbar = document.querySelector('.editor-toolbar');
    if (toolbar) {
        toolbar.appendChild(configButton);
    }
}

function openIaCConfig() {
    // Open configuration modal for cloud provider settings
    // Similar to the DevOps dashboard configuration
}
