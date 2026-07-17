// Floating 개발계획 button — lets 생각날 때마다 the same notes from
// /dev/plan/ be jotted down without leaving whatever dev screen is open.
// Shares the devPlanNotes localStorage key with /dev/plan/index.html.
(function () {
  if (window.__devPlanFabInit) return;
  window.__devPlanFabInit = true;

  const STORAGE_KEY = 'devPlanNotes';
  const POS_KEY = 'devPlanFabPos';
  const DRAG_THRESHOLD = 6; // px of movement before a press counts as a drag, not a tap

  const style = document.createElement('style');
  style.textContent = `
    .dpf-fab{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0));z-index:300;width:52px;height:52px;border-radius:50%;background:#D6A84B;color:#1a1206;border:none;font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.5);cursor:grab;user-select:none;touch-action:none;-webkit-tap-highlight-color:transparent;transition:filter .1s}
    .dpf-fab.dpf-dragging{cursor:grabbing;filter:brightness(1.1)}

    .dpf-modal{position:fixed;inset:0;z-index:310;display:none;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif}
    .dpf-modal.dpf-show{display:block}
    .dpf-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .3s cubic-bezier(.2,.8,.2,1)}
    .dpf-panel{position:absolute;left:0;right:0;bottom:0;max-width:430px;margin:0 auto;height:min(78vh,560px);background:#10151B;border:1px solid rgba(255,255,255,.08);border-bottom:none;border-radius:24px 24px 0 0;box-shadow:0 -8px 32px rgba(0,0,0,.5);display:flex;flex-direction:column;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0));opacity:0;transform:translateY(24px) scale(.97);transition:opacity .3s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1)}
    .dpf-modal.dpf-show .dpf-backdrop{opacity:1}
    .dpf-modal.dpf-show .dpf-panel{opacity:1;transform:translateY(0) scale(1)}
    .dpf-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
    .dpf-title{font-size:17px;font-weight:700;color:#EDF1F4;flex:1}
    .dpf-status{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;color:#5F6872;letter-spacing:.04em;white-space:nowrap}
    .dpf-refresh,.dpf-close{width:28px;height:28px;border-radius:50%;background:#171C22;border:1px solid rgba(255,255,255,.08);color:#EDF1F4;font-size:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
    .dpf-refresh:active,.dpf-close:active{opacity:.7}
    .dpf-sub{font-size:12.5px;color:#929BA5;margin-bottom:12px;line-height:1.5}
    .dpf-textarea{flex:1;width:100%;resize:none;background:#101419;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;color:#EDF1F4;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:13.5px;line-height:1.7;outline:none}
    .dpf-textarea:focus{border-color:rgba(89,184,200,.4)}
    .dpf-textarea::placeholder{color:#5F6872}
  `;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.className = 'dpf-fab';
  fab.setAttribute('aria-label', '개발계획');
  fab.textContent = '📋';

  const modal = document.createElement('div');
  modal.className = 'dpf-modal';
  modal.innerHTML = `
    <div class="dpf-backdrop"></div>
    <div class="dpf-panel">
      <div class="dpf-header">
        <div class="dpf-title">개발계획</div>
        <div class="dpf-status" id="dpfStatus">&nbsp;</div>
        <button class="dpf-refresh" aria-label="새로고침">⟳</button>
        <button class="dpf-close" aria-label="닫기">✕</button>
      </div>
      <div class="dpf-sub">이 기기에만 저장되는 메모입니다.</div>
      <textarea class="dpf-textarea" id="dpfText" placeholder="예)
- [ ] week0 씬3 배경 교체
- [ ] 폰 찾기 미니게임 정답 영역 재조정
- [ ] 업로드 화면 크롭 UX 다듬기"></textarea>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(modal);

  // 다른 화면(전체화면 오버레이 등)이 이 버튼과 같은 자리(왼쪽 아래)를
  // 쓸 때 겹쳐서 터치를 가로채 가는 문제 — 그 화면이 열려있는 동안
  // window.__devPlanFab.style.display = 'none' 으로 잠깐 숨길 수 있게 참조를 남긴다.
  window.__devPlanFab = fab;

  const textarea = modal.querySelector('#dpfText');
  const status = modal.querySelector('#dpfStatus');
  const backdrop = modal.querySelector('.dpf-backdrop');
  const refreshBtn = modal.querySelector('.dpf-refresh');
  const closeBtn = modal.querySelector('.dpf-close');

  function openModal() {
    textarea.value = localStorage.getItem(STORAGE_KEY) || '';
    status.textContent = ' ';
    modal.classList.add('dpf-show');
    setTimeout(() => textarea.focus(), 300);
  }

  function closeModal() {
    modal.classList.remove('dpf-show');
  }

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  // Position is stored as % of viewport (not px) so it stays sane across
  // orientation changes / different viewport sizes.
  function applySavedPos() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(POS_KEY)); } catch (e) {}
    if (!saved || typeof saved.xPct !== 'number' || typeof saved.yPct !== 'number') return;
    const x = clamp(saved.xPct / 100 * window.innerWidth, 0, window.innerWidth - fab.offsetWidth);
    const y = clamp(saved.yPct / 100 * window.innerHeight, 0, window.innerHeight - fab.offsetHeight);
    fab.style.left = x + 'px';
    fab.style.top = y + 'px';
    fab.style.bottom = 'auto';
  }
  applySavedPos();

  let drag = null;
  fab.addEventListener('pointerdown', (e) => {
    fab.setPointerCapture(e.pointerId);
    const rect = fab.getBoundingClientRect();
    drag = { x: e.clientX, y: e.clientY, startLeft: rect.left, startTop: rect.top, moved: false };
  });
  fab.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) drag.moved = true;
    if (!drag.moved) return;
    fab.classList.add('dpf-dragging');
    const x = clamp(drag.startLeft + dx, 0, window.innerWidth - fab.offsetWidth);
    const y = clamp(drag.startTop + dy, 0, window.innerHeight - fab.offsetHeight);
    fab.style.left = x + 'px';
    fab.style.top = y + 'px';
    fab.style.bottom = 'auto';
  });
  ['pointerup', 'pointercancel'].forEach(evt => fab.addEventListener(evt, () => {
    if (!drag) return;
    const wasTap = !drag.moved;
    fab.classList.remove('dpf-dragging');
    if (wasTap) {
      openModal();
    } else {
      const rect = fab.getBoundingClientRect();
      localStorage.setItem(POS_KEY, JSON.stringify({
        xPct: rect.left / window.innerWidth * 100,
        yPct: rect.top / window.innerHeight * 100,
      }));
    }
    drag = null;
  }));

  backdrop.addEventListener('click', closeModal);
  // 새로고침 버튼은 페이지 새로고침이다 — 지금 입력 중인 내용을 먼저
  // 저장해 두어야(디바운스 도중이면 클릭 시점에 아직 localStorage에
  // 안 쓰였을 수 있다) 새로고침 후에도 이어서 볼 수 있다.
  refreshBtn.addEventListener('click', () => {
    clearTimeout(saveTimer);
    localStorage.setItem(STORAGE_KEY, textarea.value);
    location.reload();
  });
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('dpf-show')) closeModal();
  });

  let saveTimer = null;
  textarea.addEventListener('input', () => {
    status.textContent = '저장 중...';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, textarea.value);
      status.textContent = '저장됨';
    }, 400);
  });
})();
