/* OPERATION MK DEV — Dialogue Set storage + repository API.
   Independent of assetDb.js / sceneDb.js so Dialogue Editor work can proceed
   in parallel with the Scene Editor without touching its files.

   Data shape (documented here since this project has no TypeScript):

   DialogueLine = {
     id: string,
     speaker: string,
     text: string,
     characterVisible: boolean,
     typingSpeedMs?: number,   // default 28, applied by vnPlayer.js
     pauseAfterMs?: number,    // default 0, not consumed yet (reserved)
   }

   DialogueSet = {
     id: string,
     name: string,
     lines: DialogueLine[],
     createdAt: number,
     updatedAt: number,
   }

   Storage: IndexedDB, db "operation-mk-dev" (same db name the old
   pre-Supabase AssetDB used), store "dialogueSets", keyPath "id". Dialogue
   Sets are plain JSON (no image blobs), so they don't carry the Safari
   Blob-corruption risk that pushed asset storage to Supabase — IndexedDB is
   fine here, and this project has no server-side DB to fall back to. */

const DialogueDB = (() => {
  const DB_NAME = 'operation-mk-dev';
  const DB_VERSION = 2;
  const STORE = 'dialogueSets';
  let dbPromise = null;

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('이 브라우저에서는 IndexedDB를 사용할 수 없습니다 (프라이빗 모드일 수 있음).'));
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function store(mode) {
    const db = await openDb();
    return db.transaction(STORE, mode).objectStore(STORE);
  }

  function reqToPromise(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getDialogueSets() {
    const s = await store('readonly');
    const all = await reqToPromise(s.getAll());
    return all.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async function getDialogueSet(id) {
    if (!id) return null;
    const s = await store('readonly');
    const result = await reqToPromise(s.get(id));
    return result || null;
  }

  async function saveDialogueSet(dialogueSet) {
    const s = await store('readwrite');
    await reqToPromise(s.put(dialogueSet));
    return dialogueSet;
  }

  async function deleteDialogueSet(id) {
    const s = await store('readwrite');
    await reqToPromise(s.delete(id));
  }

  async function createDialogueSet({ name, lines }) {
    const now = Date.now();
    return saveDialogueSet({ id: crypto.randomUUID(), name, lines, createdAt: now, updatedAt: now });
  }

  async function updateDialogueSet(id, { name, lines }) {
    const existing = await getDialogueSet(id);
    if (!existing) throw new Error('DIALOGUE SET NOT FOUND');
    return saveDialogueSet({ ...existing, name, lines, updatedAt: Date.now() });
  }

  async function duplicateDialogueSet(id) {
    const existing = await getDialogueSet(id);
    if (!existing) throw new Error('DIALOGUE SET NOT FOUND');
    const now = Date.now();
    return saveDialogueSet({
      id: crypto.randomUUID(),
      name: `${existing.name} copy`,
      lines: existing.lines.map(line => ({ ...line, id: crypto.randomUUID() })),
      createdAt: now,
      updatedAt: now,
    });
  }

  return {
    getDialogueSets,
    getDialogueSet,
    saveDialogueSet,
    deleteDialogueSet,
    createDialogueSet,
    updateDialogueSet,
    duplicateDialogueSet,
  };
})();

// Selection state read by /dev/game — kept separate from DevGameState
// (background/character asset picks) since it's a different concern
// (which Dialogue Set to play, not which image to show).
const DevDialogueState = {
  _key: 'mkDevSelectedDialogueSetId',
  getSelectedDialogueSetId() { return localStorage.getItem(this._key) || null; },
  setSelectedDialogueSetId(id) { id ? localStorage.setItem(this._key, id) : localStorage.removeItem(this._key); },
};

// Fixed id so repeated "LOAD SAMPLE DIALOGUE" clicks overwrite the same
// record instead of piling up duplicates.
const SAMPLE_DIALOGUE_SET_ID = 'sample-mina';
function buildSampleDialogueSet() {
  const now = Date.now();
  return {
    id: SAMPLE_DIALOGUE_SET_ID,
    name: '민아 테스트 대화',
    lines: [
      { id: 'line-001', speaker: '윤민아', text: '저는 이미 말했잖아요. 18시 전에는 그곳을 떠났어요.', characterVisible: true },
      { id: 'line-002', speaker: '조수', text: '그런데 이상하지 않아? 이 사진은 그 이후에 찍힌 것 같은데.', characterVisible: false },
      { id: 'line-003', speaker: '윤민아', text: '사진 한 장 가지고 뭘 증명하려는 거죠?', characterVisible: true },
    ],
    createdAt: now,
    updatedAt: now,
  };
}
