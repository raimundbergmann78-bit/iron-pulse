/* Service Worker: App offline nutzbar. Mit Internet immer neueste Dateien, ohne Internet aus dem Speicher. */
const CACHE = 'ironpulse-v85';
const FILES = ['./', './index.html', './style.css', './ip.min.js', './manifest.webmanifest',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/logo_kopf.png', './icons/logo_kopf_dunkel.png', './icons/splash_logo.png', './icons/splash_logo_dunkel.png', './icons/splash_logo_klar.png', './icons/splash_logo_klar_dunkel.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.includes('/film/')) return;  // Karten-Kacheln und grosse Videos nicht speichern
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
