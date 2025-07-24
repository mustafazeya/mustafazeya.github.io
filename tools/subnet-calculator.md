---
layout: modern
title: "IP Subnet Calculator"
---

<div class="subnet-calculator">
    <div class="container">
        <div class="tool-header">
            <h1 class="tool-title">Advanced IP Subnet Calculator</h1>
            <p class="tool-subtitle">Calculate network details and split subnets with precision</p>
        </div>

        <div class="main-content">
            <!-- Input Section -->
            <div class="input-section">
                <div class="input-group">
                    <label for="networkInput">Network (IP/CIDR)</label>
                    <input type="text" id="networkInput" placeholder="192.168.1.0/24" value="192.168.1.0/24">
                    <small>Enter network in CIDR notation (e.g., 192.168.1.0/24)</small>
                </div>
                
                <div class="calculate-section">
                    <button id="calculateBtn" class="btn btn-primary">
                        <i class="fas fa-calculator"></i>
                        Calculate Network
                    </button>
                </div>
            </div>

            <!-- Results Section -->
            <div class="results-section">
                <h2>Network Details</h2>
                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-label">Network Address</div>
                        <div class="result-value" id="networkAddress">-</div>
                        <button class="copy-btn" onclick="copyToClipboard('networkAddress')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="result-card">
                        <div class="result-label">Broadcast Address</div>
                        <div class="result-value" id="broadcastAddress">-</div>
                        <button class="copy-btn" onclick="copyToClipboard('broadcastAddress')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="result-card">
                        <div class="result-label">Subnet Mask</div>
                        <div class="result-value" id="subnetMask">-</div>
                        <button class="copy-btn" onclick="copyToClipboard('subnetMask')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="result-card">
                        <div class="result-label">First Usable IP</div>
                        <div class="result-value" id="firstUsable">-</div>
                        <button class="copy-btn" onclick="copyToClipboard('firstUsable')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="result-card">
                        <div class="result-label">Last Usable IP</div>
                        <div class="result-value" id="lastUsable">-</div>
                        <button class="copy-btn" onclick="copyToClipboard('lastUsable')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="result-card">
                        <div class="result-label">Total Hosts</div>
                        <div class="result-value" id="totalHosts">-</div>
                        <button class="copy-btn" onclick="copyToClipboard('totalHosts')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Subnet Splitting Section -->
            <div class="splitting-section">
                <h2>Subnet Splitting</h2>
                
                <div class="split-methods">
                    <div class="method-tabs">
                        <button class="tab-btn active" data-method="count">Split by Count</button>
                        <button class="tab-btn" data-method="hosts">Split by Hosts</button>
                        <button class="tab-btn" data-method="mask">Split by Mask</button>
                    </div>
                    
                    <div class="split-inputs">
                        <div class="split-method active" id="count-method">
                            <label for="subnetCount">Number of Subnets</label>
                            <input type="number" id="subnetCount" min="2" max="256" value="4">
                            <button id="splitByCountBtn" class="btn btn-secondary">
                                <i class="fas fa-cut"></i>
                                Split Network
                            </button>
                        </div>
                        
                        <div class="split-method" id="hosts-method">
                            <label for="hostsPerSubnet">Hosts per Subnet</label>
                            <input type="number" id="hostsPerSubnet" min="2" value="62">
                            <button id="splitByHostsBtn" class="btn btn-secondary">
                                <i class="fas fa-cut"></i>
                                Split Network
                            </button>
                        </div>
                        
                        <div class="split-method" id="mask-method">
                            <label for="targetMask">Target Subnet Mask</label>
                            <select id="targetMask">
                                <option value="25">/25 (128 hosts)</option>
                                <option value="26" selected>/26 (64 hosts)</option>
                                <option value="27">/27 (32 hosts)</option>
                                <option value="28">/28 (16 hosts)</option>
                                <option value="29">/29 (8 hosts)</option>
                                <option value="30">/30 (4 hosts)</option>
                            </select>
                            <button id="splitByMaskBtn" class="btn btn-secondary">
                                <i class="fas fa-cut"></i>
                                Split Network
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="subnets-results" id="subnetsResults">
                    <!-- Split results will be populated here -->
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .subnet-calculator {
        padding: 2rem 0;
        min-height: calc(100vh - 80px);
    }

    .tool-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .tool-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .tool-subtitle {
        font-size: 1.1rem;
        color: var(--text-secondary);
    }

    .main-content {
        display: grid;
        gap: 3rem;
    }

    /* Input Section */
    .input-section {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        backdrop-filter: blur(10px);
    }

    .input-group {
        margin-bottom: 1.5rem;
    }

    .input-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .input-group input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--secondary-bg);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .input-group input:focus {
        outline: none;
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
    }

    .input-group small {
        display: block;
        margin-top: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.85rem;
    }

    .calculate-section {
        text-align: center;
    }

    /* Results Section */
    .results-section {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        backdrop-filter: blur(10px);
    }

    .results-section h2 {
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }

    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .result-card {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        position: relative;
        transition: all 0.3s ease;
    }

    .result-card:hover {
        border-color: var(--accent-blue);
        transform: translateY(-2px);
    }

    .result-label {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .result-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1rem;
        color: var(--text-primary);
        font-weight: 500;
    }

    .copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .copy-btn:hover {
        color: var(--accent-blue);
        background: rgba(0, 217, 255, 0.1);
    }

    /* Splitting Section */
    .splitting-section {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        backdrop-filter: blur(10px);
    }

    .splitting-section h2 {
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }

    .method-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }

    .tab-btn {
        background: none;
        border: none;
        padding: 0.75rem 1rem;
        color: var(--text-secondary);
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .tab-btn.active {
        color: var(--accent-blue);
        border-bottom-color: var(--accent-blue);
    }

    .tab-btn:hover {
        color: var(--text-primary);
    }

    .split-method {
        display: none;
        gap: 1rem;
        align-items: end;
    }

    .split-method.active {
        display: flex;
    }

    .split-method label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .split-method input,
    .split-method select {
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--secondary-bg);
        color: var(--text-primary);
        font-size: 1rem;
        min-width: 150px;
    }

    .split-method input:focus,
    .split-method select:focus {
        outline: none;
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
    }

    .subnets-results {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
    }

    .subnet-card {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        transition: all 0.3s ease;
    }

    .subnet-card:hover {
        border-color: var(--accent-blue);
        transform: translateY(-2px);
    }

    .subnet-name {
        font-weight: 600;
        color: var(--accent-blue);
        margin-bottom: 0.5rem;
    }

    .subnet-details {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    /* Buttons */
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

    .btn-secondary {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
    }

    .btn-secondary:hover {
        border-color: var(--accent-blue);
        color: var(--accent-blue);
        transform: translateY(-2px);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .subnet-calculator {
            padding: 1rem 0;
        }

        .tool-title {
            font-size: 2rem;
        }

        .tool-subtitle {
            font-size: 1rem;
        }

        .results-grid {
            grid-template-columns: 1fr;
        }

        .split-method {
            flex-direction: column;
            align-items: stretch;
        }

        .split-method input,
        .split-method select {
            min-width: auto;
        }

        .method-tabs {
            flex-wrap: wrap;
        }

        .subnets-results {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 480px) {
        .main-content {
            gap: 2rem;
        }

        .input-section,
        .results-section,
        .splitting-section {
            padding: 1.5rem;
        }

        .tool-header {
            margin-bottom: 2rem;
        }

        .tool-title {
            font-size: 1.75rem;
        }
    }
</style>

<script>
    // IP calculation functions
    function ipToInt(ip) {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    }

    function intToIp(int) {
        return [
            (int >>> 24) & 255,
            (int >>> 16) & 255,
            (int >>> 8) & 255,
            int & 255
        ].join('.');
    }

    function calculateNetwork(networkInput) {
        const [ip, cidr] = networkInput.split('/');
        const cidrNum = parseInt(cidr);
        
        if (cidrNum < 0 || cidrNum > 32) {
            throw new Error('Invalid CIDR notation');
        }

        const mask = (0xFFFFFFFF << (32 - cidrNum)) >>> 0;
        const ipInt = ipToInt(ip);
        const networkInt = (ipInt & mask) >>> 0;
        const broadcastInt = (networkInt | (0xFFFFFFFF >>> cidrNum)) >>> 0;
        
        const totalHosts = Math.pow(2, 32 - cidrNum);
        const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

        return {
            network: intToIp(networkInt),
            broadcast: intToIp(broadcastInt),
            mask: intToIp(mask),
            firstUsable: totalHosts > 2 ? intToIp(networkInt + 1) : intToIp(networkInt),
            lastUsable: totalHosts > 2 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt),
            totalHosts: usableHosts,
            cidr: cidrNum,
            networkInt: networkInt,
            maskInt: mask
        };
    }

    function splitByCount(network, count) {
        const bitsNeeded = Math.ceil(Math.log2(count));
        const newCidr = network.cidr + bitsNeeded;
        
        if (newCidr > 32) {
            throw new Error('Cannot split into that many subnets');
        }

        const subnetSize = Math.pow(2, 32 - newCidr);
        const subnets = [];

        for (let i = 0; i < count; i++) {
            const subnetStart = network.networkInt + (i * subnetSize);
            const subnetNetwork = `${intToIp(subnetStart)}/${newCidr}`;
            const subnetDetails = calculateNetwork(subnetNetwork);
            subnets.push({
                name: `Subnet ${i + 1}`,
                network: subnetNetwork,
                details: subnetDetails
            });
        }

        return subnets;
    }

    function splitByHosts(network, hostsPerSubnet) {
        const totalHostsNeeded = hostsPerSubnet + 2; // Add network and broadcast addresses
        const bitsNeeded = Math.ceil(Math.log2(totalHostsNeeded));
        const newCidr = 32 - bitsNeeded;
        
        if (newCidr <= network.cidr) {
            throw new Error('Cannot fit that many hosts per subnet');
        }

        const subnetSize = Math.pow(2, 32 - newCidr);
        const totalNetworkSize = Math.pow(2, 32 - network.cidr);
        const maxSubnets = Math.floor(totalNetworkSize / subnetSize);
        
        const subnets = [];
        for (let i = 0; i < maxSubnets; i++) {
            const subnetStart = network.networkInt + (i * subnetSize);
            const subnetNetwork = `${intToIp(subnetStart)}/${newCidr}`;
            const subnetDetails = calculateNetwork(subnetNetwork);
            subnets.push({
                name: `Subnet ${i + 1}`,
                network: subnetNetwork,
                details: subnetDetails
            });
        }

        return subnets;
    }

    function splitByMask(network, targetCidr) {
        if (targetCidr <= network.cidr) {
            throw new Error('Target mask must be smaller than current mask');
        }

        const subnetSize = Math.pow(2, 32 - targetCidr);
        const totalNetworkSize = Math.pow(2, 32 - network.cidr);
        const maxSubnets = Math.floor(totalNetworkSize / subnetSize);
        
        const subnets = [];
        for (let i = 0; i < maxSubnets; i++) {
            const subnetStart = network.networkInt + (i * subnetSize);
            const subnetNetwork = `${intToIp(subnetStart)}/${targetCidr}`;
            const subnetDetails = calculateNetwork(subnetNetwork);
            subnets.push({
                name: `Subnet ${i + 1}`,
                network: subnetNetwork,
                details: subnetDetails
            });
        }

        return subnets;
    }

    function displayResults(network) {
        document.getElementById('networkAddress').textContent = network.network;
        document.getElementById('broadcastAddress').textContent = network.broadcast;
        document.getElementById('subnetMask').textContent = network.mask;
        document.getElementById('firstUsable').textContent = network.firstUsable;
        document.getElementById('lastUsable').textContent = network.lastUsable;
        document.getElementById('totalHosts').textContent = network.totalHosts.toLocaleString();
    }

    function displaySubnets(subnets) {
        const container = document.getElementById('subnetsResults');
        container.innerHTML = '';

        subnets.forEach(subnet => {
            const card = document.createElement('div');
            card.className = 'subnet-card';
            card.innerHTML = `
                <div class="subnet-name">${subnet.name}</div>
                <div class="subnet-details">
                    Network: ${subnet.details.network}<br>
                    Range: ${subnet.details.firstUsable} - ${subnet.details.lastUsable}<br>
                    Hosts: ${subnet.details.totalHosts.toLocaleString()}<br>
                    Broadcast: ${subnet.details.broadcast}
                </div>
            `;
            container.appendChild(card);
        });
    }

    function copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Show feedback
            const btn = element.nextElementSibling;
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = 'var(--accent-green)';
            
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.color = '';
            }, 1000);
        });
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', () => {
        let currentNetwork = null;

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs and methods
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.split-method').forEach(m => m.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding method
                btn.classList.add('active');
                const method = btn.dataset.method;
                document.getElementById(`${method}-method`).classList.add('active');
            });
        });

        // Calculate network
        document.getElementById('calculateBtn').addEventListener('click', () => {
            try {
                const input = document.getElementById('networkInput').value.trim();
                currentNetwork = calculateNetwork(input);
                displayResults(currentNetwork);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });

        // Split by count
        document.getElementById('splitByCountBtn').addEventListener('click', () => {
            if (!currentNetwork) {
                alert('Please calculate a network first');
                return;
            }
            try {
                const count = parseInt(document.getElementById('subnetCount').value);
                const subnets = splitByCount(currentNetwork, count);
                displaySubnets(subnets);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });

        // Split by hosts
        document.getElementById('splitByHostsBtn').addEventListener('click', () => {
            if (!currentNetwork) {
                alert('Please calculate a network first');
                return;
            }
            try {
                const hosts = parseInt(document.getElementById('hostsPerSubnet').value);
                const subnets = splitByHosts(currentNetwork, hosts);
                displaySubnets(subnets);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });

        // Split by mask
        document.getElementById('splitByMaskBtn').addEventListener('click', () => {
            if (!currentNetwork) {
                alert('Please calculate a network first');
                return;
            }
            try {
                const targetCidr = parseInt(document.getElementById('targetMask').value);
                const subnets = splitByMask(currentNetwork, targetCidr);
                displaySubnets(subnets);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });

        // Auto-calculate on input change
        document.getElementById('networkInput').addEventListener('input', () => {
            const input = document.getElementById('networkInput').value.trim();
            if (input.includes('/')) {
                setTimeout(() => {
                    document.getElementById('calculateBtn').click();
                }, 300);
            }
        });

        // Initial calculation
        document.getElementById('calculateBtn').click();
    });
</script>
