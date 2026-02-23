/**
 * PWA INJECTION SCRIPT — HOA SAC
 * Tiêm manifest, viewport, responsive.css, và SW register vào tất cả các trang HTML.
 * Chạy: node inject_pwa.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HTML_FILES = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

// Tags cần thêm vào <head>
const PWA_HEAD_TAGS = `
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#0a0a0a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="HOA SAC">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="assets/images/icons/icon-192.png">
    <!-- Responsive CSS -->
    <link rel="stylesheet" href="responsive.css">`;

// Script đăng ký Service Worker — thêm trước </body>
const SW_SCRIPT = `
    <!-- PWA Service Worker -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js').catch(() => {});
            });
        }
    </script>`;

let injected = 0;

HTML_FILES.forEach(file => {
    const filePath = path.join(ROOT, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Inject PWA head tags (after last <meta> or before </head>)
    if (!html.includes('manifest.json')) {
        if (html.includes('</head>')) {
            html = html.replace('</head>', PWA_HEAD_TAGS + '\n</head>');
            changed = true;
        }
    }

    // 2. Inject responsive.css if not present
    if (!html.includes('responsive.css') && !changed) {
        // Already injected via PWA_HEAD_TAGS
    }

    // 3. Inject SW register script (before </body>)
    if (!html.includes('serviceWorker') && !html.includes('service-worker.js')) {
        if (html.includes('</body>')) {
            html = html.replace('</body>', SW_SCRIPT + '\n</body>');
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf-8');
        console.log(`✅ ${file}`);
        injected++;
    } else {
        console.log(`⏭️  ${file} (đã có hoặc bỏ qua)`);
    }
});

console.log(`\nHoàn tất! Đã tiêm PWA vào ${injected}/${HTML_FILES.length} trang.`);
