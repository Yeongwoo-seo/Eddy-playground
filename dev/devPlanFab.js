// Floating 개발계획 button — lets 생각날 때마다 the same notes from
// /dev/plan/ be jotted down without leaving whatever dev screen is open.
// Shares the devPlanNotes localStorage key with /dev/plan/index.html.
(function () {
  if (window.__devPlanFabInit) return;
  window.__devPlanFabInit = true;

  const STORAGE_KEY = 'devPlanNotes';

  const style = document.createElement('style');
  style.textContent = `
    .dpf-fab{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0));z-index:300;width:52px;height:52px;border-radius:50%;background:#D6A84B;color:#1a1206;border:none;font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.5);cursor:pointer;transition:transform .15s ease;-webkit-tap-highlight-color:transparent}
    .dpf-fab:active{transform:scale(.9)}

    .dpf-modal{position:fixed;inset:0;z-index:310;display:none;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif}
    .dpf-modal.dpf-show{display:block}
    .dpf-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .3s cubic-bezier(.2,.8,.2,1)}
    .dpf-panel{position:absolute;left:0;right:0;bottom:0;max-width:430px;margin:0 auto;height:min(78vh,560px);background:#10151B;border:1px solid rgba(255,255,255,.08);border-bottom:none;border-radius:24px 24px 0 0;box-shadow:0 -8px 32px rgba(0,0,0,.5);display:flex;flex-direction:column;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0));opacity:0;transform:translateY(24px) scale(.97);transition:opacity .3s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1)}
    .dpf-modal.dpf-show .dpf-backdrop{opacity:1}
    .dpf-modal.dpf-show .dpf-panel{opacity:1;transform:translateY(0) scale(1)}
    .dpf-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
    .dpf-title{font-size:17px;font-weight:700;color:#EDF1F4;flex:1}
    .dpf-status{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;color:#5F6872;letter-spacing:.04em;white-space:nowrap}
    .dpf-close{width:28px;height:28px;border-radius:50%;background:#171C22;border:1px solid rgba(255,255,255,.08);color:#EDF1F4;font-size:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
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

  const textarea = modal.querySelector('#dpfText');
  const status = modal.querySelector('#dpfStatus');
  const backdrop = modal.querySelector('.dpf-backdrop');
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

  fab.addEventListener('click', openModal);
  backdrop.addEventListener('click', closeModal);
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
