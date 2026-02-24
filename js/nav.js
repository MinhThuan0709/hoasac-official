/* =========================================
   js/nav.js — Navigation Overlay & Hamburger
   Dùng chung cho tất cả các trang.
   ========================================= */

(function initNav() {
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    if (!hamburger || !navOverlay) return;

    function openNav() {
        navOverlay.classList.add('open');
        document.body.classList.add('nav-open');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
        navOverlay.classList.remove('open');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', () => {
        navOverlay.classList.contains('open') ? closeNav() : openNav();
    });

    // Close when clicking a link inside overlay
    navOverlay.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

    // Close on Escape key
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

    // Header scroll effect
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // Overlay clock (shared across all pages)
    function updateOverlayClock() {
        const el = document.getElementById('ov-clock');
        if (!el) return;
        const now = new Date();
        el.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
            .map(n => String(n).padStart(2, '0')).join(':');
    }
    setInterval(updateOverlayClock, 1000);
    updateOverlayClock();

    // Mood image swap on section hover
    const ovSections = document.querySelectorAll('.ov-section');
    const moodImg = document.getElementById('ov-mood-img');
    const moodText = document.getElementById('ov-mood-text');
    const moodLabels = { '01': 'New Collection', '02': 'Fabric Stories', '03': 'Silhouette Edit' };

    if (moodImg) {
        ovSections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                const imgSrc = section.dataset.img;
                const num = section.querySelector('.ov-num');
                if (imgSrc && !moodImg.src.endsWith(imgSrc)) {
                    moodImg.classList.add('fading');
                    setTimeout(() => {
                        moodImg.src = imgSrc;
                        moodImg.classList.remove('fading');
                        if (num && moodText) {
                            moodText.textContent = moodLabels[num.textContent.trim()] || 'Collection';
                        }
                    }, 300);
                }
            });
        });
    }
})();
