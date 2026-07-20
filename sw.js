// PWA scope covers the whole site — registered from schedule.html and
// hangeoreum.html (each an independently installed home-screen app) with
// { scope: '.' }, so navigating within either app's pages stays inside
// the standalone app instead of kicking out to the browser
const CACHE_NAME = 'gangnangkong-tour-v10';
const APP_SHELL = [
  'schedule.html',
  'planner.html',
  'pack.html',
  'arrival.html',
  'arrival-guide.html',
  'boarding-pass.html',
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

// Hotlinked nav-card cover photos — the home screen (schedule.html) and
// arrival.html's own sub-menu both show these on every visit, so they need
// to survive offline (e.g. checking 탑승권 mid-flight with no signal), not
// just whatever happened to load once. Precached separately from
// APP_SHELL/cache.addAll: these are cross-origin, and cache.addAll aborts
// the *entire* install if even one request in the batch fails, which would
// take down offline support for the whole app over a single flaky photo.
const PHOTO_SHELL = [
  'https://images.pexels.com/photos/9186152/pexels-photo-9186152.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'https://images.pexels.com/photos/20139504/pexels-photo-20139504.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'https://images.pexels.com/photos/4062614/pexels-photo-4062614.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'https://images.pexels.com/photos/15225161/pexels-photo-15225161.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'https://images.pexels.com/photos/15225161/pexels-photo-15225161.jpeg?auto=compress&cs=tinysrgb&w=900&h=1400&fit=crop',
  'https://images.pexels.com/photos/2069/pexels-photo-2069.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  'https://images.pexels.com/photos/7310015/pexels-photo-7310015.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(APP_SHELL);
      // Cache.add()/addAll() reject opaque responses outright (they check
      // response.ok internally, which is always false for a 'no-cors'
      // cross-origin fetch) — fetch + cache.put directly instead, which has
      // no such check. allSettled so one failed/slow photo doesn't sink the
      // rest of the install the way cache.addAll's all-or-nothing batching
      // would.
      await Promise.allSettled(
        PHOTO_SHELL.map(url => fetch(url, { mode: 'no-cors' }).then(res => cache.put(url, res)))
      );
    })
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
// round-trip every time), while a network fetch runs in the background to
// refresh the cache for the *next* open. This used to be network-first —
// always awaiting the network before showing anything — specifically to
// avoid a stale page referencing an old localStorage key/logic. That's still
// true here (a load right after a deploy can show one load's worth of stale
// UI), but it self-heals on the very next open instead of making every
// single open pay the network latency up front.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        // response.ok is false for opaque responses (status 0) — which is
        // exactly what a cross-origin no-cors load (e.g. a CSS
        // background-image: url(...) hitting images.pexels.com) always comes
        // back as. Skipping those here meant hotlinked photos were never
        // actually written to the cache no matter how many times they'd
        // loaded successfully — only same-origin/CORS responses were.
        if (response.ok || response.type === 'opaque') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
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
