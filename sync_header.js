const fs = require('fs');
const path = require('path');

const webDir = 'd:/web';

// ===== NEW HEADER BLOCK (identical to index.html) =====
const NEW_HEADER = `    <header class="site-header">
        <div class="header-container">
            <a href="index.html" class="logo">HOA SAC.</a>

            <!-- Center Nav (Desktop only) -->
            <nav class="main-nav">
                <ul class="nav-list">
                    <li class="nav-item"><a href="women.html" class="nav-link" data-vi="Nữ" data-en="Women">Nữ</a></li>
                    <li class="nav-item"><a href="men.html" class="nav-link" data-vi="Nam" data-en="Men">Nam</a></li>
                    <li class="nav-item"><a href="collections.html" class="nav-link" data-vi="Bộ Sưu Tập" data-en="Collections">Bộ Sưu Tập</a></li>
                    <li class="nav-item"><a href="stories.html" class="nav-link" data-vi="Stories" data-en="Stories">Stories</a></li>
                </ul>
            </nav>

            <!-- Right Actions -->
            <div class="header-actions">
                <!-- Language Toggle -->
                <button class="lang-toggle" id="lang-toggle" aria-label="Switch language">
                    <span class="lang-opt" data-lang="vi">VI</span>
                    <span class="lang-divider">/</span>
                    <span class="lang-opt" data-lang="en">EN</span>
                </button>

                <!-- Cart -->
                <a href="cart.html" class="cart-btn" data-vi="Giỏ hàng (0)" data-en="Cart (0)">Giỏ hàng (0)</a>

                <!-- Hamburger: ALWAYS VISIBLE -->
                <div class="hamburger-menu" id="hamburger" aria-label="Open menu">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </div>
    </header>`;

// ===== PREMIUM NAV OVERLAY (identical to index.html) =====
const OVERLAY = `
    <!-- PREMIUM NAV OVERLAY -->
    <div class="nav-overlay" id="nav-overlay">
        <!-- LEFT PANEL -->
        <div class="ov-left">

            <!-- Brand mark -->
            <a href="index.html" class="ov-brand">HOA SAC.</a>

            <!-- Main Navigation -->
            <nav class="ov-nav">

                <!-- 01 · SHOP -->
                <div class="ov-section" data-img="assets/images/lookbook/look-01.jpg">
                    <div class="ov-section-head">
                        <span class="ov-num">01</span>
                        <svg class="ov-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        <span class="ov-label" data-vi="MUA SẮM" data-en="SHOP">MUA SẮM</span>
                    </div>
                    <ul class="ov-items">
                        <li class="ov-item"><a href="collections.html" data-vi="Cao Cấp" data-en="Couture">Cao Cấp</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Sẵn Mặc" data-en="Ready-to-Wear">Sẵn Mặc</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Capsule Drop" data-en="Capsule Drop">Capsule Drop</a></li>
                    </ul>
                </div>

                <!-- 02 · MATERIAL -->
                <div class="ov-section" data-img="assets/images/lookbook/look-02.jpg">
                    <div class="ov-section-head">
                        <span class="ov-num">02</span>
                        <svg class="ov-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                            <polyline points="2 17 12 22 22 17"/>
                            <polyline points="2 12 12 17 22 12"/>
                        </svg>
                        <span class="ov-label" data-vi="CHẤT LIỆU" data-en="MATERIAL">CHẤT LIỆU</span>
                    </div>
                    <ul class="ov-items">
                        <li class="ov-item"><a href="collections.html" data-vi="Denim Élite" data-en="Denim Élite">Denim Élite</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Silk Essence" data-en="Silk Essence">Silk Essence</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Lace Reverie" data-en="Lace Reverie">Lace Reverie</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Power Leather" data-en="Power Leather">Power Leather</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Fur Statement" data-en="Fur Statement">Fur Statement</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Fusion Atelier" data-en="Fusion Atelier">Fusion Atelier</a></li>
                        <li class="ov-item"><a href="collections.html" data-vi="Thêu Đính" data-en="Embellished Couture">Thêu Đính</a></li>
                    </ul>
                </div>

                <!-- 03 · SILHOUETTE -->
                <div class="ov-section" data-img="assets/images/lookbook/look-03.jpg">
                    <div class="ov-section-head">
                        <span class="ov-num">03</span>
                        <svg class="ov-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span class="ov-label" data-vi="DÁNG" data-en="SILHOUETTE">DÁNG</span>
                    </div>
                    <ul class="ov-items">
                        <li class="ov-item"><a href="women.html" data-vi="Váy" data-en="Dress">Váy</a></li>
                        <li class="ov-item"><a href="women.html" data-vi="Áo Corset" data-en="Corset">Áo Corset</a></li>
                        <li class="ov-item"><a href="women.html" data-vi="Áo Khoác" data-en="Coat">Áo Khoác</a></li>
                        <li class="ov-item"><a href="women.html" data-vi="Áo" data-en="Tops">Áo</a></li>
                        <li class="ov-item"><a href="women.html" data-vi="Quần" data-en="Pants">Quần</a></li>
                    </ul>
                </div>

            </nav>

            <!-- Quick links row -->
            <div class="ov-quick">
                <a href="contact.html" class="ov-quick-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><polygon points="12 2 22 9 18 21 6 21 2 9 12 2"/></svg>
                    <span data-vi="Bespoke" data-en="Bespoke">Bespoke</span>
                </a>
                <a href="collections.html" class="ov-quick-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    <span data-vi="Lookbook" data-en="Lookbook">Lookbook</span>
                </a>
                <a href="stories.html" class="ov-quick-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <span data-vi="Editorial" data-en="Editorial">Editorial</span>
                </a>
                <a href="about.html" class="ov-quick-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    <span data-vi="Về chúng tôi" data-en="Our Story">Về chúng tôi</span>
                </a>
            </div>

            <!-- Footer strip -->
            <div class="ov-foot">
                <div class="ov-socials">
                    <a href="https://instagram.com/hoasacfashion" class="ov-social">IG</a>
                    <a href="https://facebook.com/hoasacfashion" class="ov-social">FB</a>
                    <a href="https://twitter.com/hoasacfashion" class="ov-social">TW</a>
                </div>
                <span class="ov-clock" id="ov-clock">00:00</span>
            </div>

        </div>

        <!-- RIGHT PANEL — mood image -->
        <div class="ov-right">
            <div class="ov-mood" id="ov-mood">
                <img src="assets/images/lookbook/look-01.jpg" alt="Mood" id="ov-mood-img">
                <div class="ov-mood-label"><span id="ov-mood-text">New Collection</span></div>
            </div>
        </div>

    </div>`;

// ===== PRELOADER FALLBACK SCRIPT =====
const PRELOADER_FALLBACK = `
    <!-- Preloader fallback -->
    <script>
        (function() {
            setTimeout(function() {
                var pl = document.querySelector('.preloader');
                if (pl) { pl.classList.add('hide-loader'); pl.style.transform = 'translateY(-100%)'; pl.style.pointerEvents = 'none'; }
                document.body.style.overflow = '';
            }, 3500);
        })();
    </script>`;

// Pages to update (skip index.html, admin.html, campaign.html)
const pages = ['women.html','men.html','collections.html','stories.html','about.html','contact.html','cart.html','product-detail.html'];

pages.forEach(page => {
    const filePath = path.join(webDir, page);
    if (!fs.existsSync(filePath)) {
        console.log(`SKIP (not found): ${page}`);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Replace old header block (from <header to </header>)
    html = html.replace(/<header class="site-header"[\s\S]*?<\/header>/m, NEW_HEADER);

    // 2. Remove any existing nav-overlay div
    html = html.replace(/\s*<!-- (?:PREMIUM |FULL-SCREEN )?NAV OVERLAY -->[\s\S]*?<\/div>\s*(?=\n\s*<(?:section|main|div|script))/m, '\n');
    // Fallback remove if above doesn't match
    html = html.replace(/<div class="nav-overlay"[\s\S]*?<\/div>\s*\n\s*(?=\n?\s*<(?:section|main|div[^>]+id|script))/m, '');

    // 3. Inject new overlay right after </header>
    html = html.replace(/<\/header>\s*\n/, '</header>\n' + OVERLAY + '\n');

    // 4. Ensure preloader fallback script exists before </body>
    if (!html.includes('Preloader fallback')) {
        html = html.replace(/<script src=".*?lenis.*?">\s*<\/script>/m, 
            match => PRELOADER_FALLBACK + '\n\n    ' + match);
    }

    // 5. Ensure header.css is linked
    if (!html.includes('header.css')) {
        html = html.replace('<link rel="stylesheet" href="style.css">', 
            '<link rel="stylesheet" href="style.css">\n    <link rel="stylesheet" href="header.css">');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`UPDATED: ${page}`);
});

console.log('Done!');
