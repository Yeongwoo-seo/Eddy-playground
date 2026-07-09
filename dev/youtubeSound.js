/* OPERATION MK DEV — YouTube-backed sound playback (사운드 tab).
   A sound entry is a YouTube video id + a [start, end) second range, not a
   downloaded/re-hosted audio file — ripping YouTube's own audio track would
   violate its Terms of Service, so this only ever streams straight from
   YouTube's own embedded player (audio-only in practice: /dev/game mounts it
   1x1 and off-screen). Shared by /dev/upload's 사운드 tab (preview) and
   /dev/game (scene BGM playback) so both go through the same loop/seek logic. */

function parseYouTubeId(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  const m = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  // Allow a bare video id pasted directly, no URL wrapper.
  return /^[A-Za-z0-9_-]{11}$/.test(trimmed) ? trimmed : null;
}

const YouTubeAPI = (() => {
  let readyPromise = null;
  function ensureReady() {
    if (readyPromise) return readyPromise;
    readyPromise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) { resolve(window.YT); return; }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        resolve(window.YT);
      };
      if (!document.getElementById('youtubeIframeApiScript')) {
        const tag = document.createElement('script');
        tag.id = 'youtubeIframeApiScript';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    });
    return readyPromise;
  }
  return { ensureReady };
})();

// Kick the iframe API script off as soon as this file loads, not on first
// use. createYTSoundPlayer's construction of `new YT.Player(...)` has to
// happen close enough to the triggering click for the browser to still
// credit it with a user gesture (otherwise unmuted autoplay is silently
// blocked, with nothing visible since the player is mounted off-screen at
// 1x1). Fetching the (~small) API script over the network on first click
// reliably blows that window; pre-fetching removes the wait entirely for
// every click that follows.
YouTubeAPI.ensureReady();

// YT.Player's onError codes (per the IFrame API docs) — surfaced through
// `onError` below instead of being silently dropped, which is what made a
// non-embeddable/removed video look exactly like "미리듣기가 안 되는" with no
// clue why: playVideo() was still called, but the iframe never actually
// started, and nothing told the caller.
const YT_ERROR_MESSAGES = {
  2: '유튜브 링크가 올바르지 않습니다.',
  5: '이 브라우저에서 재생할 수 없는 영상입니다.',
  100: '삭제되었거나 비공개로 전환된 영상입니다.',
  101: '영상 업로더가 외부 재생(임베드)을 막아둔 영상이라 미리듣기를 지원하지 않습니다. 다른 영상으로 등록해주세요.',
  150: '영상 업로더가 외부 재생(임베드)을 막아둔 영상이라 미리듣기를 지원하지 않습니다. 다른 영상으로 등록해주세요.',
};

// Mounts a YouTube player inside `containerEl` (a fresh child element is
// appended each call, since the IFrame API replaces whatever element it's
// given with its own <iframe> — reusing the same node after stop() isn't
// possible once the API has consumed it). Plays [start, end) once, looping
// back to `start` when `end` is reached (or, if `end` is 0/omitted, when the
// whole video ends) — set `loop: false` for a one-shot effect instead.
// `onError(message, code)` fires (once) on any YT.Player error — most
// commonly a video whose owner disabled embedding (101/150) or removed it
// (100) — the player is already unusable at that point, so the caller
// should treat this the same as a failed load.
// `onEnded()` fires (once) when a one-shot (`loop: false`) preview reaches
// its `end` bound, or the whole video, without the caller calling stop() —
// lets a caller drop its own "is this playing" state instead of it going
// stale once nothing is actually audible anymore.
function createYTSoundPlayer(containerEl, { videoId, start = 0, end = 0, loop = true, muted = false, onError, onEnded } = {}) {
  const target = document.createElement('div');
  containerEl.appendChild(target);

  let player = null;
  let destroyed = false;
  let loopTimer = null;

  function clearLoopTimer() {
    if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
  }

  function watchForLoopPoint() {
    clearLoopTimer();
    if (!end) return;
    loopTimer = setInterval(() => {
      if (!player || typeof player.getCurrentTime !== 'function') return;
      if (player.getCurrentTime() >= end) {
        if (loop) {
          player.seekTo(start, true);
        } else {
          clearLoopTimer();
          player.pauseVideo();
          if (onEnded) onEnded();
        }
      }
    }, 250);
  }

  YouTubeAPI.ensureReady().then((YT) => {
    if (destroyed) return;
    player = new YT.Player(target, {
      videoId,
      width: '1',
      height: '1',
      playerVars: { start: Math.max(0, Math.floor(start)), autoplay: 1, controls: 0, disablekb: 1, playsinline: 1, modestbranding: 1 },
      events: {
        onReady: (e) => {
          if (destroyed) return;
          if (muted) e.target.mute(); else e.target.unMute();
          e.target.playVideo();
          watchForLoopPoint();
        },
        onStateChange: (e) => {
          if (destroyed) return;
          if (e.data === YT.PlayerState.ENDED) {
            if (loop) {
              player.seekTo(start, true);
              player.playVideo();
            } else if (onEnded) {
              onEnded();
            }
          }
        },
        onError: (e) => {
          if (destroyed) return;
          if (onError) onError(YT_ERROR_MESSAGES[e.data] || `재생 중 알 수 없는 오류가 발생했습니다. (code ${e.data})`, e.data);
        },
      },
    });
  });

  return {
    stop() {
      destroyed = true;
      clearLoopTimer();
      if (player && player.destroy) player.destroy();
      player = null;
      target.remove();
    },
    mute() { if (player) player.mute(); },
    unMute() { if (player) player.unMute(); },
  };
}
