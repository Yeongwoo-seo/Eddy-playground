// Scoped to /dev/ only (this file lives in dev/, so the browser won't let it
// control anything outside that path) — keeps the OPERATION MK DEV sandbox as
// its own installable app, independent of the 강낭콩 투어 PWA's service worker.
const CACHE_NAME = 'operation-mk-dev-v29';
const APP_SHELL = [
  '/realPlayMode.js',
  '/dev/',
  '/dev/story/',
  '/dev/week1/',
  '/dev/week2/',
  '/dev/week3/',
  '/dev/week4/',
  '/dev/upload/',
  '/dev/data/',
  '/dev/youngwoo-test/',
  '/dev/script/',
  '/dev/start/',
  '/dev/minigames/',
  '/dev/minigame-fishing/',
  '/dev/minigame-item-scan/',
  '/dev/minigame-watermelon/',
  '/dev/minigame-watermelon/play/',
  '/dev/minigame-transform/',
  '/dev/minigame-transform/play/',
  '/dev/minigame-layton/',
  '/dev/minigame-layton/play/',
  '/dev/assetDb.js',
  '/dev/loadingOverlay.js',
  '/dev/youngwooTestData.js',
  '/dev/dialogueData.js',
  '/dev/dialoguePanel.js',
  '/dev/caseFileData.js',
  '/dev/caseFileState.js',
  '/dev/caseMenu.js',
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
//
// `cache: 'no-store'` here is load-bearing — without it, this fetch() still
// consults the browser's own HTTP cache underneath the service worker, so a
// "network-first" strategy can silently serve a stale cached response even
// though it looks like it's always going to network. That's the likely
// reason deployed fixes kept appearing not to take effect.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Only the dev sandbox's own same-origin files go through this
  // network-first strategy. Cross-origin API calls (Supabase REST/storage,
  // used by assetDb.js for every upload/list/hotspot request) must fall
  // straight through to the browser's normal fetch path instead —
  // re-fetching event.request here was breaking a second identical request
  // to the same Supabase URL made in quick succession (e.g. saveAsset()'s
  // refreshList() right after an upload) with "Failed to fetch", which
  // silently broke every 정답 영역 지정(hotspot) flow that depends on the
  // background list refreshing right after a save (지하철 지도 미니게임
  // included).
  if (new URL(event.request.url).origin !== location.origin) return;
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
