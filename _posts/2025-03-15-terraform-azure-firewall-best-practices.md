---
layout: post
title: "Terraform Best Practices for Azure Firewall Management"
date: 2025-03-15
category: Infrastructure
tags: [Terraform, Azure, Security, Networking]
excerpt: "Learn how to effectively manage Azure Firewall resources using Terraform, including network rules, application rules, and security policies. Discover patterns for scaling firewall configurations across multiple environments."
---

Azure Firewall is a critical component of any cloud security strategy, providing network-level protection for your Azure virtual networks. When managing Azure Firewall at scale, Infrastructure as Code (IaC) becomes essential. Terraform, with its declarative approach and robust Azure provider, offers an excellent solution for managing firewall configurations consistently across environments.

## Understanding Azure Firewall Architecture

Before diving into Terraform configurations, it's crucial to understand the Azure Firewall components:

- **Azure Firewall Resource:** The main firewall instance
- **Firewall Policy:** Centralized rule management (recommended approach)  
- **Rule Collections:** Groups of related rules (Network, Application, NAT)
- **Public IP:** Required for outbound connectivity
- **Subnet:** Dedicated AzureFirewallSubnet with /26 minimum

## Basic Terraform Configuration

Here's a foundational Terraform configuration for Azure Firewall:

```hcl
# Resource Group
resource "azurerm_resource_group" "firewall" {
  name     = "rg-firewall-${var.environment}"
  location = var.location
  
  tags = var.common_tags
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "vnet-firewall-${var.environment}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.firewall.location
  resource_group_name = azurerm_resource_group.firewall.name

  tags = var.common_tags
}

# Azure Firewall Subnet
resource "azurerm_subnet" "firewall" {
  name                 = "AzureFirewallSubnet"
  resource_group_name  = azurerm_resource_group.firewall.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/26"]
}

# Public IP for Firewall
resource "azurerm_public_ip" "firewall" {
  name                = "pip-firewall-${var.environment}"
  location            = azurerm_resource_group.firewall.location
  resource_group_name = azurerm_resource_group.firewall.name
  allocation_method   = "Static"
  sku                = "Standard"

  tags = var.common_tags
}

# Azure Firewall
resource "azurerm_firewall" "main" {
  name                = "fw-main-${var.environment}"
  location            = azurerm_resource_group.firewall.location
  resource_group_name = azurerm_resource_group.firewall.name
  sku_name           = "AZFW_VNet"
  sku_tier           = var.firewall_sku_tier

  ip_configuration {
    name                 = "configuration"
    subnet_id            = azurerm_subnet.firewall.id
    public_ip_address_id = azurerm_public_ip.firewall.id
  }

  firewall_policy_id = azurerm_firewall_policy.main.id

  tags = var.common_tags
}
```

## Firewall Policy Configuration

Using Firewall Policies provides centralized management and supports advanced features:

```hcl
resource "azurerm_firewall_policy" "main" {
  name                = "fwpol-main-${var.environment}"
  resource_group_name = azurerm_resource_group.firewall.name
  location            = azurerm_resource_group.firewall.location
  
  sku                      = var.firewall_sku_tier
  threat_intelligence_mode = var.threat_intelligence_mode
  
  dns {
    proxy_enabled = true
    servers       = var.custom_dns_servers
  }

  threat_intelligence_allowlist {
    ip_addresses = var.threat_intel_allowlist_ips
    fqdns        = var.threat_intel_allowlist_fqdns
  }

  tags = var.common_tags
}
```

## Network Rules Configuration

Network rules control traffic based on IP addresses, protocols, and ports:

```hcl
resource "azurerm_firewall_policy_rule_collection_group" "network_rules" {
  name               = "NetworkRuleCollectionGroup"
  firewall_policy_id = azurerm_firewall_policy.main.id
  priority           = 200

  network_rule_collection {
    name     = "AllowOutbound"
    priority = 200
    action   = "Allow"

    rule {
      name                  = "AllowHTTPS"
      protocols             = ["TCP"]
      source_addresses      = ["10.0.0.0/8"]
      destination_addresses = ["*"]
      destination_ports     = ["443"]
    }

    rule {
      name                  = "AllowHTTP"
      protocols             = ["TCP"]
      source_addresses      = ["10.0.0.0/8"]
      destination_addresses = ["*"]
      destination_ports     = ["80"]
    }

    rule {
      name                  = "AllowDNS"
      protocols             = ["UDP"]
      source_addresses      = ["10.0.0.0/8"]
      destination_addresses = ["*"]
      destination_ports     = ["53"]
    }
  }

  network_rule_collection {
    name     = "DenyAll"
    priority = 65000
    action   = "Deny"

    rule {
      name                  = "DenyAllTraffic"
      protocols             = ["Any"]
      source_addresses      = ["*"]
      destination_addresses = ["*"]
      destination_ports     = ["*"]
    }
  }
}
```

## Application Rules for FQDN Filtering

Application rules provide FQDN-based filtering with TLS inspection:

```hcl
resource "azurerm_firewall_policy_rule_collection_group" "application_rules" {
  name               = "ApplicationRuleCollectionGroup"
  firewall_policy_id = azurerm_firewall_policy.main.id
  priority           = 300

  application_rule_collection {
    name     = "AllowWeb"
    priority = 300
    action   = "Allow"

    rule {
      name = "AllowMicrosoft"
      protocols {
        type = "Http"
        port = 80
      }
      protocols {
        type = "Https"
        port = 443
      }
      source_addresses  = ["10.0.0.0/8"]
      destination_fqdns = [
        "*.microsoft.com",
        "*.azure.com",
        "*.windows.com"
      ]
    }

    rule {
      name = "AllowLinuxUpdates"
      protocols {
        type = "Http"
        port = 80
      }
      protocols {
        type = "Https"
        port = 443
      }
      source_addresses  = ["10.0.0.0/8"]
      destination_fqdns = [
        "security.ubuntu.com",
        "archive.ubuntu.com",
        "*.ubuntu.com"
      ]
    }
  }
}
```

## Advanced Configuration Patterns

### 1. Dynamic Rule Generation

Use Terraform's `for_each` to create rules dynamically:

```hcl
variable "firewall_rules" {
  type = map(object({
    priority = number
    rules = list(object({
      name                  = string
      protocols             = list(string)
      source_addresses      = list(string)
      destination_addresses = list(string)
      destination_ports     = list(string)
    }))
  }))
}

resource "azurerm_firewall_policy_rule_collection_group" "dynamic_network_rules" {
  name               = "DynamicNetworkRules"
  firewall_policy_id = azurerm_firewall_policy.main.id
  priority           = 400

  dynamic "network_rule_collection" {
    for_each = var.firewall_rules
    content {
      name     = network_rule_collection.key
      priority = network_rule_collection.value.priority
      action   = "Allow"

      dynamic "rule" {
        for_each = network_rule_collection.value.rules
        content {
          name                  = rule.value.name
          protocols             = rule.value.protocols
          source_addresses      = rule.value.source_addresses
          destination_addresses = rule.value.destination_addresses
          destination_ports     = rule.value.destination_ports
        }
      }
    }
  }
}
```

### 2. Environment-Specific Configurations

Use Terraform workspaces or separate variable files for different environments:

```hcl
# environments/prod.tfvars
environment = "prod"
firewall_sku_tier = "Premium"
threat_intelligence_mode = "Deny"

firewall_rules = {
  "ProductionNetworkRules" = {
    priority = 200
    rules = [
      {
        name                  = "AllowHTTPS"
        protocols             = ["TCP"]
        source_addresses      = ["10.0.0.0/8"]
        destination_addresses = ["*"]
        destination_ports     = ["443"]
      }
    ]
  }
}

# environments/dev.tfvars
environment = "dev"
firewall_sku_tier = "Standard"
threat_intelligence_mode = "Alert"

firewall_rules = {
  "DevelopmentNetworkRules" = {
    priority = 200
    rules = [
      {
        name                  = "AllowAll"
        protocols             = ["Any"]
        source_addresses      = ["10.0.0.0/8"]
        destination_addresses = ["*"]
        destination_ports     = ["*"]
      }
    ]
  }
}
```

## Monitoring and Logging

Enable comprehensive logging for security monitoring:

```hcl
resource "azurerm_log_analytics_workspace" "firewall" {
  name                = "law-firewall-${var.environment}"
  location            = azurerm_resource_group.firewall.location
  resource_group_name = azurerm_resource_group.firewall.name
  sku                = "PerGB2018"
  retention_in_days   = 30

  tags = var.common_tags
}

resource "azurerm_monitor_diagnostic_setting" "firewall" {
  name                       = "firewall-diagnostics"
  target_resource_id         = azurerm_firewall.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.firewall.id

  enabled_log {
    category = "AzureFirewallApplicationRule"
  }

  enabled_log {
    category = "AzureFirewallNetworkRule"
  }

  enabled_log {
    category = "AzureFirewallDnsProxy"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}
```

## Best Practices

### 1. Security Best Practices
- Use the **principle of least privilege** - only allow required traffic
- Implement **defense in depth** with multiple rule layers
- Regular **rule auditing** and cleanup of unused rules
- Enable **threat intelligence** feeds for automatic protection

### 2. Operational Best Practices  
- Use **consistent naming conventions** across all resources
- Implement **proper tagging** strategy for resource management
- Set up **monitoring and alerting** for firewall metrics
- Document rule purposes and business justifications

### 3. Terraform Best Practices
- Use **remote state** with proper state locking
- Implement **modular design** with reusable modules
- Use **variable validation** to prevent configuration errors
- Apply **least privilege** for Terraform service principals

## Conclusion

Azure Firewall management with Terraform provides robust, scalable, and repeatable security configurations. By following these patterns and best practices, you can build secure, maintainable firewall configurations that grow with your infrastructure needs.

Remember to regularly review and update your firewall rules, monitor traffic patterns, and stay current with Azure Firewall feature updates to maintain optimal security posture.
