// Scoped to /play/ only (this file lives in play/, so the browser won't let
// it control anything outside that path) — keeps the real play environment
// as its own installable app, independent of the /dev/ sandbox's service
// worker and the 강낭콩 투어 PWA's.
const CACHE_NAME = 'operation-mk-play-v2';
const APP_SHELL = [
  '/play/test/',
  '/play/manifest.json',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/splash-750x1334.jpg',
  '/icons/splash-1242x2208.jpg',
  '/icons/splash-1125x2436.jpg',
  '/icons/splash-828x1792.jpg',
  '/icons/splash-1242x2688.jpg',
  '/icons/splash-1170x2532.jpg',
  '/icons/splash-1284x2778.jpg',
  '/icons/splash-1179x2556.jpg',
  '/icons/splash-1290x2796.jpg',
  '/icons/splash-1206x2622.jpg',
  '/icons/splash-1320x2868.jpg',
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
