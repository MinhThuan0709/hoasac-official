/* ═══════════════════════════════════════════════════
   HOA SAC — CAMPAIGN JS
   Pro Editorial Engine
   GSAP + ScrollTrigger + Lenis + Custom Cursor
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── 0. WAIT FOR GSAP ─── */
gsap.registerPlugin(ScrollTrigger);

/* ─── 1. LENIS SMOOTH SCROLL ─── */
let lenis;
try {
    lenis = new Lenis({
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function rafLoop(time) {
        lenis.raf(time);
        requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);
    // Let GSAP ScrollTrigger use Lenis
    lenis.on('scroll', ScrollTrigger.update);
} catch (e) {
    console.warn('[Campaign] Lenis not available, using native scroll');
}

/* ─── 2. CUSTOM MAGNETIC CURSOR ─── */
const cursorEl = document.querySelector('.camp-cursor');
const cursorDot = cursorEl?.querySelector('.cursor-dot');
const cursorRing = cursorEl?.querySelector('.cursor-ring');
const cursorLabel = document.getElementById('cursor-label');

if (cursorEl) {
    let cx = 0, cy = 0; // ring position (lagged)
    let mx = 0, my = 0; // actual mouse

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        // Dot follows instantly
        gsap.set(cursorDot, { x: mx, y: my });
    });

    // Ring follows with lag
    function animateCursor() {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        gsap.set(cursorRing, { x: cx, y: cy });
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    document.querySelectorAll('[data-hover], a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            const label = el.dataset.cursor || 'VIEW';
            if (cursorLabel) cursorLabel.textContent = label;
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Video panel hover
    document.querySelectorAll('.ch-media').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorLabel) cursorLabel.textContent = 'WATCH';
            document.body.classList.add('cursor-video');
            document.body.classList.remove('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-video');
        });
    });
}

/* ─── 3. SCROLL PROGRESS + THREAD ─── */
const progressBar = document.getElementById('camp-progress');
const threadFill = document.getElementById('thread-fill');
const threadPct = document.getElementById('thread-pct');
const threadEl = document.getElementById('camp-thread');

window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    const pctStr = pct.toFixed(0) + '%';

    if (progressBar) progressBar.style.width = pctStr;
    if (threadFill) threadFill.style.height = pctStr;
    if (threadPct) threadPct.textContent = pctStr;

    // Show/hide thread after hero
    if (threadEl) {
        if (window.scrollY > window.innerHeight * 0.5) {
            threadEl.classList.add('visible');
        } else {
            threadEl.classList.remove('visible');
        }
    }
}, { passive: true });

/* ─── 4. HERO CINEMATIC REVEAL ─── */
const hero = document.getElementById('camp-hero');

// Letterbox bars open after brief delay
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (hero) {
            hero.classList.remove('bars-open');
            hero.classList.add('bars-closed');
        }
    }, 300);

    // Hero title lines slide up
    gsap.to('.hero-title .line span', {
        y: '0%',
        duration: 1.6,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.5
    });

    // Overline fade
    gsap.to('.hero-overline', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 1.0
    });

    // Sub fade
    gsap.to('.hero-sub', {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        delay: 1.4
    });

    // Scroll cue
    gsap.to('.hero-scroll-cue', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 2.0
    });
});

/* ─── 5. SPLIT TEXT (manual character split) ─── */
function splitChars(el) {
    const text = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('aria-label', text);
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        span.textContent = char === ' ' ? '\u00A0' : char;
        // Wrap in inner span for the animation
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.style.transform = 'translateY(110%)';
        inner.style.willChange = 'transform';
        inner.textContent = span.textContent;
        span.textContent = '';
        span.appendChild(inner);
        el.appendChild(span);
    });
}

document.querySelectorAll('[data-split]').forEach(el => splitChars(el));

/* ─── 6. CHAPTER SCROLL ANIMATIONS ─── */
document.querySelectorAll('.camp-chapter').forEach((chapter, i) => {
    const mediaInner = chapter.querySelector('.media-inner');
    const accentBar = chapter.querySelector('.ch-accent-bar');
    const headline = chapter.querySelector('.ch-headline');
    const chars = headline ? headline.querySelectorAll('.char span') : [];
    const body = chapter.querySelector('.ch-body');
    const cta = chapter.querySelector('.ch-cta');
    const video = chapter.querySelector('.ch-video');

    // GSAP Timeline for this chapter
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: chapter,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse',
            onEnter: () => { if (video) video.play().catch(() => { }); },
            onLeave: () => { if (video) video.pause(); },
            onEnterBack: () => { if (video) video.play().catch(() => { }); },
            onLeaveBack: () => { if (video) video.pause(); }
        }
    });

    // Clip-path reveal on media
    if (mediaInner) {
        tl.to(mediaInner, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.4,
            ease: 'power4.out'
        }, 0);
    }

    // Accent bar grows
    if (accentBar) {
        tl.to(accentBar, {
            height: '60%',
            duration: 1.6,
            ease: 'power3.out'
        }, 0.2);
    }

    // Character reveal
    if (chars.length) {
        tl.to(chars, {
            y: '0%',
            duration: 0.8,
            stagger: 0.025,
            ease: 'power3.out'
        }, 0.3);
    }

    // Body paragraph
    if (body) {
        tl.to(body, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out'
        }, 0.7);
    }

    // CTA link
    if (cta) {
        tl.to(cta, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
        }, 1.0);
    }
});

/* ─── 7. LOOKBOOK — PARALLAX TILT ─── */
document.querySelectorAll('.lb-item').forEach(item => {
    const tilt = item.querySelector('.lb-tilt');
    const img = item.querySelector('img');
    if (!tilt || !img) return;

    item.addEventListener('mousemove', e => {
        const rect = item.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(tilt, {
            rotateY: xPct * 10,
            rotateX: -yPct * 10,
            duration: 0.4,
            ease: 'power1.out',
            transformPerspective: 800
        });

        gsap.to(img, {
            x: xPct * 12,
            y: yPct * 12,
            duration: 0.6,
            ease: 'power1.out'
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(tilt, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' });
        gsap.to(img, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
    });
});

/* ─── 8. LOOKBOOK HEADER — Scroll reveal ─── */
gsap.utils.toArray('.sr-up').forEach(el => {
    gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
        }
    });
});

/* Stagger lb-items */
gsap.from('.lb-item', {
    opacity: 0,
    y: 60,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.lb-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    }
});

/* ─── 9. FINALE REVEAL ─── */
gsap.to('.finale-eyebrow', {
    opacity: 1, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.camp-finale', start: 'top 70%' }
});

gsap.to('.finale-headline .line span', {
    y: '0%',
    duration: 1.4,
    stagger: 0.15,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.camp-finale', start: 'top 68%' }
});

gsap.to('.finale-sub', {
    opacity: 1, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.camp-finale', start: 'top 65%' }
});

gsap.to('.finale-btn', {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.camp-finale', start: 'top 62%' }
});

/* ─── 10. HERO PARALLAX (scroll fades video) ─── */
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
    ScrollTrigger.create({
        trigger: '.camp-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
            heroVideo.style.transform = `scale(1.08) translateY(${self.progress * 10}%)`;
        }
    });
}

/* ─── 11. CHAPTER MEDIA PARALLAX ─── */
document.querySelectorAll('.ch-media video').forEach(vid => {
    ScrollTrigger.create({
        trigger: vid.closest('.ch-media'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
            const offset = (self.progress - 0.5) * 60;
            vid.style.transform = `translateY(${offset}px)`;
        }
    });
});

/* ─── 12. MARQUEE pause on scroll stop ─── */
// (Handled by CSS hover only — performant)

/* ─── 13. REFRESH ScrollTrigger on resize ─── */
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
}, { passive: true });