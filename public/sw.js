/* BN STORE offline shell — network-first, never caches error responses.
 * Cache version bumped to purge any poisoned entries (e.g. 404s cached
 * while a broken deployment was live). Old caches are deleted on activate. */
const CACHE = 'bn-store-v2';
const CORE = ['/', '/manifest.webmanifest', '/icon.svg', '/images/hero-lipstick.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        // Tolerant: one missing file must not kill the whole install.
        Promise.all(CORE.map((url) => c.add(url).catch(() => undefined)))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Same-origin only: never cache third-party (Unsplash/Cloudinary) responses.
  if (url.origin !== self.location.origin) return;
  // Never cache admin / API (orders, stock must stay fresh).
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(request)
      .then((res) => {
        // Only cache successful responses — never persist 404/500 pages.
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request).then((hit) => hit || caches.match('/')))
  );
});
