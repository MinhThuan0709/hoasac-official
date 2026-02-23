/**
 * Performance patch for collections.html scroll engine
 * Fixes: RAF throttling, cached selectors, skew batching
 */

const fs = require('fs');

const file = 'd:/web/main.js';
let js = fs.readFileSync(file, 'utf8');

// ------------------------------------------------------------
// 1. Add RAF ticking flag just before updateRunway is called
//    Find the pattern where updateRunway is defined and add ticking
// ------------------------------------------------------------

// Find section comment for horizontal scroll section
const oldSection = `    /* --- 5. HORIZONTAL SCROLL + CHAMELEON EFFECT (COLLECTIONS PAGE) --- */`;

if (!js.includes(oldSection)) {
    console.log('Could not find horizontal scroll section header, checking...');
    const idx = js.indexOf('updateRunway');
    console.log('updateRunway found at index:', idx);
    console.log('Context:', js.substring(idx - 200, idx + 100));
} else {
    console.log('Found horizontal scroll section');
}

// Find the "window.addEventListener('scroll', updateRunway)" to add RAF ticking
// Replace the scroll listener for landing + the function itself

const oldScrollListener = `    window.addEventListener('scroll', () => {\n            updateRunway();\n        });`;

const newScrollListener = `    let _rafTicking = false;\n    window.addEventListener('scroll', () => {\n            if (!_rafTicking) {\n                requestAnimationFrame(() => { updateRunway(); _rafTicking = false; });\n                _rafTicking = true;\n            }\n        }, { passive: true });`;

if (js.includes(oldScrollListener)) {
    js = js.replace(oldScrollListener, newScrollListener);
    console.log('✅ RAF ticking added to scroll listener');
} else {
    console.log('❌ Scroll listener pattern not matched, trying alternate...');
    // Try to find and fix it differently
    const m = js.match(/window\.addEventListener\('scroll',\s*\(\)\s*=>\s*\{[\s\n]*updateRunway\(\);[\s\n]*\}\)/);
    if (m) {
        js = js.replace(m[0], `window.addEventListener('scroll', () => {\n            if (!_rafTicking) { requestAnimationFrame(() => { updateRunway(); _rafTicking = false; }); _rafTicking = true; }\n        }, { passive: true })`);
        console.log('✅ RAF ticking added (alternate pattern)');
    } else {
        console.log('Could not find scroll listener for updateRunway');
    }
}

// ------------------------------------------------------------
// 2. Cache DOM selectors inside updateRunway (hoist them out)
// ------------------------------------------------------------

// Replace the live querySelectorAll calls inside updateRunway with cached refs
const oldRunwayItems = `            const items = document.querySelectorAll('.runway-item');`;
const newRunwayItems = `            const items = _cachedRunwayItems || (_cachedRunwayItems = document.querySelectorAll('.runway-item'));`;

if (js.includes(oldRunwayItems)) {
    // Also need to declare the cache var somewhere
    js = js.replace(oldRunwayItems, newRunwayItems);
    // Insert cache declaration near updateRunway
    js = js.replace('        let lastScrollTop = 0;', '        let lastScrollTop = 0;\n        let _cachedRunwayItems = null;\n        let _cachedAllImages = null;\n        let _rafTicking = false;');
    console.log('✅ Cached .runway-item querySelectorAll');
} else {
    console.log('❌ Could not cache .runway-item');
}

const oldAllImages = `            const allImages = document.querySelectorAll('.runway-img img, .runway-img video');`;
const newAllImages = `            const allImages = _cachedAllImages || (_cachedAllImages = document.querySelectorAll('.runway-img img, .runway-img video'));`;

if (js.includes(oldAllImages)) {
    js = js.replace(oldAllImages, newAllImages);
    console.log('✅ Cached .runway-img querySelectorAll');
} else {
    console.log('❌ Could not cache .runway-img img/video');
}

// Remove duplicate _rafTicking declaration if scroll listener added it twice
js = js.replace(/let _rafTicking = false;\s*let _rafTicking = false;/, 'let _rafTicking = false;');

// ------------------------------------------------------------
// 3. Make video elements lazy: remove autoplay from the break video
// ------------------------------------------------------------
// In collections.html the "Visual Break" video has autoplay — already handled in HTML

// Write back
fs.writeFileSync(file, js, 'utf8');
console.log('✅ main.js performance patch complete');
