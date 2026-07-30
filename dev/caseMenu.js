/* MISSING KEY DEV — CASE FILE investigation menu UI.
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
  // missionTitle may be a plain string (play/game's own scene name never
  // changes mid-scene) or a function returning the current title (dev/
  // explore's hub moves between locations without ever re-initializing this
  // menu, so it needs to read the *current* one each time the menu opens —
  // see resolveMissionTitle below).
  const missionTitleOption = options.missionTitle || '';
  const resolveMissionTitle = () => (typeof missionTitleOption === 'function' ? missionTitleOption() : missionTitleOption) || '';
  const currentSceneId = options.currentSceneId || null;
  const mountSelector = options.mountSelector || null;
  const disabled = !!options.disabled;
  // 1주차는 증거 1건뿐이라 증거노트(EvidenceNotebook) 진입점을 숨긴다 —
  // 2주차부터 노출.
  const isWeek1 = typeof currentSceneId === 'string' && /^week1-/.test(currentSceneId);

  CaseFileState.recordSceneVisit(currentSceneId);

  // CaseEntry 메타 카탈로그(§Phase 2)는 코드 내장 기본값으로 즉시 동작하지만,
  // 관리자가 /dev/upload에서 저장한 Supabase 오버라이드는 비동기로만 얻을 수
  // 있다. render()는 전부 동기 함수라 매번 await할 수 없으므로, 여기서 한 번
  // 프리페치해두고 — 열려 있는 도중 도착하면 그 자리에서 다시 그려 최신
  // 카탈로그를 반영한다.
  if (typeof AssetDB !== 'undefined' && AssetDB.prefetchCaseEntryMeta) {
    AssetDB.prefetchCaseEntryMeta().then(() => { if (isOpen()) render(); }).catch(() => {});
  }

  injectCaseMenuStyles();
  // 증거 획득 토스트의 사진/폴백 아이콘(CaseEntryUI.caseEntryIconHtml)이 쓰는
  // .ces-card-icon/.ces-icon-img 스타일 — 기존엔 증거 제시 시트를 한 번 열어야만
  // 늦게 주입돼, 시트를 열기 전에 뜨는 토스트가 아이콘 없이 보일 수 있었다.
  if (typeof CaseEntryUI !== 'undefined' && CaseEntryUI.injectCaseEntryUIStyles) CaseEntryUI.injectCaseEntryUIStyles();
  const root = buildCaseMenuDom();
  document.body.appendChild(root);
  const menuBtn = injectMenuButton(mountSelector, disabled);

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

  // 저장/불러오기 슬롯 목록은 이제 서버(AssetDB)와도 병합해야 해서 비동기다,
  // 반면 render()는 전부 동기 함수라 매번 await할 수 없다 — prefetchCaseEntryMeta
  // 위 주석과 같은 이유. CaseFileState.listSlotsLocalSync()로 즉시 그리고,
  // 백그라운드에서 서버-병합본이 도착하면 여전히 저장/불러오기 화면이 열려
  // 있을 때만 다시 그린다. pushView가 매 네비게이션마다 캐시를 비우므로
  // "저장하기"/"불러오기"를 다시 열 때마다 최신 목록을 새로 받아온다.
  let cachedSaveSlots = null;
  let slotsRefreshInFlight = false;
  function refreshSaveSlots() {
    if (slotsRefreshInFlight) return;
    slotsRefreshInFlight = true;
    CaseFileState.listSlots().then(slots => {
      slotsRefreshInFlight = false;
      cachedSaveSlots = slots;
      const top = nav[nav.length - 1];
      if (isOpen() && (top === 'save' || top === 'load')) render();
    }).catch(() => { slotsRefreshInFlight = false; });
  }

  function isOpen() { return !root.classList.contains('cm-hidden'); }

  function open() {
    if (disabled) return;
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
  function pushView(view, newCtx) { nav.push(view); ctx = newCtx || {}; linkPicker = null; cachedSaveSlots = null; render(); }

  menuBtn.addEventListener('click', (e) => { e.stopPropagation(); open(); });
  el.backdrop.addEventListener('click', close);
  el.closeBtn.addEventListener('click', close);
  el.backBtn.addEventListener('click', back);
  el.panel.addEventListener('click', (e) => e.stopPropagation());

  el.body.addEventListener('click', onBodyClick);

  async function onBodyClick(e) {
    const tabSwitch = e.target.closest('[data-tab-switch]');
    if (tabSwitch) { ctx.tab = tabSwitch.dataset.tabSwitch; render(); return; }
    const evidenceFilter = e.target.closest('[data-evidence-filter]');
    if (evidenceFilter) { ctx.evidenceFilter = evidenceFilter.dataset.evidenceFilter; render(); return; }
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
      const existing = (cachedSaveSlots || CaseFileState.listSlotsLocalSync())[slot - 1];
      if (existing.occupied && !confirm(`슬롯 ${slot}에 이미 저장된 기록이 있습니다. 덮어쓸까요?`)) return;
      if (options.onSaveRequested) await options.onSaveRequested(slot);
      cachedSaveSlots = null;
      render();
    } else if (action === 'loadSlot') {
      const slot = Number(actionTarget.dataset.slot);
      const existing = (cachedSaveSlots || CaseFileState.listSlotsLocalSync())[slot - 1];
      if (!existing.occupied) return;
      if (!confirm(`슬롯 ${slot}을 불러올까요? 현재 진행 상황과 다를 수 있습니다.`)) return;
      const loaded = await CaseFileState.loadSlot(slot);
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
      location.href = `/play/game/?scene=${encodeURIComponent(actionTarget.dataset.scene)}`;
    } else if (action === 'openShop') {
      if (options.onOpenShop) options.onOpenShop();
    } else if (action === 'openWardrobe') {
      if (options.onOpenWardrobe) options.onOpenWardrobe();
    } else if (action === 'openNotebook') {
      // 증거 DB 노트 v1.1 — 기존 평면 목록/상세 뷰(evidenceRow의 data-nav,
      // renderEvidenceDetail 등)는 그대로 두고, 노트는 별도 진입점으로만
      // 추가한다. EvidenceNotebook은 선택적 스크립트라 로드 안 된 페이지에서
      // 버튼 자체가 없거나(주입 쪽에서 typeof 가드) 눌려도 조용히 무시한다.
      if (typeof EvidenceNotebook !== 'undefined') EvidenceNotebook.open({ mode: 'browse', focusEntryId: id || null });
    }
  }

  function render() {
    const view = nav[nav.length - 1];
    el.backBtn.classList.toggle('cm-hidden', nav.length <= 1);
    const renderers = {
      main: renderMain, investigation: renderInvestigation,
      evidenceDetail: renderEvidenceDetail, testimonyDetail: renderTestimonyDetail,
      questionDetail: renderQuestionDetail, personDetail: renderPersonDetail,
      deductionDetail: renderDeductionDetail, factDetail: renderFactDetail,
      map: renderMap, mapDetail: renderMapDetail,
      inventory: renderInventory, inventoryDetail: renderInventoryDetail,
      system: renderSystem, save: renderSave, load: renderLoad, settings: renderSettings,
    };
    const r = renderers[view] || renderMain;
    const { title, html } = r();
    el.title.textContent = title;
    el.body.innerHTML = html;
    // 개별 승인 이미지가 있으면 폴백 이모지를 <img>로 교체(§10.14) — 모든
    // 뷰가 여기 한 곳을 거치므로 리스트/상세 어디든 따로 훅을 안 걸어도 된다.
    if (typeof CaseEntryUI !== 'undefined') CaseEntryUI.hydrateCaseEntryIcons(el.body);
  }

  /* ===== 메인 ===== */
  // 옷가게/옷장 (The Missing Key v1 §6.1) only ever show once unlocked — the
  // menu doesn't hide them entirely so much as never render the cards, same
  // as §6.1's "노출 규칙" for 지도/케이스 파일/추론.
  function renderMain() {
    const invBadge = CaseFileState.getInvestigationBadgeCount();
    const items = CaseFileState.getInventoryItems();
    const locations = CaseFileState.getMapLocations(currentSceneId);
    const unlockedCount = locations.filter(l => l.status !== 'locked').length;
    const pointsIntroduced = CaseFileState.hasFlag('pointsUiIntroduced');
    const shopUnlocked = typeof ShopState !== 'undefined' && ShopState.isUnlocked();
    const wardrobeUnlocked = typeof WardrobeState !== 'undefined' && WardrobeState.isUnlocked();
    return {
      title: 'CASE FILE',
      html: `
        <div class="cm-mission">
          <div class="cm-mission-label">현재 미션</div>
          <div class="cm-mission-title">${escapeHtml(resolveMissionTitle())}</div>
          ${pointsIntroduced ? `<div class="cm-mission-points">P ${EconomyState.getPoints()}</div>` : ''}
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
          ${shopUnlocked ? shopEntryCard('옷가게', 'openShop') : ''}
          ${wardrobeUnlocked ? shopEntryCard('옷장', 'openWardrobe') : ''}
        </div>
        <button class="cm-continue" data-action="close">계속하기</button>
      `,
    };
  }

  /* ===== 수사 노트 ===== */
  // 증거/증언/추리 메모 3분류 (§5.1) — 기존 "증거" 탭 안에 category:
  // 'testimony'로 섞여 있던 진술을 별도 탭으로 분리하고, "의문점" 탭을
  // "추리 메모"로 재명명한다. 인물/추론 탭은 그대로 유지(§5.1 "인물 프로필은
  // 기존 인물 탭이 있다면 유지"). 목록 내용 자체(제목/설명 등)는 그대로,
  // CaseFileState.getCaseEntries()가 kind로 나눠주는 것만 새로 쓴다.
  function renderInvestigation() {
    const tab = ctx.tab || 'evidence';
    const tabs = [
      { id: 'evidence', label: '증거' },
      { id: 'testimony', label: '증언' },
      { id: 'memo', label: '추리 메모' },
      { id: 'persons', label: '인물' },
      { id: 'deduction', label: '추론' },
    ];
    const tabBar = tabs.map(t => `<button class="cm-tab${t.id === tab ? ' cm-tab-active' : ''}" data-tab-switch="${t.id}">${t.label}</button>`).join('');
    let listHtml = '';
    if (tab === 'evidence') {
      listHtml = renderEvidenceTabBody();
    } else if (tab === 'testimony') {
      listHtml = renderTestimonyTabBody();
    } else if (tab === 'memo') {
      const memos = CaseFileState.getCaseEntries().filter(e => e.kind === 'memo');
      listHtml = memos.length ? memos.map(m => `
        <button class="cm-row" data-nav="questionDetail" data-id="${m.id}">
          <div class="cm-row-main">
            <div class="cm-row-title cm-q-accent">${escapeHtml(m.title)}${m.isNew ? '<span class="cm-new-dot"></span>' : ''}</div>
            <div class="cm-row-sub">${questionStatusLabel(m.status)}</div>
          </div>
          <div class="cm-row-arrow">›</div>
        </button>
      `).join('') : emptyNote('아직 등록된 추리 메모가 없습니다.');
    } else if (tab === 'deduction') {
      listHtml = renderDeductionTabBody();
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

  // 증거 탭 — 종류(물증/사진·영상/진술/기록)별 필터 칩 + 그룹 리스트. 필터가
  // '전체'일 때는 카테고리 섹션으로 나눠서 보여주고, 특정 종류를 고르면 그
  // 종류만 평평한 리스트로 보여준다. ctx.evidenceFilter는 tab 전환처럼
  // pushView 없이 유지되는 값이라 (onBodyClick 참고) 증거 탭을 벗어났다
  // 돌아와도 마지막으로 고른 필터가 살아있다. (EVIDENCE_CATEGORY_ORDER는
  // 모듈 최상단 — 탐색허브 증거 제시(play/explore/index.html)도 같은 분류
  // 순서를 쓴다.)
  function renderEvidenceTabBody() {
    const evidence = CaseFileState.getCaseEntries().filter(e => e.kind === 'evidence');
    if (!evidence.length) return emptyNote('아직 확보한 증거가 없습니다.');
    const filter = ctx.evidenceFilter || 'all';
    const presentCats = EVIDENCE_CATEGORY_ORDER.filter(c => c !== 'testimony' && evidence.some(ev => (ev.subtype || 'etc') === c));
    const notebookBtn = isWeek1 ? '' : `<button class="cm-notebook-btn" data-action="openNotebook">📓 수첩으로 보기</button>`;
    const filterBar = `
      <div class="cm-filter-row">
        <button class="cm-filter-chip${filter === 'all' ? ' cm-filter-chip-active' : ''}" data-evidence-filter="all">전체 ${evidence.length}</button>
        ${presentCats.map(c => {
          const count = evidence.filter(ev => (ev.subtype || 'etc') === c).length;
          return `<button class="cm-filter-chip${filter === c ? ' cm-filter-chip-active' : ''}" data-evidence-filter="${c}">${evidenceCategoryLabel(c)} ${count}</button>`;
        }).join('')}
      </div>
    `;
    let bodyHtml;
    if (filter !== 'all') {
      const items = evidence.filter(ev => (ev.subtype || 'etc') === filter);
      bodyHtml = `<div class="cm-list">${items.map(evidenceRow).join('')}</div>`;
    } else {
      bodyHtml = presentCats.map(c => {
        const items = evidence.filter(ev => (ev.subtype || 'etc') === c);
        return `
          <div class="cm-section-label cm-section-label-spaced">${evidenceCategoryLabel(c)}</div>
          <div class="cm-list">${items.map(evidenceRow).join('')}</div>
        `;
      }).join('');
    }
    return notebookBtn + filterBar + bodyHtml;
  }
  function evidenceRow(ev) {
    return `
      <button class="cm-row" data-nav="evidenceDetail" data-id="${ev.id}">
        ${rowIconHtml(ev)}
        <div class="cm-row-main">
          <div class="cm-row-title">${escapeHtml(ev.title)}${ev.status === 'new' ? '<span class="cm-new-dot"></span>' : ''}${ev.status === 'updated' ? '<span class="cm-updated-tag">업데이트됨</span>' : ''}</div>
          <div class="cm-row-sub">${escapeHtml(ev.code || '')}${ev.stages.length ? ` · 조사 단계 ${ev.stages.length}` : ''}</div>
        </div>
        <div class="cm-row-arrow">›</div>
      </button>
    `;
  }

  // 증언 탭 (§5.1/§8.3) — 증거 탭과 같은 cm-row 골격을 쓰되, 부제목에
  // 증언자 이름 + 현재 핵심 주장을 보여준다(코드가 아니라 발언이 중요하다는
  // 원칙, §8.3 "카드 구성"). 필터는 증언자별로 정리하기엔 인원이 적어
  // 카테고리 칩 없이 전체 리스트만 보여준다.
  function renderTestimonyTabBody() {
    const testimonies = CaseFileState.getCaseEntries().filter(e => e.kind === 'testimony');
    if (!testimonies.length) return emptyNote('아직 기록된 증언이 없습니다.');
    const notebookBtn = isWeek1 ? '' : `<button class="cm-notebook-btn" data-action="openNotebook">📓 수첩으로 보기</button>`;
    return notebookBtn + `<div class="cm-list">${testimonies.map(testimonyRow).join('')}</div>`;
  }
  function testimonyRow(t) {
    return `
      <button class="cm-row" data-nav="testimonyDetail" data-id="${t.id}">
        ${rowIconHtml(t)}
        <div class="cm-row-main">
          <div class="cm-row-title">${escapeHtml(t.title)}${t.status === 'new' ? '<span class="cm-new-dot"></span>' : ''}</div>
          <div class="cm-row-sub">${escapeHtml(t.speakerName || '')}${t.speakerName ? ' · ' : ''}${escapeHtml(t.summary || '')}</div>
        </div>
        <div class="cm-row-arrow">›</div>
      </button>
    `;
  }

  // 추론 탭 (The Missing Key v4 §5) — two groups: questions that currently
  // carry a hypothesis (or did, even if since invalidated), then every
  // generated 추론 사실 regardless of which question it's attached to (a fact
  // can relate to more than one question, so it doesn't belong to just one
  // question's row).
  function renderDeductionTabBody() {
    const questionsWithHypotheses = CaseFileState.getQuestions().filter(q => CaseFileState.getCurrentHypothesis(q.id) || CaseFileState.getHypothesisHistory(q.id).length);
    const facts = CaseFileState.getFacts();
    const hypothesisRows = questionsWithHypotheses.length ? questionsWithHypotheses.map(q => {
      const current = CaseFileState.getCurrentHypothesis(q.id);
      return `
        <button class="cm-row" data-nav="deductionDetail" data-id="${q.id}">
          <div class="cm-row-main">
            <div class="cm-row-title cm-q-accent">${escapeHtml(q.title)}</div>
            <div class="cm-row-sub">${current ? escapeHtml(current.text) : '가설 없음'} · ${questionStatusLabel(q.status)}</div>
          </div>
          <div class="cm-row-arrow">›</div>
        </button>
      `;
    }).join('') : emptyNote('아직 세운 가설이 없습니다.');
    const factRows = facts.length ? facts.map(f => `
      <button class="cm-row" data-nav="factDetail" data-id="${f.id}">
        <div class="cm-row-main">
          <div class="cm-row-title">${escapeHtml(f.title)}</div>
          <div class="cm-row-sub">추론 사실 · ${escapeHtml(f.confidence || '')}</div>
        </div>
        <div class="cm-row-arrow">›</div>
      </button>
    `).join('') : emptyNote('아직 생성된 추론 사실이 없습니다.');
    return `
      <div class="cm-section-label">현재 가설</div>
      <div class="cm-list">${hypothesisRows}</div>
      <div class="cm-section-label cm-section-label-spaced">생성된 사실</div>
      <div class="cm-list">${factRows}</div>
    `;
  }

  function renderDeductionDetail() {
    const q = CaseFileState.getQuestions().find(q => q.id === ctx.id);
    if (!q) return renderInvestigation();
    const current = CaseFileState.getCurrentHypothesis(q.id);
    const history = CaseFileState.getHypothesisHistory(q.id);
    const relatedFacts = CaseFileState.getFactsForQuestion(q.id);
    const historyHtml = history.length ? history.slice().reverse().map(h => `
      <div class="cm-linked-item${h.status === 'invalidated' ? ' cm-hyp-invalidated' : ''}">
        • ${escapeHtml(h.hypothesis ? h.hypothesis.text : h.hypothesisId)}
        ${h.status === 'invalidated' ? ' <span class="cm-hyp-tag">폐기됨</span>' : ' <span class="cm-hyp-tag cm-hyp-tag-current">현재</span>'}
      </div>
    `).join('') : '';
    return {
      title: '추론',
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title cm-q-accent">${escapeHtml(q.title)}</div>
          <div class="cm-status-pill cm-status-${q.status}">${questionStatusLabel(q.status)}</div>
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">현재 가설</span>
            <div class="cm-linked-item">${current ? escapeHtml(current.text) : '아직 가설을 세우지 않았습니다.'}</div>
          </div>
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">가설 변화 이력</span>
            ${historyHtml || '<div class="cm-linked-item cm-linked-empty">없음</div>'}
          </div>
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">관련 추론 사실</span>
            ${relatedFacts.length ? relatedFacts.map(f => `<div class="cm-linked-item">• ${escapeHtml(f.title)}</div>`).join('') : '<div class="cm-linked-item cm-linked-empty">없음</div>'}
          </div>
        </div>
      `,
    };
  }

  function renderFactDetail() {
    const f = CaseFileState.getFacts().find(f => f.id === ctx.id);
    if (!f) return renderInvestigation();
    const sourceEvidence = (f.sourceEvidenceIds || []).map(id => CaseFileState.getEvidence().find(e => e.id === id)).filter(Boolean);
    const relatedQuestions = (f.relatedQuestionIds || []).map(id => CaseFileState.getQuestions().find(q => q.id === id)).filter(Boolean);
    return {
      title: '추론 사실',
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title">${escapeHtml(f.title)}</div>
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">근거 증거</span>
            ${sourceEvidence.length ? sourceEvidence.map(e => `<div class="cm-linked-item">• ${escapeHtml(e.title)}</div>`).join('') : '<div class="cm-linked-item cm-linked-empty">없음</div>'}
          </div>
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">관련 의문점</span>
            ${relatedQuestions.length ? relatedQuestions.map(q => `<div class="cm-linked-item">• ${escapeHtml(q.title)}</div>`).join('') : '<div class="cm-linked-item cm-linked-empty">없음</div>'}
          </div>
        </div>
      `,
    };
  }

  function renderEvidenceDetail() {
    const ev = CaseFileState.getCaseEntries().find(e => e.kind === 'evidence' && e.id === ctx.id);
    if (!ev) return renderInvestigation();
    CaseFileState.markEvidenceReviewed(ev.id);
    // 같은 원본을 병합한 조사 단계(§6.3) — 목록에는 대표 카드 한 장만
    // 보이고, 여기 상세 화면에서만 시간순으로 누적된 단계를 보여준다.
    const stagesHtml = ev.stages.length ? ev.stages.map(s => `
      <div class="cm-linked-item">✓ ${escapeHtml(s.title)}${s.detail ? ` — ${escapeHtml(s.detail)}` : ''}</div>
    `).join('') : '';
    return {
      title: ev.code || '증거',
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title">${escapeHtml(ev.title)}</div>
          <div class="cm-detail-desc">${escapeHtml(ev.description || '')}</div>
          <div class="cm-detail-field"><span class="cm-detail-label">발견 장소</span><span class="cm-detail-value">${escapeHtml(ev.discoveredLocationText || '알 수 없음')}</span></div>
          <div class="cm-detail-field"><span class="cm-detail-label">상태</span><span class="cm-detail-value">${evidenceStatusLabel(ev.status)}</span></div>
          ${stagesHtml ? `<div class="cm-detail-field-block"><span class="cm-detail-label">조사 단계</span>${stagesHtml}</div>` : ''}
        </div>
      `,
    };
  }

  // 증언 상세 (§6.4/§8.3) — 최신 발언은 카드 상단에, 이전 발언은 "증언 변경
  // 이력"에서 최신이 위로 오도록 뒤집어 보여준다(§6.4 "목록에서는 최신
  // 발언만 보여주고, 상세 화면의 증언 변경 이력에서 이전 발언을 확인").
  function renderTestimonyDetail() {
    const t = CaseFileState.getCaseEntries().find(e => e.kind === 'testimony' && e.id === ctx.id);
    if (!t) return renderInvestigation();
    CaseFileState.markEvidenceReviewed(t.id);
    const historyHtml = t.history.length ? t.history.slice().reverse().map(h => `
      <div class="cm-linked-item${h.active ? '' : ' cm-hyp-invalidated'}">
        • ${escapeHtml(h.statement || '')}${h.reason ? ` <span class="cm-hyp-tag">${escapeHtml(h.reason)}</span>` : ''}
        ${h.active ? ' <span class="cm-hyp-tag cm-hyp-tag-current">현재</span>' : ''}
      </div>
    `).join('') : '<div class="cm-linked-item cm-linked-empty">없음</div>';
    return {
      title: '증언',
      html: `
        <div class="cm-detail-card">
          <div class="cm-detail-title">${escapeHtml(t.title)}</div>
          ${t.speakerName ? `<div class="cm-detail-field"><span class="cm-detail-label">증언자</span><span class="cm-detail-value">${escapeHtml(t.speakerName)}</span></div>` : ''}
          <div class="cm-status-pill cm-status-${t.status}">${testimonyStatusLabel(t.status)}</div>
          <div class="cm-detail-desc">${escapeHtml(t.summary || '')}</div>
          <div class="cm-detail-field"><span class="cm-detail-label">확보 장소</span><span class="cm-detail-value">${escapeHtml(t.discoveredLocationText || '알 수 없음')}</span></div>
          <div class="cm-detail-field-block">
            <span class="cm-detail-label">증언 변경 이력</span>
            ${historyHtml}
          </div>
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
    const slots = cachedSaveSlots || CaseFileState.listSlotsLocalSync();
    if (!cachedSaveSlots) refreshSaveSlots();
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
    const slots = cachedSaveSlots || CaseFileState.listSlotsLocalSync();
    if (!cachedSaveSlots) refreshSaveSlots();
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

  /* ===== NEW QUESTION 토스트 (§큐 — 한 줄의 effects 배열에서 addEvidence가
     여러 건 한꺼번에 fire되는 경우(예: week2-scene-008 사진 분석 씬 하나에서
     증거 3건)도 서로 덮어쓰지 않고 하나씩 순서대로 보여주기 위해 큐를 둔다.
     기존 notify* 호출들도 전부 같은 큐를 타므로 같은 틱에 서로 다른 알림이
     겹쳐도 안전하다. ===== */
  const toastEl = document.createElement('div');
  toastEl.className = 'cm-toast cm-hidden';
  document.body.appendChild(toastEl);
  let toastTimer = null;
  let toastQueue = [];
  let toastBusy = false;
  function runToastQueue() {
    const next = toastQueue.shift();
    if (!next) { toastBusy = false; return; }
    toastBusy = true;
    toastEl.innerHTML = next.html;
    toastEl.classList.remove('cm-hidden');
    requestAnimationFrame(() => toastEl.classList.add('cm-toast-show'));
    if (next.imageAssetId && typeof CaseEntryUI !== 'undefined') CaseEntryUI.hydrateCaseEntryIcons(toastEl);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('cm-toast-show');
      setTimeout(() => { toastEl.classList.add('cm-hidden'); runToastQueue(); }, 300);
    }, 1700);
  }
  function queueToast(html, imageAssetId) {
    toastQueue.push({ html, imageAssetId: imageAssetId || null });
    if (!toastBusy) runToastQueue();
  }
  function notifyToast(label, title) {
    queueToast(`<div class="cm-toast-label">${escapeHtml(label)}</div><div class="cm-toast-title">${escapeHtml(title)}</div>`);
  }
  function notifyNewQuestion(title) { notifyToast('NEW QUESTION', title); }
  // The Missing Key v1 §4.5 — a short toast for points earned mid-scene
  // (e.g. a scene's own addPoints effect), distinct from the fuller CLEAR!
  // breakdown screen a standalone minigame page shows on its own results screen.
  function notifyPoints(amount) { notifyToast('포인트 획득', `+${amount}P`); }
  // The Missing Key v4 §15 — 증거 연결 성공 시 "새 사실 카드 생성 / 수사노트
  // 등록 알림", 가설 선택 시 "현재 가설로 저장" 피드백. Reuses the same toast
  // queue as notifyNewQuestion.
  function notifyHypothesis(text) { notifyToast('가설 저장됨', text); }
  function notifyFact(title) { notifyToast('추론 사실 생성', title); }
  // 여행 만족도 / 영우 호감도 게이지 변화 — notifyPoints와 같은 목적의 짧은
  // 토스트(연출용 게이지라 방향·크기만 확인시켜주면 충분).
  function notifySatisfaction(amount) { notifyToast('여행 만족도', `${amount > 0 ? '+' : ''}${amount}`); }
  function notifyAffection(amount) { notifyToast('영우 호감도', `${amount > 0 ? '+' : ''}${amount}`); }
  // 증거 획득 시 뜨는 팝업에 넘길 표시용 데이터 조합 — 대사 줄 안에
  // "[ 증거: ... ] 등록." 문구를 박아 알리던 방식 대신, addEvidence effect가
  // fire될 때마다 사진을 포함해 보여준다. 사진은 증거수첩(evidenceNotebook.js
  // photoAssetIdFor)과 완전히 같은 우선순위로 골라야 "증거 DB에 올린 그
  // 사진"이 카드 아이콘이 아니라 이 팝업에도 그대로 뜬다 — 아래
  // CaseEvidencePopup.resolvePhotoAssetId 참고. 팝업 자체는 CaseEvidencePopup
  // (페이지 전역 싱글턴, 아래 정의)이 담당 — initCaseMenu 인스턴스와 무관하게
  // dev/settings/ 같은 다른 페이지에서도 재사용하기 위함(CaseEvidencePopup.
  // preview 참고).
  function notifyEvidence(item) {
    if (!item) return;
    const entries = (typeof CaseFileState !== 'undefined' && CaseFileState.getCaseEntries) ? CaseFileState.getCaseEntries() : [];
    const entry = entries.find(e => e.id === item.id) || null;
    const base = {
      title: (entry && entry.title) || item.title || '',
      summary: (entry && (entry.summary || entry.description)) || item.description || '',
      fallbackIcon: (entry && entry.fallbackIcon) || '🧾',
    };
    const lookup = entry || { id: item.id, kind: item.category === 'testimony' ? 'testimony' : 'evidence', detailImageAssetId: null, imageAssetId: null };
    CaseEvidencePopup.resolvePhotoAssetId(lookup)
      .then(imageAssetId => CaseEvidencePopup.show(Object.assign({}, base, { imageAssetId })))
      .catch(() => CaseEvidencePopup.show(Object.assign({}, base, { imageAssetId: null })));
  }

  return {
    open, close, isOpen, notifyNewQuestion, notifyHypothesis, notifyFact, notifyPoints, notifySatisfaction, notifyAffection, notifyEvidence,
    destroy: () => { root.remove(); toastEl.remove(); },
  };
}

/* ===== 증거 획득 팝업 (CaseEvidencePopup) — 스쳐 지나가는 토스트 대신 화면을
   암전시키고 아래에서 위로 올라오는 시트로 사진/이름/설명을 보여주고 확인
   버튼을 눌러야 닫힌다. initCaseMenu 인스턴스가 아니라 페이지 전역 싱글턴으로
   둬서, CASE FILE 메뉴 전체(저장/불러오기/수사노트 등)를 띄울 필요 없이
   dev/settings/(게임환경설정) 같은 DEV 페이지에서도 caseMenu.js만 로드해
   CaseEvidencePopup.preview()로 바로 미리볼 수 있다. */
const CaseEvidencePopup = (() => {
  let root = null;
  let sheet = null;
  let queue = [];
  let busy = false;
  let typingTimer = null;

  function ensureDom() {
    if (root) return;
    injectCaseMenuStyles();
    root = document.createElement('div');
    root.className = 'cm-evp-root cm-hidden';
    root.innerHTML = `<div class="cm-evp-backdrop"></div><div class="cm-evp-sheet"></div>`;
    document.body.appendChild(root);
    sheet = root.querySelector('.cm-evp-sheet');
    sheet.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="closeEvidencePopup"]')) close();
    });
  }
  function html(entry) {
    const photoHtml = entry.imageAssetId
      ? `<span class="cm-evp-photo" data-icon-asset="${entry.imageAssetId}">${entry.fallbackIcon}</span>`
      : `<span class="cm-evp-photo">${entry.fallbackIcon}</span>`;
    return `
      <div class="cm-evp-eyebrow">증거 획득</div>
      ${photoHtml}
      <div class="cm-evp-name">${escapeHtml(entry.title)}</div>
      <div class="cm-evp-desc"></div>
      <button class="cm-evp-confirm" data-action="closeEvidencePopup">확인</button>
    `;
  }
  // 게임 대사(vnPlayer.js typeText)와 같은 속도 체계 — 설정의 텍스트 속도를
  // 그대로 따라간다. dev/settings/ 미리보기처럼 CaseFileState가 없는
  // 페이지에서는 '보통' 속도로 고정.
  function typingSpeedMs() {
    const speeds = { slow: 58, normal: 36, fast: 18, instant: 0 };
    const setting = (typeof CaseFileState !== 'undefined' && CaseFileState.getSettings) ? CaseFileState.getSettings().textSpeed : 'normal';
    return speeds[setting] != null ? speeds[setting] : speeds.normal;
  }
  // 설명을 한 글자씩 채워 넣고, 다 채워진 뒤에만 확인 버튼을 페이드인 +
  // 클릭 가능하게 만든다 — 버튼은 html()에서 이미 opacity:0 · pointer-
  // events:none 상태로 그려지므로 타이핑 도중에는 눌러도 반응하지 않는다.
  function typeDescription(text) {
    clearInterval(typingTimer);
    const descEl = sheet.querySelector('.cm-evp-desc');
    const btnEl = sheet.querySelector('.cm-evp-confirm');
    if (btnEl) btnEl.classList.remove('cm-evp-confirm-ready');
    if (!descEl) return;
    const finish = () => { if (btnEl) btnEl.classList.add('cm-evp-confirm-ready'); };
    const speedMs = typingSpeedMs();
    if (!text || speedMs === 0) { descEl.textContent = text || ''; finish(); return; }
    let i = 0;
    typingTimer = setInterval(() => {
      i++;
      descEl.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(typingTimer); finish(); }
    }, speedMs);
  }
  // toastQueue와 같은 이유(§큐 주석)로 한 틱에 addEvidence가 여러 건 fire돼도
  // 겹치지 않게 순서대로 하나씩만 띄운다 — 다만 토스트는 타이머로 자동으로
  // 넘어가는 반면 이건 플레이어의 확인 탭을 기다렸다가 다음 걸 띄운다.
  function runQueue() {
    const next = queue.shift();
    if (!next) { busy = false; return; }
    busy = true;
    sheet.innerHTML = html(next);
    if (next.imageAssetId && typeof CaseEntryUI !== 'undefined') CaseEntryUI.hydrateCaseEntryIcons(sheet);
    typeDescription(next.summary || '');
    root.classList.remove('cm-hidden');
    // 이중 rAF — 한 번만 걸면 display:none 해제와 cm-show 부여가 같은
    // 프레임으로 묶여 브라우저가 "이전 상태"를 페인트하지 못하고 그냥
    // 최종 위치로 점프해버린다(느린 트랜지션을 걸어도 애니메이션 없이
    // 순간이동하는 원인). 첫 rAF에서 off-screen 상태가 실제로 한 프레임
    // 페인트된 뒤, 다음 rAF에서 cm-show를 추가해야 트랜지션이 재생된다.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add('cm-show'));
    });
  }
  function close() {
    clearInterval(typingTimer);
    // cm-show는 유지한 채(그래야 transform이 translateY(0)에 고정돼 아래로
    // 슬라이드해 내려가지 않는다) cm-closing만 얹어 제자리 페이드아웃만
    // 재생한다. 실제로 cm-show를 떼는 건 페이드가 끝난 다음 — 그래야 다음
    // 항목이 뜰 때 다시 off-screen(opacity 0 / translateY(100vh))부터
    // 시작한다.
    root.classList.add('cm-closing');
    setTimeout(() => {
      root.classList.remove('cm-show');
      root.classList.remove('cm-closing');
      root.classList.add('cm-hidden');
      runQueue();
    }, 520);
  }
  function show(entry) {
    ensureDom();
    queue.push(entry);
    if (!busy) runQueue();
  }
  // 사진 우선순위 — 증거수첩(evidenceNotebook.js photoAssetIdFor)과 완전히
  // 똑같은 순서를 그대로 따라간다: 증언은 공유 "기록사진"이 최우선, 그다음
  // 관리자가 승인한 상세용/카드용 이미지(detailImageAssetId/imageAssetId,
  // dev/upload/case-entries), 마지막으로 "증거 DB" 탭에서 증거 id별로 올린
  // 사진(evidence-photos 카탈로그, dev/upload/index.html 증거 DB 탭의
  // "사진 업로드"). 이 순서를 안 맞추면 노트에서 보이는 사진과 이 팝업에서
  // 보이는 사진이 서로 다른 걸 가리킬 수 있다.
  async function resolvePhotoAssetId(entry) {
    if (!entry) return null;
    if (entry.kind === 'testimony' && typeof AssetDB !== 'undefined' && AssetDB.getEvidenceTestimonyPhoto) {
      try {
        const shared = await AssetDB.getEvidenceTestimonyPhoto();
        if (shared && shared.imageAssetId) return shared.imageAssetId;
      } catch (e) { /* 오프라인/서버 불가 — 다음 우선순위로 계속 */ }
    }
    if (entry.detailImageAssetId) return entry.detailImageAssetId;
    if (entry.imageAssetId) return entry.imageAssetId;
    if (typeof AssetDB !== 'undefined' && AssetDB.getEvidencePhotos) {
      try {
        const catalog = await AssetDB.getEvidencePhotos();
        const rec = catalog && catalog[entry.id];
        if (rec && rec.imageAssetId) return rec.imageAssetId;
      } catch (e) { /* 오프라인/서버 불가 — 이모지 폴백 */ }
    }
    return null;
  }
  // dev/settings/(게임환경설정)의 "이 기능 테스트" 버튼이 부르는 진입점 —
  // 실제 증거를 등록하지 않고 샘플 데이터로 레이아웃을 확인한다. 사진 칸도
  // 폴백 이모지 대신, 위 resolvePhotoAssetId와 같은 두 카탈로그(카드용 승인
  // 이미지 + 증거 DB 탭 사진)를 통틀어 사진이 배정된 증거 id가 하나라도
  // 있으면 그중 아무거나 가져와 보여준다.
  async function preview() {
    let metaCatalog = {};
    let photosCatalog = {};
    if (typeof AssetDB !== 'undefined') {
      try { if (AssetDB.getCaseEntryMeta) metaCatalog = await AssetDB.getCaseEntryMeta(); } catch (e) { /* 오프라인 */ }
      try { if (AssetDB.getEvidencePhotos) photosCatalog = await AssetDB.getEvidencePhotos(); } catch (e) { /* 오프라인 */ }
    }
    const candidateIds = new Set([...Object.keys(metaCatalog || {}), ...Object.keys(photosCatalog || {})]);
    const candidates = [];
    candidateIds.forEach(id => {
      const meta = (metaCatalog && metaCatalog[id]) || {};
      const photoRec = (photosCatalog && photosCatalog[id]) || {};
      const resolved = meta.detailImageAssetId || meta.imageAssetId || photoRec.imageAssetId;
      if (resolved) candidates.push(resolved);
    });
    const imageAssetId = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
    show({
      title: '테스트 증거 — 명함',
      summary: '게임환경설정에서 미리보기로 띄운 샘플입니다. 실제 증거를 얻으면 사진/이름/설명과 확인 버튼이 이 레이아웃 그대로 표시됩니다.',
      fallbackIcon: '🧾',
      imageAssetId,
    });
  }
  return { show, preview, resolvePhotoAssetId };
})();

// The Missing Key v1 §5.3 — "비활성 상태에서는 메뉴를 숨기지 말고 잠금 또는
// 회색 처리하며 사유를 표시한다". A future interrogation/minigame beat sets
// 'shopAccessBlocked' (+ 'shopAccessBlockedReason') via the existing setFlag
// effect; this card just reads it generically rather than hardcoding which
// scenes count as "busy".
function shopEntryCard(label, action) {
  const blocked = CaseFileState.hasFlag('shopAccessBlocked');
  if (blocked) {
    const reason = CaseFileState.getFlag('shopAccessBlockedReason') || '지금은 이용할 수 없습니다.';
    return `<button class="cm-card cm-card-locked" disabled><div class="cm-card-name">${escapeHtml(label)}</div><div class="cm-card-lock-reason">${escapeHtml(reason)}</div></button>`;
  }
  return `<button class="cm-card" data-action="${action}"><div class="cm-card-name">${escapeHtml(label)}</div></button>`;
}

/* ===== helpers ===== */
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function emptyNote(text) { return `<div class="cm-empty">${escapeHtml(text)}</div>`; }
function rowIconHtml(entry) { return (typeof CaseEntryUI !== 'undefined') ? CaseEntryUI.caseEntryIconHtml(entry) : ''; }
// unresolved/partial/resolved are the original three-state vocab still used
// by weeks 0-3's existing content; locked/open/investigating/provisional/
// contradicted/carried_over are the wider vocab The Missing Key v4 §5.1 adds
// for hypothesis-tracked questions. Both coexist — a question only ever uses
// one vocab or the other depending on which scenes set its status.
function questionStatusLabel(status) {
  return {
    unresolved: '미해결', partial: '부분 해결', resolved: '해결됨',
    locked: '아직 조사할 수 없음', open: '미해결', investigating: '조사 중',
    provisional: '잠정 결론', contradicted: '기존 결론 폐기', carried_over: '다음 주차로 이월',
  }[status] || status;
}
function evidenceStatusLabel(status) { return { new: '용도 불명', reviewed: '확인함', linked: '연결됨', resolved: '해결됨', updated: '업데이트됨', superseded: '병합됨', invalid: '오판' }[status] || status; }
// 증언 상태(§6.2) — 레거시 증언의 초기 status는 addEvidence 기본값인
// new/reviewed(읽음 여부)라 아직 "확인 전" 의미로 보여준다. reviseTestimony
// 이후에만 실제 인식론적 상태(수정/철회/모순/거짓/확인)로 바뀐다.
function testimonyStatusLabel(status) { return { new: '확인 전', reviewed: '확인 전', unverified: '확인 전', active: '유효', revised: '수정됨', withdrawn: '철회됨', contradicted: '모순 발견', false: '거짓 판명', confirmed: '사실 확인' }[status] || status; }
// 탐색허브 증거 제시 시트(play/explore/index.html openEvidenceSheet)도 같은
// 분류/순서를 참조 — 둘 다 CaseFileState.getEvidence()의 category를 그룹핑
// 하는 곳이라 여기서만 한 번 정의한다.
const EVIDENCE_CATEGORY_ORDER = ['physical', 'photo', 'testimony', 'record', 'etc'];
function evidenceCategoryLabel(cat) { return { physical: '물증', photo: '사진·영상', testimony: '진술', record: '기록', etc: '기타' }[cat] || '기타'; }
function personStatusLabel(status) { return { unknown: '미상', witness: '목격자', suspect: '용의자', cleared: '혐의 없음', reopened: '재조사 중', involved: '연루됨', culprit: '범인' }[status] || status; }
function mapStatusLabel(status) { return { locked: '미방문', unlocked: '해금됨', visited: '방문함', current: '현재 위치' }[status] || status; }
function mapStatusIcon(status) { return { locked: '🔒', unlocked: '○', visited: '●', current: '●' }[status] || '○'; }
function formatSaveTime(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function injectMenuButton(mountSelector, disabled) {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'CASE FILE 메뉴 열기');
  btn.textContent = '☰';
  if (disabled) btn.disabled = true;
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
    .cm-menu-btn:disabled{opacity:.35;cursor:default}
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
    .cm-mission-points{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:12px;font-weight:700;color:#D8A93D;margin-top:8px}

    .cm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
    .cm-card{position:relative;background:#171F29;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:20px 14px;text-align:left;cursor:pointer;color:#F1F3F5;font-family:inherit}
    .cm-card:active{background:#1c2530}
    .cm-card-name{font-size:14.5px;font-weight:700}
    .cm-card-badge{position:absolute;top:12px;right:12px;background:#C55353;color:#fff;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;font-weight:700;border-radius:10px;padding:2px 7px;min-width:18px;text-align:center}
    .cm-card-badge-muted{background:rgba(255,255,255,.10);color:#7E8791}
    .cm-card-locked{opacity:.55;cursor:default}
    .cm-card-lock-reason{font-size:10.5px;color:#7E8791;margin-top:6px;line-height:1.4}

    .cm-continue{width:100%;background:#D8A93D;color:#191206;border:none;border-radius:14px;padding:16px;font-size:15px;font-weight:700;cursor:pointer;font-family:'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.04em}
    .cm-continue:active{opacity:.85}

    .cm-tabbar{display:flex;gap:6px;margin-bottom:14px}
    .cm-tab{flex:1;background:#171F29;border:1px solid rgba(255,255,255,.10);color:#7E8791;border-radius:10px;padding:10px 4px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
    .cm-tab-active{color:#D8A93D;border-color:rgba(216,169,61,.5);background:rgba(216,169,61,.08)}

    .cm-notebook-btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;background:linear-gradient(135deg,#2a3552,#1a2338);border:1px solid rgba(216,169,61,.4);color:#e9c467;border-radius:14px;padding:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:12px;min-height:44px}
    .cm-notebook-btn:active{opacity:.85}

    .cm-filter-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
    .cm-filter-chip{background:#171F29;border:1px solid rgba(255,255,255,.10);color:#7E8791;border-radius:20px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
    .cm-filter-chip-active{color:#4CB8D4;border-color:rgba(76,184,212,.5);background:rgba(76,184,212,.1)}

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
    .cm-updated-tag{font-size:10px;font-weight:700;color:#D8A93D;background:rgba(216,169,61,.12);border-radius:8px;padding:2px 6px;margin-left:6px;vertical-align:middle}
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
    .cm-status-unresolved,.cm-status-open,.cm-status-contradicted{color:#C55353;background:rgba(197,83,83,.12)}
    .cm-status-partial,.cm-status-provisional,.cm-status-revised,.cm-status-unverified,.cm-status-updated{color:#D8A93D;background:rgba(216,169,61,.12)}
    .cm-status-resolved,.cm-status-investigating,.cm-status-active,.cm-status-confirmed{color:#4CB8D4;background:rgba(76,184,212,.12)}
    .cm-status-locked,.cm-status-carried_over,.cm-status-withdrawn,.cm-status-false,.cm-status-invalid,.cm-status-superseded{color:#7E8791;background:rgba(255,255,255,.08)}

    .cm-section-label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.1em;color:#7E8791;text-transform:uppercase;margin-bottom:8px}
    .cm-section-label-spaced{margin-top:18px}
    .cm-hyp-invalidated{color:#7E8791;text-decoration:line-through}
    .cm-hyp-tag{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;font-weight:700;text-decoration:none;display:inline-block;color:#7E8791}
    .cm-hyp-tag-current{color:#4CB8D4}

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
    .cm-toast-row{display:flex;align-items:center;gap:10px}
    .cm-toast-icon{flex-shrink:0;width:36px;height:36px;border-radius:8px;overflow:hidden}
    .cm-toast-icon .ces-card-icon{width:36px;height:36px;font-size:22px}
    .cm-toast-icon .ces-icon-img{width:36px;height:36px}

    .cm-evp-root{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif}
    .cm-evp-root.cm-hidden{display:none}
    .cm-evp-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);opacity:0;transition:opacity .6s cubic-bezier(.45,0,.55,1)}
    /* translateY(100vh) — 카드 자기 높이 기준(예: 120%)이면 화면 크기 대비
       카드가 작을 때 시작 지점이 아직 뷰포트 안이라 위쪽이 살짝 보인 채로
       시작해버린다. 뷰포트 전체 높이만큼 내려두면 카드 크기와 무관하게
       확실히 화면 밖에서 시작한다. opacity도 transform과 같은 지속시간·
       이징으로 함께 걸어서 "이동 후 등장"이 아니라 "등장하며 이동"이
       되게 한다(둘이 어긋나면 다 올라온 뒤에 뒤늦게 페이드인하거나, 반대로
       투명한 채로 먼저 다 이동해버리는 것처럼 보인다). */
    .cm-evp-sheet{position:relative;width:calc(100% - 48px);max-width:380px;background:#10151B;border-radius:24px;padding:26px 22px;box-shadow:0 8px 40px rgba(0,0,0,.55);opacity:0;transform:translateY(100vh);transition:transform .9s cubic-bezier(.33,1,.68,1) .1s,opacity .9s cubic-bezier(.33,1,.68,1) .1s;display:flex;flex-direction:column;align-items:center;text-align:center}
    .cm-evp-root.cm-show .cm-evp-backdrop{opacity:1}
    .cm-evp-root.cm-show .cm-evp-sheet{opacity:1;transform:translateY(0)}
    /* 닫을 때는 아래로 다시 내려가는 슬라이드가 아니라 제자리에서 페이드
       아웃만 한다 — cm-show는 그대로 둔 채(transform:translateY(0) 유지)
       cm-closing만 얹어서 opacity 트랜지션만 새로 짧게 덮어쓴다(뒤에 나온
       규칙이 이겨야 하므로 아래 두 줄은 반드시 cm-show 규칙보다 뒤에 있어야
       한다). */
    .cm-evp-root.cm-closing .cm-evp-backdrop{transition:opacity .5s ease;opacity:0}
    .cm-evp-root.cm-closing .cm-evp-sheet{transition:opacity .5s ease;opacity:0}
    .cm-evp-eyebrow{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.12em;color:#D8A93D;text-transform:uppercase;margin-bottom:14px}
    .cm-evp-photo{width:120px;height:120px;border-radius:16px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:52px;overflow:hidden;margin-bottom:16px;flex-shrink:0}
    .cm-evp-photo .ces-icon-img{width:100%;height:100%;object-fit:cover;border-radius:16px}
    .cm-evp-name{font-size:18px;font-weight:800;color:#F1F3F5;margin-bottom:8px;word-break:keep-all}
    .cm-evp-desc{font-size:13.5px;line-height:1.6;color:#C9D1D9;margin-bottom:20px;word-break:keep-all}
    /* 설명 타이핑이 끝나기 전까지는 안 보이고 눌리지도 않는다(cm-evp-confirm-ready가
       붙어야 페이드인 + 클릭 가능) — typeDescription 참고. */
    .cm-evp-confirm{width:100%;background:#FFFFFF;color:#10151B;border:none;border-radius:14px;padding:15px;font-size:15px;font-weight:700;cursor:pointer;font-family:'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.04em;opacity:0;pointer-events:none;transition:opacity .4s ease}
    .cm-evp-confirm.cm-evp-confirm-ready{opacity:1;pointer-events:auto}
    .cm-evp-confirm.cm-evp-confirm-ready:active{opacity:.85}
  `;
  document.head.appendChild(style);
}
