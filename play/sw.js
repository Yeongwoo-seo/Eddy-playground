// Scoped to /play/ only (this file lives in play/, so the browser won't let
// it control anything outside that path) — keeps the real play environment
// as its own installable app, independent of the /dev/ sandbox's service
// worker and the 강낭콩 투어 PWA's.
const CACHE_NAME = 'operation-mk-play-v4';
const APP_SHELL = [
  '/play/',
  '/play/manifest.json',
  '/realPlayMode.js',
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

// stale-while-revalidate: serve the cached copy immediately (so opening the
// installed app renders instantly instead of blocking on a full network
// round-trip — worse still with { cache: 'no-store' }, which also skips the
// browser's own HTTP cache — before showing anything), while a network
// fetch runs in the background to refresh the cache for the *next* open.
// A load right after a deploy can show one load's worth of stale build, but
// it self-heals on the very next open instead of making every single open
// pay full network latency up front.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
