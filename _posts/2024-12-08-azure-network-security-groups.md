---
layout: post
title: "Azure Network Security Groups: Comprehensive Configuration Guide"
date: 2024-12-08
categories: [azure, security, networking]
tags: [azure, nsg, network-security, firewall, terraform]
---

Azure Network Security Groups (NSGs) are fundamental building blocks for network security in Azure. They act as distributed firewalls that filter network traffic to and from Azure resources. This guide provides comprehensive coverage of NSG configuration, best practices, and automation strategies.

## Understanding Network Security Groups

NSGs contain security rules that allow or deny inbound and outbound network traffic based on:
- **Source and destination IP addresses**
- **Port ranges**
- **Protocols** (TCP, UDP, ICMP, ESP, AH, or Any)
- **Direction** (inbound or outbound)

### NSG Association Points

NSGs can be associated with:
- **Subnets** - Applies to all resources in the subnet
- **Network Interfaces** - Applies to specific virtual machines
- **Both** - Subnet-level and NIC-level rules are evaluated

## Security Rule Fundamentals

### Rule Components

Each security rule contains:
- **Priority** (100-4096): Lower numbers = higher priority
- **Source**: IP address, CIDR, service tag, or application security group
- **Destination**: IP address, CIDR, service tag, or application security group
- **Protocol**: TCP, UDP, ICMP, ESP, AH, or Any
- **Port Range**: Single port, range, or wildcard (*)
- **Action**: Allow or Deny

### Default Security Rules

Azure provides default rules that cannot be deleted:
- **AllowVnetInBound** (Priority 65000): Allows VNet traffic
- **AllowAzureLoadBalancerInBound** (Priority 65001): Allows load balancer health probes
- **DenyAllInBound** (Priority 65500): Denies all other inbound traffic
- **AllowVnetOutBound** (Priority 65000): Allows VNet outbound traffic
- **AllowInternetOutBound** (Priority 65001): Allows internet outbound traffic
- **DenyAllOutBound** (Priority 65500): Denies all other outbound traffic

## NSG Configuration Best Practices

### 1. Principle of Least Privilege

Create specific rules rather than broad allow-all rules:

```hcl
# Good: Specific rule for web traffic
resource "azurerm_network_security_rule" "allow_http" {
  name                       = "AllowHTTP"
  priority                   = 1000
  direction                  = "Inbound"
  access                     = "Allow"
  protocol                   = "Tcp"
  source_port_range          = "*"
  destination_port_range     = "80"
  source_address_prefix      = "Internet"
  destination_address_prefix = "VirtualNetwork"
  resource_group_name        = azurerm_resource_group.main.name
  network_security_group_name = azurerm_network_security_group.web.name
}

# Avoid: Overly broad rule
resource "azurerm_network_security_rule" "bad_rule" {
  name                       = "AllowAll"
  priority                   = 1000
  direction                  = "Inbound"
  access                     = "Allow"
  protocol                   = "*"
  source_port_range          = "*"
  destination_port_range     = "*"
  source_address_prefix      = "*"
  destination_address_prefix = "*"
  # ... other configuration
}
```

### 2. Use Service Tags

Leverage Azure service tags instead of IP addresses:

```hcl
resource "azurerm_network_security_rule" "allow_sql" {
  name                       = "AllowSQLFromAppSubnet"
  priority                   = 1100
  direction                  = "Inbound"
  access                     = "Allow"
  protocol                   = "Tcp"
  source_port_range          = "*"
  destination_port_range     = "1433"
  source_address_prefix      = "10.0.1.0/24"  # App subnet
  destination_address_prefix = "Sql"           # Service tag
  resource_group_name        = azurerm_resource_group.main.name
  network_security_group_name = azurerm_network_security_group.database.name
}
```

### 3. Application Security Groups

Use ASGs for granular, application-centric security:

```hcl
# Application Security Groups
resource "azurerm_application_security_group" "web_servers" {
  name                = "web-servers-asg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_application_security_group" "database_servers" {
  name                = "database-servers-asg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

# NSG rule using ASGs
resource "azurerm_network_security_rule" "web_to_db" {
  name                                       = "WebToDatabase"
  priority                                   = 1200
  direction                                  = "Inbound"
  access                                     = "Allow"
  protocol                                   = "Tcp"
  source_port_range                          = "*"
  destination_port_range                     = "1433"
  source_application_security_group_ids      = [azurerm_application_security_group.web_servers.id]
  destination_application_security_group_ids = [azurerm_application_security_group.database_servers.id]
  resource_group_name                        = azurerm_resource_group.main.name
  network_security_group_name               = azurerm_network_security_group.database.name
}
```

## Complete NSG Implementation

### Multi-Tier Application NSG Setup

```hcl
# Variables
variable "allowed_ips" {
  description = "List of allowed IP addresses for management access"
  type        = list(string)
  default     = ["203.0.113.0/24"]
}

# Web Tier NSG
resource "azurerm_network_security_group" "web" {
  name                = "web-tier-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # Allow HTTP from Internet
  security_rule {
    name                       = "AllowHTTP"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }

  # Allow HTTPS from Internet
  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }

  # Allow SSH from specific IPs
  security_rule {
    name                         = "AllowSSH"
    priority                     = 1100
    direction                    = "Inbound"
    access                       = "Allow"
    protocol                     = "Tcp"
    source_port_range            = "*"
    destination_port_range       = "22"
    source_address_prefixes      = var.allowed_ips
    destination_address_prefix   = "*"
  }

  # Deny all other inbound traffic
  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4000
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = "production"
    Tier        = "web"
  }
}

# Application Tier NSG
resource "azurerm_network_security_group" "app" {
  name                = "app-tier-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # Allow traffic from web tier
  security_rule {
    name                       = "AllowFromWebTier"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8080"
    source_address_prefix      = "10.0.1.0/24"  # Web subnet
    destination_address_prefix = "*"
  }

  # Allow SSH from bastion
  security_rule {
    name                       = "AllowSSHFromBastion"
    priority                   = 1100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "10.0.0.0/24"  # Management subnet
    destination_address_prefix = "*"
  }

  tags = {
    Environment = "production"
    Tier        = "application"
  }
}

# Database Tier NSG
resource "azurerm_network_security_group" "database" {
  name                = "database-tier-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # Allow SQL from app tier
  security_rule {
    name                       = "AllowSQLFromAppTier"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "1433"
    source_address_prefix      = "10.0.2.0/24"  # App subnet
    destination_address_prefix = "*"
  }

  # Allow SSH from bastion
  security_rule {
    name                       = "AllowSSHFromBastion"
    priority                   = 1100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "10.0.0.0/24"  # Management subnet
    destination_address_prefix = "*"
  }

  # Deny all other access
  security_rule {
    name                       = "DenyAllOther"
    priority                   = 4000
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = "production"
    Tier        = "database"
  }
}
```

### NSG Association with Subnets

```hcl
# Associate NSGs with subnets
resource "azurerm_subnet_network_security_group_association" "web" {
  subnet_id                 = azurerm_subnet.web.id
  network_security_group_id = azurerm_network_security_group.web.id
}

resource "azurerm_subnet_network_security_group_association" "app" {
  subnet_id                 = azurerm_subnet.app.id
  network_security_group_id = azurerm_network_security_group.app.id
}

resource "azurerm_subnet_network_security_group_association" "database" {
  subnet_id                 = azurerm_subnet.database.id
  network_security_group_id = azurerm_network_security_group.database.id
}
```

## Advanced NSG Features

### Flow Logs Configuration

```hcl
# Storage account for flow logs
resource "azurerm_storage_account" "flow_logs" {
  name                     = "nsgflowlogs${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Network Watcher flow log
resource "azurerm_network_watcher_flow_log" "web_nsg" {
  network_watcher_name = "NetworkWatcher_eastus"
  resource_group_name  = "NetworkWatcherRG"
  name                 = "web-nsg-flow-log"

  network_security_group_id = azurerm_network_security_group.web.id
  storage_account_id        = azurerm_storage_account.flow_logs.id
  enabled                   = true

  retention_policy {
    enabled = true
    days    = 7
  }

  traffic_analytics {
    enabled               = true
    workspace_id          = azurerm_log_analytics_workspace.main.workspace_id
    workspace_region      = azurerm_log_analytics_workspace.main.location
    workspace_resource_id = azurerm_log_analytics_workspace.main.id
    interval_in_minutes   = 10
  }
}
```

### Diagnostic Settings

```hcl
resource "azurerm_monitor_diagnostic_setting" "nsg_diagnostics" {
  name               = "nsg-diagnostics"
  target_resource_id = azurerm_network_security_group.web.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  log {
    category = "NetworkSecurityGroupEvent"
    enabled  = true

    retention_policy {
      enabled = true
      days    = 30
    }
  }

  log {
    category = "NetworkSecurityGroupRuleCounter"
    enabled  = true

    retention_policy {
      enabled = true
      days    = 30
    }
  }
}
```

## NSG Rule Management Strategies

### Dynamic Rule Creation

```hcl
# Define common services
locals {
  common_ports = {
    web = {
      http  = 80
      https = 443
    }
    database = {
      mysql      = 3306
      postgresql = 5432
      mssql      = 1433
    }
    management = {
      ssh = 22
      rdp = 3389
    }
  }
}

# Create rules dynamically
resource "azurerm_network_security_rule" "web_ports" {
  for_each = local.common_ports.web

  name                       = "Allow${title(each.key)}"
  priority                   = 1000 + index(keys(local.common_ports.web), each.key)
  direction                  = "Inbound"
  access                     = "Allow"
  protocol                   = "Tcp"
  source_port_range          = "*"
  destination_port_range     = each.value
  source_address_prefix      = "Internet"
  destination_address_prefix = "*"
  resource_group_name        = azurerm_resource_group.main.name
  network_security_group_name = azurerm_network_security_group.web.name
}
```

### Environment-Specific Rules

```hcl
# Environment-specific variables
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Conditional rules based on environment
resource "azurerm_network_security_rule" "debug_access" {
  count = var.environment == "development" ? 1 : 0

  name                       = "AllowDebugAccess"
  priority                   = 2000
  direction                  = "Inbound"
  access                     = "Allow"
  protocol                   = "Tcp"
  source_port_range          = "*"
  destination_port_range     = "9000"
  source_address_prefix      = "VirtualNetwork"
  destination_address_prefix = "*"
  resource_group_name        = azurerm_resource_group.main.name
  network_security_group_name = azurerm_network_security_group.app.name
}
```

## Monitoring and Troubleshooting

### Common NSG Issues

1. **Conflicting Rules**: Higher priority rules override lower priority rules
2. **Default Rule Impacts**: Default deny rules can block expected traffic
3. **Service Tag Updates**: Service tags change over time
4. **Rule Evaluation Order**: Subnet NSG rules are evaluated before NIC NSG rules

### Monitoring with Azure Monitor

```kusto
// NSG flow logs query
AzureNetworkAnalytics_CL
| where SubType_s == "FlowLog"
| where NSGName_s == "web-tier-nsg"
| where FlowStatus_s == "D"  // Denied flows
| summarize Count=count() by SrcIP_s, DestPort_d, L4Protocol_s
| order by Count desc
```

### Effective Security Rules

Use Azure CLI to view effective rules:

```bash
# Get effective security rules for a NIC
az network nic list-effective-nsg \
  --name vm-nic \
  --resource-group myResourceGroup

# Get effective security rules for a subnet
az network vnet subnet list-effective-nsg \
  --name mySubnet \
  --vnet-name myVNet \
  --resource-group myResourceGroup
```

## Security Hardening Checklist

### Rule Review Process

1. **Regular Audits**: Review NSG rules monthly
2. **Unused Rules**: Remove rules that are no longer needed
3. **Broad Permissions**: Identify and narrow overly permissive rules
4. **Documentation**: Maintain documentation for each rule's purpose

### Automation and Compliance

```hcl
# Policy to ensure NSGs are associated with subnets
resource "azurerm_policy_definition" "require_nsg" {
  name         = "require-nsg-on-subnets"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "Require NSG on Subnets"

  policy_rule = jsonencode({
    if = {
      allOf = [
        {
          field = "type"
          equals = "Microsoft.Network/virtualNetworks/subnets"
        },
        {
          field = "Microsoft.Network/virtualNetworks/subnets/networkSecurityGroup.id"
          exists = "false"
        }
      ]
    }
    then = {
      effect = "deny"
    }
  })
}
```

## Conclusion

Azure Network Security Groups are essential for implementing defense-in-depth security strategies. Key recommendations:

- **Start with least privilege** and add permissions as needed
- **Use Application Security Groups** for granular control
- **Leverage service tags** instead of hardcoded IP addresses
- **Implement comprehensive monitoring** with flow logs and analytics
- **Regular review and audit** of security rules
- **Automate rule management** with Infrastructure as Code

By following these practices, you'll maintain robust network security while enabling necessary application functionality in your Azure environment.
