# Blog Writing Guide - Markdown for Jekyll

This guide will help you write professional blog posts in Markdown for your Jekyll-powered blog on GitHub Pages.

## Quick Start

To create a new blog post:

1. **Create a new file** in the `_posts/` directory
2. **Name it:** `YYYY-MM-DD-title.md` (e.g., `2025-07-24-kubernetes-best-practices.md`)
3. **Add front matter** (metadata) at the top
4. **Write your content** in Markdown
5. **Commit and push** to GitHub - your post will be live automatically!

## File Structure

```
_posts/
├── 2025-07-24-kubernetes-best-practices.md
├── 2025-07-20-terraform-tips.md
└── 2025-07-15-azure-security.md
```

## Front Matter (Required)

Every blog post must start with front matter (YAML metadata between `---`):

```yaml
---
layout: post
title: "Your Amazing Blog Post Title"
date: 2025-07-24
categories: [azure, devops]
tags: [kubernetes, terraform, security, ci-cd]
---
```

### Front Matter Options:

- **`layout: post`** - Always use "post" for blog posts
- **`title`** - Your blog post title (use quotes if it contains special characters)
- **`date`** - Publication date in YYYY-MM-DD format
- **`categories`** - Main topics (max 2-3, use lowercase)
- **`tags`** - Specific keywords (use lowercase, hyphens for multi-word tags)
- **`excerpt`** (optional) - Custom summary for the blog index

## Markdown Syntax Guide

### Headers

```markdown
# Main Title (H1) - Don't use this, it's automatic from front matter
## Section Header (H2)
### Subsection Header (H3)
#### Minor Header (H4)
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "This is a title")
[Internal link](/about)
```

### Images

```markdown
![Alt text](image-url.jpg)
![Alt text](image-url.jpg "Image title")
```

### Lists

#### Unordered Lists:
```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3
```

#### Ordered Lists:
```markdown
1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item
```

### Code Blocks

#### Inline Code:
```markdown
Use `kubectl get pods` to list pods.
```

#### Code Blocks with Syntax Highlighting:
````markdown
```bash
# Bash commands
kubectl apply -f deployment.yaml
helm install myapp ./chart
```

```yaml
# YAML configuration
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
  - name: app
    image: nginx
```

```terraform
# Terraform configuration
resource "azurerm_resource_group" "main" {
  name     = "rg-example"
  location = "East US"
}
```

```python
# Python code
def calculate_subnet(network, hosts):
    import ipaddress
    return list(ipaddress.ip_network(network).subnets(new_prefix=hosts))
```
````

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Info     | Data     |
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And multiple paragraphs.
```

### Horizontal Rules

```markdown
---
```

## Blog Post Template

Here's a complete template for a new blog post:

```markdown
---
layout: post
title: "Kubernetes Security Best Practices: A Complete Guide"
date: 2025-07-24
categories: [kubernetes, security]
tags: [k8s, security, rbac, network-policies, pod-security]
---

A brief introduction to your blog post. This will appear in the blog index and should give readers a clear idea of what they'll learn.

## Introduction

Start with context and why this topic matters. What problem are you solving?

## Prerequisites

List any requirements:
- Basic Kubernetes knowledge
- kubectl CLI installed
- Access to a Kubernetes cluster

## Section 1: Main Content

Break your content into logical sections with clear headings.

### Subsection

Use subsections to organize complex topics.

```yaml
# Include relevant code examples
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
```

### Key Points to Remember

- Use bullet points for important takeaways
- Keep them concise and actionable
- Include specific commands or configurations

## Common Pitfalls

Highlight what to avoid:

1. **Never run as root** - Always specify a non-root user
2. **Avoid privileged containers** - Use specific capabilities instead
3. **Don't skip RBAC** - Implement least privilege access

## Best Practices Summary

Provide a quick reference:

| Practice | Description | Priority |
|----------|-------------|----------|
| RBAC | Role-based access control | High |
| Network Policies | Restrict pod communication | High |
| Pod Security | Security contexts and policies | Medium |

## Conclusion

Summarize the key points and provide next steps or additional resources.

## Additional Resources

- [Official Kubernetes Documentation](https://kubernetes.io/docs/)
- [CNCF Security Whitepaper](https://example.com)
- [Previous blog post: Container Security](/blog/2025/07/20/container-security/)
```

## Advanced Features

### Table of Contents (Automatic)

Jekyll automatically generates a table of contents from your headers.

### Syntax Highlighting

Supported languages include:
- `bash`, `shell`, `zsh`
- `yaml`, `yml`
- `json`
- `terraform`, `hcl`
- `python`, `py`
- `javascript`, `js`
- `dockerfile`
- `sql`
- `powershell`

### Linking to Other Posts

```markdown
[Read my previous post about Terraform](/blog/2024/09/10/terraform-state-management-azure/)
```

## Writing Tips

### Technical Content Best Practices:

1. **Start with the problem** - Why should readers care?
2. **Use clear examples** - Show, don't just tell
3. **Test your code** - Ensure all examples work
4. **Add context** - Explain why, not just how
5. **Use consistent formatting** - Follow the same patterns
6. **Include error handling** - Show what can go wrong

### SEO and Readability:

1. **Use descriptive titles** - Include key technologies
2. **Write clear introductions** - Hook readers immediately
3. **Break up long sections** - Use subheadings liberally
4. **Add relevant tags** - Help people discover your content
5. **Include code comments** - Explain complex configurations
6. **End with actionable takeaways** - Give readers clear next steps

## Example Categories and Tags

### Categories (pick 1-2):
- `azure`, `aws`, `gcp`
- `kubernetes`, `docker`
- `terraform`, `ansible`
- `devops`, `security`
- `monitoring`, `logging`

### Tags (pick 3-7):
- Technology: `k8s`, `helm`, `istio`, `prometheus`
- Tools: `kubectl`, `terraform`, `ansible`
- Concepts: `iac`, `ci-cd`, `gitops`, `rbac`
- Cloud: `aks`, `eks`, `gke`, `azure-devops`

## Publishing Workflow

1. **Write locally** - Create your `.md` file in `_posts/`
2. **Preview** - Use VS Code's Markdown preview or push to a branch
3. **Review** - Check formatting, links, and code examples
4. **Commit and push** - GitHub Pages will build automatically
5. **Share** - Your post will be live at `/blog/YYYY/MM/DD/title/`

## Troubleshooting

### Common Issues:

**Post not showing up:**
- Check file name format: `YYYY-MM-DD-title.md`
- Ensure front matter is properly formatted
- Verify date is not in the future

**Broken formatting:**
- Check for missing closing tags
- Ensure proper indentation in YAML front matter
- Validate code block syntax

**Links not working:**
- Use relative URLs for internal links
- Test external links before publishing

## Quick Reference

### File name: 
`2025-07-24-my-blog-post.md`

### Front matter:
```yaml
---
layout: post
title: "Post Title"
date: 2025-07-24
categories: [category1, category2]
tags: [tag1, tag2, tag3]
---
```

### Code block:
````
```language
code here
```
````

### Internal link:
`[text](/blog/2025/07/20/other-post/)`

---

Happy blogging! 🚀

For questions or issues, refer to the [Jekyll documentation](https://jekyllrb.com/docs/) or [GitHub Pages documentation](https://docs.github.com/en/pages).
