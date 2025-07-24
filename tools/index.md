---
layout: modern
title: "Platform Engineering Tools"
---

<div class="tools-page">
    <div class="container">
        <div class="hero">
            <h1 class="hero-title">Platform Engineering Tools</h1>
            <p class="hero-subtitle">Network and infrastructure tools for platform engineers</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">1</div>
                <div class="stat-label">Tool Available</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">100%</div>
                <div class="stat-label">Client-Side</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">0</div>
                <div class="stat-label">Dependencies</div>
            </div>
        </div>

        <div class="tools-grid">
            <div class="tool-card">
                <div class="tool-icon network">
                    <i class="fas fa-network-wired"></i>
                </div>
                <h3 class="tool-title">IP Subnet Calculator</h3>
                <p class="tool-description">
                    Advanced subnet calculator with network splitting capabilities. Calculate network details 
                    from CIDR blocks and split networks into smaller subnets with multiple methods.
                </p>
                <ul class="tool-features">
                    <li>CIDR to network details conversion</li>
                    <li>Subnet splitting by count, hosts, or target mask</li>
                    <li>First/Last usable IP calculation</li>
                    <li>Host count and broadcast address</li>
                    <li>Real-time updates & copy-to-clipboard</li>
                </ul>
                <div class="tool-actions">
                    <a href="subnet-calculator" class="btn btn-primary">
                        <i class="fas fa-calculator"></i>
                        Launch Calculator
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .tools-page {
        padding: 2rem 0;
        min-height: calc(100vh - 80px);
    }

    .hero {
        text-align: center;
        margin-bottom: 4rem;
        padding: 2rem 0;
    }

    .hero-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-subtitle {
        font-size: 1.25rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
    }

    .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
    }

    .stat-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .stat-card:hover {
        transform: translateY(-5px);
        border-color: var(--accent-blue);
        box-shadow: 0 10px 30px rgba(0, 217, 255, 0.2);
    }

    .stat-number {
        font-size: 3rem;
        font-weight: 700;
        color: var(--accent-blue);
        margin-bottom: 0.5rem;
    }

    .stat-label {
        color: var(--text-secondary);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.9rem;
    }

    .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .tool-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 2.5rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
    }

    .tool-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
    }

    .tool-card:hover::before {
        transform: scaleX(1);
    }

    .tool-card:hover {
        transform: translateY(-10px);
        border-color: var(--accent-blue);
        box-shadow: 0 20px 40px rgba(0, 217, 255, 0.3);
    }

    .tool-icon {
        width: 80px;
        height: 80px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }

    .tool-icon.network {
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
        color: white;
    }

    .tool-card:hover .tool-icon {
        transform: scale(1.1) rotate(5deg);
    }

    .tool-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .tool-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .tool-features {
        list-style: none;
        margin-bottom: 2rem;
    }

    .tool-features li {
        color: var(--text-secondary);
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
    }

    .tool-features li::before {
        content: '✓';
        color: var(--accent-green);
        font-weight: bold;
        margin-right: 0.75rem;
        font-size: 1rem;
    }

    .tool-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 217, 255, 0.4);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .tools-grid {
            grid-template-columns: 1fr;
        }

        .tool-card {
            padding: 2rem;
        }

        .hero-title {
            font-size: 2.5rem;
        }

        .hero-subtitle {
            font-size: 1.1rem;
        }

        .stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .stat-card {
            padding: 1.5rem;
        }

        .stat-number {
            font-size: 2.5rem;
        }
    }

    @media (max-width: 480px) {
        .tools-page {
            padding: 1rem 0;
        }

        .hero {
            margin-bottom: 2rem;
            padding: 1rem 0;
        }

        .hero-title {
            font-size: 2rem;
        }

        .tool-card {
            padding: 1.5rem;
        }

        .tools-grid {
            gap: 1.5rem;
        }

        .stats {
            grid-template-columns: 1fr;
        }

        .tool-features li {
            font-size: 0.85rem;
        }
    }
</style>
