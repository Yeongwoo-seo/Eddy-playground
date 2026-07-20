/* OPERATION MK DEV — shared Visual Novel dialogue engine.
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
     week0-scene-flight/week0-scene-002-1 for authored examples). Before
     typing the line's text, the engine calls onSceneTransition(transition,
     line) and waits for it (a Promise) — the host uses this to play its
     own black-overlay/background-swap beat. Tapping is ignored for the
     duration, same as an in-flight pauseBeforeMs delay. */

const DEFAULT_TYPING_SPEED_MS = 36;

function createVNPlayer({ onLineChange, onTextUpdate, onArrow, onComplete, onEffect, onChoicePrompt, onEvidencePrompt, onEvidenceResult, onSceneTransition }) {
  let lines = [];
  let idIndex = new Map();
  let currentIndex = 0;
  let typingTimer = null;
  let isTyping = false;
  let isPausing = false;
  let awaitingChoice = false;
  let awaitingEvidence = false;

  // Called once a line's text has finished typing (either naturally or via
  // an instant-complete tap) — decides whether the line hands control to a
  // choice/evidence prompt or shows the normal tap-to-advance arrow.
  function handleTypingDone(line) {
    isTyping = false;
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
    onTextUpdate('');
    isTyping = true;
    onArrow(false);
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
    onLineChange(line, index, lines.length);
    if (line.effects && onEffect) onEffect(line.effects, line);
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
        typeText(line.text || '', line.typingSpeedMs, line);
      });
    } else {
      typeText(line.text || '', line.typingSpeedMs, line);
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
      onTextUpdate(line.text || '');
      handleTypingDone(line);
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
