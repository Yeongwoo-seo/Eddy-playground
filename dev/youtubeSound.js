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

// Mounts a YouTube player inside `containerEl` (a fresh child element is
// appended each call, since the IFrame API replaces whatever element it's
// given with its own <iframe> — reusing the same node after stop() isn't
// possible once the API has consumed it). Plays [start, end) once, looping
// back to `start` when `end` is reached (or, if `end` is 0/omitted, when the
// whole video ends) — set `loop: false` for a one-shot effect instead.
function createYTSoundPlayer(containerEl, { videoId, start = 0, end = 0, loop = true, muted = false } = {}) {
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
        if (loop) player.seekTo(start, true);
        else player.pauseVideo();
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
          if (e.data === YT.PlayerState.ENDED && loop) {
            player.seekTo(start, true);
            player.playVideo();
          }
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
