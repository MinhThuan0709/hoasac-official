/* =====================================================
   js/collections.js — HOA SAC Collections Page Logic
   Handles: Tab switching · Filter bar · Gallery drag
            Film strip reveal · Stats counter · Parallax
   ===================================================== */

(function () {
    'use strict';

    /* ── Image pools: local assets, fully diversified ──
       Runway images (10 Cloudinary originals):
         COL: look-01..07  /  LB: lookbook-01..03
       Hero banners use DIFFERENT local images from
         assets/unsplash, assets/pexels, assets/editorial
       Gallery Wall + Film Strip use a 3rd pool from
         assets/pexels + assets/unsplash (non-runway)
    ── */

    /* Hero background pools — unique per BST, not used in runway */
    const HERO = {
        'silent-muse': 'assets/images/unsplash/unsplash_cb8DN-Hs3Lo.jpg',  /* dramatic editorial */
        'bloom-noir': 'assets/images/unsplash/unsplash_zpS9eMSObJ4.jpg',  /* dark floral mood  */
        'urban-soul': 'assets/images/unsplash/unsplash_jWwrEHMxuWo.jpg',  /* urban architecture */
    };

    /* Gallery Wall pool — 8 unique Pexels fashion shots */
    const GAL = [
        'assets/images/pexels/photo_15011415.jpg',
        'assets/images/pexels/photo_15011406.jpg',
        'assets/images/pexels/photo_7453194.jpg',
        'assets/images/pexels/photo_4938515.jpg',
        'assets/images/pexels/photo_2920143.jpg',
        'assets/images/pexels/photo_3428524.jpg',
        'assets/images/pexels/photo_2915216.jpg',
        'assets/images/pexels/photo_1655843.jpg',
    ];

    /* Film Strip pool — 3 unique Unsplash editorial shots */
    const FILM = [
        'assets/images/unsplash/unsplash_ysqvKSupscA.jpg',
        'assets/images/unsplash/unsplash_bPh8VvNgAiM.jpg',
        'assets/images/unsplash/unsplash_cWrT0mg7Was.jpg',
    ];

    /* Runway look map — Cloudinary CDN (originals) */
    const CDN = 'https://res.cloudinary.com/dy7wqhut6/image/upload/f_auto,q_auto';
    const LOOK = (v, n) => `${CDN}/${v}/hoasac/images/collections/look-0${n}.jpg`;
    const LB = (v, n) => `${CDN}/${v}/hoasac/images/lookbook/look-0${n}.jpg`;

    /* ══════════════════════════════════════════════════
       1. COLLECTION SELECTOR — Panel + Sticky switching
       ══════════════════════════════════════════════════ */
    const selectorPanels = document.querySelectorAll('.col-selector__panel');
    const stickyBtns = document.querySelectorAll('.col-sticky-btn');
    const runwayItems = document.querySelectorAll('.runway-item[data-collection]');
    const heroTitle = document.querySelector('.col-hero__title');
    const heroDesc = document.querySelector('.col-hero__desc');
    const heroBg = document.querySelector('.col-hero__bg img');
    const heroBadgeNum = document.querySelector('.col-hero__badge span:first-child');

    const collectionData = {
        'silent-muse': {
            title: ['THE', 'SILENT', 'MUSE'],
            desc: 'Khi sự ồn ào của phố thị lùi lại phía sau, chỉ còn bản ngã đối thoại cùng trang phục. BST tôn vinh những đường cắt sắc sảo trên nền vải lụa tơ tằm Bảo Lộc.',
            bg: HERO['silent-muse'],
            season: 'FW 2025',
            count: 5,
        },
        'bloom-noir': {
            title: ['BLOOM', 'NOIR'],
            desc: 'Vẻ đẹp của đóa hoa nở trong bóng đêm. Sự kết hợp táo bạo giữa cấu trúc corset và những tầng váy bồng bềnh, được thêu đính tỉ mỉ bởi nghệ nhân thủ công.',
            bg: HERO['bloom-noir'],
            season: 'SS 2025',
            count: 5,
        },
        'urban-soul': {
            title: ['URBAN', 'SOUL'],
            desc: 'Kiến trúc hiện đại được tái hiện trên trang phục. Những đường cắt gẫy gọn, dứt khoát — biểu tượng cho người phụ nữ và đàn ông thành thị của kỷ nguyên mới.',
            bg: HERO['urban-soul'],
            season: 'RTW 2025',
            count: 5,
        },
    };

    function switchCollection(id, scrollToRunway = false) {
        if (!collectionData[id]) return;
        const data = collectionData[id];

        /* Update selector panels */
        selectorPanels.forEach(p => {
            const active = p.dataset.collection === id;
            p.classList.toggle('is-active', active);
            p.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        /* Update sticky mini-tabs */
        stickyBtns.forEach(b => b.classList.toggle('is-active', b.dataset.collection === id));

        /* Hero background crossfade */
        if (heroBg) {
            heroBg.style.opacity = '0';
            setTimeout(() => {
                heroBg.src = data.bg;
                heroBg.style.opacity = '0.55';
            }, 400);
        }

        /* Hero title animated reveal */
        if (heroTitle) {
            heroTitle.querySelectorAll('span').forEach((s, i) => {
                s.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
                s.style.opacity = '0';
                s.style.transform = 'translateY(-20px)';
            });
            setTimeout(() => {
                heroTitle.innerHTML = data.title.map(w => `<span>${w}</span>`).join('');
                heroTitle.querySelectorAll('span').forEach((s, i) => {
                    s.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
                    s.style.opacity = '1';
                    s.style.transform = 'translateY(0)';
                });
            }, 350);
        }

        if (heroDesc) {
            heroDesc.style.opacity = '0';
            setTimeout(() => {
                heroDesc.textContent = data.desc;
                heroDesc.style.transition = 'opacity 0.5s ease';
                heroDesc.style.opacity = '1';
            }, 400);
        }

        if (heroBadgeNum) heroBadgeNum.textContent = data.count;

        /* Runway items: show/hide */
        runwayItems.forEach(item => {
            item.classList.toggle('hidden-look', item.dataset.collection !== id);
        });

        /* Update hero season tag */
        const seasonTag = document.querySelector('.season-tag');
        if (seasonTag) seasonTag.textContent = data.season;

        /* Only scroll if triggered from sticky mini-tabs while user has scrolled away */
        if (scrollToRunway) {
            const runway = document.querySelector('.scroll-container');
            if (runway) {
                window.scrollTo({ top: runway.offsetTop - 120, behavior: 'smooth' });
            }
        }

        /* Reset horizontal scroll */
        const trackEl = document.querySelector('.horizontal-track');
        if (trackEl) trackEl.style.transform = 'translate3d(0, 0, 0)';
    }

    /* Panel click/keyboard */
    selectorPanels.forEach(panel => {
        panel.addEventListener('click', () => switchCollection(panel.dataset.collection, false));
        panel.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchCollection(panel.dataset.collection, false);
            }
        });
    });

    /* Sticky mini-tab click → switch + scroll to runway */
    stickyBtns.forEach(btn => {
        btn.addEventListener('click', () => switchCollection(btn.dataset.collection, true));
    });

    /* Activate first panel on load */
    switchCollection('silent-muse', false);


    /* ══════════════════════════════════════════════════
       2. STATS BAR — Animated Counter
       ══════════════════════════════════════════════════ */
    const statBlocks = document.querySelectorAll('.stat-block[data-count]');

    function animateStat(el) {
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';
        el.classList.add('is-revealed');
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const numEl = el.querySelector('.stat-block__number');
        if (!numEl) return;
        const duration = 1600;
        const start = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            numEl.textContent = Math.round(easeOut(p) * target).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
            else numEl.textContent = target.toLocaleString() + suffix;
        }
        requestAnimationFrame(step);
    }

    const statObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateStat(e.target);
                statObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.25 });

    statBlocks.forEach(el => statObserver.observe(el));

    /* ══════════════════════════════════════════════════
       3. COLLECTION GRID — Filter Bar
       ══════════════════════════════════════════════════ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card-col[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const cat = btn.dataset.filter;
            productCards.forEach(card => {
                const matches = cat === 'all' || card.dataset.category === cat;
                card.classList.toggle('is-filtered-out', !matches);
            });
        });
    });

    /* ══════════════════════════════════════════════════
       4. GALLERY WALL — Drag Scroll
       ══════════════════════════════════════════════════ */
    const gallery = document.querySelector('.gallery-wall');
    if (gallery) {
        let isDown = false, startX = 0, scrollLeft = 0;

        gallery.addEventListener('mousedown', e => {
            isDown = true;
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
            gallery.classList.add('is-dragging');
        });

        const endDrag = () => {
            isDown = false;
            gallery.classList.remove('is-dragging');
        };

        gallery.addEventListener('mouseleave', endDrag);
        gallery.addEventListener('mouseup', endDrag);

        gallery.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            gallery.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });

        /* Touch */
        gallery.addEventListener('touchstart', e => {
            startX = e.touches[0].pageX;
            scrollLeft = gallery.scrollLeft;
        }, { passive: true });

        gallery.addEventListener('touchmove', e => {
            const x = e.touches[0].pageX;
            gallery.scrollLeft = scrollLeft - (x - startX);
        }, { passive: true });
    }

    /* ══════════════════════════════════════════════════
       5. FILM STRIP — Intersection Reveal
       ══════════════════════════════════════════════════ */
    const filmImgs = document.querySelectorAll('.film-chapter__img');
    const filmTexts = document.querySelectorAll('.film-chapter__text');

    const filmObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-revealed');
                filmObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    filmImgs.forEach(el => filmObserver.observe(el));
    filmTexts.forEach(el => filmObserver.observe(el));

    /* 6+8. UNIFIED SCROLL — RAF throttled: parallax + progress */
    const stickySection = document.querySelector('.scroll-container');
    const track = document.querySelector('.horizontal-track');
    const giantTexts = document.querySelectorAll('.runway-item .giant-text');
    const progressBar = document.querySelector('.progress-bar');
    const progressNum = document.querySelector('.progress-number');

    if (stickySection && track) {
        let sectionTop = stickySection.offsetTop;
        let sectionH = stickySection.offsetHeight;
        let trackScrollW = track.scrollWidth;
        let viewW = window.innerWidth;
        let rafId = null;

        window.addEventListener('resize', () => {
            sectionTop = stickySection.offsetTop;
            sectionH = stickySection.offsetHeight;
            trackScrollW = track.scrollWidth;
            viewW = window.innerWidth;
        }, { passive: true });

        window.addEventListener('scroll', () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const scrollDistance = sectionH - viewW;
                const scrollTop = window.scrollY - sectionTop;
                const pct = Math.max(0, Math.min(scrollTop / scrollDistance, 1));
                const offset = pct * (trackScrollW - viewW);

                giantTexts.forEach((el, i) => {
                    const itemW = el.closest('.runway-item')?.offsetWidth || viewW;
                    el.style.transform = `translateY(-50%) translateX(${(offset - i * itemW) * 0.3}px) translateZ(0)`;
                });

                if (progressBar) {
                    const p = pct * 100;
                    progressBar.style.width = p + '%';
                    if (progressNum) progressNum.textContent = Math.round(p) + '%';
                }
            });
        }, { passive: true });
    }
    /* 7. VIDEO AUTOPLAY */
    const videoObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            const video = e.target.querySelector('video');
            if (!video) return;
            if (e.isIntersecting) video.play().catch(() => { });
            else { video.pause(); video.currentTime = 0; }
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('.runway-item').forEach(item => videoObs.observe(item));

})();
