'use strict';

/* ── Lenis ── */
let lenis;
try {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', () => ScrollTrigger.update());
} catch (e) { }

gsap.registerPlugin(ScrollTrigger);

/* ── Cursor ── */
const cursor = document.getElementById('ue-cursor');
if (cursor) {
    const dot = cursor.querySelector('.ue-dot');
    const ring = cursor.querySelector('.ue-ring');
    const txt = cursor.querySelector('.ue-txt');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        gsap.set(dot, { x: mx, y: my });
    });
    (function lag() {
        rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
        gsap.set(ring, { x: rx, y: ry });
        requestAnimationFrame(lag);
    })();

    document.querySelectorAll('[data-cursor], a, button, .look-card, .swatch, .strip-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            txt.textContent = el.dataset.cursor || '→';
            document.body.classList.add('hyper');
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('hyper'));
    });

    // Drag mode on strip
    const strip = document.querySelector('.ue-strip');
    if (strip) {
        strip.addEventListener('mouseenter', () => {
            txt.textContent = 'DRAG';
            document.body.classList.add('drag-mode');
        });
        strip.addEventListener('mouseleave', () => document.body.classList.remove('drag-mode'));
    }
}

/* ── Progress bar ── */
const bar = document.getElementById('ue-bar');
window.addEventListener('scroll', () => {
    const p = document.documentElement.scrollHeight - window.innerHeight;
    if (bar && p > 0) bar.style.width = (window.scrollY / p * 100) + '%';
}, { passive: true });

/* ── Nav scroll color ── */
const nav = document.querySelector('.ue-nav');
window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Leaves ── */
const leafEmojis = ['🍂', '🍁', '🍃', '🌿'];
function spawnLeaf() {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
    leaf.style.cssText = `
    left: ${Math.random() * 100}vw;
    top: -40px;
    font-size: ${0.9 + Math.random() * 1.4}rem;
    animation-duration: ${7 + Math.random() * 11}s;
    animation-delay: ${Math.random() * 4}s;
  `;
    document.querySelector('.ue-hero').appendChild(leaf);
    leaf.addEventListener('animationend', () => leaf.remove());
}
for (let i = 0; i < 14; i++) spawnLeaf();
setInterval(spawnLeaf, 3200);

/* ── Hero reveal ── */
window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero-title .wrd > span', { y: '0%', duration: 1.5, stagger: 0.12 }, 0)
        .to('.hero-tag', { opacity: 1, x: 0, duration: 1 }, 0.3)
        .to('.hero-img-wrap', { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }, 0.5)
        .to('.hero-desc', { opacity: 1, y: 0, duration: .9 }, 0.8)
        .to('.hero-cta', { opacity: 1, y: 0, duration: .8, ease: 'back.out(1.8)' }, 1.0);

    // Animate stat numbers
    document.querySelectorAll('.hero-stat .num').forEach(el => {
        const target = parseInt(el.textContent);
        gsap.from(el, {
            textContent: 0, duration: 2, delay: 1.2, ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)); }
        });
    });
});

/* ── Split text helper ── */
function splitChars(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    text.split('').forEach(ch => {
        const s = document.createElement('span');
        s.className = 'char';
        s.style.cssText = 'display:inline-block;transform:translateY(80px) rotate(6deg);opacity:0;will-change:transform,opacity;';
        s.textContent = ch === ' ' ? '\u00a0' : ch;
        el.appendChild(s);
    });
}

document.querySelectorAll('[data-split]').forEach(splitChars);

/* ── Look cards tilt + stagger ── */
document.querySelectorAll('.look-card').forEach((card, i) => {
    // ScrollTrigger entrance
    gsap.to(card, {
        opacity: 1, y: 0, duration: 1,
        ease: 'back.out(1.4)',
        delay: i * 0.12,
        scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none reverse' }
    });

    // 3D tilt on mousemove
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: x * 12, rotateX: -y * 10, scale: 1.02, duration: .4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: .7, ease: 'elastic.out(1,0.5)' });
    });

    // Wiggle on click
    card.addEventListener('click', () => {
        card.classList.remove('wiggle');
        void card.offsetWidth;
        card.classList.add('wiggle');
    });
});

/* ── Quote split reveal ── */
const quoteEl = document.querySelector('.quote-body[data-split]');
if (quoteEl) {
    gsap.to(quoteEl.querySelectorAll('.char'), {
        y: 0, rotate: 0, opacity: 1,
        duration: .7, stagger: 0.018, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: quoteEl, start: 'top 75%' }
    });
    gsap.to('.quote-attr', {
        opacity: 1, y: 0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ue-quote', start: 'top 68%' }
    });
}

/* ── Strip drag scroll ── */
const strip = document.querySelector('.ue-strip');
if (strip) {
    let isDragging = false, startX, scrollLeft;
    strip.addEventListener('mousedown', e => {
        isDragging = true;
        strip.style.cursor = 'grabbing';
        startX = e.pageX - strip.offsetLeft;
        scrollLeft = strip.scrollLeft;
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        strip.style.cursor = 'none';
    });
    strip.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - strip.offsetLeft;
        strip.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
}

/* ── Swatches wobble ── */
document.querySelectorAll('.swatch').forEach((sw, i) => {
    gsap.from(sw, {
        scale: 0, rotation: 20, opacity: 0, duration: .7,
        ease: 'back.out(2)', delay: i * 0.07,
        scrollTrigger: { trigger: '.swatches', start: 'top 80%' }
    });
    sw.addEventListener('click', () => {
        gsap.to('.look-card .card-img img', {
            filter: `saturate(1) hue-rotate(${i * 20}deg) brightness(1)`,
            duration: .8, ease: 'power2.out'
        });
        gsap.to(sw, { scale: 1.3, duration: .3, yoyo: true, repeat: 1, ease: 'power2.inOut' });
    });
});

/* ── Finale reveal ── */
const fin = document.querySelector('.ue-finale');
if (fin) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: fin, start: 'top 75%' } });
    tl.to('.finale-eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' })
        .to('.finale-title', { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.4)' }, 0.2)
        .to('.finale-sub', { opacity: 1, duration: .8, ease: 'power2.out' }, 0.5)
        .to('.finale-actions', { opacity: 1, y: 0, duration: .8, ease: 'back.out(1.6)' }, 0.7);
}

/* ── Refresh on resize ── */
window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
