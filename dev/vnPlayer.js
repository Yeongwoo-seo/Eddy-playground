/* OPERATION MK DEV — shared Visual Novel dialogue engine.
   Typewriter effect + tap-to-skip/tap-to-next, extracted out of
   /dev/game so the Dialogue Editor's Preview uses the exact same
   engine instead of a second, drifting implementation. */

const DEFAULT_TYPING_SPEED_MS = 28;

function createVNPlayer({ onLineChange, onTextUpdate, onArrow, onComplete }) {
  let lines = [];
  let currentIndex = 0;
  let typingTimer = null;
  let isTyping = false;
  let isPausing = false;

  function typeText(text, speedMs) {
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
        isTyping = false;
        onArrow(true);
      }
    }, speedMs || DEFAULT_TYPING_SPEED_MS);
  }

  function showLine(index) {
    currentIndex = index;
    const line = lines[index];
    onLineChange(line, index, lines.length);
    typeText(line.text, line.typingSpeedMs);
  }

  function load(newLines, startIndex) {
    clearInterval(typingTimer);
    lines = newLines || [];
    isTyping = false;
    isPausing = false;
    if (!lines.length) return;
    showLine(Math.min(startIndex || 0, lines.length - 1));
  }

  // Tap while typing -> finish the line instantly.
  // Tap after finished -> advance (respecting the next line's pauseBeforeMs,
  // a beat of held silence before it appears), or call onComplete() past the
  // last line.
  function tap() {
    if (!lines.length || isPausing) return;
    if (isTyping) {
      clearInterval(typingTimer);
      onTextUpdate(lines[currentIndex].text);
      isTyping = false;
      onArrow(true);
      return;
    }
    if (currentIndex < lines.length - 1) {
      const nextIndex = currentIndex + 1;
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

  function restart() {
    if (lines.length) showLine(0);
  }

  function getState() {
    return { index: currentIndex, total: lines.length, isTyping };
  }

  return { load, tap, restart, getState };
}
