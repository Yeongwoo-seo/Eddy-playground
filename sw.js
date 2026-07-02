// PWA scope is schedule.html only — this SW is registered from
// schedule.html with an explicit { scope: 'schedule.html' }, so it
// never controls index/home/tour
const CACHE_NAME = 'gangnangkong-tour-v2';
const APP_SHELL = [
  'schedule.html',
  'manifest.json',
  'icons/splash-bg.jpg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
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
