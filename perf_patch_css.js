const fs = require('fs');

// PATCH STYLE.CSS
let css = fs.readFileSync('d:/web/style.css', 'utf8');

// 1. Noise overlay
css = css.replace(
    /opacity: 0\.05; \/\* Độ mờ của hạt nhiễu \(rất nhẹ\) \*\/\r?\n\s*background-image: url\("data:image\/svg\+xml,%3Csvg viewBox='0 0 200 200' xmlns='http:\/\/www\.w3\.org\/2000\/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0\.65' numOctaves='3' stitchTiles='stitch'\/\%3E%3C\/filter%3E%3Crect width='100%25' height='100%25' filter='url\(%23noiseFilter\)' opacity='1'\/\%3E%3C\/svg%3E"\);/,
    `opacity: 0.05; /* Độ mờ của hạt nhiễu (rất nhẹ) */\n    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");\n    will-change: transform;\n    transform: translateZ(0);`
);

// 2. Horizontal track
css = css.replace(
    /will-change: transform; \/\* Tối ưu hiệu suất cho trình duyệt \*\//,
    `will-change: transform; /* Tối ưu hiệu suất cho trình duyệt */\n    transform: translateZ(0);`
);

// 3. Runway Image
css = css.replace(
    /transition: transform 0\.5s ease;/,
    `transition: transform 0.5s ease;\n    will-change: transform;`
);

fs.writeFileSync('d:/web/style.css', css, 'utf8');
console.log("Patched style.css");

// PATCH COLLECTIONS.HTML
let html = fs.readFileSync('d:/web/collections.html', 'utf8');

// 1. Lazy load images
html = html.replace(/(<img src="assets\/images\/collections\/[^"]+" alt="[^"]+")([^>]*>)/g, '$1 loading="lazy"$2');

// 2. Preload none for videos 
html = html.replace(/<video muted loop playsinline(?!.*?preload)>/g, '<video muted loop playsinline preload="none">');

// 3. CSS Containment cho runway-item
html = html.replace(/<div class="runway-item" /g, '<div class="runway-item" style="contain: layout paint;" ');

fs.writeFileSync('d:/web/collections.html', html, 'utf8');
console.log("Patched collections.html");
