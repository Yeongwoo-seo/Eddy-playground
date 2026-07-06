/* OPERATION MK DEV — Scene storage, same durability rationale as assetDb.js:
   Scenes live in Supabase (dev_scenes table) instead of IndexedDB/localStorage
   so a saved Scene survives closing the app, reinstalling it, or switching
   devices. A Scene only ever stores asset IDs (backgroundId / character.assetId),
   never image data itself — the images stay owned by dev_assets/AssetDB.
   Requires SUPABASE_URL / SUPABASE_ANON_KEY from assetDb.js, which must be
   loaded first via <script src="/dev/assetDb.js"> before this file. */

const DEV_SCENES_TABLE = 'dev_scenes';

const SceneDB = (() => {
  function restHeaders(extra) {
    return Object.assign({
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    }, extra || {});
  }

  function toScene(row) {
    return {
      id: row.id,
      name: row.name,
      backgroundId: row.background_id,
      character: row.character || null,
      dialogueSetId: row.dialogue_set_id,
      createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
      updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
    };
  }

  async function getAllScenes() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_SCENES_TABLE}?select=*&order=updated_at.desc`, {
      headers: restHeaders(),
    });
    if (!res.ok) throw new Error(`Scene 목록을 불러오지 못했습니다 (${res.status})`);
    const rows = await res.json();
    return rows.map(toScene);
  }

  async function getScene(id) {
    if (!id) return null;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_SCENES_TABLE}?id=eq.${encodeURIComponent(id)}&select=*`, {
      headers: restHeaders(),
    });
    if (!res.ok) throw new Error(`Scene을 불러오지 못했습니다 (${res.status})`);
    const rows = await res.json();
    return rows.length ? toScene(rows[0]) : null;
  }

  async function addScene({ name, backgroundId, character, dialogueSetId }) {
    const id = `scene_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const row = {
      id,
      name,
      background_id: backgroundId || null,
      character: character || null,
      dialogue_set_id: dialogueSetId || null,
      created_at: now,
      updated_at: now,
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_SCENES_TABLE}`, {
      method: 'POST',
      headers: restHeaders({ Prefer: 'return=minimal' }),
      body: JSON.stringify(row),
    });
    if (!res.ok) throw new Error(`Scene 저장 실패 (${res.status}): ${await res.text()}`);
    return toScene(row);
  }

  async function updateScene(id, { name, backgroundId, character, dialogueSetId }) {
    const patch = {
      name,
      background_id: backgroundId || null,
      character: character || null,
      dialogue_set_id: dialogueSetId || null,
      updated_at: new Date().toISOString(),
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_SCENES_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: restHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`Scene 수정 실패 (${res.status}): ${await res.text()}`);
    const rows = await res.json();
    return rows.length ? toScene(rows[0]) : null;
  }

  async function deleteScene(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${DEV_SCENES_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: restHeaders(),
    });
    if (!res.ok) throw new Error(`Scene 삭제 실패 (${res.status})`);
  }

  async function duplicateScene(id) {
    const original = await getScene(id);
    if (!original) throw new Error('복제할 Scene을 찾을 수 없습니다');
    return addScene({
      name: `${original.name} copy`,
      backgroundId: original.backgroundId,
      character: original.character,
      dialogueSetId: original.dialogueSetId,
    });
  }

  return { getAllScenes, getScene, addScene, updateScene, deleteScene, duplicateScene };
})();

// Which saved Scene /dev/game should play, if any. Kept in localStorage like
// the rest of DevGameState's selection state — cheap to redo if lost, unlike
// the Scene data itself.
const SceneGameState = {
  _key: 'mkDevSelectedScene',
  getSelectedSceneId() { return localStorage.getItem(this._key) || null; },
  setSelectedSceneId(id) { id ? localStorage.setItem(this._key, id) : localStorage.removeItem(this._key); },
};
