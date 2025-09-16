const CACHE_VERSION = 'run70s-v3';
const APP_SHELL = [
  './',
  './Run70s.html',
  './manifest.webmanifest',
  './Run192-01.png',
  './Run512-01.png',
  './service-worker.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE_VERSION ? caches.delete(k) : null))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Offline-Fallback für Navigation (z.B. /Run70s/)
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./Run70s.html').then(res => res || fetch(req))
    );
    return;
  }

  event.respondWith(caches.match(req).then(res => res || fetch(req)));
});
