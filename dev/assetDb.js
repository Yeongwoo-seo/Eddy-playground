/* OPERATION MK DEV — isolated MVP sandbox, not part of the main game.
   IndexedDB asset store (background/character image blobs) +
   localStorage-backed selection state for /dev/game. */

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

  async function addAsset({ type, name, blob, width, height }) {
    const db = await openDb();
    const id = `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const record = { id, type, name, blob, width, height, createdAt: Date.now() };
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
  _keys: { background: 'mkDevSelectedBackground', character: 'mkDevSelectedCharacter' },
  getBackgroundId() { return localStorage.getItem(this._keys.background) || null; },
  setBackgroundId(id) { id ? localStorage.setItem(this._keys.background, id) : localStorage.removeItem(this._keys.background); },
  getCharacterId() { return localStorage.getItem(this._keys.character) || null; },
  setCharacterId(id) { id ? localStorage.setItem(this._keys.character, id) : localStorage.removeItem(this._keys.character); },
};
