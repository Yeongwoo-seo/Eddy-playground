/* OPERATION MK DEV — shared full-screen loading animation.
   Every scene/minigame entry point has to wait on at least one network
   fetch (a Supabase-hosted photo, sometimes several) before it has anything
   real to show. A slow connection can make that take a couple of seconds —
   revealing the game view first and popping the photo in afterward (or
   silently sitting on a blank/placeholder screen) reads as broken, not
   loading. LoadingOverlay.show() must be called before that fetch starts,
   and .hide() only once everything it needs is actually ready to render, so
   the screen transition itself never happens ahead of the content it's
   transitioning to. Injected via JS (once per page) instead of a shared
   <link> stylesheet, matching the DevDiag banner pattern in assetDb.js. */
const LoadingOverlay = (() => {
  let el = null;
  let labelEl = null;

  function ensure() {
    if (el) return el;
    el = document.createElement('div');
    el.id = 'mkLoadingOverlay';
    el.innerHTML = `
      <style>
        #mkLoadingOverlay{position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;transition:opacity .35s ease}
        #mkLoadingOverlay.hide{opacity:0;pointer-events:none}
        #mkLoadingOverlay .mk-spinner{width:34px;height:34px;border-radius:50%;border:3px solid rgba(255,255,255,.14);border-top-color:#59B8C8;animation:mkLoadingSpin .8s linear infinite}
        #mkLoadingOverlay .mk-label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.14em;color:#929BA5;text-transform:uppercase}
        @keyframes mkLoadingSpin{to{transform:rotate(360deg)}}
      </style>
      <div class="mk-spinner"></div>
      <div class="mk-label"></div>
    `;
    document.body.appendChild(el);
    labelEl = el.querySelector('.mk-label');
    return el;
  }

  function show(label) {
    ensure();
    labelEl.textContent = label || '불러오는 중';
    el.classList.remove('hide');
  }

  function hide() {
    if (!el) return;
    el.classList.add('hide');
  }

  return { show, hide };
})();
