// ==========================================
// HOA SAC — Service Worker (PWA Offline Cache)
// ==========================================
const CACHE_NAME = 'hoasac-v3';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/header.css',
    '/footer.css',
    '/responsive.css',
    '/main.js',
    '/manifest.json'
];

// Cài đặt — Cache các file cốt lõi
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Pre-caching core assets');
            return cache.addAll(PRECACHE_URLS);
        }).catch(err => console.log('[SW] Pre-cache failed (normal on file://):', err))
    );
    self.skipWaiting();
});

// Kích hoạt — Dọn dẹp cache cũ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — Network-first strategy to prevent stale HTML issues
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Chỉ xử lý HTTP/HTTPS
    if (!url.protocol.startsWith('http')) return;

    // Bỏ qua Firebase API calls
    if (url.hostname.includes('googleapis.com') || url.hostname.includes('firebaseio.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Chỉ cache response hoàn chỉnh (status 200)
                if (response.status === 200 && event.request.method === 'GET') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                // Offline fallback
                return caches.match(event.request).then(cached => {
                    if (cached) return cached;
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});
