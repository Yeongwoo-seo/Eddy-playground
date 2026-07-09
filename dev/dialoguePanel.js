/* OPERATION MK DEV — shared bulk dialogue-script editor.
   Renders one scene's whole script as a single editable text block and
   saves it as a full ordered line manifest via AssetDB.getDialogueOverrides/
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
   would misread as a block boundary.

   Header format is `[화자] (감정) {id}`, e.g. `[지수] (기쁨) {line-003}`, or
   `[내레이션] {id}` for a line with no speaker at all. `화자` and "which
   character's portrait is on screen" are DIFFERENT things in the underlying
   data — `speaker` (the name tag shown) and `characterId` (whose portrait
   stays up) can diverge: a narration beat can keep a character's portrait
   visible with no one speaking, and a speaker's own text-message lines
   have no portrait at all even though the same speaker also has portrait
   lines elsewhere. Presence of "(감정)" is what says whether a portrait is
   showing — a portrait always carries an expression, never omitted. When
   화자 alone doesn't already tell you which portrait that is (narration
   keeping a portrait up, or a nickname that isn't the character's
   registered name), the header spells it out: `[내레이션 · 지수] (호기심)`.

   The trailing `{id}` tag is what makes free add/remove/reorder of plain
   lines possible without guessing by position: a block that keeps its
   original `{id}` is "the same line, maybe reworded"; a block with no
   `{id}` is a brand-new plain line (gets a generated id on save); deleting
   a tagged block removes that line; reordering blocks reorders the line-up.
   A line with any interactive field (선택지/분기/증거 트리거 — see
   isInteractiveDialogueLine) renders as `[LOCKED] {id}` instead and can be
   moved but never edited/deleted here, since its wording/branch targets
   aren't representable in this plain-text format and vnPlayer.js resolves
   goto/correctGoto by that exact id.

   Saved as a full ordered `{ lineList }` manifest (see
   buildEffectiveDialogueLines/buildSceneLineList below) via
   AssetDB.setDialogueOverrides — dialogueData.js's static source itself is
   never touched, /dev/game rebuilds the scene's actual line-up from it at
   load time. Older saves (a flat `{ [lineId]: patch }` map, from before
   free add/remove/reorder existed) are still read correctly. */

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

// effectiveLines: [{ id, speaker, characterId, expression, text, locked }],
// see buildEffectiveDialogueLines. Each line already carries its resolved
// (post-override) fields, so formatting doesn't need a separate overrides
// map — just render what's there, plus the `{id}` tag every line already
// has by the time it reaches here.
function formatDialogueBulkText(effectiveLines) {
  return effectiveLines.map(l => {
    const header = l.locked ? `[LOCKED] {${l.id}}` : `${dialogueHeaderLine(l.speaker, l.characterId, l.expression)} {${l.id}}`;
    return `${header}\n${l.text}`;
  }).join('\n\n---\n\n');
}

const DIALOGUE_HEADER_RE = /^\[(.+?)\]\s*(?:\((.+?)\))?\s*(?:\{(.+?)\})?\s*$/;
const DASH_DELIMITER_RE = /^[ \t]*-{3,}[ \t]*$/;

// Splits bulk text into blocks on lone "---" lines, but ONLY where that
// line is actually acting as a delimiter — i.e. the next non-blank line
// looks like a "[화자] (감정) {id}" header, which every real block boundary
// is followed by. A "---"-shaped line that turns up inside a line's own
// text (a written-out pause, a divider some writer typed, dialogue quoting
// a horizontal rule, etc.) has ordinary text after it, not a header, so
// it's left alone and stays part of the block it's in. Without this guard
// any such line silently inflated the block count past the scene's real
// line count on save.
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

// Splits the bulk text back into per-block { speaker, characterId,
// expression, text, id } / { locked: true, id } (or { error }) — a lone
// "---" line separates blocks, first line of each block is the header, the
// rest is the line's text. `id` is null when the block has no `{id}` tag
// (a brand-new plain line, only valid for non-locked blocks — see
// buildSceneLineList, which is what actually knows which ids already exist).
function parseDialogueBulkText(raw) {
  const blocks = splitDialogueBlocks(raw);
  return blocks.map((block, i) => {
    const nl = block.indexOf('\n');
    const headerLine = nl === -1 ? block : block.slice(0, nl);
    const text = nl === -1 ? '' : block.slice(nl + 1);
    const m = headerLine.match(DIALOGUE_HEADER_RE);
    if (!m) return { error: `${i + 1}번째 블록: "[화자] (감정) {id}" 헤더 형식이 아닙니다 ("${headerLine}")` };
    const nameField = m[1].trim();
    const id = m[3] ? m[3].trim() : null;
    if (nameField === 'LOCKED') {
      if (!id) return { error: `${i + 1}번째 블록: [LOCKED] 블록에는 {id}가 있어야 합니다 — 지우거나 새로 만들 수 없어요.` };
      return { locked: true, id };
    }
    const emotionLabel = m[2] ? m[2].trim() : null;
    // A portrait always carries "(감정)" (see the format comment above) —
    // no parens means no portrait, full stop, regardless of whether the
    // 화자 text happens to match a registered character's name (e.g. 영우's
    // own text-message lines have no portrait even though 영우 also has
    // portrait lines elsewhere).
    if (!emotionLabel) {
      const speaker = nameField === '내레이션' ? '' : nameField;
      return { speaker, characterId: null, expression: null, text, id };
    }
    // A portrait line's 화자 is either the portrait's own registered name
    // ("[지수] (기쁨)") or, when 화자 and the portrait diverge (narration
    // keeping a portrait up, or a nickname), "화자 · 인물명"
    // ("[내레이션 · 지수] (호기심)").
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
    return { speaker, characterId: char.id, expression: expr.id, text, id };
  });
}

/* ===== Line-level override model — a scene's dialogue-overrides JSON blob
   (AssetDB.getDialogueOverrides/setDialogueOverrides) is either:
     - Old/flat form: { [lineId]: { text?, speaker?, characterId?,
       expression? } } — per-line patches applied directly onto
       dialogueData.js's static lines array, same order/count as the static
       script. Still readable for scenes saved before free add/remove/
       reorder existed.
     - New form: { lineList: [ ...entries ] } — a full ordered manifest.
       Each entry is either { ref: <staticLineId>, patch?: {...} } (an
       existing static line, used as-is or with a text/화자/감정 patch) or
       { new: <generatedId>, characterId, expression, speaker, text } (a
       brand-new plain line with no counterpart in dialogueData.js).

   Lines with any field beyond the plain set below (choices/goto/effects/
   evidenceIds/correctGoto/wrongText/type, or any future field this file
   doesn't know about) are "interactive" — this editor can move them but
   never edit or delete them, since their wording/branch targets are
   load-bearing for vnPlayer.js. ===== */

const DIALOGUE_PLAIN_LINE_FIELDS = new Set(['id', 'speaker', 'text', 'characterId', 'expression', 'pauseBeforeMs']);

function isInteractiveDialogueLine(line) {
  return Object.keys(line).some(k => !DIALOGUE_PLAIN_LINE_FIELDS.has(k));
}

// Every line id an interactive line can jump to directly — used so a save
// can be refused if it would remove a line something else still targets.
function dialogueLineGotoTargets(line) {
  const targets = [];
  if (line.goto) targets.push(line.goto);
  if (line.correctGoto) targets.push(line.correctGoto);
  (line.choices || []).forEach(c => { if (c && c.goto) targets.push(c.goto); });
  return targets;
}

// Builds the ordered list of *effective* lines for a scene: the static
// script (dialogueData.js) with `rawOverride` layered on top. Every entry
// gets a `locked` flag (see isInteractiveDialogueLine).
function buildEffectiveDialogueLines(staticLines, rawOverride) {
  if (rawOverride && Array.isArray(rawOverride.lineList)) {
    const byId = new Map(staticLines.map(l => [l.id, l]));
    return rawOverride.lineList.map(entry => {
      if (entry.ref) {
        const staticLine = byId.get(entry.ref);
        if (!staticLine) return null; // dangling ref — dropped rather than crashing playback
        const locked = isInteractiveDialogueLine(staticLine);
        return Object.assign({}, staticLine, (!locked && entry.patch) ? entry.patch : {}, { locked });
      }
      return {
        id: entry.new, speaker: entry.speaker || '', text: entry.text || '',
        characterId: entry.characterId || null, expression: entry.expression || null,
        locked: false,
      };
    }).filter(Boolean);
  }
  // Old flat-patch form (or no override yet) — same order/count as the
  // static script, each line optionally patched by id. Never patches an
  // interactive line, same as the new form.
  return staticLines.map(l => {
    const patch = rawOverride && rawOverride[l.id];
    const locked = isInteractiveDialogueLine(l);
    const applied = (!locked && patch) ? (typeof patch === 'string' ? { text: patch } : patch) : {};
    return Object.assign({}, l, applied, { locked });
  });
}

// Validates a scene's parsed blocks (from parseDialogueBulkText) against
// its static `lines` and builds the `{ lineList }` manifest to save, or
// `{ error }`. Used by both mountBulkDialogueEditor and /dev/script.
function buildSceneLineList(staticLines, bulkText) {
  const parsed = parseDialogueBulkText(bulkText);
  const blockErrors = parsed.map(p => p.error).filter(Boolean);
  if (blockErrors.length) return { error: blockErrors.join(' / ') };

  const staticById = new Map(staticLines.map(l => [l.id, l]));
  const staticInteractiveIds = new Set(staticLines.filter(isInteractiveDialogueLine).map(l => l.id));
  const seenIds = new Set();
  const lockedSeen = new Set();
  const lineList = [];

  for (const p of parsed) {
    if (p.locked) {
      if (!staticInteractiveIds.has(p.id)) {
        return { error: `[LOCKED] {${p.id}} — 이 씬에서 선택지/분기가 있는 줄이 아닙니다. 지우거나 바꾸지 마세요.` };
      }
      if (seenIds.has(p.id)) return { error: `{${p.id}}가 중복됐습니다.` };
      seenIds.add(p.id);
      lockedSeen.add(p.id);
      lineList.push({ ref: p.id });
      continue;
    }
    if (p.id && staticInteractiveIds.has(p.id)) {
      return { error: `{${p.id}}는 선택지/분기가 있는 줄이라 [LOCKED]로만 다룰 수 있어요.` };
    }
    const id = p.id || `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    if (seenIds.has(id)) return { error: `{${id}}가 중복됐습니다.` };
    seenIds.add(id);
    const staticLine = staticById.get(id);
    if (staticLine) {
      const patch = {};
      if ((p.characterId || null) !== (staticLine.characterId || null)) patch.characterId = p.characterId || null;
      if (p.speaker !== (staticLine.speaker || '')) patch.speaker = p.speaker;
      if ((p.expression || null) !== (staticLine.expression || null)) patch.expression = p.expression || null;
      if (p.text !== staticLine.text) patch.text = p.text;
      lineList.push(Object.keys(patch).length ? { ref: id, patch } : { ref: id });
    } else {
      lineList.push({ new: id, characterId: p.characterId || null, expression: p.expression || null, speaker: p.speaker || '', text: p.text || '' });
    }
  }

  // Every interactive/선택지·분기 line from the static source must still be
  // present exactly once — this editor can move them but never add/remove one.
  const missingLocked = [...staticInteractiveIds].filter(id => !lockedSeen.has(id));
  if (missingLocked.length) {
    return { error: `선택지/분기가 있는 줄이 빠졌습니다: ${missingLocked.join(', ')} — [LOCKED] 블록은 지울 수 없어요, 되돌리기로 복구하세요.` };
  }
  // goto/correctGoto/choices[].goto targets must still resolve somewhere in
  // the final line-up, or the branch silently falls through to "just
  // advance one line" instead of jumping where it's supposed to.
  for (const id of lockedSeen) {
    for (const target of dialogueLineGotoTargets(staticById.get(id))) {
      if (!seenIds.has(target)) {
        return { error: `"${id}"가 가리키는 "${target}" 줄이 사라졌습니다 — 분기가 깨져요. 그 줄을 되돌리거나 지우지 마세요.` };
      }
    }
  }

  return { lineList };
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
  let rawOverride;
  try {
    rawOverride = await AssetDB.getDialogueOverrides(sceneId);
  } catch (err) {
    status.textContent = '대사를 불러오지 못했습니다.';
    if (window.DevDiag) DevDiag.show('대사 불러오기 실패: ' + (err && err.message ? err.message : err));
    return;
  }
  if (isStale && isStale()) return;

  let originalText = formatDialogueBulkText(buildEffectiveDialogueLines(lines, rawOverride));
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
    const result = buildSceneLineList(lines, textarea.value);
    if (result.error) {
      status.textContent = result.error;
      return;
    }
    saveBtn.disabled = true;
    status.textContent = '저장 중…';
    try {
      await AssetDB.setDialogueOverrides(sceneId, { lineList: result.lineList });
      originalText = formatDialogueBulkText(buildEffectiveDialogueLines(lines, { lineList: result.lineList }));
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
    const rawOverride = overridesByScene[scene.id] || {};
    return `${sceneHeaderLine(scene)}\n\n${formatDialogueBulkText(buildEffectiveDialogueLines(scene.lines, rawOverride))}`;
  }).join('\n\n\n');
}

// Splits combined text back into { [sceneId]: chunkText } using the scene
// header lines above. Returns { chunks } or { error } — every scene in
// `scenes` must have exactly one header found (this editor can't add/
// remove/reorder scenes, though lines within a scene can be — see
// buildSceneLineList).
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
