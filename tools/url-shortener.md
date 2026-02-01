---
layout: none
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=//mustafazeya.github.io/url-shortener/">
    <link rel="canonical" href="https://mustafazeya.github.io/url-shortener/">
    <title>Redirecting to URL Shortener...</title>
    <script>
        // Get current theme from main site's localStorage
        const currentTheme = localStorage.getItem('portfolio-theme') || 
                           document.documentElement.getAttribute('data-theme') || 
                           'dark';
        // Redirect with theme parameter
        window.location.href = `https://mustafazeya.github.io/url-shortener/?theme=${currentTheme}`;
    </script>
</head>
<body>
    <p>Redirecting to <a href="https://mustafazeya.github.io/url-shortener/">URL Shortener</a>...</p>
</body>
</html>
