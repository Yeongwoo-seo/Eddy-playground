// Scoped to /play/ only (this file lives in play/, so the browser won't let
// it control anything outside that path) — keeps the real play environment
// as its own installable app, independent of the /dev/ sandbox's service
// worker and the 강낭콩 투어 PWA's.
const CACHE_NAME = 'operation-mk-play-v1';
const APP_SHELL = [
  '/play/test/',
  '/play/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// network-first, same as /dev/sw.js: always prefer the latest deployed build
// when online, only falling back to the cached shell when offline.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
