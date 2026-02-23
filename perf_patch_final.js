const fs = require('fs');

// Patch collections.html
let html = fs.readFileSync('d:/web/collections.html', 'utf8');

// Remove fog blobs - they cause massive repaint
html = html.replace(/<div class="fog-background">[\s\S]*?<\/div>[\s]*\n/g, '');

// Lazy load images
html = html.replace(/(<img src="assets\/images\/collections\/[^"]+" alt="[^"]+")/g, '$1 loading="lazy"');

// Preload none for videos
html = html.replace(/<video muted loop playsinline(?!.*?preload)>/g, '<video muted loop playsinline preload="none">');

// Containment for items
html = html.replace(/<div class="runway-item" /g, '<div class="runway-item" style="contain: layout paint;" ');

// Will-change for track
html = html.replace(/<div class="horizontal-track">/, '<div class="horizontal-track" style="will-change: transform; transform: translateZ(0);">');

fs.writeFileSync('d:/web/collections.html', html, 'utf8');


// Patch main.js
let js = fs.readFileSync('d:/web/main.js', 'utf8');

// Remove Skew effect
js = js.replace(/let skew = speed \* 0\.08;[\s\S]*?}, 100\);/m, '// Skew Effect Disabled');

fs.writeFileSync('d:/web/main.js', js, 'utf8');

console.log("Optimizations applied successfully");
