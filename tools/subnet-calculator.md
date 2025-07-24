---
layout: modern
title: "IP Subnet Calculator"
---

<div class="tool-header">
    <h1 class="tool-title">IP Subnet Calculator</h1>
    <p class="tool-subtitle">
        Calculate network details from CIDR notation. Get network addresses, 
        usable IP ranges, and host information instantly.
    </p>
</div>

<div class="calculator-grid">
    <div class="input-section">
        <h2 class="section-title">
            <i class="fas fa-keyboard"></i>
            Input
        </h2>
        
        <div class="input-group">
            <label class="input-label" for="cidr-input">CIDR Block</label>
            <input 
                type="text" 
                id="cidr-input" 
                class="input-field" 
                placeholder="192.168.1.0/24"
                autocomplete="off"
            >
            <div class="input-hint">
                Enter an IP address with subnet mask in CIDR notation (e.g., 192.168.1.0/24)
            </div>
        </div>

        <div class="examples">
            <strong>Examples:</strong><br>
            <span class="example-btn" onclick="setExample('192.168.1.0/24')">192.168.1.0/24</span>
            <span class="example-btn" onclick="setExample('10.0.0.0/16')">10.0.0.0/16</span>
            <span class="example-btn" onclick="setExample('172.16.0.0/20')">172.16.0.0/20</span>
            <span class="example-btn" onclick="setExample('192.168.0.0/22')">192.168.0.0/22</span>
            <span class="example-btn" onclick="setExample('10.1.0.0/18')">10.1.0.0/18</span>
        </div>

        <div class="error-message" id="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <span id="error-text"></span>
        </div>
    </div>

    <div class="output-section">
        <h2 class="section-title">
            <i class="fas fa-chart-bar"></i>
            Results
        </h2>
        
        <div class="result-grid" id="results">
            <div class="result-item">
                <div class="result-label">Network Address</div>
                <div class="result-value" id="network-address">-</div>
                <button class="copy-btn" onclick="copyToClipboard('network-address', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <div class="result-item">
                <div class="result-label">Subnet Mask</div>
                <div class="result-value" id="subnet-mask">-</div>
                <button class="copy-btn" onclick="copyToClipboard('subnet-mask', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <div class="result-item">
                <div class="result-label">First Usable IP</div>
                <div class="result-value" id="first-ip">-</div>
                <button class="copy-btn" onclick="copyToClipboard('first-ip', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <div class="result-item">
                <div class="result-label">Last Usable IP</div>
                <div class="result-value" id="last-ip">-</div>
                <button class="copy-btn" onclick="copyToClipboard('last-ip', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <div class="result-item">
                <div class="result-label">Broadcast Address</div>
                <div class="result-value" id="broadcast-address">-</div>
                <button class="copy-btn" onclick="copyToClipboard('broadcast-address', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <div class="result-item">
                <div class="result-label">Total Hosts</div>
                <div class="result-value" id="total-hosts">-</div>
                <button class="copy-btn" onclick="copyToClipboard('total-hosts', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <div class="result-item">
                <div class="result-label">Usable Hosts</div>
                <div class="result-value" id="usable-hosts">-</div>
                <button class="copy-btn" onclick="copyToClipboard('usable-hosts', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <div class="result-item">
                <div class="result-label">Wildcard Mask</div>
                <div class="result-value" id="wildcard-mask">-</div>
                <button class="copy-btn" onclick="copyToClipboard('wildcard-mask', this)">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>

        <div class="subnet-info" id="subnet-info" style="display: none;">
            <h4><i class="fas fa-info-circle"></i> Subnet Information</h4>
            <div id="subnet-class">-</div>
            <div id="subnet-type">-</div>
        </div>
    </div>
</div>

<!-- Subnet Splitter Section -->
<div class="subnet-splitter" id="subnet-splitter" style="display: none;">
    <h2 class="section-title">
        <i class="fas fa-cut"></i>
        Subnet Splitter
    </h2>
    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
        Split the network into smaller subnets. Choose by number of subnets, hosts per subnet, or target subnet mask.
    </p>
    
    <div class="splitter-controls">
        <div class="input-group">
            <label class="input-label" for="split-type">Split Method</label>
            <select id="split-type" class="input-field" style="cursor: pointer;">
                <option value="subnets">Number of Subnets</option>
                <option value="hosts">Hosts per Subnet</option>
                <option value="mask">Target Subnet Mask</option>
            </select>
        </div>
        
        <div class="input-group">
            <label class="input-label" for="split-value">Value</label>
            <input 
                type="number" 
                id="split-value" 
                class="input-field" 
                min="2" 
                max="1024"
                placeholder="e.g., 4"
            >
        </div>
        
        <button id="split-button" class="split-button" onclick="splitSubnet()">
            <i class="fas fa-cut"></i> Split
        </button>
    </div>

    <div id="split-results" style="display: none;">
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">
            <i class="fas fa-network-wired"></i>
            Generated Subnets (<span id="subnet-count">0</span>)
        </h3>
        <div class="subnets-grid" id="subnets-grid"></div>
    </div>
</div>

<style>
    .tool-header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 3rem 0 0 0;
    }

    .tool-title {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 1rem;
    }

    .tool-subtitle {
        font-size: 1.2rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
    }

    .calculator-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
    }

    .subnet-splitter {
        grid-column: 1 / -1;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 2rem;
        backdrop-filter: blur(20px);
        margin-top: 2rem;
    }

    .splitter-controls {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 1rem;
        align-items: end;
        margin-bottom: 2rem;
    }

    .split-button {
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    .split-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 217, 255, 0.3);
    }

    .split-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    .subnets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
    }

    .subnet-card {
        background: rgba(0, 217, 255, 0.05);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 8px;
        padding: 1rem;
    }

    .subnet-card h4 {
        margin: 0 0 0.5rem 0;
        color: var(--accent-blue);
        font-size: 0.9rem;
    }

    .subnet-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.3rem 0;
        font-size: 0.85rem;
        font-family: 'JetBrains Mono', monospace;
    }

    .subnet-detail .label {
        color: var(--text-secondary);
    }

    .subnet-detail .value {
        color: var(--text-primary);
    }

    .subnet-detail .copy-mini {
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
        padding: 0.2rem;
        color: var(--accent-blue);
    }

    .subnet-detail:hover .copy-mini {
        opacity: 1;
    }

    .input-section, .output-section {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 2rem;
        backdrop-filter: blur(20px);
    }

    .section-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
    }

    .section-title i {
        margin-right: 0.5rem;
        color: var(--accent-blue);
    }

    .input-group {
        margin-bottom: 2rem;
    }

    .input-label {
        display: block;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .input-field {
        width: 100%;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: var(--text-primary);
        font-family: 'JetBrains Mono', monospace;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .input-field:focus {
        outline: none;
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.3);
    }

    .input-field.error {
        border-color: var(--accent-red);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
    }

    .input-hint {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .examples {
        margin-top: 1rem;
    }

    .example-btn {
        display: inline-block;
        padding: 0.4rem 0.8rem;
        margin: 0.2rem 0.3rem 0.2rem 0;
        background: rgba(0, 217, 255, 0.1);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 6px;
        color: var(--accent-blue);
        text-decoration: none;
        font-size: 0.85rem;
        font-family: 'JetBrains Mono', monospace;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .example-btn:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.4);
    }

    .result-grid {
        display: grid;
        gap: 1rem;
    }

    .result-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;
        position: relative;
    }

    .result-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .result-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 217, 255, 0.1);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 6px;
        color: var(--accent-blue);
        padding: 0.4rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.8rem;
    }

    .copy-btn:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: var(--accent-blue);
    }

    .copy-btn.copied {
        background: rgba(16, 185, 129, 0.2);
        border-color: var(--accent-green);
        color: var(--accent-green);
    }

    .error-message {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 8px;
        padding: 1rem;
        color: var(--accent-red);
        margin-top: 1rem;
        display: none;
    }

    .subnet-info {
        margin-top: 2rem;
        padding: 1.5rem;
        background: rgba(0, 217, 255, 0.05);
        border: 1px solid rgba(0, 217, 255, 0.1);
        border-radius: 8px;
    }

    .subnet-info h4 {
        color: var(--accent-blue);
        margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
        .calculator-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .tool-header {
            padding: 2rem 0 0 0;
        }
        
        .tool-title {
            font-size: 2rem;
        }
        
        .splitter-controls {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .subnets-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

<script>
    class SubnetCalculator {
        constructor() {
            this.currentNetwork = null;
            this.initializeEventListeners();
        }

        initializeEventListeners() {
            const input = document.getElementById('cidr-input');
            input.addEventListener('input', (e) => this.calculateSubnet(e.target.value));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateSubnet(e.target.value);
                }
            });

            // Subnet splitter event listeners
            const splitType = document.getElementById('split-type');
            const splitValue = document.getElementById('split-value');
            
            splitType.addEventListener('change', () => this.updateSplitConstraints());
            splitValue.addEventListener('input', () => this.validateSplitInput());
            splitValue.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.splitSubnet();
                }
            });
        }

        updateSplitConstraints() {
            const splitType = document.getElementById('split-type').value;
            const splitValue = document.getElementById('split-value');
            const label = document.querySelector('label[for="split-value"]');
            
            if (splitType === 'subnets') {
                splitValue.type = 'number';
                splitValue.min = 2;
                splitValue.max = 1024;
                splitValue.placeholder = 'e.g., 4';
                label.textContent = 'Number of Subnets';
            } else if (splitType === 'hosts') {
                splitValue.type = 'number';
                splitValue.min = 2;
                splitValue.max = 65534;
                splitValue.placeholder = 'e.g., 50';
                label.textContent = 'Hosts per Subnet';
            } else if (splitType === 'mask') {
                splitValue.type = 'number';
                splitValue.min = this.currentNetwork ? this.currentNetwork.mask + 1 : 1;
                splitValue.max = 30;
                splitValue.placeholder = 'e.g., 26';
                label.textContent = 'Target Mask (CIDR)';
            }
            
            this.validateSplitInput();
        }

        validateSplitInput() {
            const splitButton = document.getElementById('split-button');
            const splitValue = document.getElementById('split-value');
            const splitType = document.getElementById('split-type').value;
            const value = parseInt(splitValue.value);
            
            let isValid = this.currentNetwork && !isNaN(value);
            
            if (isValid && splitType === 'mask') {
                // For mask splitting, ensure the target mask is larger than current
                isValid = value > this.currentNetwork.mask && value <= 30;
            } else if (isValid) {
                // For other types, use min/max validation
                isValid = value >= parseInt(splitValue.min) && value <= parseInt(splitValue.max);
            }
                          
            splitButton.disabled = !isValid;
        }

        ipToInt(ip) {
            return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
        }

        intToIp(int) {
            return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
        }

        validateCIDR(cidr) {
            const regex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
            if (!regex.test(cidr)) {
                throw new Error('Invalid CIDR format. Use format: x.x.x.x/y');
            }

            const [ip, mask] = cidr.split('/');
            const maskNum = parseInt(mask, 10);

            if (maskNum < 0 || maskNum > 32) {
                throw new Error('Subnet mask must be between 0 and 32');
            }

            const octets = ip.split('.').map(octet => parseInt(octet, 10));
            for (const octet of octets) {
                if (octet < 0 || octet > 255) {
                    throw new Error('IP address octets must be between 0 and 255');
                }
            }

            return { ip, mask: maskNum };
        }

        getSubnetClass(ip) {
            const firstOctet = parseInt(ip.split('.')[0], 10);
            if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
            if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
            if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
            if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
            if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Reserved)';
            return 'Unknown';
        }

        getSubnetType(ip) {
            const firstOctet = parseInt(ip.split('.')[0], 10);
            const secondOctet = parseInt(ip.split('.')[1], 10);
            
            if (firstOctet === 10) return 'Private (RFC 1918)';
            if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'Private (RFC 1918)';
            if (firstOctet === 192 && secondOctet === 168) return 'Private (RFC 1918)';
            if (firstOctet === 127) return 'Loopback (RFC 1122)';
            if (firstOctet === 169 && secondOctet === 254) return 'Link-Local (RFC 3927)';
            return 'Public';
        }

        calculateSubnet(cidr) {
            this.clearError();

            if (!cidr || cidr.trim() === '') {
                this.clearResults();
                this.currentNetwork = null;
                this.hideSplitter();
                return;
            }

            try {
                const { ip, mask } = this.validateCIDR(cidr.trim());
                
                const ipInt = this.ipToInt(ip);
                const subnetMask = (0xFFFFFFFF << (32 - mask)) >>> 0;
                const wildcardMask = ~subnetMask >>> 0;
                
                const networkInt = (ipInt & subnetMask) >>> 0;
                const broadcastInt = (networkInt | wildcardMask) >>> 0;
                
                const networkAddress = this.intToIp(networkInt);
                const broadcastAddress = this.intToIp(broadcastInt);
                const subnetMaskStr = this.intToIp(subnetMask);
                const wildcardMaskStr = this.intToIp(wildcardMask);
                
                const totalHosts = Math.pow(2, 32 - mask);
                const usableHosts = Math.max(0, totalHosts - 2);
                
                const firstUsableInt = networkInt + 1;
                const lastUsableInt = broadcastInt - 1;
                
                const firstUsableIP = usableHosts > 0 ? this.intToIp(firstUsableInt) : 'N/A';
                const lastUsableIP = usableHosts > 0 ? this.intToIp(lastUsableInt) : 'N/A';

                // Store current network for splitting
                this.currentNetwork = {
                    ip: networkAddress,
                    mask: mask,
                    networkInt: networkInt,
                    broadcastInt: broadcastInt,
                    availableBits: 32 - mask
                };

                this.displayResults({
                    networkAddress,
                    subnetMask: subnetMaskStr,
                    firstUsableIP,
                    lastUsableIP,
                    broadcastAddress,
                    totalHosts: totalHosts.toLocaleString(),
                    usableHosts: usableHosts.toLocaleString(),
                    wildcardMask: wildcardMaskStr,
                    subnetClass: this.getSubnetClass(ip),
                    subnetType: this.getSubnetType(ip)
                });

                // Show splitter if network can be split
                if (mask < 30) {
                    this.showSplitter();
                    this.updateSplitConstraints(); // Update constraints when network changes
                } else {
                    this.hideSplitter();
                }

            } catch (error) {
                this.showError(error.message);
                this.clearResults();
                this.currentNetwork = null;
                this.hideSplitter();
            }
        }

        displayResults(results) {
            document.getElementById('network-address').textContent = results.networkAddress;
            document.getElementById('subnet-mask').textContent = results.subnetMask;
            document.getElementById('first-ip').textContent = results.firstUsableIP;
            document.getElementById('last-ip').textContent = results.lastUsableIP;
            document.getElementById('broadcast-address').textContent = results.broadcastAddress;
            document.getElementById('total-hosts').textContent = results.totalHosts;
            document.getElementById('usable-hosts').textContent = results.usableHosts;
            document.getElementById('wildcard-mask').textContent = results.wildcardMask;

            document.getElementById('subnet-class').textContent = `Network Class: ${results.subnetClass}`;
            document.getElementById('subnet-type').textContent = `Address Type: ${results.subnetType}`;
            document.getElementById('subnet-info').style.display = 'block';

            // Remove error styling
            document.getElementById('cidr-input').classList.remove('error');
        }

        clearResults() {
            const resultElements = [
                'network-address', 'subnet-mask', 'first-ip', 'last-ip',
                'broadcast-address', 'total-hosts', 'usable-hosts', 'wildcard-mask'
            ];
            
            resultElements.forEach(id => {
                document.getElementById(id).textContent = '-';
            });

            document.getElementById('subnet-info').style.display = 'none';
        }

        showError(message) {
            const errorDiv = document.getElementById('error-message');
            const errorText = document.getElementById('error-text');
            
            errorText.textContent = message;
            errorDiv.style.display = 'block';
            document.getElementById('cidr-input').classList.add('error');
        }

        clearError() {
            document.getElementById('error-message').style.display = 'none';
            document.getElementById('cidr-input').classList.remove('error');
        }

        showSplitter() {
            document.getElementById('subnet-splitter').style.display = 'block';
            this.validateSplitInput();
        }

        hideSplitter() {
            document.getElementById('subnet-splitter').style.display = 'none';
            document.getElementById('split-results').style.display = 'none';
        }

        splitSubnet() {
            if (!this.currentNetwork) return;

            const splitType = document.getElementById('split-type').value;
            const splitValue = parseInt(document.getElementById('split-value').value);

            if (isNaN(splitValue) || splitValue < 2) {
                this.showError('Please enter a valid number (minimum 2)');
                return;
            }

            try {
                let subnets;
                if (splitType === 'subnets') {
                    subnets = this.splitBySubnetCount(splitValue);
                } else if (splitType === 'hosts') {
                    subnets = this.splitByHostCount(splitValue);
                } else if (splitType === 'mask') {
                    subnets = this.splitByTargetMask(splitValue);
                }

                this.displaySplitResults(subnets);
            } catch (error) {
                this.showError(error.message);
            }
        }

        splitBySubnetCount(subnetCount) {
            const bitsNeeded = Math.ceil(Math.log2(subnetCount));
            const newMask = this.currentNetwork.mask + bitsNeeded;

            if (newMask > 30) {
                throw new Error('Cannot create that many subnets. Maximum mask length exceeded.');
            }

            const subnetSize = Math.pow(2, 32 - newMask);
            const subnets = [];

            for (let i = 0; i < subnetCount; i++) {
                const subnetStart = this.currentNetwork.networkInt + (i * subnetSize);
                const subnetEnd = subnetStart + subnetSize - 1;
                
                if (subnetStart > this.currentNetwork.broadcastInt) break;

                subnets.push(this.createSubnetInfo(subnetStart, newMask, i + 1));
            }

            return subnets;
        }

        splitByHostCount(hostCount) {
            const totalHostsNeeded = hostCount + 2; // +2 for network and broadcast
            const bitsNeeded = Math.ceil(Math.log2(totalHostsNeeded));
            const newMask = 32 - bitsNeeded;

            if (newMask <= this.currentNetwork.mask) {
                throw new Error('Not enough address space for the requested host count.');
            }

            if (newMask > 30) {
                throw new Error('Host count too small. Minimum is 2 hosts per subnet.');
            }

            const subnetSize = Math.pow(2, 32 - newMask);
            const maxSubnets = Math.floor((this.currentNetwork.broadcastInt - this.currentNetwork.networkInt + 1) / subnetSize);
            const subnets = [];

            for (let i = 0; i < maxSubnets; i++) {
                const subnetStart = this.currentNetwork.networkInt + (i * subnetSize);
                
                if (subnetStart > this.currentNetwork.broadcastInt) break;

                subnets.push(this.createSubnetInfo(subnetStart, newMask, i + 1));
            }

            return subnets;
        }

        splitByTargetMask(targetMask) {
            if (targetMask <= this.currentNetwork.mask) {
                throw new Error(`Target mask /${targetMask} must be larger than current mask /${this.currentNetwork.mask}`);
            }

            if (targetMask > 30) {
                throw new Error('Target mask cannot exceed /30 (maximum useful subnet size)');
            }

            const subnetSize = Math.pow(2, 32 - targetMask);
            const maxSubnets = Math.floor((this.currentNetwork.broadcastInt - this.currentNetwork.networkInt + 1) / subnetSize);
            const subnets = [];

            for (let i = 0; i < maxSubnets; i++) {
                const subnetStart = this.currentNetwork.networkInt + (i * subnetSize);
                
                if (subnetStart > this.currentNetwork.broadcastInt) break;

                subnets.push(this.createSubnetInfo(subnetStart, targetMask, i + 1));
            }

            return subnets;
        }

        createSubnetInfo(networkInt, mask, index) {
            const subnetSize = Math.pow(2, 32 - mask);
            const broadcastInt = networkInt + subnetSize - 1;
            const firstUsableInt = networkInt + 1;
            const lastUsableInt = broadcastInt - 1;
            const usableHosts = Math.max(0, subnetSize - 2);

            return {
                index,
                network: this.intToIp(networkInt),
                mask,
                cidr: `${this.intToIp(networkInt)}/${mask}`,
                broadcast: this.intToIp(broadcastInt),
                firstUsable: usableHosts > 0 ? this.intToIp(firstUsableInt) : 'N/A',
                lastUsable: usableHosts > 0 ? this.intToIp(lastUsableInt) : 'N/A',
                usableHosts: usableHosts.toLocaleString()
            };
        }

        displaySplitResults(subnets) {
            const resultsDiv = document.getElementById('split-results');
            const subnetsGrid = document.getElementById('subnets-grid');
            const subnetCount = document.getElementById('subnet-count');

            subnetCount.textContent = subnets.length;
            subnetsGrid.innerHTML = '';

            subnets.forEach(subnet => {
                const card = this.createSubnetCard(subnet);
                subnetsGrid.appendChild(card);
            });

            resultsDiv.style.display = 'block';
        }

        createSubnetCard(subnet) {
            const card = document.createElement('div');
            card.className = 'subnet-card';
            
            card.innerHTML = `
                <h4>Subnet ${subnet.index}</h4>
                <div class="subnet-detail">
                    <span class="label">Network:</span>
                    <span class="value">${subnet.cidr}</span>
                    <i class="fas fa-copy copy-mini" onclick="copyText('${subnet.cidr}', this)"></i>
                </div>
                <div class="subnet-detail">
                    <span class="label">First IP:</span>
                    <span class="value">${subnet.firstUsable}</span>
                    <i class="fas fa-copy copy-mini" onclick="copyText('${subnet.firstUsable}', this)"></i>
                </div>
                <div class="subnet-detail">
                    <span class="label">Last IP:</span>
                    <span class="value">${subnet.lastUsable}</span>
                    <i class="fas fa-copy copy-mini" onclick="copyText('${subnet.lastUsable}', this)"></i>
                </div>
                <div class="subnet-detail">
                    <span class="label">Broadcast:</span>
                    <span class="value">${subnet.broadcast}</span>
                    <i class="fas fa-copy copy-mini" onclick="copyText('${subnet.broadcast}', this)"></i>
                </div>
                <div class="subnet-detail">
                    <span class="label">Hosts:</span>
                    <span class="value">${subnet.usableHosts}</span>
                    <i class="fas fa-copy copy-mini" onclick="copyText('${subnet.usableHosts}', this)"></i>
                </div>
            `;

            return card;
        }
    }

    // Global functions
    function setExample(cidr) {
        document.getElementById('cidr-input').value = cidr;
        calculator.calculateSubnet(cidr);
    }

    function splitSubnet() {
        calculator.splitSubnet();
    }

    function copyText(text, button) {
        if (text === '-' || text === 'N/A') return;

        navigator.clipboard.writeText(text).then(() => {
            const originalClass = button.className;
            
            button.className = 'fas fa-check copy-mini';
            button.style.color = 'var(--accent-green)';
            
            setTimeout(() => {
                button.className = originalClass;
                button.style.color = '';
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    function copyToClipboard(elementId, button) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        if (text === '-' || text === 'N/A') return;

        navigator.clipboard.writeText(text).then(() => {
            const icon = button.querySelector('i');
            const originalClass = icon.className;
            
            button.classList.add('copied');
            icon.className = 'fas fa-check';
            
            setTimeout(() => {
                button.classList.remove('copied');
                icon.className = originalClass;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Initialize calculator when page loads
    let calculator;
    
    document.addEventListener('DOMContentLoaded', () => {
        calculator = new SubnetCalculator();
        // Initialize with default value
        calculator.calculateSubnet('192.168.1.0/24');
    });
</script>
