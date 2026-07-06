// Scoped to /dev/ only (this file lives in dev/, so the browser won't let it
// control anything outside that path) — keeps the OPERATION MK DEV sandbox as
// its own installable app, independent of the 강낭콩 투어 PWA's service worker.
const CACHE_NAME = 'operation-mk-dev-v2';
const APP_SHELL = [
  '/dev/',
  '/dev/game/',
  '/dev/upload/',
  '/dev/dialogue/',
  '/dev/scene/',
  '/dev/assetDb.js',
  '/dev/sceneDb.js',
  '/dev/dialogueData.js',
  '/dev/dialogueDb.js',
  '/dev/vnPlayer.js',
  '/dev/manifest.json',
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

// network-first: always prefer the latest deployed dev build when online,
// only falling back to the cached shell when offline.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
