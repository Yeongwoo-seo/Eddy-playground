/* OPERATION MK DEV — isolated MVP sandbox, not part of the main game.
   Background/character images live in Supabase Storage (bucket:
   dev-assets) with metadata in the dev_assets table, so an upload
   survives closing the app, reinstalling it, or switching devices —
   unlike browser-local IndexedDB/localStorage, which several rounds of
   on-device testing showed getting silently evicted. Every hotspot ("정답
   영역") position — room-search hotspots and single/staged minigame
   hotspots alike — lives in that same Storage bucket for the same reason;
   see AssetDB.getRoomHotspots/setRoomHotspot and
   AssetDB.getMinigameHotspot/setMinigameHotspot below. Selection state
   (which asset is assigned to which character/scene) stays in localStorage,
   backed by navigator.storage.persist() below; it's cheap to redo if lost. */

// Supabase anon key is meant to be public/client-side (that's the whole
// point of the "anon" role) — same project already used by planner.html.
const SUPABASE_URL = 'https://dhtstqnksjoyyshnhksv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHN0cW5rc2pveXlzaG5oa3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjIyNzQsImV4cCI6MjA5ODUzODI3NH0.FMZdCXntYJKxQeYNwfrsy1liJcHIkD2inJ4NzbwLzd4';
const DEV_ASSETS_BUCKET = 'dev-assets';
const DEV_ASSETS_TABLE = 'dev_assets';

// On-screen error banner so real failures (storage quota, private-browsing
// restrictions, etc.) are visible on the phone itself instead of failing
// silently — Safari's remote inspector isn't always within reach mid-test.
const DevDiag = (() => {
  let bannerEl = null;
  function show(message) {
    if (!bannerEl) {
      bannerEl = document.createElement('div');
      bannerEl.id = 'devDiagBanner';
      bannerEl.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;background:#3a0d0d;color:#ffb4b4;border:1px solid #d94141;border-radius:10px;padding:12px 14px;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11.5px;line-height:1.5;white-space:pre-wrap;word-break:break-all;box-shadow:0 8px 24px rgba(0,0,0,.4)';
      bannerEl.addEventListener('click', () => bannerEl.remove());
      document.body.appendChild(bannerEl);
    }
    bannerEl.textContent = 'DEV ERROR (탭하면 닫힘): ' + message;
  }
  window.addEventListener('error', (e) => show(e.message || String(e.error)));
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    show(reason && reason.message ? reason.message : String(reason));
  });
  // Selection state (which asset each character uses) still lives in
  // localStorage — request persistence so it isn't evicted under storage
  // pressure either, even though the images themselves no longer depend on it.
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persisted().then(already => {
      if (already) return;
      navigator.storage.persist().then(granted => {
        if (!granted) show('브라우저가 영구 저장을 허용하지 않았습니다. 캐릭터/배경 선택 상태가 저장 공간 부족 시 초기화될 수 있습니다.');
      });
    });
  }
  return { show };
})();

const AssetDB = (() => {
  // /play/game re-requests the active character/background asset on every
  // single dialogue line change, even when it's the same asset as before —
  // without a cache that's a Supabase round-trip per tap, which is exactly
  // why lines were visibly slow to appear. Every /play/game scene is its own
  // full page navigation (see game/index.html's nextSceneId handoff), so an
  // in-memory-only Map would restart empty on every single scene change —
  // re-paying that round trip for the *same* background/portrait dozens of
  // times over one week's playthrough. Mirrored into sessionStorage (below)
  // so it survives navigation within one browser tab/session; asset rows are
  // effectively immutable once uploaded (addAsset always mints a fresh id —
  // see addAsset below), so a session-old entry doesn't go stale the way a
  // live-edited value would.
  const cache = new Map();
  const ASSET_CACHE_SESSION_KEY = 'mkAssetDbCache';
  function hydrateAssetCache() {
    try {
      const raw = sessionStorage.getItem(ASSET_CACHE_SESSION_KEY);
      if (!raw) return;
      JSON.parse(raw).forEach(row => cache.set(row.id, row));
    } catch (e) { /* corrupt/unavailable storage — start with an empty cache */ }
  }
  function persistAssetCache() {
    try { sessionStorage.setItem(ASSET_CACHE_SESSION_KEY, JSON.stringify([...cache.values()])); }
    catch (e) { /* storage full/unavailable — cache still works in-memory for this page */ }
  }
  hydrateAssetCache();

  function restHeaders(extra) {
    return Object.assign({
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    }, extra || {});
  }

  // Background/character DB metadata (which scene — or minigame — a
  // background belongs to; which character+expression a portrait belongs
  // to) rides along in the Storage path instead of new dev_assets columns —
  // avoids a schema migration against the shared Supabase project for a
  // dev-only sandbox. A character portrait's path grows one extra segment
  // (the outfit id) for characters that have outfit versions — distinguished
  // by part count so pre-existing, no-outfit paths keep parsing exactly as
  // before (outfit: null).
  //
  // Backgrounds have two coexisting shapes, also distinguished by part
  // count (location-background-system §2/§3 design): ordinary VN scene
  // backgrounds now live under `background/<locationId>/<variantId>/<id>.ext`
  // (4 parts) so photos are shared by every scene slot pointing at the same
  // physical location; minigame/room-search backgrounds are explicitly out
  // of scope for that change and keep the original
  // `background/<sceneId>/<id>.ext` (3 parts) scene-owned shape.
  function parsePathMeta(type, path) {
    const parts = (path || '').split('/');
    if (type === 'background') {
      if (parts.length >= 4) return { locationId: parts[1] || null, variantId: parts[2] || null };
      return { sceneId: parts[1] || null };
    }
    if (type === 'character') {
      if (parts.length >= 5) return { characterKey: parts[1] || null, outfit: parts[2] || null, expression: parts[3] || null };
      return { characterKey: parts[1] || null, outfit: null, expression: parts[2] || null };
    }
    return {};
  }

  function toAsset(row) {
    // `dataUrl` kept as the field name consumers read (game/upload pages) —
    // it's just a public Storage URL now instead of a base64 string.
    return Object.assign(
      { id: row.id, type: row.type, name: row.name, width: row.width, height: row.height, dataUrl: row.url },
      parsePathMeta(row.type, row.path)
    );
  }

  async function addAsset({ type, name, blob, width, height, sceneId, locationId, variantId, characterKey, expression, outfit }) {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ext = (name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    // Callers pass either (locationId[, variantId]) for an ordinary VN scene
    // background (장소 DB tab) or sceneId for a minigame/room-search
    // background (배경 DB tab, 미니게임 kind) — see parsePathMeta above.
    const path = type === 'background'
      ? (locationId
          ? `background/${locationId}/${variantId || 'default'}/${id}.${ext}`
          : `background/${sceneId || 'unassigned'}/${id}.${ext}`)
      : type === 'character'
        ? (outfit
            ? `character/${characterKey || 'unassigned'}/${outfit}/${expression || 'unassigned'}/${id}.${ext}`
            : `character/${characterKey || 'unassigned'}/${expression || 'unassigned'}/${id}.${ext}`)
        : `${type}/${id}.${ext}`;

    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${path}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': blob.type || 'application/octet-stream',
      },
      body: blob,
    });
    if (!uploadRes.ok) throw new Error(`이미지 업로드 실패 (${uploadRes.status}): ${await uploadRes.text()}`);

    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${path}`;
    const row = { id, type, name, path, url, width, height };
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_ASSETS_TABLE}`, {
      method: 'POST',
      headers: restHeaders({ Prefer: 'return=minimal' }),
      body: JSON.stringify(row),
    });
    if (!insertRes.ok) throw new Error(`이미지 정보 저장 실패 (${insertRes.status}): ${await insertRes.text()}`);
    const asset = toAsset(row);
    cache.set(asset.id, asset);
    persistAssetCache();
    return asset;
  }

  async function getAssetsByType(type) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_ASSETS_TABLE}?type=eq.${encodeURIComponent(type)}&order=created_at.desc`, {
      headers: restHeaders(),
    });
    if (!res.ok) throw new Error(`이미지 목록을 불러오지 못했습니다 (${res.status})`);
    const rows = await res.json();
    const assets = rows.map(toAsset);
    assets.forEach(a => cache.set(a.id, a));
    persistAssetCache();
    return assets;
  }

  async function getAsset(id) {
    if (!id) return null;
    if (cache.has(id)) return cache.get(id);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_ASSETS_TABLE}?id=eq.${encodeURIComponent(id)}&select=*`, {
      headers: restHeaders(),
    });
    if (!res.ok) throw new Error(`이미지를 불러오지 못했습니다 (${res.status})`);
    const rows = await res.json();
    const asset = rows.length ? toAsset(rows[0]) : null;
    if (asset) { cache.set(id, asset); persistAssetCache(); }
    return asset;
  }

  // Batched counterpart to getAsset — a whole week's worth of scenes shares
  // a small pool of backgrounds/portraits, so fetching each one's metadata
  // with its own round trip (WeekPreloader's original approach) was itself
  // the slow part. One `id=in.(...)` request covers everything still
  // missing from cache; already-cached ids resolve for free.
  async function getAssetsByIds(ids) {
    const unique = [...new Set((ids || []).filter(Boolean))];
    const missing = unique.filter(id => !cache.has(id));
    if (missing.length) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_ASSETS_TABLE}?id=in.(${missing.map(encodeURIComponent).join(',')})&select=*`, {
        headers: restHeaders(),
      });
      if (!res.ok) throw new Error(`이미지 목록을 불러오지 못했습니다 (${res.status})`);
      const rows = await res.json();
      rows.map(toAsset).forEach(a => cache.set(a.id, a));
      persistAssetCache();
    }
    return unique.map(id => cache.get(id)).filter(Boolean);
  }

  async function deleteAsset(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_ASSETS_TABLE}?id=eq.${encodeURIComponent(id)}&select=path`, {
      headers: restHeaders(),
    });
    const rows = res.ok ? await res.json() : [];
    const path = rows[0] && rows[0].path;
    if (path) {
      await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${path}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      });
    }
    await fetch(`${SUPABASE_URL}/rest/v1/${DEV_ASSETS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: restHeaders(),
    });
    cache.delete(id);
    persistAssetCache();
  }

  // Caching the metadata/URL above isn't enough on its own — setting an
  // <img>/background-image src still has to download AND decode the actual
  // bytes the first time. `onload` only guarantees the download finished;
  // the (often more expensive, for a full-resolution room photo) bitmap
  // decode/rasterize step still gets deferred to whenever the image is
  // first actually painted — which, without this, is the first real paint
  // after a switch, i.e. exactly the stutter this was meant to prevent.
  // img.decode() forces that decode to happen now, off-DOM, during the
  // loading screen, so every switch afterward is a plain paint of an
  // already-decoded bitmap.
  // Deliberately in-memory only (unlike `cache` above) — this used to be
  // mirrored into sessionStorage so a decode warmed on one page load wasn't
  // "forgotten" by the next page's full navigation, but that backfired: the
  // decoded *bitmap* itself never survives a navigation (each page gets a
  // fresh renderer), only this bookkeeping did. A hub/scene page that opened
  // *believing* everything was already warmed — because an earlier page in
  // the same tab session had warmed the same URLs — skipped the real
  // img.decode() call entirely, so the actual decode got deferred back to
  // first paint after all: exactly the pop this exists to prevent, just
  // moved to whichever background a player's *second* visit lands on
  // instead of the first. Redoing decode() once per fresh page is the
  // correct amount of "redundant" work — the bytes are still HTTP-cached,
  // only the decode itself repeats, and that's the whole point of calling
  // this during a loading screen instead of never.
  const warmedImages = new Set();

  function preloadImage(url) {
    if (!url || warmedImages.has(url)) return Promise.resolve();
    warmedImages.add(url);
    const img = new Image();
    img.src = url;
    const ready = img.decode ? img.decode() : new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    return Promise.resolve(ready).catch(() => {}); // a broken image shouldn't block the scene
  }

  // Fetches one of the JSON-blob-in-Storage documents (room hotspots, item
  // catalog, recipes, ...) below. A missing object (nothing saved there yet)
  // is a normal, expected case — Supabase Storage's public GET reports it as
  // either a real 404 or a 400 with a `not_found` error body depending on
  // version, so both are treated as "doesn't exist yet" and resolve to null.
  // Anything else non-ok (auth/RLS misconfig, rate limit, a transient 5xx)
  // must NOT be treated the same way: getRoomHotspots/getItems/etc used to
  // silently cache `{}` for ANY non-ok response, and every set* function
  // reads that cache as "current data" before overwriting the blob with
  // just the one field being edited — so one transient failure at just the
  // wrong moment would permanently poison the session's cache and the next
  // save would silently wipe out everything else already stored. Throwing
  // here instead lets that reach the caller's own error handling (usually a
  // visible DevDiag banner) instead of failing silently.
  async function fetchJsonBlob(url) {
    const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
    if (res.ok) return await res.json();
    if (res.status === 404) return null;
    let body = null;
    try { body = await res.json(); } catch (e) { /* not JSON — fall through */ }
    if (body && /not.?found/i.test(String(body.error || body.message || ''))) return null;
    throw new Error(`데이터를 불러오지 못했습니다 (${res.status})`);
  }

  // Every set* below calls this (not the paired lenient get*) to read the
  // blob it's about to overwrite — trusts an already-populated cache, but on
  // a cache miss lets fetchJsonBlob's error propagate instead of swallowing
  // it into "empty," which is what get* does for read-time display. A save
  // has to fail loudly rather than silently write over real data with just
  // the one field being edited.
  async function readCurrentForWrite(cache, key, url, emptyValue) {
    if (cache.has(key)) return cache.get(key);
    const value = (await fetchJsonBlob(url)) || emptyValue;
    cache.set(key, value);
    return value;
  }

  // Room-search minigame hotspot positions ({ [hotspotId]: {x1,y1,x2,y2} }
  // per sceneId) — stored as one JSON blob per scene directly in the same
  // Storage bucket the photos themselves live in (no new Postgres table/
  // columns needed: a deterministic path IS the primary key, and Storage's
  // upsert header does the overwrite-in-place). This replaces the old
  // localStorage-only version of this data, which never left the device
  // that ran /dev/upload — now marking a hotspot's position is visible from
  // any device/browser immediately, same as the photos already are.
  const roomHotspotsCache = new Map(); // sceneId -> hotspots map, refreshed on write; a fresh page load refetches once
  function roomHotspotsPath(sceneId) { return `room-hotspots/${encodeURIComponent(sceneId)}.json`; }

  async function getRoomHotspots(sceneId) {
    if (!sceneId) return {};
    if (roomHotspotsCache.has(sceneId)) return roomHotspotsCache.get(sceneId);
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${roomHotspotsPath(sceneId)}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      roomHotspotsCache.set(sceneId, map);
      return map;
    } catch (e) {
      return roomHotspotsCache.get(sceneId) || {};
    }
  }

  async function setRoomHotspot(sceneId, hotspotId, hotspot) {
    if (!sceneId || !hotspotId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${roomHotspotsPath(sceneId)}?t=${Date.now()}`;
    const current = await readCurrentForWrite(roomHotspotsCache, sceneId, url, {});
    const map = Object.assign({}, current);
    // Delete-then-set (rather than a plain overwrite) so a re-saved hotspot's
    // key moves to the end of insertion order — overlapping hotspots are hit-
    // tested in reverse key order, so this keeps the most recently specified
    // one on top even when it's just an edit of an existing hotspot.
    delete map[hotspotId];
    if (hotspot) map[hotspotId] = hotspot;
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${roomHotspotsPath(sceneId)}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`핫스팟 위치 저장 실패 (${res.status}): ${await res.text()}`);
    roomHotspotsCache.set(sceneId, map);
    return map;
  }

  // Single/staged minigame hotspot positions (one per sceneId, or several
  // sharing one map image via a stageIndex — e.g. the 3-stop station
  // finder) — same per-scene JSON-blob-in-Storage pattern as room hotspots
  // above, just keyed by stage instead of by named hotspot id:
  // { [stageKey]: {points:[{x,y},...]} }, stageKey is '_single' or a stage
  // index string.
  const minigameHotspotsCache = new Map();
  function minigameHotspotsPath(sceneId) { return `minigame-hotspots/${encodeURIComponent(sceneId)}.json`; }
  function minigameStageKey(stageIndex) { return stageIndex == null ? '_single' : String(stageIndex); }

  async function getMinigameHotspots(sceneId) {
    if (!sceneId) return {};
    if (minigameHotspotsCache.has(sceneId)) return minigameHotspotsCache.get(sceneId);
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${minigameHotspotsPath(sceneId)}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      minigameHotspotsCache.set(sceneId, map);
      return map;
    } catch (e) {
      return minigameHotspotsCache.get(sceneId) || {};
    }
  }

  async function getMinigameHotspot(sceneId, stageIndex) {
    if (!sceneId) return null;
    const all = await getMinigameHotspots(sceneId);
    return all[minigameStageKey(stageIndex)] || null;
  }

  async function setMinigameHotspot(sceneId, stageIndex, hotspot) {
    if (!sceneId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${minigameHotspotsPath(sceneId)}?t=${Date.now()}`;
    const current = await readCurrentForWrite(minigameHotspotsCache, sceneId, url, {});
    const map = Object.assign({}, current);
    const key = minigameStageKey(stageIndex);
    if (hotspot) map[key] = hotspot; else delete map[key];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${minigameHotspotsPath(sceneId)}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`핫스팟 위치 저장 실패 (${res.status}): ${await res.text()}`);
    minigameHotspotsCache.set(sceneId, map);
    return map;
  }

  // Evidence-collection item catalog — { [itemId]: { name, icon, imageAssetId,
  // hotspotId, message } } per evidence-collection id (e.g.
  // 'week1-scene-002-2'). Same per-scene JSON-blob-in-Storage pattern as
  // room hotspots above. `hotspotId` is which hotspot (across every area of
  // that evidence collection) grants this item on tap — null/absent means
  // the item isn't a simple hotspot pickup (a core-route item, or a
  // recipe's output). `imageAssetId` points at a normal AssetDB asset
  // (type 'item') and overrides `icon` (an emoji fallback) when set.
  const itemsCache = new Map();
  function itemsPath(evidenceId) { return `items/${encodeURIComponent(evidenceId)}.json`; }

  async function getItems(evidenceId) {
    if (!evidenceId) return {};
    if (itemsCache.has(evidenceId)) return itemsCache.get(evidenceId);
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${itemsPath(evidenceId)}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      itemsCache.set(evidenceId, map);
      return map;
    } catch (e) {
      return itemsCache.get(evidenceId) || {};
    }
  }

  async function setItem(evidenceId, itemId, def) {
    if (!evidenceId || !itemId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${itemsPath(evidenceId)}?t=${Date.now()}`;
    const current = await readCurrentForWrite(itemsCache, evidenceId, url, {});
    const map = Object.assign({}, current);
    if (def) map[itemId] = def; else delete map[itemId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${itemsPath(evidenceId)}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`아이템 저장 실패 (${res.status}): ${await res.text()}`);
    itemsCache.set(evidenceId, map);
    return map;
  }

  // Evidence-collection recipes — [{ id, inputItemIds: [a, b], outputItemId,
  // message }] per evidence-collection id, same JSON-blob pattern.
  const recipesCache = new Map();
  function recipesPath(evidenceId) { return `recipes/${encodeURIComponent(evidenceId)}.json`; }

  async function getRecipes(evidenceId) {
    if (!evidenceId) return [];
    if (recipesCache.has(evidenceId)) return recipesCache.get(evidenceId);
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${recipesPath(evidenceId)}?t=${Date.now()}`;
    try {
      const list = (await fetchJsonBlob(url)) || [];
      recipesCache.set(evidenceId, list);
      return list;
    } catch (e) {
      return recipesCache.get(evidenceId) || [];
    }
  }

  // Unlike setItem/setRoomHotspot/setMinigameHotspot, this takes the whole
  // desired list rather than doing its own read-modify-write. No caller in
  // dev/upload reaches this anymore (its 조합법 tab was replaced by 상호작용
  // — see that file's history), but minigame-phone-search's
  // loadCustomItemsAndRecipes still reads getRecipes() at boot, so this
  // stays a valid store for whatever custom recipes were saved before then.
  // A getRecipes() call that fails and falls back to [] (see
  // above) can still lead to a real overwrite-with-incomplete-list if a dev
  // adds/deletes a recipe right after — same class of risk as the other
  // stores, just one layer up in the caller instead of in here.
  async function setRecipes(evidenceId, recipes) {
    if (!evidenceId) return [];
    const blob = new Blob([JSON.stringify(recipes)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${recipesPath(evidenceId)}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`조합법 저장 실패 (${res.status}): ${await res.text()}`);
    recipesCache.set(evidenceId, recipes);
    return recipes;
  }

  // Per-line dialogue overrides — { [lineId]: { text?, speaker?,
  // characterId?, expression? } } per sceneId, same JSON-blob-in-Storage
  // pattern as room hotspots/items above. Only the fields that differ from
  // dialogueData.js's static script are stored, so a line can have its
  // wording, speaker (이름) and/or expression (감정) tweaked together from
  // /dev/upload's 대사 tab, without restructuring a scene's line list.
  // Older saves stored just the text as a bare string — normalized to
  // { text } on read so both shapes keep working.
  //
  // /dev/upload's 대사 tab edits a scene's whole script as one text block
  // and always re-derives the complete overrides map for that scene from
  // it, so — like setRecipes above — setDialogueOverrides takes the whole
  // desired map and does a plain overwrite rather than its own
  // read-modify-write (that also sidesteps the lost-update race a
  // per-line read-modify-write would have if this ever saved concurrently).
  const dialogueOverridesCache = new Map();
  function dialogueOverridesPath(sceneId) { return `dialogue-overrides/${encodeURIComponent(sceneId)}.json`; }
  function normalizeDialogueOverrides(map) {
    const out = {};
    Object.keys(map).forEach(id => {
      const v = map[id];
      out[id] = typeof v === 'string' ? { text: v } : v;
    });
    return out;
  }

  async function getDialogueOverrides(sceneId) {
    if (!sceneId) return {};
    if (dialogueOverridesCache.has(sceneId)) return dialogueOverridesCache.get(sceneId);
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${dialogueOverridesPath(sceneId)}?t=${Date.now()}`;
    try {
      const map = normalizeDialogueOverrides((await fetchJsonBlob(url)) || {});
      dialogueOverridesCache.set(sceneId, map);
      return map;
    } catch (e) {
      return dialogueOverridesCache.get(sceneId) || {};
    }
  }

  async function setDialogueOverrides(sceneId, overrides) {
    if (!sceneId) return {};
    const map = Object.assign({}, overrides);
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${dialogueOverridesPath(sceneId)}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`대사 저장 실패 (${res.status}): ${await res.text()}`);
    dialogueOverridesCache.set(sceneId, map);
    return map;
  }

  // 사운드 카탈로그 — { [soundId]: { name, kind: 'bgm'|'sfx', videoId, start,
  // end } }, one JSON blob for the whole catalog (not per-scene like items/
  // hotspots — a sound isn't tied to a single scene; which scene plays a
  // given BGM lives separately in DevGameState's own sceneBgm map, same
  // localStorage-backed pattern as background/character selection). `end: 0`
  // means "play to the natural end of the clip" rather than a fixed loop
  // point — see youtubeSound.js's createYTSoundPlayer.
  const soundsCache = new Map(); // single entry keyed 'catalog'
  const SOUNDS_PATH = 'sounds/catalog.json';

  async function getSounds() {
    if (soundsCache.has('catalog')) return soundsCache.get('catalog');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${SOUNDS_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      soundsCache.set('catalog', map);
      return map;
    } catch (e) {
      return soundsCache.get('catalog') || {};
    }
  }

  // Seeds dialogueOverridesCache/soundsCache directly (no network, no
  // sessionStorage of their own) — used exclusively by WeekPreloader to
  // replay its one bulk fetch's results into a fresh /play/game page load, so
  // getDialogueOverrides/getSounds see a warm cache instead of re-fetching
  // per scene. Deliberately *not* auto-persisted/hydrated the way `cache`
  // and `warmedImages` are above: dialogue overrides and the sound catalog
  // are cache-busted (`?t=${Date.now()}`) on purpose because /dev/upload's
  // editors expect every read there to reflect the latest save, and blanket
  // sessionStorage hydration would silently defeat that for any page, not
  // just /play/game.
  function primeDialogueOverrides(sceneId, map) {
    if (!sceneId || dialogueOverridesCache.has(sceneId)) return;
    dialogueOverridesCache.set(sceneId, normalizeDialogueOverrides(map || {}));
  }
  function primeSounds(map) {
    if (soundsCache.has('catalog')) return;
    soundsCache.set('catalog', map || {});
  }
  // Same idea for the scene->location assignment map (getSceneLocationMap
  // below) — DevGameState.getBackgroundId reads it on every single
  // applyBackground call, so without priming it WeekPreloader's batching
  // wouldn't actually stop that one from re-fetching per scene.
  function primeSceneLocationMap(map) {
    if (sceneLocationsCache.has('map')) return;
    sceneLocationsCache.set('map', map || {});
  }

  async function setSound(soundId, def) {
    if (!soundId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${SOUNDS_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(soundsCache, 'catalog', url, {});
    const map = Object.assign({}, current);
    if (def) map[soundId] = def; else delete map[soundId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${SOUNDS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`사운드 저장 실패 (${res.status}): ${await res.text()}`);
    soundsCache.set('catalog', map);
    return map;
  }

  function deleteSound(soundId) {
    return setSound(soundId, null);
  }

  // 전역 장소 카탈로그 (location-background-system 설계안) — { [locationId]:
  // { id, label, variants: [{id, label}, ...] } }, one JSON blob for the
  // whole catalog, same single-blob pattern as the sound catalog above.
  // Photos are assigned per (locationId, variantId) — see
  // DevGameState.getLocationAssetId/setLocationAssetId — so scenes sharing
  // the same physical location (e.g. two different beats both at "Eastwood
  // Accommodation") automatically share the same photo once it's uploaded
  // once, instead of each scene slot needing its own separate upload.
  const locationsCache = new Map(); // single entry keyed 'catalog'
  const LOCATIONS_PATH = 'locations/catalog.json';

  // CaseEntry 메타데이터 카탈로그 (증거·증언·추리메모 재설계 §7.3) —
  // groupId/presentable/relatedNpcIds/topicTags/이미지 명세 등 화면 구성용
  // 오버레이. 원본 증거 정의(dialogueData.js의 addEvidence 호출)는 절대
  // 건드리지 않고, 이 카탈로그만으로 그룹 병합/제시 가능 여부/태그를 조정한다.
  // getLocations/setLocation과 완전히 동일한 단일 JSON blob 패턴.
  const caseEntryMetaCache = new Map(); // single entry keyed 'catalog'
  const CASE_ENTRY_META_PATH = 'case-entries/catalog.json';

  async function getCaseEntryMeta() {
    if (caseEntryMetaCache.has('catalog')) return caseEntryMetaCache.get('catalog');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${CASE_ENTRY_META_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      caseEntryMetaCache.set('catalog', map);
      return map;
    } catch (e) {
      return caseEntryMetaCache.get('catalog') || {};
    }
  }

  async function setCaseEntryMeta(entryId, def) {
    if (!entryId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${CASE_ENTRY_META_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(caseEntryMetaCache, 'catalog', url, {});
    const map = Object.assign({}, current);
    if (def) map[entryId] = def; else delete map[entryId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${CASE_ENTRY_META_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`사건 카드 메타 저장 실패 (${res.status}): ${await res.text()}`);
    caseEntryMetaCache.set('catalog', map);
    return map;
  }

  // 스프라이트 시트 매니페스트 (§10.9) — 시트마다 파일 하나 대신, 다른
  // 카탈로그들과 똑같이 시트 전체를 한 JSON blob으로 묶는다. 이유는 이
  // 프로젝트에 "Storage 안 파일 목록 조회" API가 아예 안 쓰이고 있어서
  // (모든 카탈로그가 단일 blob 패턴) — 시트가 늘어나도 새 리소스나 목록
  // API 없이 이 한 파일의 키만 늘어난다.
  const caseEntrySheetsCache = new Map(); // single entry keyed 'catalog'
  const CASE_ENTRY_SHEETS_PATH = 'case-entry-sheets/manifests.json';

  async function getSpriteSheetManifests() {
    if (caseEntrySheetsCache.has('catalog')) return caseEntrySheetsCache.get('catalog');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${CASE_ENTRY_SHEETS_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      caseEntrySheetsCache.set('catalog', map);
      return map;
    } catch (e) {
      return caseEntrySheetsCache.get('catalog') || {};
    }
  }
  async function getSpriteSheetManifest(sheetId) { return (await getSpriteSheetManifests())[sheetId] || null; }

  async function setSpriteSheetManifest(sheetId, manifest) {
    if (!sheetId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${CASE_ENTRY_SHEETS_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(caseEntrySheetsCache, 'catalog', url, {});
    const map = Object.assign({}, current);
    if (manifest) map[sheetId] = manifest; else delete map[sheetId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${CASE_ENTRY_SHEETS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`스프라이트 시트 매니페스트 저장 실패 (${res.status}): ${await res.text()}`);
    caseEntrySheetsCache.set('catalog', map);
    return map;
  }

  // caseMenu.js/game/explore의 렌더 경로는 전부 동기 함수라 위 async 조회를
  // 매 렌더마다 await할 수 없다 — 페이지 로드 시 한 번 프리페치해 동기
  // 조회용 캐시에 실어두고, 이후 재조회는 이 캐시에서 즉시 반환한다(§Phase
  // 2). 프리페치가 아직 안 끝났으면 빈 객체를 반환 — caseEntryModel.js가
  // 코드 내장 기본 카탈로그(CASE_ENTRY_META_DEFAULTS)와 합쳐 쓰므로 화면이
  // 비어 보이는 일은 없다.
  let caseEntryMetaSyncCache = null;
  async function prefetchCaseEntryMeta() {
    caseEntryMetaSyncCache = await getCaseEntryMeta().catch(() => ({}));
    return caseEntryMetaSyncCache;
  }
  function getCaseEntryMetaCached() { return caseEntryMetaSyncCache || {}; }

  async function getLocations() {
    if (locationsCache.has('catalog')) return locationsCache.get('catalog');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${LOCATIONS_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      locationsCache.set('catalog', map);
      return map;
    } catch (e) {
      return locationsCache.get('catalog') || {};
    }
  }

  async function setLocation(locationId, def) {
    if (!locationId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${LOCATIONS_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(locationsCache, 'catalog', url, {});
    const map = Object.assign({}, current);
    if (def) map[locationId] = def; else delete map[locationId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${LOCATIONS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`장소 저장 실패 (${res.status}): ${await res.text()}`);
    locationsCache.set('catalog', map);
    return map;
  }

  // 지도 핀 좌표 override — { [locationId]: { x, y } }, 같은 단일 JSON blob
  // 패턴. dev/data/locationDefs.js의 각 위치가 갖는 mapPosition은 정적 코드값
  // (그 위치가 지도에 핀을 찍을 "랜드마크급"인지 자체를 결정 — 코드 수정
  // 필요)이고, 이건 그 좌표를 실제 생성된 지도 그림을 보면서 미세 조정하기
  // 위한 override다. /dev/upload 탐색허브 탭의 지도 핀 편집기(renderMapPin
  // Editor)가 여기 쓰고, play/explore/index.html의 openMoveMapSheet가 여기
  // 값이 있으면 locationDefs.js의 mapPosition보다 우선해서 읽는다.
  const mapPinsCache = new Map(); // single entry keyed 'positions'
  const MAP_PINS_PATH = 'map-pins/positions.json';

  async function getMapPins() {
    if (mapPinsCache.has('positions')) return mapPinsCache.get('positions');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${MAP_PINS_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      mapPinsCache.set('positions', map);
      return map;
    } catch (e) {
      return mapPinsCache.get('positions') || {};
    }
  }

  async function setMapPin(locationId, pos) {
    if (!locationId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${MAP_PINS_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(mapPinsCache, 'positions', url, {});
    const map = Object.assign({}, current);
    if (pos) map[locationId] = pos; else delete map[locationId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${MAP_PINS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`지도 핀 저장 실패 (${res.status}): ${await res.text()}`);
    mapPinsCache.set('positions', map);
    return map;
  }

  // 씬 배경 슬롯(위 backgroundKinds()의 sceneId key, 예: 'week1-scene-002-1')
  // → { locationId, variantId } 배정. dialogueData.js는 정적 스크립트 파일이라
  // /dev/upload에서 직접 고쳐 쓸 수 없으므로, "이 슬롯이 어느 장소인지"는 코드가
  // 아니라 이 blob에 저장된다 — 장소 카탈로그 자체와 같은 이유(§확정된 결정
  // 사항: 코드 수정 없이 추가/수정). 미니게임/방탈출 배경 슬롯은 이번 변경
  // 범위 밖이라 여기 등록되지 않고, 기존 sceneId 직접 배정 방식을 그대로 쓴다
  // (DevGameState.getBackgroundId의 폴백 참고).
  const sceneLocationsCache = new Map(); // single entry keyed 'map'
  const SCENE_LOCATIONS_PATH = 'scene-locations/map.json';

  async function getSceneLocationMap() {
    if (sceneLocationsCache.has('map')) return sceneLocationsCache.get('map');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${SCENE_LOCATIONS_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      sceneLocationsCache.set('map', map);
      return map;
    } catch (e) {
      return sceneLocationsCache.get('map') || {};
    }
  }

  async function setSceneLocation(sceneKey, locationId, variantId) {
    if (!sceneKey) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${SCENE_LOCATIONS_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(sceneLocationsCache, 'map', url, {});
    const map = Object.assign({}, current);
    if (locationId) map[sceneKey] = { locationId, variantId: variantId || 'default' }; else delete map[sceneKey];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${SCENE_LOCATIONS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`장소 배정 저장 실패 (${res.status}): ${await res.text()}`);
    sceneLocationsCache.set('map', map);
    return map;
  }

  // 영우 테스트 answers — { [scenarioId]: { choiceId, note, answeredAt } }, one
  // JSON blob for the whole test (scenario bank lives in youngwooTestData.js,
  // this only stores the real answers picked on /dev/youngwoo-test). Same
  // single-blob-keyed-'answers' pattern as the sound catalog above — this
  // data isn't per-scene, there's just one test.
  const youngwooTestCache = new Map(); // single entry keyed 'answers'
  const YOUNGWOO_TEST_PATH = 'youngwoo-test/answers.json';

  async function getYoungwooTestAnswers() {
    if (youngwooTestCache.has('answers')) return youngwooTestCache.get('answers');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${YOUNGWOO_TEST_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      youngwooTestCache.set('answers', map);
      return map;
    } catch (e) {
      return youngwooTestCache.get('answers') || {};
    }
  }

  async function setYoungwooTestAnswer(scenarioId, answer) {
    if (!scenarioId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${YOUNGWOO_TEST_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(youngwooTestCache, 'answers', url, {});
    const map = Object.assign({}, current);
    if (answer) map[scenarioId] = answer; else delete map[scenarioId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${YOUNGWOO_TEST_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`답변 저장 실패 (${res.status}): ${await res.text()}`);
    youngwooTestCache.set('answers', map);
    return map;
  }

  // 증거 DB 탭(읽기 전용 감사 목록, dev/upload/index.html renderEvidencePanel)
  // 에 붙는 AI 생성 사진 — 증거 id 하나당 사진 하나, 장소/지도 핀과 같은
  // 단일 JSON blob 카탈로그 패턴({ [evidenceId]: { imageAssetId } }). 실제
  // 생성은 외부 AI 도구에서 하고(증거 DB 탭 우상단 공통 프롬프트 설정 참고)
  // 결과 사진만 여기 업로드해 배정한다.
  const evidencePhotosCache = new Map(); // single entry keyed 'catalog'
  const EVIDENCE_PHOTOS_PATH = 'evidence-photos/catalog.json';

  async function getEvidencePhotos() {
    if (evidencePhotosCache.has('catalog')) return evidencePhotosCache.get('catalog');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${EVIDENCE_PHOTOS_PATH}?t=${Date.now()}`;
    try {
      const map = (await fetchJsonBlob(url)) || {};
      evidencePhotosCache.set('catalog', map);
      return map;
    } catch (e) {
      return evidencePhotosCache.get('catalog') || {};
    }
  }

  async function setEvidencePhoto(evidenceId, imageAssetId) {
    if (!evidenceId) return {};
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${EVIDENCE_PHOTOS_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(evidencePhotosCache, 'catalog', url, {});
    const map = Object.assign({}, current);
    if (imageAssetId) map[evidenceId] = { imageAssetId }; else delete map[evidenceId];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${EVIDENCE_PHOTOS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`증거 사진 저장 실패 (${res.status}): ${await res.text()}`);
    evidencePhotosCache.set('catalog', map);
    return map;
  }

  // 증거 DB 탭 우상단 설정 — 개별 증거의 AI 프롬프트는 이 공통 프롬프트 +
  // 그 증거 자신의 제목/설명을 합쳐서 만든다(buildEvidencePrompt, dev/upload/
  // index.html). 위 카탈로그들과 달리 id로 나뉜 맵이 아니라 { commonPrompt }
  // 하나만 담는 단일 오브젝트라 늘 같은 키로 읽고 쓴다.
  const evidencePromptSettingsCache = new Map(); // single entry keyed 'settings'
  const EVIDENCE_PROMPT_SETTINGS_PATH = 'evidence-photos/prompt-settings.json';
  // 아직 아무도 저장한 적 없을 때(첫 사용)의 기본값 — 저장이 한 번이라도
  // 일어나면 그 이후로는 항상 저장된 값을 읽으므로 이 상수는 다시 쓰이지 않는다.
  const DEFAULT_EVIDENCE_COMMON_PROMPT = '수사 자료용 증거품 사진. 정면 또는 45도 각도에서 촬영한 클로즈업, 사실적인 사진(포토리얼리스틱) 스타일, 어둡고 중립적인 배경 위에 증거품만 선명하게 놓여 있음. 라벨·텍스트·워터마크·사람 손이나 신체 일부는 나오지 않음. 약간의 그레인이 있는 다큐멘터리/포렌식 사진 느낌.';

  async function getEvidencePromptSettings() {
    if (evidencePromptSettingsCache.has('settings')) return evidencePromptSettingsCache.get('settings');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${EVIDENCE_PROMPT_SETTINGS_PATH}?t=${Date.now()}`;
    try {
      const settings = (await fetchJsonBlob(url)) || { commonPrompt: DEFAULT_EVIDENCE_COMMON_PROMPT };
      evidencePromptSettingsCache.set('settings', settings);
      return settings;
    } catch (e) {
      return evidencePromptSettingsCache.get('settings') || { commonPrompt: DEFAULT_EVIDENCE_COMMON_PROMPT };
    }
  }

  async function setEvidencePromptSettings(commonPrompt) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${EVIDENCE_PROMPT_SETTINGS_PATH}?t=${Date.now()}`;
    const settings = { commonPrompt: commonPrompt || '' };
    const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${EVIDENCE_PROMPT_SETTINGS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`공통 프롬프트 저장 실패 (${res.status}): ${await res.text()}`);
    evidencePromptSettingsCache.set('settings', settings);
    return settings;
  }

  // 게임환경설정(/dev/settings/) — 지금은 탐색허브 이동 페이드(.move-fade의
  // 트랜지션 길이/이징 곡선, MOVE_FADE_MS 홀드 시간) 하나뿐이지만, 다른
  // 게임 전반 설정도 같은 자리에 필드만 늘려서 추가할 수 있게 flat한 단일
  // 오브젝트로 둔다 — getEvidencePromptSettings와 완전히 같은 패턴(id로
  // 나뉜 카탈로그가 아니라 항상 같은 키 하나만 읽고 쓴다).
  const gameSettingsCache = new Map(); // single entry keyed 'settings'
  const GAME_SETTINGS_PATH = 'game-settings/settings.json';
  // /dev/settings/에서 슬라이더로 맞춰본 뒤 최종 확정한 값 — 저장된 값이
  // 아직 없을 때(첫 사용)의 기본값이다.
  const DEFAULT_GAME_SETTINGS = {
    moveFade: { durationMs: 520, holdMs: 210, x1: 0.2, y1: 0.8, x2: 0.2, y2: 1 },
    // /dev/start/에서 고른 시작화면 배경 — 예전엔 localStorage(base64)에만
    // 있어서 그 화면을 설정한 기기에서만 보였다. 다른 필드처럼 이미지 자체는
    // AssetDB(Supabase Storage, type:'startScreenBg')에 올리고 여기엔 그
    // assetId·위치만 둔다(/play/index.html이 읽어서 이미지를 가져옴).
    startScreen: { bgAssetId: null, bgPos: { x: 50, y: 50 }, btnPos: { x: 50, y: 80, w: 46, h: 7 } },
  };

  async function getGameSettings() {
    if (gameSettingsCache.has('settings')) return gameSettingsCache.get('settings');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${GAME_SETTINGS_PATH}?t=${Date.now()}`;
    try {
      // Object.assign이 아니라 얕은 필드별 병합 — 예전에 저장된 blob은
      // startScreen 필드가 아예 없을 수 있으므로, 없으면 기본값으로 채워
      // 새로 추가된 필드를 쓰는 코드가 undefined를 만나지 않게 한다.
      const stored = await fetchJsonBlob(url);
      const settings = stored
        ? Object.assign({}, DEFAULT_GAME_SETTINGS, stored, {
            startScreen: Object.assign({}, DEFAULT_GAME_SETTINGS.startScreen, stored.startScreen),
          })
        : DEFAULT_GAME_SETTINGS;
      gameSettingsCache.set('settings', settings);
      return settings;
    } catch (e) {
      return gameSettingsCache.get('settings') || DEFAULT_GAME_SETTINGS;
    }
  }

  async function setGameSettings(settings) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${GAME_SETTINGS_PATH}`;
    const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`게임 설정 저장 실패 (${res.status}): ${await res.text()}`);
    gameSettingsCache.set('settings', settings);
    return settings;
  }

  // 낚시 미니게임 설정 — 캐스팅/올리기 모션 프레임과 낚시바 디자인(색상·
  // 캐치존 크기·물고기 아이콘)을 한 blob에 묶어 저장한다. 난이도·모션타입
  // (물고기 움직임 패턴)처럼 플레이마다 바뀌는 값은 여기 두지 않고 기존
  // 미니게임들의 관례대로 play 화면 쿼리스트링(?diff=&motion=)으로 넘긴다 —
  // 여기 저장하는 건 순수 아트/디자인 자산이라 map-pins/youngwoo-test와
  // 같은 단일 JSON blob 패턴을 그대로 쓴다.
  const fishingConfigCache = new Map(); // single entry keyed 'config'
  const FISHING_CONFIG_PATH = 'fishing-config/config.json';
  // 예전엔 캐스팅/올리기/이동(4방향)이 각자 다른 업로드 방식(개별 프레임
  // 배열이거나, 방향마다 따로 올리는 1행짜리 시트)을 썼다 — motionSheetAssetId/
  // motionFrameOverrides(아래)로 하나로 통일하면서 그 필드들은 없앴다.
  // 새 기능이라 실사용 데이터가 없어 기존 저장값을 마이그레이션하지 않고
  // 그냥 무시한다.
  //
  // fishSheetAssetId — 물고기 종류 아이콘 스프라이트시트(FISH_SHEET_LAYOUT
  // 규격: 196x136px, 10열x7행, 16x16px 칸, 4px 간격) 자산 id. 업로드되면
  // fishDefs.js의 각 물고기 slot 순서 그대로 아이콘이 배정된다.
  // fishIconOverrides — 물고기별 세밀영역조절 보정, { [fishId]: {cx,cy,size} }.
  // backgroundAssetId — 플레이 화면 전체 배경 그림 자산 id. 비어있으면
  // 기본 하늘/바다 그라데이션(dev/minigame-fishing/play/index.html의
  // .frame 기본 background)이 그대로 쓰인다.
  // castingFrameRodTips — 캐스팅 프레임별 낚싯대 끝 지점, { [frameIndex]:
  // {x,y} }(0~1, char-stage 박스 기준 정규화 좌표). 캐스팅 던지기 물리와
  // 현수선 낚싯줄 렌더링(play/index.html의 rodTipPxForFrame)이 이 값을
  // 쓴다 — 지정 안 한 프레임은 DEFAULT_ROD_TIP_FRAC으로 폴백.
  // reelFrameRodTips — 올리기 프레임별 낚싯대 끝 지점, castingFrameRodTips와
  // 같은 형식. 낚시 성공 후 물고기 딸려오기·잡아채기(낚시바) 홀드/릴리즈·
  // 캐스팅 취소 되감기 중 이 지점과 추/물고기 사이를 팽팽한 줄로 이어
  // 그린다(play/index.html의 reelTipPxForFrame/reelLineSlack) — 지정 안 한
  // 프레임은 DEFAULT_ROD_TIP_FRAC으로 폴백.
  // motionSheetAssetId — '모션' 탭에 올린 6행×6열 스프라이트시트 자산 id.
  // 캐스팅·올리기·이동(상/하/좌/우) 6가지 동작을 한 장에 담는다(행 순서
  // 고정: dev/data/fishDefs.js의 MOTION_CATEGORIES 참고). 업로드한 이미지의
  // 실제 크기를 6등분해서 칸 위치를 구하므로 해상도는 자유(사이즈 상관없음).
  // motionFrameOverrides — 카테고리별 세밀영역조절 보정,
  // { [category]: { [frameIndex]: {cx,cy,size} } }. 보정 없는 칸은
  // getMotionGridDefaultCropRect의 격자 위치를 그대로 쓴다.
  // motionRowOverrides — 카테고리(행) 전체의 세로 범위 보정,
  // { [category]: {top,height} }(시트 세로 기준 0~1 정규화). 업로드한
  // 시트가 정확히 6등분되지 않을 때, 그 행의 프레임 6개를 하나하나 옮기는
  // 대신 행 하나만 조정하면 아직 프레임별 보정이 없는 칸들의 기본 위치가
  // 전부 같이 맞춰진다. 카테고리가 없거나 비어 있으면 기존처럼 6등분
  // 위치를 그대로 쓴다.
  // castGaugeAssetId — 캐스팅 세기 게이지(화면을 꾹 눌러 세기 조절할 때
  // 뜨는 바) 배경 그림 자산 id. castGaugeFillRegion({x,y,w,h}, 이 그림의
  // 원본 자연 크기 대비 0~1)이 그림 위 어디가 채워지는 부분인지 지정한다 —
  // 둘 다 비어있으면 기본 막대 게이지(cast-power-track/-fill)가 쓰인다.
  // walkMotion — 자유 이동의 속도 설정, { stepMs, animFrameMs }. 격자에
  // 스냅되지 않는 연속 이동이라 stepMs는 "타일 한 칸(MOVE_STEP_PX/
  // MOVE_TILE_SIZE) 크기를 이동하는 데 걸리는 시간"으로 해석해 px/ms
  // 속도로 환산한다. animFrameMs는 걷기 프레임이 다음 프레임으로 넘어가는
  // 데 걸리는 시간(다리 움직이는 체감 속도)으로, 이동 속도와 독립적이다.
  // castPhysics — 추 던지기 자유낙하 물리 튜닝, { gravityMps2, vxScale }.
  // gravityMps2는 자유낙하 가속도(클수록 빨리 떨어져 체공 시간 T가 짧아짐,
  // play/index.html의 throwSinker 참고) — 표준중력 9.8이 기본값. vxScale은
  // 세기(게이지)로 정해지는 기본 수평거리(dx)에 곱하는 배율로, 1이면 원래
  // 세기~거리 관계 그대로다.
  // itemPopup — 낚시 성공 시(물고기가 추에서 캐릭터로 날아온 다음) 뜨는
  // 낚시 팝업의 디자인. backgroundAssetId(팝업 액자 그림) + iconPos(그
  // 그림 위 어디에 아이템 아이콘이 놓일지, 0~1 정규화 좌표) + iconSizePx.
  // itemWindowBackgroundAssetId — 아이템창(이번 판에서 잡은 물고기 목록을
  // 보여주고 파는 창, play/index.html의 물고기 팔기 기능 그대로 재사용 —
  // 영우 NPC 메뉴 → "물고기 팔기"에서 연다) 카드의 배경(액자) 그림. 비어있으면
  // 기존 어두운 단색 카드(.sell-fish-card 기본 배경)가 그대로 쓰인다.
  // heldFishPos — 낚시 성공 후 캐릭터가 물고기를 들고 있는 포즈일 때, 잡은
  // 물고기 아이콘이 캐릭터 기준(char-stage 박스, 0~1 정규화 좌표) 어디에
  // 놓일지. "모션" 탭 올리기 카테고리의 마지막 프레임 위로 점을 찍어
  // 지정한다(rodtip-marker와 같은 단일 포인트 피커). null이면
  // play/index.html의 기본값(DEFAULT_HELD_FISH_POS)으로 폴백한다.
  // characterIdleSheets — 지수(플레이어)/영우(NPC)가 멈춰 서 있을 때의
  // 방향별(위/아래/왼쪽/오른쪽) idle 포즈, 2열×2행 시트 한 장씩(fishDefs.js의
  // IDLE_GRID_DIRS/buildIdleFrameDataUrls 참고). jisu가 비어있으면 캐스팅
  // 1번 프레임을 그대로 재사용하던 예전 idle 동작으로 폴백한다(play/index.html).
  // youngwoo는 NPC용이라 항상 down(정면) 프레임만 쓴다.
  // motionPlaybackMs — 이동(위/아래/왼쪽/오른쪽) 각 방향별 걷기 프레임 전환
  // 속도(ms), { up, down, left, right }. walkMotion.animFrameMs(전체 방향
  // 공통 기본값)를 방향별로 재정의한다 — 값이 없는 방향은 여전히
  // walkMotion.animFrameMs를 쓴다.
  // motionFrameImageOverrides — 이동 방향별로 특정 프레임을 모션 시트
  // 크롭 대신 개별 업로드한 사진(배경 자동 제거)으로 대체, { [dir]:
  // { [frameIndex]: assetId } }. 값이 있는 칸은 motionFrameOverrides(크롭
  // 좌표 보정)보다 우선한다.
  //
  // ===== 화면(screens) — 배경화면 여러 장을 서로 이동 가능한 "화면"들로
  // 두는 단위(§신규, 영역지정/화면 전환). 각 screen:
  // { id, name, backgroundAssetId, fishableAreas, blockedAreas,
  // interactionAreas, moveAreas, youngwooNpcPos }. fishableAreas/
  // blockedAreas/interactionAreas/moveAreas는 그 화면의 배경화면
  // (backgroundAssetId) 위에 그리는 다각형 영역들, 각각
  // [{ id, points: [{x,y}, ...] }] (points는 배경 이미지 원본 크기 기준
  // 0~1 정규화 좌표, "영역 설정" 탭의 폴리곤 에디터가 채운다).
  // fishableAreas는 캐스팅해서 낚시할 수 있는 영역, blockedAreas는
  // 캐릭터가 걸어 들어갈 수 없는 영역, interactionAreas는 상점·대화 등
  // 게임에 필요한 상호작용 지점(각 항목에 label 필드로 어떤 상호작용인지
  // 적어둔다), moveAreas는 캐릭터가 걸어 들어가면 다른 화면으로 이동하는
  // 영역(각 항목에 targetScreenId + entryPoint({x,y}, 도착 화면 배경
  // 원본 크기 기준 0~1 정규화 좌표)로 어느 화면 어디에서 다시 나타날지
  // 지정) — 넷 다 화면마다 여러 개를 둘 수 있다. youngwooNpcPos — 영우
  // NPC가 이 화면에 서 있는 위치, 배경화면 원본 크기 기준 0~1 정규화
  // 좌표("영역 설정" 탭 다각형 점과 같은 좌표계). null이면 이 화면엔
  // 영우가 나타나지 않는다.
  // startScreenId — play/index.html이 처음 로드될 때 캐릭터가 서 있을
  // 화면의 id. screens가 비어있으면(아직 화면을 하나도 안 만들었으면)
  // 배경 없는 예전 기본 하늘/바다 그라데이션으로 폴백한다
  // (play/index.html의 hasWorldBackground).
  //
  // 화면 개념이 생기기 전엔 backgroundAssetId/fishableAreas/blockedAreas/
  // interactionAreas/youngwooNpcPos가 최상위 필드였다 — 아래
  // getFishingConfig가 읽을 때 screens가 비어있고 이 레거시 필드 중
  // backgroundAssetId가 남아있으면 화면 하나('screen-1')로 자동
  // 변환한다. 최상위 필드 자체는 이제 FISHING_CONFIG_DEFAULT에 없지만,
  // 예전에 저장된 JSON blob엔 여전히 남아있을 수 있어 병합 시 그대로
  // 딸려온다.
  const FISHING_CONFIG_DEFAULT = { barDesign: {}, fishSheetAssetId: null, fishIconOverrides: {}, motionSheetAssetId: null, motionFrameOverrides: { cast: {}, reel: {}, up: {}, down: {}, left: {}, right: {} }, motionRowOverrides: {}, motionFrameImageOverrides: { up: {}, down: {}, left: {}, right: {} }, motionPlaybackMs: { up: 90, down: 90, left: 90, right: 90 }, castingFrameDurations: [], castingFrameRodTips: {}, reelFrameRodTips: {}, walkMotion: { stepMs: 200, animFrameMs: 90 }, castPhysics: { gravityMps2: 9.8, vxScale: 1 }, itemPopup: { backgroundAssetId: null, iconPos: null, iconSizePx: 64 }, itemWindowBackgroundAssetId: null, castGaugeAssetId: null, castGaugeFillRegion: null, screens: [], startScreenId: null, dialogueScene: { boxLayer: null, jisooLayer: null, youngwooLayer: null }, heldFishPos: null, characterIdleSheets: { jisu: { assetId: null, overrides: {} }, youngwoo: { assetId: null, overrides: {} } }, statusWindow: { frameAssetId: null, arrowAssetId: null, numberFontAssetIds: {}, numberFontAdjust: { width: 16, height: 22, gap: 2 }, datePos: null, timePos: null, pointsPos: null, arrowPivot: null } };

  function migrateLegacyFishingScreen(cfg) {
    if ((cfg.screens && cfg.screens.length) || !cfg.backgroundAssetId) return cfg;
    const screen = {
      id: 'screen-1', name: '화면 1', backgroundAssetId: cfg.backgroundAssetId,
      fishableAreas: cfg.fishableAreas || [], blockedAreas: cfg.blockedAreas || [],
      interactionAreas: cfg.interactionAreas || [], moveAreas: [],
      youngwooNpcPos: cfg.youngwooNpcPos || null,
    };
    return Object.assign({}, cfg, { screens: [screen], startScreenId: 'screen-1' });
  }

  async function getFishingConfig() {
    if (fishingConfigCache.has('config')) return fishingConfigCache.get('config');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${FISHING_CONFIG_PATH}?t=${Date.now()}`;
    try {
      const cfg = migrateLegacyFishingScreen(Object.assign({}, FISHING_CONFIG_DEFAULT, (await fetchJsonBlob(url)) || {}));
      fishingConfigCache.set('config', cfg);
      return cfg;
    } catch (e) {
      return fishingConfigCache.get('config') || FISHING_CONFIG_DEFAULT;
    }
  }

  async function setFishingConfig(patch) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${FISHING_CONFIG_PATH}?t=${Date.now()}`;
    const current = migrateLegacyFishingScreen(await readCurrentForWrite(fishingConfigCache, 'config', url, FISHING_CONFIG_DEFAULT));
    const cfg = Object.assign({}, FISHING_CONFIG_DEFAULT, current, patch);
    const blob = new Blob([JSON.stringify(cfg)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${FISHING_CONFIG_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`낚시 설정 저장 실패 (${res.status}): ${await res.text()}`);
    fishingConfigCache.set('config', cfg);
    return cfg;
  }

  // 증거수첩 — 책갈피(증인/증거/사진)별 배경 이미지 최대 3장과, 그 위 어느
  // 네모 영역에 어떤 증거 데이터 필드(코드/제목/사진/설명/발견 위치)가
  // 배치될지의 좌표를 담는다. 배경 원본(디자이너가 준 3장)이 이미 탭 바
  // 자체를 그림으로 그려 넣은 상태라(책갈피마다 활성 탭 색만 다른 완성된
  // 페이지 아트), UI가 별도로 탭 텍스트/아이콘을 그리면 이미지 위에 또
  // 겹쳐 그려진다 — 그래서 이미지가 배정된 책갈피는 그림 자체가 탭 역할을
  // 하고 코드 쪽 탭은 투명 히트존으로만 남는다(evidenceNotebook.js 참고).
  // regions는 세 배경이 레이아웃이 동일하다는 전제로 공유(디자이너 확인,
  // 탭 색만 다름) — 참고 이미지 하나를 기준으로 한 번만 지정하면 셋 다에
  // 적용된다. imageAssetId(단수)는 이 3분할 이전에 저장된 이전 데이터용
  // 레거시 필드 — 아직 특정 책갈피 이미지가 없는 섹션의 폴백으로 쓰인다.
  // 좌표는 실제 화면 크기와 무관하게 재사용되도록 이미지의 원본 픽셀
  // 크기 대비 0~1 비율(x,y,w,h)로 저장 — getFishingConfig/setFishingConfig와
  // 완전히 같은 단일 JSON blob + patch 병합 패턴.
  const evidenceNotebookConfigCache = new Map(); // single entry keyed 'config'
  const EVIDENCE_NOTEBOOK_CONFIG_PATH = 'evidence-notebook/config.json';
  const EVIDENCE_NOTEBOOK_CONFIG_DEFAULT = { imageAssetId: null, imageAssetIds: { witness: null, evidence: null, photo: null }, regions: {} };

  async function getEvidenceNotebookConfig() {
    if (evidenceNotebookConfigCache.has('config')) return evidenceNotebookConfigCache.get('config');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${EVIDENCE_NOTEBOOK_CONFIG_PATH}?t=${Date.now()}`;
    try {
      const cfg = Object.assign({}, EVIDENCE_NOTEBOOK_CONFIG_DEFAULT, (await fetchJsonBlob(url)) || {});
      evidenceNotebookConfigCache.set('config', cfg);
      return cfg;
    } catch (e) {
      return evidenceNotebookConfigCache.get('config') || EVIDENCE_NOTEBOOK_CONFIG_DEFAULT;
    }
  }

  async function setEvidenceNotebookConfig(patch) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${EVIDENCE_NOTEBOOK_CONFIG_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(evidenceNotebookConfigCache, 'config', url, EVIDENCE_NOTEBOOK_CONFIG_DEFAULT);
    const cfg = Object.assign({}, EVIDENCE_NOTEBOOK_CONFIG_DEFAULT, current, patch);
    const blob = new Blob([JSON.stringify(cfg)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${EVIDENCE_NOTEBOOK_CONFIG_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`증거수첩 설정 저장 실패 (${res.status}): ${await res.text()}`);
    evidenceNotebookConfigCache.set('config', cfg);
    return cfg;
  }

  // 진행 저장 슬롯 (§16 "저장/불러오기 연동") — caseFileState.js가 만드는 슬롯
  // 번들(caseState + economy/shop/wardrobe/exploration/relationship 스냅샷)
  // 전체를 다른 카탈로그들과 같은 단일 JSON blob 패턴으로 보관한다. 예전엔
  // localStorage(mkInvestigationSaveSlots_v1)에만 있어서 저장한 기기를 잃거나
  // 브라우저 저장공간이 정리되면 진행 상황이 통째로 사라졌다 — 다른 기기/
  // 재설치 후에도 이어할 수 있도록 서버에도 올려둔다. localStorage는 오프라인
  // 폴백/즉시 표시용 캐시로 계속 같이 쓴다(caseFileState.js 참고).
  const saveSlotsCache = new Map(); // single entry keyed 'slots'
  const SAVE_SLOTS_PATH = 'player-save/slots.json';

  async function getSaveSlots() {
    if (saveSlotsCache.has('slots')) return saveSlotsCache.get('slots');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${SAVE_SLOTS_PATH}?t=${Date.now()}`;
    const map = (await fetchJsonBlob(url)) || {};
    saveSlotsCache.set('slots', map);
    return map;
  }

  async function setSaveSlot(slotNum, slotData) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${SAVE_SLOTS_PATH}?t=${Date.now()}`;
    const current = await readCurrentForWrite(saveSlotsCache, 'slots', url, {});
    const map = Object.assign({}, current);
    if (slotData) map[slotNum] = slotData; else delete map[slotNum];
    const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${SAVE_SLOTS_PATH}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`저장 슬롯 업로드 실패 (${res.status}): ${await res.text()}`);
    saveSlotsCache.set('slots', map);
    return map;
  }

  // 플레이어 환경설정 (텍스트 속도/효과음/BGM/진동 — caseState.settings) —
  // 위 저장 슬롯과 별개로 늘 즉시 반영돼야 하는 값이라 슬롯 저장(명시적
  // "저장하기" 액션) 타이밍과 무관하게 바뀔 때마다 바로 올린다. 같은 단일
  // JSON blob 패턴.
  const playerSettingsCache = new Map(); // single entry keyed 'settings'
  const PLAYER_SETTINGS_PATH = 'player-save/settings.json';

  async function getPlayerSettings() {
    if (playerSettingsCache.has('settings')) return playerSettingsCache.get('settings');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${PLAYER_SETTINGS_PATH}?t=${Date.now()}`;
    const settings = (await fetchJsonBlob(url)) || null;
    if (settings) playerSettingsCache.set('settings', settings);
    return settings;
  }

  async function setPlayerSettings(settings) {
    const url = `${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${PLAYER_SETTINGS_PATH}`;
    const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`환경설정 업로드 실패 (${res.status}): ${await res.text()}`);
    playerSettingsCache.set('settings', settings);
    return settings;
  }

  // 개발계획 메모 (/dev/plan/, devPlanFab.js 플로팅 버튼 공용) — 예전엔
  // "이 기기에만 저장되는 메모"였다(localStorage의 devPlanNotes 키). 다른
  // 기기에서도 같은 메모를 보고/이어 쓸 수 있도록 서버에도 올린다.
  const devPlanNotesCache = new Map(); // single entry keyed 'text'
  const DEV_PLAN_NOTES_PATH = 'dev-plan/notes.json';

  async function getDevPlanNotes() {
    if (devPlanNotesCache.has('text')) return devPlanNotesCache.get('text');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${DEV_PLAN_NOTES_PATH}?t=${Date.now()}`;
    const data = await fetchJsonBlob(url);
    const text = (data && typeof data.text === 'string') ? data.text : null;
    if (text !== null) devPlanNotesCache.set('text', text);
    return text;
  }

  async function setDevPlanNotes(text) {
    const url = `${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${DEV_PLAN_NOTES_PATH}`;
    const blob = new Blob([JSON.stringify({ text, updatedAt: Date.now() })], { type: 'application/json' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`개발계획 메모 업로드 실패 (${res.status}): ${await res.text()}`);
    devPlanNotesCache.set('text', text);
    return text;
  }

  // 낚시 미니게임 배치 편집(§레이아웃 편집, play/minigame-fishing/index.html의
  // layoutPrefs — 조이스틱/낚시버튼/캐릭터/캐스팅UI/낚시바/낚시팝업 크기·위치)
  // — 예전엔 localStorage에만 있어서 편집한 기기에서만 그 배치로 보였다.
  // dev/start/index.html의 시작화면 배치와 같은 이유로 서버에도 올린다.
  // 이 화면도 개발자 한 명만 만지므로(플레이 중에는 아무도 이 값을 쓰지
  // 않는다) 저장 슬롯처럼 최신값 비교 없이 "서버 값이 항상 최신"으로 다룬다.
  const fishingLayoutPrefsCache = new Map(); // single entry keyed 'prefs'
  const FISHING_LAYOUT_PREFS_PATH = 'fishing-config/layout-prefs.json';

  async function getFishingLayoutPrefs() {
    if (fishingLayoutPrefsCache.has('prefs')) return fishingLayoutPrefsCache.get('prefs');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${FISHING_LAYOUT_PREFS_PATH}?t=${Date.now()}`;
    const prefs = await fetchJsonBlob(url);
    if (prefs) fishingLayoutPrefsCache.set('prefs', prefs);
    return prefs;
  }

  async function setFishingLayoutPrefs(prefs) {
    const url = `${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${FISHING_LAYOUT_PREFS_PATH}`;
    const blob = new Blob([JSON.stringify(prefs)], { type: 'application/json' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`낚시 배치 설정 업로드 실패 (${res.status}): ${await res.text()}`);
    fishingLayoutPrefsCache.set('prefs', prefs);
    return prefs;
  }

  // 변신 마법 미니게임 도감(collection) — 결과 조합별로 지금까지 나온 최고
  // 등급을 기록해 다음에도 참고할 수 있게 하는 플레이어 진행 기록. 예전엔
  // localStorage에만 있어서 기기를 바꾸면 그동안 모은 도감이 다 사라졌다 —
  // 이 게임엔 계정 개념이 없고 플레이어가 사실상 한 팀이라, 저장 슬롯 같은
  // 기기별 최신값 비교 없이 늘 바로바로 서버에 병합해 올린다(환경설정과
  // 같은 관례).
  const transformCollectionCache = new Map(); // single entry keyed 'collection'
  const TRANSFORM_COLLECTION_PATH = 'transform-config/collection.json';

  async function getTransformCollection() {
    if (transformCollectionCache.has('collection')) return transformCollectionCache.get('collection');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${TRANSFORM_COLLECTION_PATH}?t=${Date.now()}`;
    const collection = (await fetchJsonBlob(url)) || {};
    transformCollectionCache.set('collection', collection);
    return collection;
  }

  async function setTransformCollection(collection) {
    const url = `${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${TRANSFORM_COLLECTION_PATH}`;
    const blob = new Blob([JSON.stringify(collection)], { type: 'application/json' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`변신 마법 도감 업로드 실패 (${res.status}): ${await res.text()}`);
    transformCollectionCache.set('collection', collection);
    return collection;
  }

  // 수박 게임 미니게임 — 최고 기록(best)과 과일 사진(설정 화면에서 tier별로
  // 올리는 사진, 예전엔 base64로 통째로 localStorage에 박혀 있어 기기 간
  // 공유가 안 됐다). 사진 자체는 다른 이미지들처럼 addAsset으로 Storage에
  // 올리고, 여기엔 tier(0~10) -> assetId 매핑만 담는다.
  const watermelonBestCache = new Map(); // single entry keyed 'best'
  const WATERMELON_BEST_PATH = 'watermelon-config/best.json';

  async function getWatermelonBest() {
    if (watermelonBestCache.has('best')) return watermelonBestCache.get('best');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${WATERMELON_BEST_PATH}?t=${Date.now()}`;
    const data = await fetchJsonBlob(url);
    const best = (data && typeof data.best === 'number') ? data.best : 0;
    watermelonBestCache.set('best', best);
    return best;
  }

  async function setWatermelonBest(best) {
    const url = `${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${WATERMELON_BEST_PATH}`;
    const blob = new Blob([JSON.stringify({ best })], { type: 'application/json' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`수박 게임 최고기록 업로드 실패 (${res.status}): ${await res.text()}`);
    watermelonBestCache.set('best', best);
    return best;
  }

  const watermelonFruitImagesCache = new Map(); // single entry keyed 'images', { [tierIdx]: assetId }
  const WATERMELON_FRUIT_IMAGES_PATH = 'watermelon-config/fruit-images.json';

  async function getWatermelonFruitImages() {
    if (watermelonFruitImagesCache.has('images')) return watermelonFruitImagesCache.get('images');
    const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${WATERMELON_FRUIT_IMAGES_PATH}?t=${Date.now()}`;
    const images = (await fetchJsonBlob(url)) || {};
    watermelonFruitImagesCache.set('images', images);
    return images;
  }

  async function setWatermelonFruitImages(images) {
    const url = `${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${WATERMELON_FRUIT_IMAGES_PATH}`;
    const blob = new Blob([JSON.stringify(images)], { type: 'application/json' });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`수박 게임 과일 사진 설정 업로드 실패 (${res.status}): ${await res.text()}`);
    watermelonFruitImagesCache.set('images', images);
    return images;
  }

  // ===== /play PWA 아이콘 =====
  // dev/upload/app-icon/에서 이미지를 올리면 /play/manifest.json의 icons와
  // 각 /play/*/index.html의 apple-touch-icon이 실제로 가리키는 고정 경로를
  // 덮어쓴다 — icons/*.png처럼 git에 커밋된 파일이 아니라 Storage의 고정
  // 경로 자체가 "정식 아이콘"이라, 여기서 다시 올리기만 하면 배포 없이도
  // (브라우저가 다음에 manifest/아이콘을 재확인할 때) 설치된 PWA 아이콘이
  // 바뀐다. 카탈로그 JSON 한 덩어리가 아니라 크기별 PNG 파일 자체가 고정
  // 경로 오브젝트라, 다른 고정-경로 항목들(GAME_SETTINGS_PATH 등)과 같은
  // x-upsert 패턴으로 덮어쓴다.
  const PLAY_ICON_PATHS = {
    icon192: 'app-icon/play-icon-192.png',
    icon512: 'app-icon/play-icon-512.png',
    maskable512: 'app-icon/play-icon-maskable-512.png',
    appleTouch: 'app-icon/play-apple-touch-icon.png',
  };

  function playIconUrl(key, bust) {
    const base = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${PLAY_ICON_PATHS[key]}`;
    return bust ? `${base}?t=${Date.now()}` : base;
  }

  // manifest.json/apple-touch-icon이 실제로 박아두는, 캐시버스팅 없는 고정
  // URL — 언제 마지막으로 올렸는지와 무관하게 항상 같은 값이라 정적 파일에
  // 한 번만 적어두면 된다. 업로드 도구 쪽 미리보기는 이 함수 대신
  // playIconUrl(key, true)로 매번 최신 파일을 강제로 다시 받는다.
  function getPlayIconUrls() {
    return {
      icon192: playIconUrl('icon192'),
      icon512: playIconUrl('icon512'),
      maskable512: playIconUrl('maskable512'),
      appleTouch: playIconUrl('appleTouch'),
    };
  }
  function getPlayIconPreviewUrls() {
    return {
      icon192: playIconUrl('icon192', true),
      icon512: playIconUrl('icon512', true),
      maskable512: playIconUrl('maskable512', true),
      appleTouch: playIconUrl('appleTouch', true),
    };
  }

  async function uploadPlayIconFile(key, blob) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${PLAY_ICON_PATHS[key]}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'image/png',
        'x-upsert': 'true',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`아이콘 업로드 실패 (${key}, ${res.status}): ${await res.text()}`);
  }

  // blobs: { icon192, icon512, maskable512, appleTouch } (전부 PNG Blob) —
  // 한 원본 이미지에서 한 번에 만들어지는 값들이라 부분 갱신 없이 항상 넷
  // 다 함께 올린다.
  async function savePlayIcon(blobs) {
    await Promise.all(Object.keys(PLAY_ICON_PATHS).map(key => {
      const blob = blobs[key];
      if (!blob) throw new Error(`아이콘 저장 실패: ${key} 이미지가 없습니다`);
      return uploadPlayIconFile(key, blob);
    }));
    return getPlayIconUrls();
  }

  return {
    addAsset, getAssetsByType, getAsset, getAssetsByIds, deleteAsset, preloadImage,
    getSaveSlots, setSaveSlot,
    getPlayerSettings, setPlayerSettings,
    getDevPlanNotes, setDevPlanNotes,
    getFishingLayoutPrefs, setFishingLayoutPrefs,
    getTransformCollection, setTransformCollection,
    getWatermelonBest, setWatermelonBest,
    getWatermelonFruitImages, setWatermelonFruitImages,
    getRoomHotspots, setRoomHotspot,
    getMinigameHotspot, setMinigameHotspot,
    getItems, setItem, getRecipes, setRecipes,
    getDialogueOverrides, setDialogueOverrides, primeDialogueOverrides,
    getSounds, setSound, deleteSound, primeSounds,
    getYoungwooTestAnswers, setYoungwooTestAnswer,
    getLocations, setLocation,
    getSceneLocationMap, setSceneLocation, primeSceneLocationMap,
    getMapPins, setMapPin,
    getCaseEntryMeta, setCaseEntryMeta, prefetchCaseEntryMeta, getCaseEntryMetaCached,
    getSpriteSheetManifests, getSpriteSheetManifest, setSpriteSheetManifest,
    getEvidencePhotos, setEvidencePhoto,
    getEvidencePromptSettings, setEvidencePromptSettings,
    getGameSettings, setGameSettings, DEFAULT_GAME_SETTINGS,
    getFishingConfig, setFishingConfig,
    getEvidenceNotebookConfig, setEvidenceNotebookConfig,
    getPlayIconUrls, getPlayIconPreviewUrls, savePlayIcon,
  };
})();

const DevGameState = {
  _keys: {
    background: 'mkDevSelectedBackgrounds', characters: 'mkDevSelectedCharacters',
    transforms: 'mkDevCharacterTransforms', sceneBgm: 'mkDevSceneBgm',
    outfits: 'mkDevSelectedOutfits', locationBackgrounds: 'mkDevLocationBackgrounds',
  },

  // Legacy scene-owned background slot map (sceneId -> assetId) — minigame
  // and room-search backgrounds stay on this exactly as before
  // (location-background-system §applies-to: "미니게임 배경은 이번 변경
  // 대상 아님"). An ordinary VN scene slot also lands here until it's been
  // assigned a location via /dev/upload's 배경 DB tab, so nothing goes blank
  // mid-migration.
  _loadBackgroundMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.background)) || {}; }
    catch (e) { return {}; }
  },
  getLegacyBackgroundId(sceneId) {
    if (!sceneId) return null;
    return this._loadBackgroundMap()[sceneId] || null;
  },
  setLegacyBackgroundId(sceneId, assetId) {
    if (!sceneId) return;
    const map = this._loadBackgroundMap();
    if (assetId) map[sceneId] = assetId; else delete map[sceneId];
    localStorage.setItem(this._keys.background, JSON.stringify(map));
  },

  // New location-owned assignment map (`${locationId}::${variantId}` ->
  // assetId) — every ordinary VN scene slot that's been pointed at a
  // catalog location (AssetDB.getSceneLocationMap/setSceneLocation) resolves
  // its photo through here instead, so scenes sharing one physical location
  // share one upload.
  _loadLocationBackgroundMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.locationBackgrounds)) || {}; }
    catch (e) { return {}; }
  },
  _locationSlotKey(locationId, variantId) { return `${locationId}::${variantId || 'default'}`; },
  getLocationAssetId(locationId, variantId) {
    if (!locationId) return null;
    return this._loadLocationBackgroundMap()[this._locationSlotKey(locationId, variantId)] || null;
  },
  setLocationAssetId(locationId, variantId, assetId) {
    if (!locationId) return;
    const map = this._loadLocationBackgroundMap();
    const key = this._locationSlotKey(locationId, variantId);
    if (assetId) map[key] = assetId; else delete map[key];
    localStorage.setItem(this._keys.locationBackgrounds, JSON.stringify(map));
  },

  // Which location (+variant) a scene background slot (backgroundKinds()'s
  // sceneId key) has been pointed at — see AssetDB.getSceneLocationMap for
  // why this lives in Storage rather than as a literal field in
  // dialogueData.js. Returns null for a slot that's never been assigned
  // (fresh migration state, or a minigame/room-search slot that
  // intentionally never gets one).
  async resolveSlotLocation(sceneId) {
    if (!sceneId) return null;
    const map = await AssetDB.getSceneLocationMap();
    return map[sceneId] || null;
  },
  assignSlotLocation(sceneId, locationId, variantId) {
    return AssetDB.setSceneLocation(sceneId, locationId, variantId);
  },

  // 2-stage resolution (location-background-system §5): sceneId -> the
  // location it's been assigned -> the photo assigned to that location. A
  // slot with no location assignment (minigame/room-search, or an
  // unmigrated ordinary scene) falls back to the legacy direct sceneId
  // lookup, so nothing regresses before a dev has re-assigned it.
  async getBackgroundId(sceneId) {
    if (!sceneId) return null;
    const locRef = await this.resolveSlotLocation(sceneId);
    if (locRef && locRef.locationId) return this.getLocationAssetId(locRef.locationId, locRef.variantId);
    return this.getLegacyBackgroundId(sceneId);
  },
  // Mirrors getBackgroundId's resolution: if the slot already points at a
  // location, the asset is assigned to that location (so every other scene
  // sharing it updates too); otherwise it falls back to the legacy
  // direct-per-scene assignment.
  async setBackgroundId(sceneId, assetId) {
    if (!sceneId) return;
    const locRef = await this.resolveSlotLocation(sceneId);
    if (locRef && locRef.locationId) {
      this.setLocationAssetId(locRef.locationId, locRef.variantId, assetId);
      return;
    }
    this.setLegacyBackgroundId(sceneId, assetId);
  },
  removeAllBackgroundAssetRefs(assetId) {
    const map = this._loadBackgroundMap();
    let changed = false;
    Object.keys(map).forEach(sceneId => { if (map[sceneId] === assetId) { delete map[sceneId]; changed = true; } });
    if (changed) localStorage.setItem(this._keys.background, JSON.stringify(map));

    const locMap = this._loadLocationBackgroundMap();
    let locChanged = false;
    Object.keys(locMap).forEach(key => { if (locMap[key] === assetId) { delete locMap[key]; locChanged = true; } });
    if (locChanged) localStorage.setItem(this._keys.locationBackgrounds, JSON.stringify(locMap));
  },

  // Which AssetDB sound-catalog entry (a 'bgm'-kind one) plays as a scene's
  // background music — same one-slot-per-scene, localStorage-backed pattern
  // as the background map above. /play/game reads this on scene load; the
  // catalog entry itself (videoId/start/end) lives in AssetDB.getSounds().
  _loadSceneBgmMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.sceneBgm)) || {}; }
    catch (e) { return {}; }
  },
  getSceneBgmId(sceneId) {
    if (!sceneId) return null;
    return this._loadSceneBgmMap()[sceneId] || null;
  },
  setSceneBgmId(sceneId, soundId) {
    if (!sceneId) return;
    const map = this._loadSceneBgmMap();
    if (soundId) map[sceneId] = soundId; else delete map[sceneId];
    localStorage.setItem(this._keys.sceneBgm, JSON.stringify(map));
  },
  removeAllSceneBgmRefs(soundId) {
    const map = this._loadSceneBgmMap();
    let changed = false;
    Object.keys(map).forEach(sceneId => { if (map[sceneId] === soundId) { delete map[sceneId]; changed = true; } });
    if (changed) localStorage.setItem(this._keys.sceneBgm, JSON.stringify(map));
  },

  // Minigame answer-area hotspot = { points: [{x,y}, ...] } — a free-form
  // polygon (traced corner-by-corner in /dev/upload, 3+ vertices) as
  // fractions of the background image's natural width/height, so it stays
  // correct regardless of the uploaded image's actual pixel size. Consumers
  // should tolerate an older saved { x1, y1, x2, y2 } rectangle too (see
  // hotspotToPoints in /dev/upload and the equivalent in each minigame).
  // stageIndex selects which stop's hotspot to read/write for minigames with
  // multiple sequential targets sharing one map image (e.g. the 3-stop
  // station-finder: 0 = 공항, 1 = 이스트우드, 2 = 마라용). Backed by Supabase
  // (AssetDB), not localStorage — same reasoning as the room-hotspot
  // comment below. Both methods are now async; callers must await them.
  getMinigameHotspot(sceneId, stageIndex) { return AssetDB.getMinigameHotspot(sceneId, stageIndex); },
  setMinigameHotspot(sceneId, stageIndex, hotspot) { return AssetDB.setMinigameHotspot(sceneId, stageIndex, hotspot); },

  // Room-search minigame variant of the hotspot above — a single background
  // image (one per area, e.g. 'week1-scene-002-2-kitchen') can hold several
  // independently-marked, named tap targets instead of just one, since a
  // room photo has multiple things to investigate.
  // { [hotspotId]: {points:[{x,y},...]} } (or an older {x1,y1,x2,y2}
  // rectangle). Backed by Supabase (AssetDB), not localStorage — see the
  // comment above AssetDB's roomHotspotsCache. Both methods are now async;
  // callers must await them.
  getRoomHotspots(sceneId) { return AssetDB.getRoomHotspots(sceneId); },
  setRoomHotspot(sceneId, hotspotId, hotspot) { return AssetDB.setRoomHotspot(sceneId, hotspotId, hotspot); },

  _loadCharacterMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.characters)) || {}; }
    catch (e) { return {}; }
  },
  // Storage key for a (character, outfit, expression) portrait slot. `outfit`
  // is null for every character without outfit versions, which reproduces
  // the original `${characterKey}::${expression}` key exactly (no migration
  // needed for anything uploaded before outfits existed).
  _assetKey(characterKey, outfit, expression) {
    return outfit ? `${characterKey}::${outfit}::${expression || 'neutral'}` : `${characterKey}::${expression || 'neutral'}`;
  },
  // characterKey is a dialogue character id (e.g. 'jisoo' / 'youngwoo'); each
  // (characterKey, [outfit,] expression) pair gets its own uploaded asset,
  // driven by the `expression` field on the active dialogue line and (for
  // characters with outfit versions — see dialogueCharacters' `outfits`)
  // whichever outfit is currently selected via getSelectedOutfit. Falls back
  // first to that outfit's 'neutral' portrait, then to the no-outfit/legacy
  // slot, so a scene doesn't go blank just because one expression — or a
  // newly added outfit — isn't fully registered yet.
  getCharacterAssetId(characterKey, expression) {
    if (!characterKey) return null;
    const map = this._loadCharacterMap();
    const outfit = this.getSelectedOutfit(characterKey);
    if (outfit) {
      return map[this._assetKey(characterKey, outfit, expression)]
        || map[this._assetKey(characterKey, outfit, 'neutral')]
        || map[this._assetKey(characterKey, null, expression)]
        || map[this._assetKey(characterKey, null, 'neutral')]
        || null;
    }
    return map[this._assetKey(characterKey, null, expression)] || map[this._assetKey(characterKey, null, 'neutral')] || null;
  },
  // Outfit-explicit variant of getCharacterAssetId — used by /dev/upload to
  // check which asset is active for a specific outfit's slot regardless of
  // which outfit is currently selected for gameplay (getCharacterAssetId
  // above always resolves against the *selected* outfit, which is the right
  // behavior for /play/game but wrong for browsing a different outfit's
  // uploads in the editor).
  getCharacterAssetIdForOutfit(characterKey, outfit, expression) {
    if (!characterKey) return null;
    const map = this._loadCharacterMap();
    return map[this._assetKey(characterKey, outfit, expression)]
      || (outfit ? map[this._assetKey(characterKey, outfit, 'neutral')] : null)
      || null;
  },
  setCharacterAssetId(characterKey, expression, assetId, outfit) {
    if (!characterKey) return;
    const map = this._loadCharacterMap();
    const key = this._assetKey(characterKey, outfit, expression);
    if (assetId) map[key] = assetId; else delete map[key];
    localStorage.setItem(this._keys.characters, JSON.stringify(map));
  },
  removeAllCharacterAssetRefs(assetId) {
    const map = this._loadCharacterMap();
    let changed = false;
    Object.keys(map).forEach(key => { if (map[key] === assetId) { delete map[key]; changed = true; } });
    if (changed) localStorage.setItem(this._keys.characters, JSON.stringify(map));
  },

  // Which outfit id (from that character's `outfits` list in
  // dialogueData.js) is currently "worn" — set explicitly per-character from
  // /dev/upload's 인물 DB tab (an explicit "이 옷 게임에 적용" action, not just
  // browsing that outfit's uploads), same localStorage-backed pattern as
  // background/character selection. Defaults to the character's first listed
  // outfit so a fresh install still resolves portraits instead of finding
  // nothing. Returns null for a character with no `outfits` list at all —
  // that's the "no outfit dimension" case getCharacterAssetId above treats
  // the same as before this feature existed.
  _loadOutfitMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.outfits)) || {}; }
    catch (e) { return {}; }
  },
  getSelectedOutfit(characterKey) {
    if (!characterKey) return null;
    const def = (typeof dialogueCharacters !== 'undefined') ? dialogueCharacters.find(c => c.id === characterKey) : null;
    if (!def || !def.outfits || !def.outfits.length) return null;
    const saved = this._loadOutfitMap()[characterKey];
    return (saved && def.outfits.includes(saved)) ? saved : def.outfits[0];
  },
  setSelectedOutfit(characterKey, outfitId) {
    if (!characterKey) return;
    const map = this._loadOutfitMap();
    if (outfitId) map[characterKey] = outfitId; else delete map[characterKey];
    localStorage.setItem(this._keys.outfits, JSON.stringify(map));
  },

  _loadTransformMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.transforms)) || {}; }
    catch (e) { return {}; }
  },
  // The protagonist gets their own dedicated transform; every other
  // character shares one common default (tune it on any of them, it applies
  // to all) — see the `role` field on dialogueCharacters in dialogueData.js.
  _transformKeyFor(characterKey) {
    if (!characterKey) return null;
    const def = (typeof dialogueCharacters !== 'undefined') ? dialogueCharacters.find(c => c.id === characterKey) : null;
    return (def && def.role === 'protagonist') ? characterKey : '__other__';
  },
  // CharacterTransform = { x, y, scale }.
  getCharacterTransform(characterKey) {
    const defaults = { x: 0, y: 0, scale: 1 };
    const key = this._transformKeyFor(characterKey);
    if (!key) return defaults;
    return this._loadTransformMap()[key] || defaults;
  },
  setCharacterTransform(characterKey, transform) {
    const key = this._transformKeyFor(characterKey);
    if (!key) return;
    const map = this._loadTransformMap();
    map[key] = transform;
    localStorage.setItem(this._keys.transforms, JSON.stringify(map));
  },
};
