/* FoldFarer offline-first shell: use the latest deployed app when online.
   An installed iPhone Home Screen icon always launches the same URL.
   This worker refreshes files over the network and keeps a working offline fallback. */
const CACHE = 'foldfarer-shell-0.36';
const SHELL = ['./', './index.html', './styles.css', './game.js', './icon.svg', './manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('foldfarer-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      // Explicitly bypass the browser's HTTP cache to fetch latest GitHub Pages
      // assets. An updated game appears next time the Home Screen app is opened.
      const latest = await fetch(new Request(req, { cache: 'no-store' }));
      if (latest.ok) {
        const copy = latest.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(req, copy)).catch(() => {}));
      }
      return latest;
    } catch (error) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const entry = await caches.match('./index.html');
        if (entry) return entry;
      }
      return Response.error();
    }
  })());
});