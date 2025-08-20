
const CACHE_NAME = 'eva-static-v3';
const PRECACHE_URLS = [
  "styles.css",
  "eva-logo.png",
  "evalogoface.jpg",
  "site.webmanifest",
  "icons/icon-512.png",
  "icons/icon-192.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/favicon-16.png",
  "icons/splash-640x1136.png",
  "icons/splash-750x1334.png",
  "icons/splash-1125x2436.png",
  "icons/splash-828x1792.png",
  "icons/splash-1242x2208.png",
  "icons/splash-1170x2532.png",
  "icons/splash-1284x2778.png",
  "icons/splash-1536x2048.png",
  "icons/splash-1668x2224.png",
  "icons/splash-1668x2388.png",
  "icons/splash-2048x2732.png",
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      return resp;
    }).catch(() => cached))
  );
});
