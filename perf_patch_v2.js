const fs = require('fs');
let js = fs.readFileSync('d:/web/main.js', 'utf8');

// 1. Lenis duration
js = js.replace(/duration:\s*2\.0,/, 'duration: 1.2,');
js = js.replace(/mouseMultiplier:\s*0\.8,/, 'mouseMultiplier: 1.0,');

console.log("Lenis updated.");

// 2. Chameleon Effect -> Intersection Observer
const chameleonOld = /\/\/ --- NEW CHAMELEON EFFECT \(CENTER-BASED DETECTION\) ---[\s\S]*?\/\/ Skew Effect\s*let currentScroll = window\.scrollY;/;

const chameleonNew = `// --- OPTIMIZED CHAMELEON EFFECT (INTERSECTION OBSERVER) ---
            if (!window._themeObserverSetup) {
                const themeObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const newTheme = entry.target.getAttribute('data-theme') || 'light';
                            document.body.classList.remove('dark-mode', 'grey-mode');
                            if (newTheme === 'dark') document.body.classList.add('dark-mode');
                            if (newTheme === 'grey') document.body.classList.add('grey-mode');
                        }
                    });
                }, {
                    root: null,
                    rootMargin: "0px -40% 0px -40%",
                    threshold: 0
                });

                const items = _cachedRunwayItems || (_cachedRunwayItems = document.querySelectorAll('.runway-item'));
                items.forEach(item => {
                    themeObserver.observe(item);
                });
                window._themeObserverSetup = true;
            }
            
            // Theo dõi cuộn
            let currentScroll = window.scrollY;`;

js = js.replace(chameleonOld, chameleonNew);
console.log("Chameleon updated.");

// 3. Remove Skew Effect
const skewOld = /let skew = speed \* 0\.08;[\s\S]*?}, 100\);/;
js = js.replace(skewOld, '\/\/ Skew Effect Disabled để tăng tốc độ mượt mà');
console.log("Skew disabled.");

fs.writeFileSync('d:/web/main.js', js, 'utf8');
console.log("Done patching main.js");
