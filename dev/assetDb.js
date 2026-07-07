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
  // /dev/game re-requests the active character/background asset on every
  // single dialogue line change, even when it's the same asset as before —
  // without a cache that's a Supabase round-trip per tap, which is exactly
  // why lines were visibly slow to appear. Cached per page session (a fresh
  // page load starts empty, so edits made elsewhere are always picked up).
  const cache = new Map();

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
  // dev-only sandbox.
  function parsePathMeta(type, path) {
    const parts = (path || '').split('/');
    if (type === 'background') return { sceneId: parts[1] || null };
    if (type === 'character') return { characterKey: parts[1] || null, expression: parts[2] || null };
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

  async function addAsset({ type, name, blob, width, height, sceneId, characterKey, expression }) {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ext = (name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const path = type === 'background'
      ? `background/${sceneId || 'unassigned'}/${id}.${ext}`
      : type === 'character'
        ? `character/${characterKey || 'unassigned'}/${expression || 'unassigned'}/${id}.${ext}`
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
    if (asset) cache.set(id, asset);
    return asset;
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
  }

  // Caching the metadata/URL above isn't enough on its own — setting an
  // <img>/background-image src still has to download and decode the actual
  // bytes the first time. Warming the browser's own image cache ahead of
  // time (before the line that needs it is shown) makes that swap instant.
  const warmedImages = new Set();
  function preloadImage(url) {
    if (!url || warmedImages.has(url)) return Promise.resolve();
    warmedImages.add(url);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // a broken image shouldn't block the scene
      img.src = url;
    });
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
      const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
      const map = res.ok ? await res.json() : {};
      roomHotspotsCache.set(sceneId, map);
      return map;
    } catch (e) {
      return roomHotspotsCache.get(sceneId) || {};
    }
  }

  async function setRoomHotspot(sceneId, hotspotId, hotspot) {
    if (!sceneId || !hotspotId) return {};
    const current = await getRoomHotspots(sceneId);
    const map = Object.assign({}, current);
    if (hotspot) map[hotspotId] = hotspot; else delete map[hotspotId];
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
      const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
      const map = res.ok ? await res.json() : {};
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
    const current = await getMinigameHotspots(sceneId);
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

  return {
    addAsset, getAssetsByType, getAsset, deleteAsset, preloadImage,
    getRoomHotspots, setRoomHotspot,
    getMinigameHotspot, setMinigameHotspot,
  };
})();

const DevGameState = {
  _keys: {
    background: 'mkDevSelectedBackgrounds', characters: 'mkDevSelectedCharacters',
    transforms: 'mkDevCharacterTransforms',
  },

  // Each scene (or minigame — a minigame's own background is just another
  // sceneId string, e.g. 'week1-scene-001-2-minigame') gets its own
  // background slot.
  _loadBackgroundMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.background)) || {}; }
    catch (e) { return {}; }
  },
  getBackgroundId(sceneId) {
    if (!sceneId) return null;
    return this._loadBackgroundMap()[sceneId] || null;
  },
  setBackgroundId(sceneId, assetId) {
    if (!sceneId) return;
    const map = this._loadBackgroundMap();
    if (assetId) map[sceneId] = assetId; else delete map[sceneId];
    localStorage.setItem(this._keys.background, JSON.stringify(map));
  },
  removeAllBackgroundAssetRefs(assetId) {
    const map = this._loadBackgroundMap();
    let changed = false;
    Object.keys(map).forEach(sceneId => { if (map[sceneId] === assetId) { delete map[sceneId]; changed = true; } });
    if (changed) localStorage.setItem(this._keys.background, JSON.stringify(map));
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
  // characterKey is a dialogue character id (e.g. 'jisoo' / 'youngwoo'); each
  // (characterKey, expression) pair gets its own uploaded asset, driven by the
  // `expression` field on the active dialogue line. Falls back to that
  // character's 'neutral' portrait when the exact expression isn't registered
  // yet, so a scene doesn't go blank just because one expression is missing.
  getCharacterAssetId(characterKey, expression) {
    if (!characterKey) return null;
    const map = this._loadCharacterMap();
    return map[`${characterKey}::${expression || 'neutral'}`] || map[`${characterKey}::neutral`] || null;
  },
  setCharacterAssetId(characterKey, expression, assetId) {
    if (!characterKey) return;
    const map = this._loadCharacterMap();
    const key = `${characterKey}::${expression || 'neutral'}`;
    if (assetId) map[key] = assetId; else delete map[key];
    localStorage.setItem(this._keys.characters, JSON.stringify(map));
  },
  removeAllCharacterAssetRefs(assetId) {
    const map = this._loadCharacterMap();
    let changed = false;
    Object.keys(map).forEach(key => { if (map[key] === assetId) { delete map[key]; changed = true; } });
    if (changed) localStorage.setItem(this._keys.characters, JSON.stringify(map));
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
