/* =========================================
   main.js — HOA SAC Core
   Chỉ chứa logic chuyên biệt cho từng trang.
   Logic chung đã chuyển sang:
     js/nav.js        → Hamburger, overlay, clock
     js/lang.js       → VI/EN toggle
     js/auth-state.js → Header auth UI
     js/cart.js       → Mini cart drawer
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. PRELOADER --- */
    const preloader = document.querySelector('.preloader');
    document.body.style.overflow = 'hidden';

    function dismissPreloader() {
        if (preloader && !preloader.classList.contains('hide-loader')) {
            preloader.classList.add('hide-loader');
            document.body.style.overflow = '';
        }
    }
    window.addEventListener('load', () => setTimeout(dismissPreloader, 1200));
    setTimeout(dismissPreloader, 3000); // Fallback max 3s

    /* --- 1. LENIS SMOOTH SCROLL (Desktop only) --- */
    if (window.innerWidth > 1024 && typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            mouseMultiplier: 1.0,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        /* Parallax scroll */
        const parallaxImages = document.querySelectorAll('.editorial-image img');
        if (parallaxImages.length > 0) {
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                parallaxImages.forEach(img => {
                    const parent = img.parentElement;
                    if (!parent) return;
                    const parentTop = parent.offsetTop;
                    const parentHeight = parent.offsetHeight;
                    if (scrollY + window.innerHeight > parentTop && scrollY < parentTop + parentHeight) {
                        img.style.transform = `translateY(${(scrollY - parentTop) * 0.1}px)`;
                    }
                });
            }, { passive: true });
        }
    }

    /* --- 2. INTERSECTION OBSERVER (Reveal on scroll) --- */
    const hiddenItems = document.querySelectorAll('.hidden-item');
    if (hiddenItems.length > 0) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show-item'); });
        }, { threshold: 0.1 });
        hiddenItems.forEach(el => revealObserver.observe(el));
    }

    /* --- 3. CUSTOM CURSOR (Desktop only) --- */
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.innerWidth > 1024) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverTargets = document.querySelectorAll('a, button, .hamburger-menu, .product-card, .view-more, .quick-add');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });

        document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.8)');
        document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
    }

    /* --- 4. HORIZONTAL SCROLL — RUNWAY (collections.html desktop only) --- */
    const stickySection = document.querySelector('.scroll-container');
    const track = document.querySelector('.horizontal-track');

    if (stickySection && track && window.innerWidth > 768) {
        let lastScrollTop = 0;
        let ticking = false;

        function updateRunway() {
            const scrollDistance = stickySection.offsetHeight - window.innerHeight;
            const scrollTop = window.scrollY - stickySection.offsetTop;
            const percentage = Math.max(0, Math.min(scrollTop / scrollDistance, 1));

            // Move track
            const trackWidth = track.scrollWidth - window.innerWidth;
            track.style.transform = `translate3d(-${percentage * trackWidth}px, 0, 0)`;

            // Theme observer — setup once
            if (!window._themeObserverSetup) {
                const themeObserver = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const theme = entry.target.dataset.theme || 'light';
                            document.body.classList.remove('dark-mode', 'grey-mode');
                            if (theme === 'dark') document.body.classList.add('dark-mode');
                            if (theme === 'grey') document.body.classList.add('grey-mode');
                        }
                    });
                }, { rootMargin: '0px -40% 0px -40%', threshold: 0 });

                document.querySelectorAll('.runway-item').forEach(item => themeObserver.observe(item));
                window._themeObserverSetup = true;
            }

            // Magnetic nav highlight
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length > 0) {
                const activeIndex = Math.max(0, Math.min(Math.round(percentage * (navItems.length - 1)), navItems.length - 1));
                navItems.forEach((nav, idx) => nav.classList.toggle('active', idx === activeIndex));
            }

            lastScrollTop = window.scrollY;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => { updateRunway(); ticking = false; });
                ticking = true;
            }
        }, { passive: true });

        // Click nav to scroll
        document.querySelectorAll('.nav-item').forEach((nav, index, items) => {
            nav.addEventListener('click', () => {
                const scrollDistance = stickySection.offsetHeight - window.innerHeight;
                window.scrollTo({ top: stickySection.offsetTop + (index / (items.length - 1)) * scrollDistance, behavior: 'smooth' });
            });
        });
    }

    /* --- 5. SOUNDSCAPE CONTROLLER --- */
    const soundBtn = document.getElementById('sound-toggle');
    const audio = document.getElementById('bg-audio');
    const soundLabel = document.querySelector('.sound-label');

    if (soundBtn && audio) {
        audio.volume = 0.4;
        let isToggling = false;

        soundBtn.addEventListener('click', async () => {
            if (isToggling) return;
            isToggling = true;
            try {
                if (audio.paused) {
                    await audio.play();
                    soundBtn.classList.add('is-playing');
                    if (soundLabel) soundLabel.textContent = 'Sound On';
                } else {
                    audio.pause();
                    soundBtn.classList.remove('is-playing');
                    if (soundLabel) soundLabel.textContent = 'Sound Off';
                }
            } catch (err) {
                console.error('Audio error:', err);
            } finally {
                isToggling = false;
            }
        });
    }

    /* --- 6. STORY SCROLL (stories.html / about.html) --- */
    const storyTexts = document.querySelectorAll('.text-block');
    const storyImages = document.querySelectorAll('.story-img');

    if (storyTexts.length > 0 && storyImages.length > 0) {
        const storyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const idx = entry.target.getAttribute('data-img');
                storyImages.forEach(img => img.classList.remove('active'));
                document.querySelector(`.story-img[data-index="${idx}"]`)?.classList.add('active');
                storyTexts.forEach(t => t.classList.remove('active-text'));
                entry.target.classList.add('active-text');
            });
        }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });
        storyTexts.forEach(t => storyObserver.observe(t));
    }

    /* --- 7. CONTACT FORM → FIRESTORE (contact.html) --- */
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = bookingForm.querySelector('.btn-submit span');
            const original = btn?.innerText;
            if (btn) btn.innerText = 'Đang gửi...';

            const fields = id => document.getElementById(id)?.value || '';
            const doc = {
                fields: {
                    date: { stringValue: new Date().toISOString() },
                    name: { stringValue: fields('name') },
                    email: { stringValue: fields('email') },
                    subject: { stringValue: fields('subject') },
                    message: { stringValue: fields('message') },
                    status: { stringValue: 'new' }
                }
            };

            const URL = 'https://firestore.googleapis.com/v1/projects/hoasac-web/databases/(default)/documents/consultations';
            try {
                const res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) });
                if (!res.ok) throw new Error((await res.json()).error?.message || 'HTTP ' + res.status);

                const modal = document.getElementById('success-modal');
                if (modal) {
                    modal.classList.add('active');
                    modal.querySelector('.close-modal').onclick = () => modal.classList.remove('active');
                    window.onclick = ev => { if (ev.target === modal) modal.classList.remove('active'); };
                }
                bookingForm.reset();
                if (btn) { btn.innerText = 'Gửi Thành Công ✓'; setTimeout(() => btn.innerText = original, 3000); }
            } catch (err) {
                console.error('Firestore error:', err);
                if (btn) { btn.innerText = 'Lỗi: ' + err.message; setTimeout(() => btn.innerText = original, 5000); }
            }
        });
    }

    /* --- 8. VIDEO HOVER PLAY (collections.html) --- */
    document.querySelectorAll('.runway-item').forEach(item => {
        const video = item.querySelector('video');
        if (video) {
            item.addEventListener('mouseenter', () => video.play());
            item.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
        }
    });

    /* --- 9. FOOTER YEAR --- */
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* --- 10. TREND POPUP --- */
    if (!sessionStorage.getItem('hoa_sac_trend_closed')) {
        const ideas = [
            { img: 'assets/images/lookbook/look-01.jpg', title: 'Xu H&#432;&#7899;ng M&#7899;i', desc: 'Th&#7917; ph&#7889;i Monochrome &#273;&#7875; t&#244;n vinh s&#7921; t&#7889;i gi&#7843;n.' },
            { img: 'assets/images/lookbook/look-02.jpg', title: 'Must Have', desc: 'Ch&#7845;t li&#7879;u l&#7909;a m&#7887;ng nh&#7865; cho l&#7889;i s&#7889;ng thanh l&#7883;ch.' },
            { img: 'assets/images/lookbook/look-03.jpg', title: 'Bespoke', desc: 'Trang ph&#7909;c may &#273;o ri&#234;ng bi&#7879;t cho th&#7901;i &#273;&#7841;i m&#7899;i.' },
            { img: 'assets/images/editorial/editorial-1.jpg', title: 'Ph&#7889;i &#272;&#7891;', desc: 'K&#7871;t h&#7907;p Layering t&#297;nh l&#7863;ng nh&#432;ng s&#7855;c s&#7843;o.' }
        ];
        const idea = ideas[Math.floor(Math.random() * ideas.length)];
        const popup = document.createElement('div');
        popup.className = 'trend-popup';
        popup.innerHTML = `
            <div class="trend-popup-close" title="&#272;&#243;ng">&times;</div>
            <div class="trend-popup-content">
                <img src="${idea.img}" alt="Trend">
                <div class="trend-popup-text">
                    <strong>${idea.title}</strong>
                    <p>${idea.desc}</p>
                </div>
            </div>
            <a href="collections.html" class="trend-popup-link">Kh&#225;m ph&#225; ngay</a>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 5000);
        popup.querySelector('.trend-popup-close').addEventListener('click', () => {
            popup.classList.remove('show');
            sessionStorage.setItem('hoa_sac_trend_closed', 'true');
        });
    }

}); // end DOMContentLoaded

/* =========================================
   GLOBAL: Products DB (Admin Support)
   ========================================= */
window.getProductsDB = async function () {
    const local = localStorage.getItem('hoasac_products_db');
    if (local) return JSON.parse(local);
    try {
        const res = await fetch('assets/data/products.json');
        return await res.json();
    } catch {
        return [];
    }
};
