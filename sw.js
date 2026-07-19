// PWA scope covers the whole site — registered from schedule.html and
// hangeoreum.html (each an independently installed home-screen app) with
// { scope: '.' }, so navigating within either app's pages stays inside
// the standalone app instead of kicking out to the browser
const CACHE_NAME = 'gangnangkong-tour-v7';
const APP_SHELL = [
  'schedule.html',
  'planner.html',
  'pack.html',
  'arrival.html',
  'secret.html',
  'hangeoreum.html',
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

// background notifications for both installed apps (강낭콩 투어 + 한걸음),
// delivered by the shared gangnangkong-tour-push Worker even while the app
// is fully closed — see worker/README.md. The Worker stamps title/icon/url
// per app in the push payload, so this handler stays app-agnostic.
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || '강낭콩 투어';
  const body = data.body || '';
  const options = { body, data: { url: data.url || 'schedule.html' } };
  if (data.icon) options.icon = data.icon;
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || 'schedule.html';
  event.waitUntil(clients.openWindow(url));
});
