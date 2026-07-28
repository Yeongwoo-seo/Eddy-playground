/* MISSING KEY DEV — shared Visual Novel dialogue engine.
   Typewriter effect + tap-to-skip/tap-to-next, extracted out of
   /play/game so the Dialogue Editor's Preview uses the exact same
   engine instead of a second, drifting implementation.

   Interactive detective-game additions (all opt-in per line, so any
   existing scene with plain { speaker, text, ... } lines behaves exactly
   as before):
   - line.goto: jump to another line by id instead of index+1 once this
     line is tapped through. Lets branches rejoin the main sequence.
   - line.effects: array of host-defined effect objects applied the
     moment the line is shown (e.g. registering evidence/questions in
     CaseFileState) — the engine just forwards them via onEffect.
   - line.type === 'choice': after the line's text finishes typing, the
     engine stops (no tap-to-advance) and calls onChoicePrompt(choices,
     line). The host renders buttons and calls player.choose(choiceId).
     Each choice may carry its own `goto` and `effects`.
   - line.type === 'evidence': same pause, but calls onEvidencePrompt(line)
     instead. The host lets the player pick a piece of evidence and calls
     player.presentEvidence(evidenceId); the engine checks it against
     line.evidenceIds, reports the result via onEvidenceResult(correct,
     evidenceId, line), and only advances (to line.correctGoto or the
     next line) once a correct id is presented.
   - line.sceneTransition: marks a line as the start of a new location
     inside a merged, multi-location scene (see dialogueData.js's
     week1-scene-flight/week1-scene-002-1 for authored examples). Before
     typing the line's text, the engine calls onSceneTransition(transition,
     line) and waits for it (a Promise) — the host uses this to play its
     own black-overlay/background-swap beat. Tapping is ignored for the
     duration, same as an in-flight pauseBeforeMs delay.
   - pageFit (constructor option, not a per-line field): { textEl, boundsEl }.
     When given, a line's text is paginated to fit boundsEl (defaults to
     textEl itself) instead of letting the box grow/scroll to hold it all at
     once — textEl is the exact DOM node the host's onTextUpdate writes into,
     so measuring against it (temporarily, restored before any paint) reads
     the box's real, already-applied CSS cap. A tap on a page that isn't the
     line's last just reveals the next page of the SAME line (no
     onLineChange/effects re-fire, no goto) — only the last page's tap falls
     through to the normal advance/choice/evidence behavior. Omit pageFit to
     keep the old no-pagination behavior (box grows/scrolls, all in one
     page). */

const DEFAULT_TYPING_SPEED_MS = 36;

function createVNPlayer({ onLineChange, onTextUpdate, onArrow, onComplete, onEffect, onChoicePrompt, onEvidencePrompt, onEvidenceResult, onSceneTransition, pageFit }) {
  let lines = [];
  let idIndex = new Map();
  let currentIndex = 0;
  let typingTimer = null;
  let isTyping = false;
  let isPausing = false;
  let awaitingChoice = false;
  let awaitingEvidence = false;
  let pages = [''];
  let pageIndex = 0;
  let awaitingPageBreak = false;

  // Splits `fullText` into page-sized chunks that each fit inside
  // pageFit.boundsEl, by binary-searching (via temporary, restored writes to
  // pageFit.textEl) for the longest prefix that doesn't overflow, then
  // backing off to the nearest word/line boundary so a page never ends
  // mid-word. No-op (single page) when pageFit wasn't supplied.
  function paginate(fullText) {
    if (!fullText) return [''];
    if (!pageFit || !pageFit.textEl) return [fullText];
    const textEl = pageFit.textEl;
    const boundsEl = pageFit.boundsEl || textEl;
    const prevText = textEl.textContent;
    function fits(candidate) {
      textEl.textContent = candidate;
      return boundsEl.scrollHeight <= boundsEl.clientHeight + 1;
    }
    const result = [];
    let remaining = fullText;
    let guard = 0;
    while (remaining.length && guard++ < 500) {
      if (fits(remaining)) { result.push(remaining); break; }
      let lo = 1, hi = remaining.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (fits(remaining.slice(0, mid))) lo = mid; else hi = mid - 1;
      }
      let cut = lo;
      if (cut < remaining.length) {
        const boundary = Math.max(remaining.lastIndexOf('\n', cut - 1), remaining.lastIndexOf(' ', cut - 1));
        if (boundary > 0) cut = boundary + 1;
      }
      result.push(remaining.slice(0, cut).replace(/[ \t]+$/, ''));
      remaining = remaining.slice(cut).replace(/^[ \t\n]+/, '');
    }
    textEl.textContent = prevText;
    return result.length ? result : [fullText];
  }

  // Called once a line's text has finished typing (either naturally or via
  // an instant-complete tap) — decides whether the line hands control to a
  // choice/evidence prompt or shows the normal tap-to-advance arrow.
  function handleTypingDone(line) {
    isTyping = false;
    if (pageIndex < pages.length - 1) {
      // More pages left in this same line — pause for a tap that reveals
      // the next page instead of falling through to advance/choice/evidence.
      awaitingPageBreak = true;
      onArrow(true);
      return;
    }
    if (line.type === 'choice') {
      awaitingChoice = true;
      if (onChoicePrompt) onChoicePrompt(line.choices || [], line);
    } else if (line.type === 'evidence') {
      awaitingEvidence = true;
      if (onEvidencePrompt) onEvidencePrompt(line);
    } else {
      onArrow(true);
    }
  }

  function typeText(text, speedMs, line) {
    clearInterval(typingTimer);
    isTyping = true;
    onArrow(false);
    // speedMs === 0 means "don't animate at all" (증거버전의 안 중요한 줄) —
    // an interval clamped to the browser's ~4ms floor still crawls character
    // by character for a long line, which reads as "빠르게 지나가는" typing
    // rather than the flash-and-skip the evidence mode wants. Skip the
    // interval entirely and show the whole line in one paint instead.
    if (speedMs === 0) {
      onTextUpdate(text);
      handleTypingDone(line);
      return;
    }
    onTextUpdate('');
    let i = 0;
    typingTimer = setInterval(() => {
      i++;
      onTextUpdate(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typingTimer);
        handleTypingDone(line);
      }
    }, speedMs || DEFAULT_TYPING_SPEED_MS);
  }

  // Resolves a `goto` line id to an index, falling back to "just advance
  // one line" (matches the old, purely-sequential behavior) when the id is
  // missing or unknown.
  function resolveTarget(gotoId) {
    if (gotoId && idIndex.has(gotoId)) return idIndex.get(gotoId);
    return currentIndex + 1;
  }

  function advanceTo(index) {
    if (index >= 0 && index < lines.length) {
      showLine(index);
    } else if (onComplete) {
      onComplete();
    }
  }

  function showLine(index) {
    currentIndex = index;
    const line = lines[index];
    awaitingChoice = false;
    awaitingEvidence = false;
    awaitingPageBreak = false;
    onLineChange(line, index, lines.length);
    if (line.effects && onEffect) onEffect(line.effects, line);
    // Paginate only after onLineChange/effects ran — they can change the
    // speaker name, portrait, or has-interactive-style box chrome, all of
    // which shrink or grow the space actually available to the text. Measuring
    // before they run (e.g. against a still-empty, collapsed name row) reads
    // more room than the box will really have once they land, letting a page
    // overflow the instant the name appears.
    pages = paginate(line.text || '');
    pageIndex = 0;
    if (line.sceneTransition && onSceneTransition) {
      isPausing = true;
      onArrow(false);
      // Clear the previous line's text right away instead of leaving it on
      // screen until typeText() runs after the transition resolves — the
      // black overlay fades in over ~0.5s (not an instant cut), so stale
      // text stayed visibly readable through it while the speaker name (set
      // by onLineChange above) had already switched to the new line's, and
      // then the whole dialogue box would jump/reset only once the overlay
      // finished. See play/game/index.html's playSceneTransition.
      onTextUpdate('');
      // A failed background/asset fetch inside onSceneTransition must not
      // leave isPausing stuck true forever — that permanently disables tap()
      // (see its guard above) with no visible error, indistinguishable from
      // infinite loading. Always resume the scene even if the transition
      // visual itself couldn't load.
      Promise.resolve(onSceneTransition(line.sceneTransition, line)).catch((err) => {
        console.error('sceneTransition failed, continuing scene anyway', err);
      }).then(() => {
        isPausing = false;
        typeText(pages[pageIndex], line.typingSpeedMs, line);
      });
    } else {
      typeText(pages[pageIndex], line.typingSpeedMs, line);
    }
  }

  function load(newLines, startIndex) {
    clearInterval(typingTimer);
    lines = newLines || [];
    idIndex = new Map(lines.map((l, i) => [l.id, i]));
    isTyping = false;
    isPausing = false;
    awaitingChoice = false;
    awaitingEvidence = false;
    awaitingPageBreak = false;
    pages = [''];
    pageIndex = 0;
    if (!lines.length) return;
    showLine(Math.min(startIndex || 0, lines.length - 1));
  }

  // Tap while typing -> finish the line instantly (and, for a choice/
  // evidence line, immediately open its prompt). Tap after finished ->
  // advance (respecting the next line's pauseBeforeMs, a beat of held
  // silence before it appears), or call onComplete() past the last line.
  // A tap while a choice/evidence prompt is open does nothing — the player
  // must use choose()/presentEvidence() instead.
  function tap() {
    if (!lines.length || isPausing) return;
    if (isTyping) {
      const line = lines[currentIndex];
      clearInterval(typingTimer);
      onTextUpdate(pages[pageIndex]);
      handleTypingDone(line);
      return;
    }
    if (awaitingPageBreak) {
      awaitingPageBreak = false;
      pageIndex++;
      typeText(pages[pageIndex], lines[currentIndex].typingSpeedMs, lines[currentIndex]);
      return;
    }
    if (awaitingChoice || awaitingEvidence) return;
    const line = lines[currentIndex];
    const nextIndex = resolveTarget(line.goto);
    if (nextIndex < lines.length) {
      const delay = lines[nextIndex].pauseBeforeMs || 0;
      if (delay > 0) {
        isPausing = true;
        onArrow(false);
        setTimeout(() => { isPausing = false; showLine(nextIndex); }, delay);
      } else {
        showLine(nextIndex);
      }
    } else if (onComplete) {
      onComplete();
    }
  }

  function choose(choiceId) {
    if (!awaitingChoice) return;
    const line = lines[currentIndex];
    const choice = (line.choices || []).find(c => c.id === choiceId);
    if (!choice) return;
    awaitingChoice = false;
    if (choice.effects && onEffect) onEffect(choice.effects, line);
    advanceTo(resolveTarget(choice.goto));
  }

  function presentEvidence(evidenceId) {
    if (!awaitingEvidence) return;
    const line = lines[currentIndex];
    const correct = (line.evidenceIds || []).includes(evidenceId);
    if (onEvidenceResult) onEvidenceResult(correct, evidenceId, line);
    if (!correct) return; // stays on the prompt so the player can try again
    awaitingEvidence = false;
    advanceTo(resolveTarget(line.correctGoto));
  }

  function restart() {
    if (lines.length) showLine(0);
  }

  function getState() {
    return { index: currentIndex, total: lines.length, isTyping, awaitingChoice, awaitingEvidence };
  }

  return { load, tap, restart, getState, choose, presentEvidence };
}
