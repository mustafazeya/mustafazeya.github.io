# Platform Engineering Tools - Real API Integration Guide

Transform your static dashboards into fully functional tools with real cloud provider integrations!

## 🚀 Quick Start

### 1. **Frontend-Only Setup (Simple)**
For GitHub integration only (no backend required):

```bash
# 1. Configure GitHub token in the dashboard
# 2. Open DevOps Dashboard
# 3. Click "Configure" button
# 4. Add your GitHub Personal Access Token
# 5. Set your username and repository
```

### 2. **Full Backend Setup (Advanced)**

```bash
# Clone and setup backend
git clone https://github.com/mustafazeya/platform-engineering-tools.git
cd platform-engineering-tools/v2

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys and settings

# Start the server
npm run dev

# Or use Docker
docker-compose up -d
```

## 🔧 **Integration Options**

### **Level 1: Client-Side Only (No Backend)**
- ✅ GitHub repository metrics
- ✅ Public API endpoints
- ✅ Local storage configuration
- ✅ Real-time syntax validation

**What works:**
- GitHub repo stats, issues, PRs
- Terraform syntax validation
- Local cost calculations
- Demo data with real UI interactions

### **Level 2: Backend Proxy (Recommended)**
- ✅ All Level 1 features
- ✅ Secure API key handling
- ✅ AWS Cost Explorer
- ✅ Azure Cost Management
- ✅ ARM template validation
- ✅ Terraform Cloud integration

### **Level 3: Enterprise Integration**
- ✅ All Level 2 features
- ✅ Database persistence
- ✅ User authentication
- ✅ Role-based access
- ✅ Audit logging
- ✅ Real-time notifications

## 📋 **API Keys Required**

### **GitHub Integration**
```bash
# Create at: https://github.com/settings/tokens
# Permissions needed: repo, read:org, read:user
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### **AWS Integration**
```bash
# Create IAM user with Cost Explorer permissions
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# IAM Policy needed:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetUsageReport",
        "ce:GetReservationCoverage"
      ],
      "Resource": "*"
    }
  ]
}
```

### **Azure Integration**
```bash
# Create App Registration in Azure Portal
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_SUBSCRIPTION_ID=your-subscription-id

# Required permissions:
# - Cost Management Reader
# - Reader (for ARM validation)
```

### **Terraform Cloud Integration**
```bash
# Create at: https://app.terraform.io/app/settings/tokens
TERRAFORM_CLOUD_TOKEN=your-terraform-token
TERRAFORM_ORGANIZATION=your-org-name
```

## 🛠 **Implementation Examples**

### **1. GitHub Metrics (Client-Side)**
```javascript
// Already implemented in DevOps Dashboard
const api = new DevOpsAPI();
const metrics = await api.getGitHubMetrics('mustafazeya', 'mustafazeya.github.io');
updateDashboard(metrics);
```

### **2. AWS Costs (Backend Required)**
```javascript
// Frontend calls your backend
const response = await fetch('/api/aws/costs', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
const costs = await response.json();
updateCostDashboard(costs);
```

### **3. Infrastructure Validation**
```javascript
// Real ARM template validation
const result = await fetch('/api/azure/validate-template', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subscriptionId: 'your-sub-id',
    resourceGroupName: 'test-rg',
    template: armTemplate
  })
});
```

## 🐳 **Docker Deployment**

```bash
# Quick start with Docker Compose
docker-compose up -d

# Individual services
docker build -t platform-api .
docker run -p 3001:3001 --env-file .env platform-api

# With monitoring stack
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

## 🔒 **Security Best Practices**

### **API Key Management**
- Store sensitive keys in environment variables
- Use Azure Key Vault or AWS Secrets Manager in production
- Implement token rotation
- Never commit keys to source control

### **Backend Security**
```javascript
// Implement in backend-server.js
app.use(helmet()); // Security headers
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting
app.use(authenticateToken); // JWT authentication
```

### **CORS Configuration**
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}));
```

## 📊 **Monitoring & Alerts**

### **Prometheus Metrics**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'platform-api'
    static_configs:
      - targets: ['platform-api:3001']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### **Grafana Dashboards**
- Import pre-built dashboards for infrastructure monitoring
- Custom panels for cost tracking
- Alerting rules for budget thresholds

## 🚀 **Deployment Options**

### **1. GitHub Pages (Frontend Only)**
```bash
# Already deployed at: https://mustafazeya.github.io/v2/
# Configure API keys in browser localStorage
```

### **2. Vercel/Netlify (Frontend + Serverless)**
```bash
# Deploy frontend to Vercel
vercel --prod

# Use Vercel Functions for backend API
# api/github-metrics.js
```

### **3. AWS/Azure (Full Stack)**
```bash
# AWS: ECS + RDS + ElastiCache
# Azure: Container Apps + Cosmos DB + Redis Cache
# Use Terraform in iac-playground to deploy!
```

### **4. Kubernetes (Enterprise)**
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: platform-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: platform-api
  template:
    spec:
      containers:
      - name: platform-api
        image: platform-api:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
```

## 🔄 **Real-Time Features**

### **WebSocket Integration**
```javascript
// Add to backend-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Stream real-time metrics
wss.on('connection', (ws) => {
  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      type: 'metrics_update',
      data: getCurrentMetrics()
    }));
  }, 5000);

  ws.on('close', () => clearInterval(interval));
});
```

### **Live Cost Tracking**
```javascript
// Implement in cost-optimizer.html
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'cost_update') {
    updateCostCharts(data.costs);
  }
};
```

## 📱 **Mobile Optimization**

All dashboards are fully responsive and work on mobile devices. For native mobile apps, consider:

- React Native wrapper
- Progressive Web App (PWA)
- Capacitor/Cordova integration

## 🎯 **Next Steps**

1. **Start Simple**: Use GitHub integration first
2. **Add Backend**: Deploy the Express server
3. **Cloud Integration**: Add AWS/Azure APIs
4. **Monitor**: Set up Prometheus/Grafana
5. **Scale**: Move to Kubernetes/serverless

## 📞 **Support**

- 📧 Email: zeyaul@mustafazeya.com
- 🐛 Issues: [GitHub Issues](https://github.com/mustafazeya/platform-engineering-tools/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mustafazeya/platform-engineering-tools/discussions)

---

**Made with ❤️ by Mustafa Zeya | Senior Platform Engineer**
