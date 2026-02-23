const fs = require('fs');

let html = fs.readFileSync('d:/web/campaign.html', 'utf8');

// The original tag is <video autoplay muted loop playsinline>
// Replace this with <video muted loop playsinline preload="none">
html = html.replace(/<video autoplay muted loop playsinline>/g, '<video muted loop playsinline preload="none">');

fs.writeFileSync('d:/web/campaign.html', html, 'utf8');
console.log("Updated videos in campaign.html");
