/* OPERATION MK DEV — shared bulk dialogue-script editor.
   Renders one scene's whole script as a single editable text block and
   saves it as a per-line override map via AssetDB.getDialogueOverrides/
   setDialogueOverrides. Used by both /dev/upload's 대사 tab (one scene at a
   time) and /dev/script's 전체 대사보기 (every scene in a week, one editor
   per scene) so the two can't drift into two different formats/save paths.
   The host page owns the markup/CSS (see /dev/upload's .dialogue-bulk-input/
   .hotspot-actions/.hotspot-secondary-btn/.crop-save-btn classes, reused
   as-is by /dev/script) — this module only owns the format + behavior.

   Format: each line renders as a header line followed by its text, blocks
   separated by a lone "---" line. A "---" line (not a blank line) is the
   delimiter because some lines' own text already contains blank lines
   (e.g. "[ ITEM ACQUIRED ]\n\nUNKNOWN KEY"), which a blank-line separator
   would misread as a block boundary. Saving parses the block back into
   lines by position and diffs each against dialogueData.js's static line
   to build one combined override object per changed line — the static
   source itself is never touched, /dev/game merges the override over it
   at load time. This only supports editing existing lines in place, not
   adding/removing/reordering them.

   Header format is `[화자] (감정)`, e.g. `[지수] (기쁨)`, or `[내레이션]`
   for a line with no speaker at all. `화자` and "which character's
   portrait is on screen" are DIFFERENT things in the underlying data —
   `speaker` (the name tag shown) and `characterId` (whose portrait stays
   up) can diverge: a narration beat can keep a character's portrait
   visible with no one speaking, and a speaker's own text-message lines
   have no portrait at all even though the same speaker also has portrait
   lines elsewhere. Presence of "(감정)" is what says whether a portrait is
   showing — a portrait always carries an expression, never omitted. When
   화자 alone doesn't already tell you which portrait that is (narration
   keeping a portrait up, or a nickname that isn't the character's
   registered name), the header spells it out: `[내레이션 · 지수] (호기심)`.
   Getting this wrong previously meant *every* narration-with-portrait or
   portrait-less-speaker line silently mutated on a no-op save. */

function dialogueHeaderLine(speaker, characterId, expression) {
  const char = dialogueCharacters.find(c => c.id === characterId);
  const displayName = speaker || '내레이션';
  if (!char) return `[${displayName}]`;
  const label = (dialogueExpressions.find(x => x.id === expression) || {}).label || expression;
  // 화자 already identifies this exact portrait — no need to spell it out
  // a second time.
  if (char.name === displayName) return `[${displayName}] (${label})`;
  return `[${displayName} · ${char.name}] (${label})`;
}

function formatDialogueBulkText(lines, overrides) {
  return lines.map(l => {
    const o = overrides[l.id] || {};
    const speaker = 'speaker' in o ? o.speaker : (l.speaker || '');
    const characterId = 'characterId' in o ? o.characterId : l.characterId;
    const expression = 'expression' in o ? o.expression : l.expression;
    const text = 'text' in o ? o.text : l.text;
    return `${dialogueHeaderLine(speaker, characterId, expression)}\n${text}`;
  }).join('\n\n---\n\n');
}

const DIALOGUE_HEADER_RE = /^\[(.+?)\]\s*(?:\((.+?)\))?\s*$/;
const DASH_DELIMITER_RE = /^[ \t]*-{3,}[ \t]*$/;

// Splits bulk text into blocks on lone "---" lines, but ONLY where that
// line is actually acting as a delimiter — i.e. the next non-blank line
// looks like a "[화자] (감정)" header, which every real block boundary is
// followed by. A "---"-shaped line that turns up inside a line's own text
// (a written-out pause, a divider some writer typed, dialogue quoting a
// horizontal rule, etc.) has ordinary text after it, not a header, so it's
// left alone and stays part of the block it's in. Without this guard any
// such line silently inflated the block count past the scene's real line
// count on save (see the "블록 개수가 ... 다릅니다" check below).
function splitDialogueBlocks(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let current = [];
  for (let i = 0; i < lines.length; i++) {
    if (DASH_DELIMITER_RE.test(lines[i])) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      if (j < lines.length && DIALOGUE_HEADER_RE.test(lines[j])) {
        blocks.push(current.join('\n'));
        current = [];
        continue;
      }
    }
    current.push(lines[i]);
  }
  blocks.push(current.join('\n'));
  return blocks.map(b => b.trim()).filter(b => b.length);
}

// Splits the bulk text back into per-line { speaker, characterId,
// expression, text } (or { error }) by position — a lone "---" line
// separates blocks, first line of each block is the header, the rest is
// the line's text.
function parseDialogueBulkText(raw) {
  const blocks = splitDialogueBlocks(raw);
  return blocks.map((block, i) => {
    const nl = block.indexOf('\n');
    const headerLine = nl === -1 ? block : block.slice(0, nl);
    const text = nl === -1 ? '' : block.slice(nl + 1);
    const m = headerLine.match(DIALOGUE_HEADER_RE);
    if (!m) return { error: `${i + 1}번째 블록: "[화자] (감정)" 헤더 형식이 아닙니다 ("${headerLine}")` };
    const emotionLabel = m[2] ? m[2].trim() : null;
    // A portrait always carries "(감정)" (see the format comment above) —
    // no parens means no portrait, full stop, regardless of whether the
    // 화자 text happens to match a registered character's name (e.g. 영우's
    // own text-message lines have no portrait even though 영우 also has
    // portrait lines elsewhere).
    if (!emotionLabel) {
      const nameField = m[1].trim();
      const speaker = nameField === '내레이션' ? '' : nameField;
      return { speaker, characterId: null, expression: null, text };
    }
    // A portrait line's 화자 is either the portrait's own registered name
    // ("[지수] (기쁨)") or, when 화자 and the portrait diverge (narration
    // keeping a portrait up, or a nickname), "화자 · 인물명"
    // ("[내레이션 · 지수] (호기심)").
    const nameField = m[1].trim();
    const dotIdx = nameField.indexOf(' · ');
    const speakerLabel = dotIdx === -1 ? nameField : nameField.slice(0, dotIdx).trim();
    const portraitLabel = dotIdx === -1 ? nameField : nameField.slice(dotIdx + 3).trim();
    const char = dialogueCharacters.find(c => c.name === portraitLabel);
    if (!char) return { error: `${i + 1}번째 블록: "${portraitLabel}"는 알 수 없는 인물입니다.` };
    // Any of the 10 canonical emotion labels is accepted here, not just the
    // character's own `expressions` subset — that subset only limits which
    // portraits the 인물 DB upload picker offers, and existing script lines
    // already reference emotions outside it for some characters (e.g.
    // 지수/호기심), so enforcing it here would block re-saving those
    // untouched lines.
    const expr = dialogueExpressions.find(x => x.label === emotionLabel);
    if (!expr) {
      const allowed = dialogueExpressions.map(x => x.label).join(', ');
      return { error: `${i + 1}번째 블록: "${portraitLabel}"의 감정표현 "${emotionLabel}"을(를) 알 수 없습니다. (가능: ${allowed})` };
    }
    const speaker = speakerLabel === '내레이션' ? '' : speakerLabel;
    return { speaker, characterId: char.id, expression: expr.id, text };
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
    const patch = {};
    if (p.characterId !== l.characterId) patch.characterId = p.characterId;
    if (p.speaker !== (l.speaker || '')) patch.speaker = p.speaker;
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
