/* OPERATION MK DEV — shared bulk dialogue-script editor.
   Renders one scene's whole script as a single editable text block and
   saves it as a per-line override map via AssetDB.getDialogueOverrides/
   setDialogueOverrides. Used by both /dev/upload's 대사 tab (one scene at a
   time) and /dev/script's 전체 대사보기 (every scene in a week, one editor
   per scene) so the two can't drift into two different formats/save paths.
   The host page owns the markup/CSS (see /dev/upload's .dialogue-bulk-input/
   .hotspot-actions/.hotspot-secondary-btn/.crop-save-btn classes, reused
   as-is by /dev/script) — this module only owns the format + behavior.

   Format: each line renders as a `[화자] (감정)` header line followed by
   its text, blocks separated by a lone "---" line; narration is
   `[내레이션]`. A "---" line (not a blank line) is the delimiter because
   some lines' own text already contains blank lines (e.g.
   "[ ITEM ACQUIRED ]\n\nUNKNOWN KEY"), which a blank-line separator would
   misread as a block boundary. Saving parses the block back into lines by
   position and diffs each against dialogueData.js's static line to build
   one combined override object per changed line — the static source
   itself is never touched, /dev/game merges the override over it at load
   time. This only supports editing existing lines in place, not
   adding/removing/reordering them. */

function dialogueHeaderLine(characterId, expression) {
  const char = dialogueCharacters.find(c => c.id === characterId);
  if (!char) return '[내레이션]';
  const label = (dialogueExpressions.find(x => x.id === expression) || {}).label || expression;
  return `[${char.name}] (${label})`;
}

function formatDialogueBulkText(lines, overrides) {
  return lines.map(l => {
    const o = overrides[l.id] || {};
    const characterId = 'characterId' in o ? o.characterId : l.characterId;
    const expression = 'expression' in o ? o.expression : l.expression;
    const text = 'text' in o ? o.text : l.text;
    return `${dialogueHeaderLine(characterId, expression)}\n${text}`;
  }).join('\n\n---\n\n');
}

const DIALOGUE_HEADER_RE = /^\[(.+?)\]\s*(?:\((.+?)\))?\s*$/;

// Splits the bulk text back into per-line { characterId, expression, text }
// (or { error }) by position — a lone "---" line separates blocks, first
// line of each block is the `[화자] (감정)` header, the rest is the line's
// text.
function parseDialogueBulkText(raw) {
  const blocks = raw.replace(/\r\n/g, '\n').split(/\n[ \t]*-{3,}[ \t]*\n/).map(b => b.trim()).filter(b => b.length);
  return blocks.map((block, i) => {
    const nl = block.indexOf('\n');
    const headerLine = nl === -1 ? block : block.slice(0, nl);
    const text = nl === -1 ? '' : block.slice(nl + 1);
    const m = headerLine.match(DIALOGUE_HEADER_RE);
    if (!m) return { error: `${i + 1}번째 블록: "[화자] (감정)" 헤더 형식이 아닙니다 ("${headerLine}")` };
    const nameRaw = m[1].trim();
    if (nameRaw === '내레이션') return { characterId: null, expression: null, text };
    const char = dialogueCharacters.find(c => c.name === nameRaw);
    if (!char) return { error: `${i + 1}번째 블록: "${nameRaw}"는 알 수 없는 화자입니다.` };
    const emotionLabel = m[2] ? m[2].trim() : null;
    // Any of the 10 canonical emotion labels is accepted here, not just the
    // character's own `expressions` subset — that subset only limits which
    // portraits the 인물 DB upload picker offers, and existing script lines
    // already reference emotions outside it for some characters (e.g.
    // 지수/호기심), so enforcing it here would block re-saving those
    // untouched lines.
    const expr = emotionLabel && dialogueExpressions.find(x => x.label === emotionLabel);
    if (!expr) {
      const allowed = dialogueExpressions.map(x => x.label).join(', ');
      return { error: `${i + 1}번째 블록: "${nameRaw}"의 감정표현 "${emotionLabel || ''}"을(를) 알 수 없습니다. (가능: ${allowed})` };
    }
    return { characterId: char.id, expression: expr.id, text };
  });
}

// Diffs a scene's parsed blocks (from parseDialogueBulkText, already
// validated to have no .error entries) against its static lines to build
// the override map AssetDB.setDialogueOverrides expects — only the fields
// that actually changed go in, per line.
function buildLineOverridesMap(lines, parsed) {
  const overridesMap = {};
  lines.forEach((l, i) => {
    const p = parsed[i];
    const char = dialogueCharacters.find(c => c.id === p.characterId);
    const speaker = char ? char.name : '';
    const patch = {};
    if (p.characterId !== l.characterId) patch.characterId = p.characterId;
    if (speaker !== (l.speaker || '')) patch.speaker = speaker;
    if (p.expression !== (l.expression || null)) patch.expression = p.expression;
    if (p.text !== l.text) patch.text = p.text;
    if (Object.keys(patch).length) overridesMap[l.id] = patch;
  });
  return overridesMap;
}

// els = { textarea, revertBtn, saveBtn, status } — already-created DOM
// elements owned by the host page. Fetches this scene's overrides, fills
// the textarea, and (re)wires revert/save on these exact elements — safe to
// call again on the same els for a different scene, since it assigns
// .onclick (replacing any prior handler) rather than addEventListener
// (which would stack duplicate handlers across repeated calls).
//
// `isStale`, if given, is checked right after the async override fetch —
// lets a caller whose own selection may have changed mid-fetch (e.g.
// /dev/upload switching scene/tab) skip overwriting whatever's now on
// screen. A caller with one dedicated els set per scene can omit it.
async function mountBulkDialogueEditor(els, scene, { isStale } = {}) {
  const { textarea, revertBtn, saveBtn, status } = els;
  const lines = scene && scene.lines;
  textarea.disabled = true;
  revertBtn.disabled = true;
  saveBtn.disabled = true;
  if (!lines || !lines.length) {
    textarea.value = '';
    status.textContent = '이 씬에는 대사 데이터가 없습니다. (미니게임/증거수집 항목이거나 아직 미구현)';
    return;
  }
  const sceneId = scene.id;
  textarea.value = '';
  status.textContent = '불러오는 중…';
  let overrides;
  try {
    overrides = await AssetDB.getDialogueOverrides(sceneId);
  } catch (err) {
    status.textContent = '대사를 불러오지 못했습니다.';
    if (window.DevDiag) DevDiag.show('대사 불러오기 실패: ' + (err && err.message ? err.message : err));
    return;
  }
  if (isStale && isStale()) return;

  let originalText = formatDialogueBulkText(lines, overrides);
  textarea.value = originalText;
  textarea.disabled = false;
  revertBtn.disabled = false;
  saveBtn.disabled = false;
  status.textContent = '';

  revertBtn.onclick = () => {
    textarea.value = originalText;
    status.textContent = '';
  };

  saveBtn.onclick = async () => {
    const parsed = parseDialogueBulkText(textarea.value);
    if (parsed.length !== lines.length) {
      status.textContent = `블록 개수(${parsed.length}개)가 원래 대사 줄 수(${lines.length}개)와 다릅니다 — 이 편집기로는 줄을 추가/삭제할 수 없어요.`;
      return;
    }
    const errors = parsed.map(p => p.error).filter(Boolean);
    if (errors.length) {
      status.textContent = errors.join(' / ');
      return;
    }
    const overridesMap = buildLineOverridesMap(lines, parsed);
    saveBtn.disabled = true;
    status.textContent = '저장 중…';
    try {
      await AssetDB.setDialogueOverrides(sceneId, overridesMap);
      originalText = formatDialogueBulkText(lines, overridesMap);
      textarea.value = originalText;
      status.textContent = '저장됨';
    } catch (err) {
      status.textContent = '저장 실패';
      if (window.DevDiag) DevDiag.show('대사 저장 실패: ' + (err && err.message ? err.message : err));
    } finally {
      saveBtn.disabled = false;
    }
  };
}

/* ===== Multi-scene "one big text" combining — used by /dev/script's 전체
   대사보기 to bundle a whole week's scenes into a single editable text
   block (/dev/upload's 대사 tab only ever edits one scene, so it has no
   need for these). A scene boundary is its own header line, distinct from
   the "---" per-line delimiter above so the two never collide:
     ===== #01 씬 이름 [sceneId] =====
   The bracketed sceneId (not just the name) is what parsing actually keys
   off, so a display name with unusual characters can't break the split. */

const SCENE_HEADER_RE = /^={3,}\s*#\d+\s+.*?\[([\w-]+)\]\s*={3,}\s*$/;

function sceneHeaderLine(scene) {
  return `===== #${String(scene.order || 0).padStart(2, '0')} ${scene.name} [${scene.id}] =====`;
}

function formatCombinedDialogueText(scenes, overridesByScene) {
  return scenes.map(scene => {
    const overrides = overridesByScene[scene.id] || {};
    return `${sceneHeaderLine(scene)}\n\n${formatDialogueBulkText(scene.lines, overrides)}`;
  }).join('\n\n\n');
}

// Splits combined text back into { [sceneId]: chunkText } using the scene
// header lines above. Returns { chunks } or { error } — every scene in
// `scenes` must have exactly one header found (this editor can't add/
// remove/reorder scenes, same as parseDialogueBulkText can't for lines).
function parseCombinedDialogueText(raw, scenes) {
  const knownIds = new Set(scenes.map(s => s.id));
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const chunks = {};
  let currentId = null;
  let currentLines = [];
  function flush() {
    if (currentId) chunks[currentId] = currentLines.join('\n').trim();
  }
  for (const line of lines) {
    const m = line.match(SCENE_HEADER_RE);
    if (m) {
      flush();
      const id = m[1];
      if (!knownIds.has(id)) return { error: `알 수 없는 씬 헤더입니다: "${line.trim()}"` };
      if (id in chunks) return { error: `씬 헤더가 두 번 나옵니다: "${line.trim()}"` };
      currentId = id;
      currentLines = [];
    } else if (currentId) {
      currentLines.push(line);
    } else if (line.trim()) {
      return { error: `첫 씬 헤더(===== ... =====) 앞에 알 수 없는 텍스트가 있습니다: "${line.trim()}"` };
    }
  }
  flush();
  const missing = scenes.filter(s => !(s.id in chunks));
  if (missing.length) {
    return { error: `다음 씬의 헤더를 찾을 수 없습니다 — 헤더 줄은 지우거나 고치지 마세요: ${missing.map(s => s.name).join(', ')}` };
  }
  return { chunks };
}
