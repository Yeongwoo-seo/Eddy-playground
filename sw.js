// PWA scope covers the whole site — registered from schedule.html
// (the installed start_url) with { scope: '.' }, so navigating to
// planner.html/pack.html/arrival.html/secret.html stays inside the
// standalone app instead of kicking out to the browser
const CACHE_NAME = 'gangnangkong-tour-v5';
const APP_SHELL = [
  'schedule.html',
  'planner.html',
  'pack.html',
  'arrival.html',
  'secret.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/splash-750x1334.jpg',
  'icons/splash-1242x2208.jpg',
  'icons/splash-1125x2436.jpg',
  'icons/splash-828x1792.jpg',
  'icons/splash-1242x2688.jpg',
  'icons/splash-1170x2532.jpg',
  'icons/splash-1284x2778.jpg',
  'icons/splash-1179x2556.jpg',
  'icons/splash-1290x2796.jpg',
  'icons/splash-1206x2622.jpg',
  'icons/splash-1320x2868.jpg'
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

// network-first: always prefer the latest deployed code when online,
// only falling back to the cached app shell when offline. A stale
// cached page could reference an old localStorage key or logic, which
// looks exactly like "my data disappeared" to the user.
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
