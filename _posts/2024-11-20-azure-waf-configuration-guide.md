---
layout: post
title: "Azure WAF Configuration Guide: Best Practices for Web Security"
date: 2024-11-20
categories: [azure, security, waf]
tags: [azure, web-application-firewall, security, configuration]
---

The Azure Web Application Firewall (WAF) provides critical protection for web applications by filtering, monitoring, and blocking malicious HTTP/HTTPS traffic. This guide covers best practices for configuring Azure WAF to maximize security while minimizing false positives.

## Understanding Azure WAF

Azure WAF operates at the application layer (Layer 7) and can be deployed with Azure Application Gateway, Azure Front Door, or Azure CDN. It provides protection against common web vulnerabilities identified by OWASP Top 10.

### Key Features

- **OWASP Core Rule Set (CRS)**: Pre-configured rules for common attacks
- **Custom Rules**: Create application-specific protection rules
- **Rate Limiting**: Protect against DDoS and brute force attacks
- **Geo-filtering**: Block traffic from specific countries/regions
- **Bot Protection**: Advanced bot detection and mitigation

## Configuration Best Practices

### 1. Start with Detection Mode

Always begin with WAF in detection mode to understand traffic patterns:

```json
{
  "firewallPolicy": {
    "policySettings": {
      "mode": "Detection",
      "state": "Enabled"
    }
  }
}
```

### 2. Implement Core Rule Set (CRS)

Configure the latest OWASP CRS version:

```json
{
  "managedRules": {
    "managedRuleSets": [
      {
        "ruleSetType": "OWASP",
        "ruleSetVersion": "3.2",
        "exclusions": []
      }
    ]
  }
}
```

### 3. Custom Rules for Specific Threats

Create custom rules for application-specific protection:

```json
{
  "customRules": [
    {
      "name": "BlockSQLInjection",
      "priority": 100,
      "ruleType": "MatchRule",
      "action": "Block",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "QueryString"
            }
          ],
          "operator": "Contains",
          "matchValues": ["UNION", "SELECT", "DROP"]
        }
      ]
    }
  ]
}
```

### 4. Rate Limiting Configuration

Implement rate limiting to prevent abuse:

```json
{
  "customRules": [
    {
      "name": "RateLimitRule",
      "priority": 200,
      "ruleType": "RateLimitRule",
      "action": "Block",
      "rateLimitDurationInMinutes": 1,
      "rateLimitThreshold": 100,
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RemoteAddr"
            }
          ],
          "operator": "IPMatch",
          "matchValues": ["0.0.0.0/0"]
        }
      ]
    }
  ]
}
```

## Monitoring and Maintenance

### Log Analysis

Regularly review WAF logs to identify:
- Blocked legitimate traffic (false positives)
- Unblocked malicious traffic (false negatives)
- Traffic patterns and trends

### Performance Optimization

- **Tune exclusions** for legitimate applications
- **Adjust sensitivity** based on application requirements
- **Monitor latency** impact of WAF rules

### Rule Management

- Keep CRS updated to latest version
- Regularly review and update custom rules
- Test rule changes in staging environment

## Common Configuration Pitfalls

1. **Running in prevention mode too early** without proper tuning
2. **Over-broad exclusions** that reduce security effectiveness
3. **Ignoring false positives** instead of properly tuning rules
4. **Not monitoring WAF logs** regularly for optimization opportunities

## Terraform Example

Here's a complete Terraform configuration for Azure WAF:

```hcl
resource "azurerm_web_application_firewall_policy" "main" {
  name                = "waf-policy-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location

  policy_settings {
    enabled                     = true
    mode                       = "Prevention"
    request_body_check         = true
    file_upload_limit_in_mb    = 100
    max_request_body_size_in_kb = 128
  }

  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }
  }

  custom_rules {
    name     = "RateLimitByIP"
    priority = 1
    rule_type = "RateLimitRule"
    action   = "Block"

    rate_limit_duration_in_minutes = 1
    rate_limit_threshold          = 10

    match_conditions {
      match_variables {
        variable_name = "RemoteAddr"
      }
      operator           = "IPMatch"
      negation_condition = false
      match_values       = ["0.0.0.0/0"]
    }
  }

  tags = var.common_tags
}
```

## Conclusion

Azure WAF is a powerful tool for protecting web applications, but proper configuration is crucial for effectiveness. Start with detection mode, gradually implement rules, and continuously monitor and tune your configuration based on actual traffic patterns.

Remember that security is an ongoing process - regularly review your WAF configuration, update rules, and stay informed about new threats and protection mechanisms.
