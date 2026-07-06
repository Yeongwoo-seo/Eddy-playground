/* OPERATION MK DEV — isolated MVP sandbox, not part of the main game.
   IndexedDB asset store (background/character images) +
   localStorage-backed selection state for /dev/game.

   Images are stored as base64 data URLs rather than raw Blobs — iOS
   Safari has a long history of silently failing or corrupting Blobs
   stored directly in IndexedDB, while data URL strings round-trip
   reliably everywhere and need no URL.createObjectURL/revoke cleanup. */

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
  _keys: { background: 'mkDevSelectedBackground', characters: 'mkDevSelectedCharacters' },
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
};
