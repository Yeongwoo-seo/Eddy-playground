// Scoped to /play/ only (this file lives in play/, so the browser won't let
// it control anything outside that path) — keeps the real play environment
// as its own installable app, independent of the /dev/ sandbox's service
// worker and the 강낭콩 투어 PWA's.
const CACHE_NAME = 'operation-mk-play-v5';
const APP_SHELL = [
  '/play/',
  '/play/manifest.json',
  '/play/game/',
  '/play/explore/',
  '/play/minigame-eastwood/',
  '/play/minigame-fishing/',
  '/play/minigame-phone-search/',
  '/play/minigame-photo-zoom/',
  '/play/minigame-timeline/',
  '/play/shop/',
  '/play/wardrobe/',
  '/dev/assetDb.js',
  '/dev/loadingOverlay.js',
  '/dev/dialogueData.js',
  '/dev/dialoguePanel.js',
  '/dev/caseFileData.js',
  '/dev/caseFileState.js',
  '/dev/caseMenu.js',
  '/dev/vnPlayer.js',
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

// Splitting the fetch strategy by request type: stale-while-revalidate (v3's
// approach) made the app open instantly, but it meant a deployed gameplay
// fix wouldn't actually show up until the *next* full close/reopen — the
// install-gate/week-select/minigame-select screen, and realPlayMode.js's
// dev-chrome-hiding logic, kept serving whatever was cached from the
// previous open for the entire current play session (installed PWA, but
// gameplay fixes don't apply mid-session). Same root cause /dev/sw.js hit
// and fixed with network-first (see its comment), which never got applied
// here when /play/sw.js was switched to stale-while-revalidate for speed.
//
// Fix: only the large, rarely-changing static images (icons/splash screens)
// keep stale-while-revalidate, since serving those from cache immediately is
// what actually made app-open feel instant. Everything else — HTML, JS,
// manifest.json — goes network-first with cache: 'no-store' (bypassing the
// browser's own HTTP cache too, same as /dev/sw.js) so gameplay code is
// always current for the session that's about to start, not the next one.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.destination === 'image') {
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
    return;
  }

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
