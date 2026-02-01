---
layout: modern
title: "URL Shortener"
description: "Free URL shortening service - Create short, memorable links for your long URLs. Perfect for sharing on social media, tracking campaigns, and simplifying link management."
---

<section class="hero">
    <h1>URL Shortener</h1>
    <p>Create short, memorable links for easy sharing</p>
</section>

<section class="section">
    <div class="cards-grid">
        <div class="card">
            <h2 class="section-title">
                <i class="fas fa-link"></i>
                Shorten URL
            </h2>
            
            <div class="input-group">
                <label class="input-label" for="long-url-input">Long URL</label>
                <input 
                    type="text" 
                    id="long-url-input" 
                    class="input-field" 
                    placeholder="https://example.com/very/long/url/path"
                    autocomplete="off"
                >
                <div class="input-hint">
                    Enter the URL you want to shorten
                </div>
            </div>

            <div class="input-group" style="margin-top: 1rem;">
                <label class="input-label" for="custom-alias">Custom Alias (Optional)</label>
                <input 
                    type="text" 
                    id="custom-alias" 
                    class="input-field" 
                    placeholder="my-custom-link"
                    autocomplete="off"
                >
                <div class="input-hint">
                    Create a custom short link (letters, numbers, hyphens only)
                </div>
            </div>

            <button 
                class="btn btn-primary" 
                onclick="shortenUrl()"
                style="margin-top: 1.5rem; width: 100%;"
            >
                <i class="fas fa-cut"></i>
                Shorten URL
            </button>

            <div class="error-message" id="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span id="error-text"></span>
            </div>
        </div>
        
        <div class="card" id="result-card" style="display: none;">
            <h2 class="section-title">
                <i class="fas fa-check-circle"></i>
                Shortened URL
            </h2>
            
            <div class="result-container">
                <div class="result-url" id="short-url-display">
                    <!-- Shortened URL will appear here -->
                </div>
                
                <div class="button-group" style="margin-top: 1rem;">
                    <button 
                        class="btn btn-secondary" 
                        onclick="copyToClipboard()"
                    >
                        <i class="fas fa-copy"></i>
                        Copy Link
                    </button>
                    
                    <button 
                        class="btn btn-secondary" 
                        onclick="openInNewTab()"
                    >
                        <i class="fas fa-external-link-alt"></i>
                        Open
                    </button>
                </div>
                
                <div class="stats-container" style="margin-top: 1.5rem;">
                    <div class="stat-item">
                        <span class="stat-label">Original Length:</span>
                        <span class="stat-value" id="original-length">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Shortened Length:</span>
                        <span class="stat-value" id="shortened-length">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Saved:</span>
                        <span class="stat-value" id="saved-chars">0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card" style="margin-top: 2rem;">
        <h2 class="section-title">
            <i class="fas fa-clock"></i>
            Recent Links
        </h2>
        
        <div id="recent-links-container">
            <p style="color: #666; text-align: center; padding: 2rem;">
                No recent links yet. Create your first shortened URL above!
            </p>
        </div>
    </div>
</section>

<style>
.result-container {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.result-url {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0066cc;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    word-break: break-all;
    text-align: center;
    border: 2px solid #0066cc;
}

.button-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.button-group .btn {
    flex: 1;
    min-width: 120px;
}

.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.stat-item {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.error-message {
    display: none;
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 6px;
    margin-top: 1rem;
}

.error-message i {
    margin-right: 0.5rem;
}

.recent-link-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 0.5rem;
}

.recent-link-info {
    flex: 1;
}

.recent-link-short {
    font-weight: 600;
    color: #0066cc;
    margin-bottom: 0.25rem;
}

.recent-link-original {
    font-size: 0.875rem;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
}

.recent-link-actions {
    display: flex;
    gap: 0.5rem;
}

.recent-link-actions button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}
</style>

<script>
let shortenedUrl = '';

// Initialize from localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadRecentLinks();
});

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
        return false;
    }
}

function isValidAlias(alias) {
    // Only allow letters, numbers, and hyphens
    return /^[a-zA-Z0-9-]+$/.test(alias);
}

function generateRandomAlias(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    errorText.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function shortenUrl() {
    const longUrl = document.getElementById('long-url-input').value.trim();
    const customAlias = document.getElementById('custom-alias').value.trim();
    
    // Validate URL
    if (!longUrl) {
        showError('Please enter a URL to shorten');
        return;
    }
    
    if (!isValidUrl(longUrl)) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }
    
    // Validate custom alias if provided
    if (customAlias && !isValidAlias(customAlias)) {
        showError('Custom alias can only contain letters, numbers, and hyphens');
        return;
    }
    
    // Generate or use custom alias
    const alias = customAlias || generateRandomAlias();
    const baseUrl = 'https://mustafazeya.online/s/';
    shortenedUrl = baseUrl + alias;
    
    // Display result
    document.getElementById('short-url-display').textContent = shortenedUrl;
    document.getElementById('result-card').style.display = 'block';
    
    // Update stats
    document.getElementById('original-length').textContent = longUrl.length;
    document.getElementById('shortened-length').textContent = shortenedUrl.length;
    document.getElementById('saved-chars').textContent = (longUrl.length - shortenedUrl.length) + ' chars';
    
    // Save to recent links
    saveToRecentLinks(shortenedUrl, longUrl);
    
    // Scroll to result
    document.getElementById('result-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyToClipboard() {
    navigator.clipboard.writeText(shortenedUrl).then(() => {
        const btn = event.target.closest('button');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
        }, 2000);
    });
}

function openInNewTab() {
    window.open(shortenedUrl, '_blank');
}

function saveToRecentLinks(shortUrl, longUrl) {
    let recentLinks = JSON.parse(localStorage.getItem('recentLinks') || '[]');
    
    // Add new link to the beginning
    recentLinks.unshift({
        short: shortUrl,
        long: longUrl,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 links
    recentLinks = recentLinks.slice(0, 10);
    
    localStorage.setItem('recentLinks', JSON.stringify(recentLinks));
    loadRecentLinks();
}

function loadRecentLinks() {
    const recentLinks = JSON.parse(localStorage.getItem('recentLinks') || '[]');
    const container = document.getElementById('recent-links-container');
    
    if (recentLinks.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No recent links yet. Create your first shortened URL above!</p>';
        return;
    }
    
    container.innerHTML = recentLinks.map(link => `
        <div class="recent-link-item">
            <div class="recent-link-info">
                <div class="recent-link-short">${link.short}</div>
                <div class="recent-link-original" title="${link.long}">${link.long}</div>
            </div>
            <div class="recent-link-actions">
                <button class="btn btn-secondary" onclick="copyRecentLink('${link.short}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn btn-secondary" onclick="window.open('${link.short}', '_blank')">
                    <i class="fas fa-external-link-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function copyRecentLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        const btn = event.target.closest('button');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
        }, 2000);
    });
}
</script>
