/* OPERATION MK DEV — isolated MVP sandbox, not part of the main game.
   IndexedDB asset store (background/character images) +
   localStorage-backed selection state for /dev/game.

   Images are stored as base64 data URLs rather than raw Blobs — iOS
   Safari has a long history of silently failing or corrupting Blobs
   stored directly in IndexedDB, while data URL strings round-trip
   reliably everywhere and need no URL.createObjectURL/revoke cleanup. */

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
  if (!window.indexedDB) {
    show('이 브라우저에서는 IndexedDB를 사용할 수 없습니다 (프라이빗 모드일 수 있음). 이미지 저장이 동작하지 않습니다.');
  }
  // Without this, browsers may treat our storage as "best effort" and quietly
  // evict it under storage pressure — the likely cause of uploads disappearing
  // after the app is closed and reopened, since eviction is silent otherwise.
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persisted().then(already => {
      if (already) return;
      navigator.storage.persist().then(granted => {
        if (!granted) show('브라우저가 영구 저장을 허용하지 않았습니다. 저장 공간이 부족하면 업로드한 이미지가 다음에 열 때 사라질 수 있습니다.');
      });
    });
  }
  return { show };
})();

const AssetDB = (() => {
  const DB_NAME = 'operation-mk-dev';
  const DB_VERSION = 1;
  const STORE = 'assets';
  let dbPromise = null;

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const store = req.result.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  async function addAsset({ type, name, blob, width, height }) {
    const dataUrl = await blobToDataUrl(blob);
    const db = await openDb();
    const id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const record = { id, type, name, dataUrl, width, height, createdAt: Date.now() };
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(record);
      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getAssetsByType(type) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).index('type').getAll(type);
      req.onsuccess = () => resolve(req.result.sort((a, b) => b.createdAt - a.createdAt));
      req.onerror = () => reject(req.error);
    });
  }

  async function getAsset(id) {
    if (!id) return null;
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteAsset(id) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  return { addAsset, getAssetsByType, getAsset, deleteAsset };
})();

const DevGameState = {
  _keys: { background: 'mkDevSelectedBackground', characters: 'mkDevSelectedCharacters', transforms: 'mkDevCharacterTransforms' },
  getBackgroundId() { return localStorage.getItem(this._keys.background) || null; },
  setBackgroundId(id) { id ? localStorage.setItem(this._keys.background, id) : localStorage.removeItem(this._keys.background); },

  _loadCharacterMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.characters)) || {}; }
    catch (e) { return {}; }
  },
  // characterKey is a dialogue character id, e.g. 'jisoo' / 'youngwoo' — each
  // one gets its own uploaded asset, unlike the single shared background slot.
  getCharacterAssetId(characterKey) {
    if (!characterKey) return null;
    return this._loadCharacterMap()[characterKey] || null;
  },
  setCharacterAssetId(characterKey, assetId) {
    const map = this._loadCharacterMap();
    if (assetId) map[characterKey] = assetId; else delete map[characterKey];
    localStorage.setItem(this._keys.characters, JSON.stringify(map));
  },

  _loadTransformMap() {
    try { return JSON.parse(localStorage.getItem(this._keys.transforms)) || {}; }
    catch (e) { return {}; }
  },
  // CharacterTransform = { x, y, scale }, one per named character.
  getCharacterTransform(characterKey) {
    const defaults = { x: 0, y: 0, scale: 1 };
    if (!characterKey) return defaults;
    return this._loadTransformMap()[characterKey] || defaults;
  },
  setCharacterTransform(characterKey, transform) {
    const map = this._loadTransformMap();
    map[characterKey] = transform;
    localStorage.setItem(this._keys.transforms, JSON.stringify(map));
  },
};
