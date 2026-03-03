/**
 * HOA SAC — BLACK ON BLACK LOOKBOOK
 * black-on-black.js — Interactive experience
 */

'use strict';

/* ════════════════════════════════════════════
   CUSTOM CURSOR — runs immediately, no delay
═══════════════════════════════════════════ */
(function initCursor() {
    const cursor = document.getElementById('bob-cursor');
    if (!cursor) return;

    const dot = cursor.querySelector('.bob-dot');
    const ring = cursor.querySelector('.bob-ring');
    const txt = cursor.querySelector('.bob-txt');

    let mX = -200, mY = -200;   // start off-screen
    let dX = -200, dY = -200;
    let rX = -200, rY = -200;
    let visible = false;

    // Follow the actual mouse
    document.addEventListener('mousemove', (e) => {
        mX = e.clientX;
        mY = e.clientY;
        if (!visible) {
            dX = rX = mX;
            dY = rY = mY;
            visible = true;
            cursor.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        visible = false;
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    // Smooth lag loop
    (function loop() {
        dX += (mX - dX) * 0.35;
        dY += (mY - dY) * 0.35;
        rX += (mX - rX) * 0.1;
        rY += (mY - rY) * 0.1;

        dot.style.transform = `translate(${dX}px, ${dY}px) translate(-50%,-50%)`;
        ring.style.transform = `translate(${rX}px, ${rY}px) translate(-50%,-50%)`;
        txt.style.transform = `translate(${rX}px, ${rY}px) translate(-50%,-50%)`;

        requestAnimationFrame(loop);
    })();

    // Hyper state on hover targets
    document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hyper');
            txt.textContent = el.dataset.cursor || 'VIEW';
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hyper');
        });
    });

    // Drag mode on film strip
    const strip = document.getElementById('bob-strip');
    if (strip) {
        strip.addEventListener('mouseenter', () => {
            document.body.classList.add('drag-mode');
            txt.textContent = 'DRAG';
        });
        strip.addEventListener('mouseleave', () => {
            document.body.classList.remove('drag-mode');
        });
    }
})();

/* ════════════════════════════════════════════
   REST OF PAGE — wait for GSAP + Lenis
═══════════════════════════════════════════ */
window.addEventListener('load', function () {

    /* ─── 1. LENIS SMOOTH SCROLL ─── */
    const lenis = new Lenis({
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);

    /* ─── 2. SCROLL PROGRESS BAR ─── */
    const bar = document.getElementById('bob-bar');
    lenis.on('scroll', ({ progress }) => {
        bar.style.width = (progress * 100) + '%';
    });

    /* ─── 3. NAV SCROLL STATE ─── */
    const nav = document.getElementById('bob-nav');
    ScrollTrigger.create({
        start: 80,
        onEnter: () => nav.classList.add('scrolled'),
        onLeaveBack: () => nav.classList.remove('scrolled')
    });

    /* ─── 4. FLOATING PARTICLES ─── */
    const pWrap = document.getElementById('particles');
    for (let i = 0; i < 45; i++) {
        const p = document.createElement('div');
        const sz = Math.random() * 3 + 1;
        const dur = 10 + Math.random() * 14;
        const del = Math.random() * 14;
        const op = (Math.random() * 0.5 + 0.1).toFixed(2);
        p.className = 'particle';
        p.style.cssText = `
            left:${Math.random() * 100}%;
            bottom:-10px;
            width:${sz}px; height:${sz}px;
            animation-duration:${dur}s;
            animation-delay:-${del}s;
            opacity:${op};
        `;
        pWrap.appendChild(p);
    }

    /* ─── 5. HERO ENTRANCE (GSAP overrides CSS fallback) ─── */
    gsap.set(['.hero-eyebrow', '.hero-manifesto', '.hero-ribbon'], {
        clearProps: 'animation',
        opacity: 0,
        y: 20
    });
    gsap.set('.word > span', { clearProps: 'animation', y: '110%' });

    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl
        .to('.img-reveal-bar', {
            scaleY: 0, duration: 1.4, ease: 'expo.inOut', transformOrigin: 'top'
        }, 0)
        .to('.hero-eyebrow', {
            opacity: 1, y: 0, duration: 0.9, ease: 'expo.out'
        }, 0.3)
        .to('.word > span', {
            y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1
        }, 0.5)
        .to('.hero-manifesto', {
            opacity: 1, y: 0, duration: 0.9, ease: 'expo.out'
        }, 0.9)
        .to('.hero-ribbon', {
            opacity: 1, y: 0, duration: 0.7, ease: 'expo.out'
        }, 1.1);

    /* ─── 6. SCROLL REVEALS — PHILOSOPHY ─── */
    gsap.from('.phil-eyebrow', {
        scrollTrigger: { trigger: '.bob-philosophy', start: 'top 78%' },
        opacity: 0, x: -20, duration: 0.8, ease: 'expo.out'
    });
    gsap.from('.phil-heading', {
        scrollTrigger: { trigger: '.bob-philosophy', start: 'top 74%' },
        opacity: 0, y: 30, duration: 1, ease: 'expo.out', delay: 0.1
    });
    gsap.from('.phil-body', {
        scrollTrigger: { trigger: '.bob-philosophy', start: 'top 70%' },
        opacity: 0, y: 20, duration: 1, ease: 'expo.out', delay: 0.2
    });
    gsap.from('.phil-image-wrap', {
        scrollTrigger: { trigger: '.bob-philosophy', start: 'top 72%' },
        opacity: 0, x: 30, scale: 0.96, duration: 1.2, ease: 'expo.out', delay: 0.15
    });

    /* ─── 7. SCROLL REVEALS — GALLERY CARDS ─── */
    // Remove initial hidden state set by CSS so cards are always visible if GSAP fails
    gsap.from('.look-card', {
        scrollTrigger: { trigger: '.look-grid', start: 'top 85%' },
        opacity: 0, y: 60, duration: 0.8, ease: 'expo.out', stagger: 0.1
    });
    // Immediately make cards visible (override CSS opacity:0)
    gsap.set('.look-card', { opacity: 1, y: 0, delay: 0 });
    // Re-hide and animate in on scroll
    gsap.fromTo('.look-card',
        { opacity: 0, y: 60 },
        {
            scrollTrigger: { trigger: '.look-grid', start: 'top 85%', once: true },
            opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1
        }
    );

    /* ─── 8. PULL QUOTE — CHAR SPLIT ─── */
    const bq = document.getElementById('bq-body');
    if (bq) {
        // Simple char split that preserves <em>
        const raw = bq.innerHTML;
        bq.innerHTML = raw.replace(/(<em>)([\s\S]*?)(<\/em>)|([^<\s])(?!\S*>)/g, (m, o, inner, c, ch) => {
            if (o && inner !== undefined) {
                // wrap chars inside em
                return `<em>${inner.split('').map(x => x === ' ' ? ' ' : `<span class="char">${x}</span>`).join('')}</em>`;
            }
            if (ch) return `<span class="char">${ch}</span>`;
            return m;
        });

        gsap.from('.bq-body', {
            scrollTrigger: { trigger: '.bob-quote', start: 'top 72%' },
            opacity: 0, y: 40, duration: 1, ease: 'expo.out'
        });
        gsap.from('.bq-body .char', {
            scrollTrigger: { trigger: '.bob-quote', start: 'top 70%' },
            opacity: 0, y: 18, duration: 0.7, ease: 'expo.out', stagger: 0.018, delay: 0.25
        });
        gsap.from('.bq-attr', {
            scrollTrigger: { trigger: '.bob-quote', start: 'top 65%' },
            opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.8
        });
    }

    /* ─── 9. TEXTURE SECTION ─── */
    gsap.from('.tex-eyebrow', {
        scrollTrigger: { trigger: '.bob-textures', start: 'top 78%' },
        opacity: 0, x: -16, duration: 0.8, ease: 'expo.out'
    });
    gsap.from('.tex-title', {
        scrollTrigger: { trigger: '.bob-textures', start: 'top 74%' },
        opacity: 0, y: 24, duration: 1, ease: 'expo.out', delay: 0.1
    });
    gsap.from('.tex-card', {
        scrollTrigger: { trigger: '.tex-grid', start: 'top 82%' },
        opacity: 0, y: 30, duration: 0.7, ease: 'expo.out', stagger: 0.08
    });

    /* ─── 10. FINALE ─── */
    gsap.from('.fin-eyebrow', {
        scrollTrigger: { trigger: '.bob-finale', start: 'top 78%' },
        opacity: 0, y: 20, duration: 0.8, ease: 'expo.out'
    });
    gsap.from('.fin-title', {
        scrollTrigger: { trigger: '.bob-finale', start: 'top 74%' },
        opacity: 0, y: 44, duration: 1, ease: 'expo.out', delay: 0.1
    });
    gsap.from('.fin-sub', {
        scrollTrigger: { trigger: '.bob-finale', start: 'top 70%' },
        opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', delay: 0.2
    });
    gsap.from('.fin-actions', {
        scrollTrigger: { trigger: '.bob-finale', start: 'top 68%' },
        opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', delay: 0.3
    });

    /* ─── 11. HERO PARALLAX ─── */
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
        gsap.to(heroImg, {
            scrollTrigger: {
                trigger: '.bob-hero', start: 'top top', end: 'bottom top', scrub: true
            },
            yPercent: 14, ease: 'none'
        });
    }

    /* ─── 12. FILM STRIP DRAG ─── */
    const strip = document.getElementById('bob-strip');
    if (strip) {
        let down = false, startX, sl;
        strip.addEventListener('mousedown', e => { down = true; startX = e.pageX - strip.offsetLeft; sl = strip.scrollLeft; });
        strip.addEventListener('mouseleave', () => { down = false; });
        strip.addEventListener('mouseup', () => { down = false; });
        strip.addEventListener('mousemove', e => {
            if (!down) return;
            e.preventDefault();
            strip.scrollLeft = sl - (e.pageX - strip.offsetLeft - startX) * 1.4;
        });
    }

    /* ─── 13. MARQUEE PAUSE ON HOVER ─── */
    const mq = document.querySelector('.bob-marquee');
    if (mq) {
        mq.addEventListener('mouseenter', () => mq.style.animationPlayState = 'paused');
        mq.addEventListener('mouseleave', () => mq.style.animationPlayState = 'running');
    }

    /* ─── 14. LOOK CARD 3D TILT ─── */
    document.querySelectorAll('.look-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
            const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
            gsap.to(card, { rotateY: x, rotateX: -y, duration: 0.5, ease: 'expo.out', transformPerspective: 800 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'expo.out' });
        });
    });

}); // end load
