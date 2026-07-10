/* OPERATION MK DEV — CASE FILE investigation menu UI.
   Vanilla-JS "component": initCaseMenu(options) injects its own <style> and
   DOM once, wires everything, and returns { open, close, isOpen,
   notifyNewQuestion, destroy } so the host page's own tap-to-advance
   dialogue listener can guard itself with `if (menu.isOpen()) return;` —
   that guard, plus the fact that the menu overlay is a body-level sibling
   (not a descendant of the game frame), is the entire "VN pause" mechanism.
   No changes to vnPlayer.js's internal timer are needed: the backdrop fully
   covers the screen, so a typewriter finishing underneath is invisible.

   Depends on caseFileData.js (static content) and caseFileState.js
   (CaseFileState) both being loaded first. */

function initCaseMenu(options) {
  options = options || {};
  const missionTitle = options.missionTitle || '';
  const currentSceneId = options.currentSceneId || null;
  const mountSelector = options.mountSelector || null;

  CaseFileState.recordSceneVisit(currentSceneId);

  injectCaseMenuStyles();
  const root = buildCaseMenuDom();
  document.body.appendChild(root);
  const menuBtn = injectMenuButton(mountSelector);

  const el = {
    root,
    backdrop: root.querySelector('.cm-backdrop'),
    panel: root.querySelector('.cm-panel'),
    backBtn: root.querySelector('.cm-back'),
    closeBtn: root.querySelector('.cm-close'),
    title: root.querySelector('.cm-header-title'),
    body: root.querySelector('.cm-body'),
  };

  let nav = ['main'];
  let ctx = {};
  let linkPicker = null; // Set of evidence ids currently checked, while question-detail's link picker is open

  function isOpen() { return !root.classList.contains('cm-hidden'); }

  function open() {
    nav = ['main']; ctx = {}; linkPicker = null;
    root.classList.remove('cm-hidden');
    render();
    requestAnimationFrame(() => root.classList.add('cm-show'));
  }
  function close() {
    root.classList.remove('cm-show');
    setTimeout(() => { if (!root.classList.contains('cm-show')) root.classList.add('cm-hidden'); }, 200);
  }
  function back() {
    if (nav.length > 1) { nav.pop(); linkPicker = null; render(); }
    else close();
  }
  function pushView(view, newCtx) { nav.push(view); ctx = newCtx || {}; linkPicker = null; render(); }

  menuBtn.addEventListener('click', (e) => { e.stopPropagation(); open(); });
  el.backdrop.addEventListener('click', close);
  el.closeBtn.addEventListener('click', close);
  el.backBtn.addEventListener('click', back);
  el.panel.addEventListener('click', (e) => e.stopPropagation());

  el.body.addEventListener('click', onBodyClick);

  function onBodyClick(e) {
    const tabSwitch = e.target.closest('[data-tab-switch]');
    if (tabSwitch) { ctx.tab = tabSwitch.dataset.tabSwitch; render(); return; }
    const navTarget = e.target.closest('[data-nav]');
    if (navTarget) { pushView(navTarget.dataset.nav, { id: navTarget.dataset.id }); return; }
    const actionTarget = e.target.closest('[data-action]');
    if (!actionTarget) return;
    const action = actionTarget.dataset.action;
    const id = actionTarget.dataset.id;
    if (action === 'close') close();
    else if (action === 'markReviewed') { CaseFileState.markEvidenceReviewed(id); render(); }
    else if (action === 'markSeen') { CaseFileState.markQuestionSeen(id); render(); }
    else if (action === 'showLinkPicker') { linkPicker = new Set(); render(); }
    else if (action === 'cancelLinkPicker') { linkPicker = null; render(); }
    else if (action === 'toggleLinkCandidate') {
      if (linkPicker.has(id)) linkPicker.delete(id); else linkPicker.add(id);
      render();
    } else if (action === 'confirmLinks') {
      linkPicker.forEach(evidenceId => CaseFileState.linkEvidenceToQuestion(ctx.id, evidenceId));
      linkPicker = null;
      render();
    } else if (action === 'saveSlot') {
      const slot = Number(actionTarget.dataset.slot);
      const existing = CaseFileState.listSlots()[slot - 1];
      if (existing.occupied && !confirm(`슬롯 ${slot}에 이미 저장된 기록이 있습니다. 덮어쓸까요?`)) return;
      if (options.onSaveRequested) options.onSaveRequested(slot);
      render();
    } else if (action === 'loadSlot') {
      const slot = Number(actionTarget.dataset.slot);
      const existing = CaseFileState.listSlots()[slot - 1];
      if (!existing.occupied) return;
      if (!confirm(`슬롯 ${slot}을 불러올까요? 현재 진행 상황과 다를 수 있습니다.`)) return;
      const loaded = CaseFileState.loadSlot(slot);
      if (loaded && options.onResumeToScene) options.onResumeToScene(loaded.sceneId, loaded.lineIndex || 0);
      close();
    } else if (action === 'setTextSpeed') {
      CaseFileState.setSetting('textSpeed', actionTarget.dataset.value);
      render();
    } else if (action === 'toggleBoolSetting') {
      const s = CaseFileState.getSettings();
      const key = actionTarget.dataset.key;
      const value = !s[key];
      CaseFileState.setSetting(key, value);
      if (options.onSettingChange) options.onSettingChange(key, value);
      render();
    } else if (action === 'replayLocation') {
      location.href = `/dev/game/?scene=${encodeURIComponent(actionTarget.dataset.scene)}`;
    }
  }

  function render() {
    const view = nav[nav.length - 1];
    el.backBtn.classList.toggle('cm-hidden', nav.length <= 1);
    const renderers = {
      main: renderMain, investigation: renderInvestigation,
      evidenceDetail: renderEvidenceDetail, questionDetail: renderQuestionDetail, personDetail: renderPersonDetail,
      map: renderMap, mapDetail: renderMapDetail,
      inventory: renderInventory, inventoryDetail: renderInventoryDetail,
      system: renderSystem, save: renderSave, load: renderLoad, settings: renderSettings,
    };
    const r = renderers[view] || renderMain;
    const { title, html } = r();
    el.title.textContent = title;
    el.body.innerHTML = html;
  }

  /* ===== 메인 ===== */
  function renderMain() {
    const invBadge = CaseFileState.getInvestigationBadgeCount();
    const items = CaseFileState.getInventoryItems();
    const locations = CaseFileState.getMapLocations(currentSceneId);
    const unlockedCount = locations.filter(l => l.status !== 'locked').length;
    return {
      title: 'CASE FILE',
      html: `
        <div class="cm-mission">
          <div class="cm-mission-label">현재 미션</div>
          <div class="cm-mission-title">${escapeHtml(missionTitle)}</div>
        </div>
        <div class="cm-grid">
          <button class="cm-card" data-nav="investigation">
            <div class="cm-card-name">수사 노트</div>
            ${invBadge ? `<div class="cm-card-badge">${invBadge}</div>` : ''}
          </button>
          <button class="cm-card" data-nav="map">
            <div class="cm-card-name">지도</div>
            <div class="cm-card-badge cm-card-badge-muted">${unlockedCount}/${locations.length}</div>
          </button>
          <button class="cm-card" data-nav="inventory">
            <div class="cm-card-name">소지품</div>
            ${items.length ? `<div class="cm-card-badge cm-card-badge-muted">${items.length}</div>` : ''}
          </button>
          <button class="cm-card" data-nav="system">
            <div class="cm-card-name">시스템</div>
          </button>
        </div>
        <button class="cm-continue" data-action="close">계속하기</button>
      `,
    };
  }

  /* ===== 수사 노트 ===== */
  function renderInvestigation() {
    const tab = ctx.tab || 'evidence';
    const tabs = [
      { id: 'evidence', label: '증거' },
      { id: 'questions', label: '의문점' },
      { id: 'persons', label: '인물' },
    ];
    const tabBar = tabs.map(t => `<button class="cm-tab${t.id === tab ? ' cm-tab-active' : ''}" data-tab-switch="${t.id}">${t.label}</button>`).join('');
    let listHtml = '';
    if (tab === 'evidence') {
      const evidence = CaseFileState.getEvidence();
      listHtml = evidence.length ? evidence.map(ev => `
        <button class="cm-row" data-nav="evidenceDetail" data-id="${ev.id}">
          <div class="cm-row-main">
            <div class="cm-row-title">${escapeHtml(ev.title)}${ev.status === 'new' ? '<span class="cm-new-dot"></span>' : ''}</div>
            <div class="cm-row-sub">${escapeHtml(ev.code || '')}</div>
          </div>
          <div class="cm-row-arrow">›</div>
        </button>
      `).join('') : emptyNote('아직 확보한 증거가 없습니다.');
    } else if (tab === 'questions') {
      const questions = CaseFileState.getQuestions();
      listHtml = questions.length ? questions.map(q => `
        <button class="cm-row" data-nav="questionDetail" data-id="${q.id}">
          <div class="cm-row-main">
            <div class="cm-row-title cm-q-accent">${escapeHtml(q.title)}${q.isNew ? '<span class="cm-new-dot"></span>' : ''}</div>
            <div class="cm-row-sub">${questionStatusLabel(q.status)}</div>
          </div>
          <div class="cm-row-arrow">›</div>
        </button>
      `).join('') : emptyNote('아직 등록된 의문점이 없습니다.');
    } else {
      const persons = CaseFileState.getPersons();
      listHtml = persons.length ? persons.map(p => `
        <button class="cm-row" data-nav="personDetail" data-id="${p.id}">
          <div class="cm-row-main">
            <div class="cm-row-title">${escapeHtml(p.name)}</div>
            <div class="cm-row-sub">${escapeHtml(personStatusLabel(p.status))}</div>
          </div>
          <div class="cm-row-arrow">›</div>
        </button>
      `).join('') : emptyNote('아직 등록된 인물이 없습니다.');
    }
    // Re-bind the tab bar's own nav (it reuses data-nav="investigation" with a tab id).
    return { title: '수사 노트', html: `<div class="cm-tabbar">${tabBar}</div><div class="cm-list">${listHtml}</div>` };
  }

  function renderEvidenceDetail() {
    const ev = CaseFileState.getEvidence().find(e => e.id === ctx.id);
    if (!ev) return renderInvestigation();
    CaseFileState.markEvidenceReviewed(ev.id);
    return {
      title: ev.code || '증거',
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title">${escapeHtml(ev.title)}</div>
          <div class="cm-detail-desc">${escapeHtml(ev.description || '')}</div>
          <div class="cm-detail-field"><span class="cm-detail-label">발견 장소</span><span class="cm-detail-value">${escapeHtml(ev.discoveredLocationText || '알 수 없음')}</span></div>
          <div class="cm-detail-field"><span class="cm-detail-label">상태</span><span class="cm-detail-value">${evidenceStatusLabel(ev.status)}</span></div>
        </div>
      `,
    };
  }

  function renderQuestionDetail() {
    const q = CaseFileState.getQuestions().find(q => q.id === ctx.id);
    if (!q) return renderInvestigation();
    CaseFileState.markQuestionSeen(q.id);
    const linked = q.linkedEvidenceIds.map(id => CaseFileState.getEvidence().find(e => e.id === id)).filter(Boolean);
    if (linkPicker) {
      const allEvidence = CaseFileState.getEvidence();
      const rows = allEvidence.length ? allEvidence.map(ev => {
        const alreadyLinked = q.linkedEvidenceIds.includes(ev.id);
        const checked = alreadyLinked || linkPicker.has(ev.id);
        return `
          <button class="cm-pick-row${checked ? ' cm-pick-row-checked' : ''}" data-action="${alreadyLinked ? '' : 'toggleLinkCandidate'}" data-id="${ev.id}">
            <span class="cm-pick-box">${checked ? '✓' : ''}</span>
            <span>${escapeHtml(ev.title)}</span>
          </button>
        `;
      }).join('') : emptyNote('연결할 수 있는 증거가 없습니다.');
      return {
        title: '증거 연결',
        html: `<div class="cm-list">${rows}</div>
          <div class="cm-btn-row">
            <button class="cm-secondary-btn" data-action="cancelLinkPicker">취소</button>
            <button class="cm-primary-btn" data-action="confirmLinks">연결</button>
          </div>`,
      };
    }
    return {
      title: '의문점',
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title cm-q-accent">${escapeHtml(q.title)}</div>
          <div class="cm-detail-desc">${escapeHtml(q.description || '')}</div>
          <div class="cm-status-pill cm-status-${q.status}">${questionStatusLabel(q.status)}</div>
          ${q.resolutionText ? `<div class="cm-detail-desc">${escapeHtml(q.resolutionText)}</div>` : ''}
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">연결된 증거</span>
            ${linked.length ? linked.map(e => `<div class="cm-linked-item">• ${escapeHtml(e.title)}</div>`).join('') : '<div class="cm-linked-item cm-linked-empty">없음</div>'}
          </div>
          <button class="cm-secondary-btn cm-full" data-action="showLinkPicker">증거 연결</button>
        </div>
      `,
    };
  }

  function renderPersonDetail() {
    const p = CaseFileState.getPersons().find(p => p.id === ctx.id);
    if (!p) return renderInvestigation();
    // knownFacts/lies/unknowns (§14.3) are optional — older/sample person
    // rows only ever had `summary`, so those still render exactly as before.
    const factBlock = (label, items, cls) => (items && items.length)
      ? `<div class="cm-detail-field-block"><span class="cm-detail-label">${label}</span>${items.map(t => `<div class="cm-linked-item${cls ? ' ' + cls : ''}">• ${escapeHtml(t)}</div>`).join('')}</div>`
      : '';
    return {
      title: '인물',
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title">${escapeHtml(p.name)}</div>
          <div class="cm-detail-desc">${escapeHtml(p.summary || '')}</div>
          <div class="cm-detail-field"><span class="cm-detail-label">상태</span><span class="cm-detail-value">${escapeHtml(personStatusLabel(p.status))}</span></div>
          ${factBlock('확인된 사실', p.knownFacts)}
          ${factBlock('거짓말', p.lies, 'cm-lie-item')}
          ${factBlock('미확인', p.unknowns)}
        </div>
      `,
    };
  }

  /* ===== 지도 ===== */
  function renderMap() {
    const locations = CaseFileState.getMapLocations(currentSceneId);
    const rows = locations.map(loc => `
      <button class="cm-row" data-nav="mapDetail" data-id="${loc.id}">
        <div class="cm-row-main">
          <div class="cm-row-title">${mapStatusIcon(loc.status)} ${escapeHtml(loc.name)}</div>
          <div class="cm-row-sub">${mapStatusLabel(loc.status)}</div>
        </div>
        <div class="cm-row-arrow">›</div>
      </button>
    `).join('');
    return { title: '지도 · SYDNEY', html: `<div class="cm-list">${rows}</div>` };
  }

  function renderMapDetail() {
    const loc = CaseFileState.getMapLocations(currentSceneId).find(l => l.id === ctx.id);
    if (!loc) return renderMap();
    if (loc.status === 'locked') {
      return { title: loc.name, html: `<div class="cm-detail-card"><div class="cm-detail-desc">아직 방문하지 않은 장소입니다.</div></div>` };
    }
    return {
      title: loc.name,
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-field"><span class="cm-detail-label">상태</span><span class="cm-detail-value">${mapStatusLabel(loc.status)}</span></div>
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">관련 Scene</span>
            ${loc.relatedSceneIds.length ? loc.relatedSceneIds.map(id => `<div class="cm-linked-item">• ${escapeHtml(id)}</div>`).join('') : '<div class="cm-linked-item cm-linked-empty">없음</div>'}
          </div>
          ${loc.relatedSceneIds.length ? `<button class="cm-secondary-btn cm-full" data-action="replayLocation" data-scene="${escapeHtml(loc.relatedSceneIds[0])}">다시 보기</button>` : ''}
        </div>
      `,
    };
  }

  /* ===== 소지품 ===== */
  function renderInventory() {
    const items = CaseFileState.getInventoryItems();
    const rows = items.length ? items.map(it => `
      <button class="cm-row" data-nav="inventoryDetail" data-id="${it.id}">
        <div class="cm-row-icon">${it.icon || '❔'}</div>
        <div class="cm-row-main"><div class="cm-row-title">${escapeHtml(it.name)}</div></div>
        <div class="cm-row-arrow">›</div>
      </button>
    `).join('') : emptyNote('아직 소지품이 없습니다.');
    return { title: '소지품', html: `<div class="cm-list">${rows}</div>` };
  }

  function renderInventoryDetail() {
    const items = CaseFileState.getInventoryItems();
    const it = items.find(i => i.id === ctx.id);
    if (!it) return renderInventory();
    return {
      title: it.name,
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title">${it.icon || ''} ${escapeHtml(it.name)}</div>
          <div class="cm-detail-desc">${escapeHtml(it.description || '')}</div>
          <div class="cm-detail-field"><span class="cm-detail-label">획득 장소</span><span class="cm-detail-value">${escapeHtml(it.discoveredLocationText || '알 수 없음')}</span></div>
        </div>
      `,
    };
  }

  /* ===== 시스템 ===== */
  function renderSystem() {
    return {
      title: '시스템',
      html: `
        <div class="cm-list">
          <button class="cm-row" data-nav="save"><div class="cm-row-main"><div class="cm-row-title">저장하기</div></div><div class="cm-row-arrow">›</div></button>
          <button class="cm-row" data-nav="load"><div class="cm-row-main"><div class="cm-row-title">불러오기</div></div><div class="cm-row-arrow">›</div></button>
          <button class="cm-row" data-nav="settings"><div class="cm-row-main"><div class="cm-row-title">설정</div></div><div class="cm-row-arrow">›</div></button>
          <a class="cm-row" href="/dev/"><div class="cm-row-main"><div class="cm-row-title">DEV로 돌아가기</div></div><div class="cm-row-arrow">›</div></a>
        </div>
      `,
    };
  }

  function renderSave() {
    const slots = CaseFileState.listSlots();
    const rows = slots.map(s => `
      <button class="cm-row" data-action="saveSlot" data-slot="${s.slotNum}">
        <div class="cm-row-main">
          <div class="cm-row-title">슬롯 ${s.slotNum}</div>
          <div class="cm-row-sub">${s.occupied ? escapeHtml(s.missionTitle || '') + ' · ' + formatSaveTime(s.updatedAt) : '비어 있음'}</div>
        </div>
      </button>
    `).join('');
    return { title: '저장하기', html: `<div class="cm-list">${rows}</div>` };
  }

  function renderLoad() {
    const slots = CaseFileState.listSlots();
    const rows = slots.map(s => `
      <button class="cm-row"${s.occupied ? ` data-action="loadSlot" data-slot="${s.slotNum}"` : ' disabled'}>
        <div class="cm-row-main">
          <div class="cm-row-title">슬롯 ${s.slotNum}</div>
          <div class="cm-row-sub">${s.occupied ? escapeHtml(s.missionTitle || '') + ' · ' + formatSaveTime(s.updatedAt) : '비어 있음'}</div>
        </div>
      </button>
    `).join('');
    return { title: '불러오기', html: `<div class="cm-list">${rows}</div>` };
  }

  function renderSettings() {
    const s = CaseFileState.getSettings();
    const speeds = [['slow', '느림'], ['normal', '보통'], ['fast', '빠름'], ['instant', '즉시']];
    return {
      title: '설정',
      html: `
        <div class="cm-settings-block">
          <div class="cm-detail-label">텍스트 속도</div>
          <div class="cm-segmented">
            ${speeds.map(([v, label]) => `<button class="cm-seg${s.textSpeed === v ? ' cm-seg-active' : ''}" data-action="setTextSpeed" data-value="${v}">${label}</button>`).join('')}
          </div>
        </div>
        ${boolSettingRow('sfx', '효과음', s.sfx)}
        ${boolSettingRow('bgm', '배경음', s.bgm)}
        ${boolSettingRow('vibration', '진동', s.vibration)}
      `,
    };
  }

  function boolSettingRow(key, label, value) {
    return `
      <div class="cm-row cm-row-static">
        <div class="cm-row-main"><div class="cm-row-title">${label}</div></div>
        <button class="cm-toggle${value ? ' cm-toggle-on' : ''}" data-action="toggleBoolSetting" data-key="${key}">${value ? 'ON' : 'OFF'}</button>
      </div>
    `;
  }

  /* ===== NEW QUESTION 토스트 ===== */
  const toastEl = document.createElement('div');
  toastEl.className = 'cm-toast cm-hidden';
  document.body.appendChild(toastEl);
  let toastTimer = null;
  function notifyNewQuestion(title) {
    toastEl.innerHTML = `<div class="cm-toast-label">NEW QUESTION</div><div class="cm-toast-title">${escapeHtml(title)}</div>`;
    toastEl.classList.remove('cm-hidden');
    requestAnimationFrame(() => toastEl.classList.add('cm-toast-show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('cm-toast-show');
      setTimeout(() => toastEl.classList.add('cm-hidden'), 300);
    }, 1700);
  }

  return { open, close, isOpen, notifyNewQuestion, destroy: () => { root.remove(); toastEl.remove(); } };
}

/* ===== helpers ===== */
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function emptyNote(text) { return `<div class="cm-empty">${escapeHtml(text)}</div>`; }
function questionStatusLabel(status) { return { unresolved: '미해결', partial: '부분 해결', resolved: '해결됨' }[status] || status; }
function evidenceStatusLabel(status) { return { new: '용도 불명', reviewed: '확인함', linked: '연결됨', resolved: '해결됨' }[status] || status; }
function personStatusLabel(status) { return { unknown: '미상', witness: '목격자', suspect: '용의자', cleared: '혐의 없음', reopened: '재조사 중', involved: '연루됨', culprit: '범인' }[status] || status; }
function mapStatusLabel(status) { return { locked: '미방문', unlocked: '해금됨', visited: '방문함', current: '현재 위치' }[status] || status; }
function mapStatusIcon(status) { return { locked: '🔒', unlocked: '○', visited: '●', current: '●' }[status] || '○'; }
function formatSaveTime(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function injectMenuButton(mountSelector) {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'CASE FILE 메뉴 열기');
  btn.textContent = '☰';
  const mount = mountSelector && document.querySelector(mountSelector);
  if (mount) {
    btn.className = 'cm-menu-btn cm-menu-btn-inline';
    mount.appendChild(btn);
  } else {
    btn.className = 'cm-menu-btn cm-menu-btn-floating';
    (document.getElementById('frame') || document.body).appendChild(btn);
  }
  // Click handling (open() + stopPropagation so it doesn't also register as
  // a dialogue-advance tap) is wired by the caller, which has the closure.
  return btn;
}

function buildCaseMenuDom() {
  const root = document.createElement('div');
  root.className = 'cm-root cm-hidden';
  root.innerHTML = `
    <div class="cm-backdrop"></div>
    <div class="cm-panel">
      <div class="cm-header">
        <button class="cm-back cm-hidden" aria-label="뒤로">‹</button>
        <div class="cm-header-title">CASE FILE</div>
        <button class="cm-close" aria-label="닫기">×</button>
      </div>
      <div class="cm-body"></div>
    </div>
  `;
  return root;
}

function injectCaseMenuStyles() {
  if (document.getElementById('caseMenuStyles')) return;
  const style = document.createElement('style');
  style.id = 'caseMenuStyles';
  style.textContent = `
    .cm-menu-btn{font-family:'IBM Plex Mono',ui-monospace,monospace;cursor:pointer;display:flex;align-items:center;justify-content:center;border:none;-webkit-tap-highlight-color:transparent}
    .cm-menu-btn-inline{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(89,184,200,.4);color:var(--cyan,#59B8C8);font-size:15px}
    .cm-menu-btn-floating{position:absolute;top:calc(env(safe-area-inset-top,0) + 12px);left:14px;width:48px;height:48px;border-radius:50%;background:rgba(8,10,12,.6);border:1px solid rgba(255,255,255,.14);color:#fff;font-size:18px;z-index:30}

    .cm-root{position:fixed;inset:0;z-index:50;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif}
    .cm-root.cm-hidden{display:none}
    .cm-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .15s ease}
    .cm-panel{position:absolute;left:0;right:0;bottom:0;top:6%;max-width:430px;margin:0 auto;background:#10151B;border-radius:20px 20px 0 0;display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(14px);transition:opacity .18s ease,transform .18s ease;box-shadow:0 -8px 32px rgba(0,0,0,.5)}
    .cm-root.cm-show .cm-backdrop{opacity:1}
    .cm-root.cm-show .cm-panel{opacity:1;transform:translateY(0)}

    .cm-header{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.10)}
    .cm-back,.cm-close{background:none;border:none;color:#F1F3F5;font-size:22px;cursor:pointer;width:28px;height:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
    .cm-back.cm-hidden{visibility:hidden}
    .cm-header-title{flex:1;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:13px;letter-spacing:.08em;color:#F1F3F5;font-weight:700;text-transform:uppercase}
    .cm-close{margin-left:auto}
    .cm-body{flex:1;overflow-y:auto;touch-action:pan-y;padding:18px}

    .cm-mission{background:#171F29;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:14px 16px;margin-bottom:18px}
    .cm-mission-label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.1em;color:#7E8791;text-transform:uppercase;margin-bottom:6px}
    .cm-mission-title{font-size:15px;font-weight:700;color:#F1F3F5}

    .cm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
    .cm-card{position:relative;background:#171F29;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:20px 14px;text-align:left;cursor:pointer;color:#F1F3F5;font-family:inherit}
    .cm-card:active{background:#1c2530}
    .cm-card-name{font-size:14.5px;font-weight:700}
    .cm-card-badge{position:absolute;top:12px;right:12px;background:#C55353;color:#fff;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;font-weight:700;border-radius:10px;padding:2px 7px;min-width:18px;text-align:center}
    .cm-card-badge-muted{background:rgba(255,255,255,.10);color:#7E8791}

    .cm-continue{width:100%;background:#D8A93D;color:#191206;border:none;border-radius:14px;padding:16px;font-size:15px;font-weight:700;cursor:pointer;font-family:'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.04em}
    .cm-continue:active{opacity:.85}

    .cm-tabbar{display:flex;gap:6px;margin-bottom:14px}
    .cm-tab{flex:1;background:#171F29;border:1px solid rgba(255,255,255,.10);color:#7E8791;border-radius:10px;padding:10px 4px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
    .cm-tab-active{color:#D8A93D;border-color:rgba(216,169,61,.5);background:rgba(216,169,61,.08)}

    .cm-list{display:flex;flex-direction:column;gap:8px}
    .cm-row{display:flex;align-items:center;gap:12px;background:#171F29;border:1px solid rgba(255,255,255,.10);border-radius:12px;padding:13px 14px;text-align:left;cursor:pointer;color:#F1F3F5;font-family:inherit;text-decoration:none}
    .cm-row:active{background:#1c2530}
    .cm-row-static{cursor:default}
    .cm-row[disabled]{opacity:.45;cursor:default;pointer-events:none}
    .cm-row-icon{font-size:19px;width:24px;text-align:center;flex-shrink:0}
    .cm-row-main{flex:1;min-width:0}
    .cm-row-title{font-size:14px;font-weight:700;display:flex;align-items:center;gap:6px}
    .cm-row-sub{font-size:11.5px;color:#7E8791;margin-top:3px}
    .cm-row-arrow{color:#7E8791;font-size:16px;flex-shrink:0}
    .cm-q-accent{color:#4CB8D4}
    .cm-new-dot{width:7px;height:7px;border-radius:50%;background:#C55353;display:inline-block}
    .cm-empty{font-size:12.5px;color:#7E8791;padding:14px 2px}

    .cm-detail-card{background:#171F29;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:18px}
    .cm-detail-title{font-size:17px;font-weight:800;color:#F1F3F5;margin-bottom:10px}
    .cm-detail-desc{font-size:13.5px;line-height:1.6;color:#F1F3F5;margin-bottom:14px;word-break:keep-all}
    .cm-detail-field{display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid rgba(255,255,255,.08);font-size:13px}
    .cm-detail-label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.08em;color:#7E8791;text-transform:uppercase}
    .cm-detail-value{color:#F1F3F5;font-weight:600;text-align:right}
    .cm-detail-field-block{padding:10px 0;border-top:1px solid rgba(255,255,255,.08)}
    .cm-linked-item{font-size:13px;color:#F1F3F5;margin-top:6px}
    .cm-linked-empty{color:#7E8791}
    .cm-lie-item{color:#C55353}
    .cm-status-pill{display:inline-block;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:.04em;border-radius:12px;padding:4px 10px;margin-bottom:12px}
    .cm-status-unresolved{color:#C55353;background:rgba(197,83,83,.12)}
    .cm-status-partial{color:#D8A93D;background:rgba(216,169,61,.12)}
    .cm-status-resolved{color:#4CB8D4;background:rgba(76,184,212,.12)}

    .cm-secondary-btn{background:rgba(255,255,255,.08);color:#F1F3F5;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:12px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
    .cm-secondary-btn.cm-full{width:100%;margin-top:4px}
    .cm-primary-btn{flex:1;background:#4CB8D4;color:#06181c;border:none;border-radius:10px;padding:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
    .cm-btn-row{display:flex;gap:8px;margin-top:14px}
    .cm-btn-row .cm-secondary-btn{flex:1}

    .cm-pick-row{display:flex;align-items:center;gap:10px;width:100%;background:#171F29;border:1px solid rgba(255,255,255,.10);border-radius:12px;padding:12px 14px;color:#F1F3F5;font-size:13.5px;cursor:pointer;text-align:left;font-family:inherit}
    .cm-pick-row-checked{border-color:rgba(76,184,212,.5);background:rgba(76,184,212,.08)}
    .cm-pick-box{width:20px;height:20px;border-radius:5px;border:1px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#4CB8D4;font-size:13px}

    .cm-settings-block{margin-bottom:16px}
    .cm-segmented{display:flex;gap:6px;margin-top:8px}
    .cm-seg{flex:1;background:#171F29;border:1px solid rgba(255,255,255,.10);color:#7E8791;border-radius:10px;padding:10px 4px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit}
    .cm-seg-active{color:#D8A93D;border-color:rgba(216,169,61,.5);background:rgba(216,169,61,.08)}
    .cm-toggle{background:rgba(255,255,255,.08);color:#7E8791;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:6px 12px;font-size:11px;font-weight:700;font-family:'IBM Plex Mono',ui-monospace,monospace;cursor:pointer}
    .cm-toggle-on{color:#4CB8D4;border-color:rgba(76,184,212,.5);background:rgba(76,184,212,.1)}

    .cm-toast{position:fixed;top:calc(env(safe-area-inset-top,0) + 70px);left:50%;transform:translateX(-50%) translateY(-8px);z-index:60;background:rgba(9,12,16,.94);border:1px solid rgba(216,169,61,.4);border-radius:12px;padding:12px 16px;max-width:calc(100% - 56px);opacity:0;transition:opacity .3s ease,transform .3s ease;pointer-events:none}
    .cm-toast.cm-hidden{display:none}
    .cm-toast-show{opacity:1;transform:translateX(-50%) translateY(0)}
    .cm-toast-label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.1em;color:#D8A93D;margin-bottom:4px}
    .cm-toast-title{font-size:13px;color:#F1F3F5;font-weight:600;word-break:keep-all}
  `;
  document.head.appendChild(style);
}
