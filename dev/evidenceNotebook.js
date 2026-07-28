/* MISSING KEY DEV — 증거수첩(수사 노트) 전체화면 UI (증거 DB 노트 v1.1).

   기존 증거 정의(dialogueData.js/interactionDefs.js/미니게임의 addEvidence,
   58곳)와 CaseEntryModel(그룹 병합·관련도·게이트 감사)은 절대 건드리지
   않는다 — 이 파일은 그 위에 얹는 순수 표시 계층 하나뿐이다. 데이터는
   CaseFileState.getCaseEntries()에서 그대로 받고, 책갈피 분류는
   CaseEntryModel.getNotebookSection() 한 곳(기존 5개 category → 증인/증거/
   사진 3개 책갈피)만 쓴다. 기존 제시 시트(CaseEntryUI.renderPresentSheetHtml,
   관련도 스코어링·게이트 안전성 다 검증된 코드)는 유지한 채, 이 노트는
   "펼쳐서 한 장씩 읽는" 대안 프레젠테이션 + 증거 제시(present) 모드를
   추가로 제공한다. 제출 판정 자체는 여전히 호출부가 넘겨주는 콜백
   (game/explore의 player.presentEvidence)이 하므로 이 파일은 정답/오답을
   전혀 모른다.

   배경 아트: dev/upload/evidence-notebook/index.html에서 책갈피(증인/증거/
   사진)별로 올린 배경 이미지 최대 3장 + 5개 데이터 영역(코드/제목/사진/
   설명/발견위치, AssetDB.getEvidenceNotebookConfig)을 쓴다. 이 원본 아트는
   탭 바까지 이미 그림 안에 그려 넣은 완성된 페이지라(디자이너 확인 —
   책갈피마다 활성 탭 색만 다름), 코드가 별도로 탭 텍스트/아이콘을 그리면
   그림 위에 또 겹쳐 그려진다. 그래서 실제 배경 이미지가 하나라도 있으면
   §CSS 탭바(.evn-tabbar)는 완전히 숨기고, 그 대신 그림 자체의 탭 위치에
   투명 히트존만 얹어 탭 전환을 받는다 — 배경이 하나도 없을 때만(§20
   "아트 없어도 기능은 항상 동작") CSS로 그린 탭바 + 목업 페이지로 대체한다. */

const EvidenceNotebook = (function () {
  const SECTIONS = [
    { id: 'witness', label: '증언', icon: '👤', tint: '#8a2332' },
    { id: 'evidence', label: '증거', icon: '🔍', tint: '#1f3a6e' },
    { id: 'photo', label: '사진', icon: '📷', tint: '#1f5c3a' },
  ];
  // 배경 아트에 그려진 탭 3개의 대략적인 위치(이미지 전체 대비 0~1 비율) —
  // 참고 시안 기준 눈대중 추정치. 탭 자체는 이미 그림에 그려져 있어 여기
  // 히트존은 보이지 않게(투명) 얹히기만 하면 되므로 픽셀 정확도보다는
  // 넉넉하게 잡는 쪽이 안전하다.
  const TAB_HOTSPOT_BAND = { top: 0, height: 0.115, left: 0.44, width: 0.56 };
  // 관리자가 아직 "영역지정"으로 각 라벨을 안 찍었을 때 쓰는 눈대중
  // 기본값 — 실제 지정된 regions가 있으면 그쪽이 항상 우선한다. 버튼 4개
  // (prevButton/indexButton/nextButton/submitButton)는 참고 시안 하단
  // 버튼 줄 위치 기준.
  const DEFAULT_REGION_FALLBACK = {
    code: { x: 0.09, y: 0.10, w: 0.5, h: 0.025 },
    title: { x: 0.09, y: 0.135, w: 0.82, h: 0.05 },
    photo: { x: 0.18, y: 0.20, w: 0.64, h: 0.40 },
    description: { x: 0.10, y: 0.63, w: 0.80, h: 0.11 },
    discoveredLocationText: { x: 0.10, y: 0.755, w: 0.55, h: 0.035 },
    relatedPerson: { x: 0.10, y: 0.72, w: 0.55, h: 0.035 },
    prevButton: { x: 0.09, y: 0.895, w: 0.19, h: 0.045 },
    indexButton: { x: 0.30, y: 0.895, w: 0.19, h: 0.045 },
    nextButton: { x: 0.51, y: 0.895, w: 0.19, h: 0.045 },
    submitButton: { x: 0.71, y: 0.89, w: 0.20, h: 0.055 },
  };
  // dev/upload/evidence-notebook/index.html의 DEFAULT_LABEL_STYLE과 같은
  // 기본값 — 텍스트형 라벨(code/title/description/discoveredLocationText/
  // relatedPerson)에만 의미가 있다.
  const DEFAULT_LABEL_STYLE = { fontSize: 13, color: '#2c2311', align: 'left', weight: 'normal' };

  let mounted = false;
  let el = {};
  let state = {
    isOpen: false,
    mode: 'browse', // 'browse' | 'present'
    npcId: null,
    section: 'evidence',
    entriesBySection: { witness: [], evidence: [], photo: [] },
    index: 0,
    isIndexOpen: false,
    zoomEntry: null,
    onPresent: null,
    onClose: null,
  };
  const lastViewedBySection = { witness: 0, evidence: 0, photo: 0 };

  let notebookConfig = null; // { imageAssetId, imageAssetIds:{witness,evidence,photo}, regions }
  let sectionBgUrls = { witness: null, evidence: null, photo: null };
  let evidencePhotoAssetIds = {}; // entryId -> imageAssetId (evidence-photos catalog)
  let evidenceTestimonyPhotoAssetId = null; // 증언(kind==='testimony') 전부가 공유하는 "기록사진"
  let assetUrlCache = {}; // assetId -> dataUrl

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function currentEntries() { return state.entriesBySection[state.section] || []; }
  function currentEntry() { return currentEntries()[state.index] || null; }
  function personName(npcId) {
    if (!npcId || typeof CaseFileState === 'undefined') return npcId || '';
    const p = CaseFileState.getPersons().find(p => p.id === npcId);
    return p ? p.name : npcId;
  }

  /* ===== 자산 로딩 (실패해도 노트가 열리는 데는 지장 없어야 함) ===== */
  async function ensureNotebookConfig() {
    if (typeof AssetDB === 'undefined' || notebookConfig) return;
    try {
      notebookConfig = await AssetDB.getEvidenceNotebookConfig();
      const perSlotIds = Object.assign({ witness: null, evidence: null, photo: null }, notebookConfig.imageAssetIds);
      const ids = SECTIONS.map(s => perSlotIds[s.id]).filter(Boolean);
      if (ids.length) {
        const assets = await AssetDB.getAssetsByIds(ids);
        const byId = new Map(assets.map(a => [a.id, a]));
        SECTIONS.forEach(s => {
          const asset = perSlotIds[s.id] ? byId.get(perSlotIds[s.id]) : null;
          if (asset && asset.dataUrl) sectionBgUrls[s.id] = asset.dataUrl;
        });
      }
      // 레거시(책갈피 3분할 이전) 단일 이미지 — 아직 자기 슬롯이 없는
      // 책갈피의 폴백으로만 쓴다. dev/upload/evidence-notebook에서 각
      // 책갈피에 다시 배정하면 이 폴백은 더 이상 쓰이지 않는다.
      if (notebookConfig.imageAssetId && SECTIONS.some(s => !sectionBgUrls[s.id])) {
        const legacy = await AssetDB.getAsset(notebookConfig.imageAssetId);
        if (legacy && legacy.dataUrl) SECTIONS.forEach(s => { if (!sectionBgUrls[s.id]) sectionBgUrls[s.id] = legacy.dataUrl; });
      }
    } catch (e) { notebookConfig = notebookConfig || { imageAssetId: null, imageAssetIds: {}, regions: {} }; }
  }
  function sectionBgUrl(sectionId) { return sectionBgUrls[sectionId] || null; }
  function hasAnyRealBg() { return SECTIONS.some(s => !!sectionBgUrls[s.id]); }
  function regionFor(labelId) {
    const r = notebookConfig && notebookConfig.regions && notebookConfig.regions[labelId];
    return r || DEFAULT_REGION_FALLBACK[labelId] || null;
  }
  function styleFor(labelId) {
    const s = notebookConfig && notebookConfig.styles && notebookConfig.styles[labelId];
    return Object.assign({}, DEFAULT_LABEL_STYLE, s);
  }
  function textStyleCss(labelId) {
    const s = styleFor(labelId);
    return `font-size:${s.fontSize}px;color:${s.color};text-align:${s.align};font-weight:${s.weight === 'bold' ? '700' : '400'}`;
  }
  async function ensureEvidencePhotoCatalog() {
    if (typeof AssetDB === 'undefined') return;
    try {
      const [photos, testimonyPhoto] = await Promise.all([AssetDB.getEvidencePhotos(), AssetDB.getEvidenceTestimonyPhoto()]);
      evidencePhotoAssetIds = {};
      Object.keys(photos).forEach(id => { if (photos[id] && photos[id].imageAssetId) evidencePhotoAssetIds[id] = photos[id].imageAssetId; });
      evidenceTestimonyPhotoAssetId = (testimonyPhoto && testimonyPhoto.imageAssetId) || null;
    } catch (e) { /* offline — pages fall back to icon placeholders */ }
  }
  // 증언(kind==='testimony')은 개별 사진 대신 전부 이 공용 "기록사진" 한
  // 장을 쓴다 — 아직 기록사진이 배정되지 않았을 때만 레거시 개별 자산으로
  // 폴백한다.
  function photoAssetIdFor(entry) {
    if (!entry) return null;
    if (entry.kind === 'testimony') return evidenceTestimonyPhotoAssetId || entry.detailImageAssetId || entry.imageAssetId || evidencePhotoAssetIds[entry.id];
    return entry.detailImageAssetId || entry.imageAssetId || evidencePhotoAssetIds[entry.id];
  }
  async function hydratePagePhoto(entry) {
    if (!entry || typeof AssetDB === 'undefined') return false;
    const assetId = photoAssetIdFor(entry);
    if (!assetId || assetUrlCache[assetId]) return false;
    try {
      const asset = await AssetDB.getAsset(assetId);
      if (asset && asset.dataUrl) { assetUrlCache[assetId] = asset.dataUrl; return true; }
    } catch (e) {}
    return false;
  }
  function photoUrlFor(entry) {
    const assetId = photoAssetIdFor(entry);
    return assetId ? (assetUrlCache[assetId] || null) : null;
  }

  /* ===== 열기 / 닫기 ===== */
  // opts: { mode:'browse'|'present', npcId, focusEntryId, onPresent(entryId), onClose() }
  async function open(opts) {
    opts = opts || {};
    ensureMounted();
    state.mode = opts.mode === 'present' ? 'present' : 'browse';
    state.npcId = opts.npcId || null;
    state.onPresent = typeof opts.onPresent === 'function' ? opts.onPresent : null;
    state.onClose = typeof opts.onClose === 'function' ? opts.onClose : null;
    state.isIndexOpen = false;
    state.zoomEntry = null;
    el.indexPanel.classList.remove('evn-index-open');
    el.indexPanel.classList.add('hidden');
    pageFlipToken += 1; // 열려 있던 중 넘김 애니메이션이 끝나지 못하고 닫혔을 경우를 대비해 이전 체인을 무효화
    el.page.classList.remove('evn-page-anim-out-next', 'evn-page-anim-out-prev', 'evn-page-anim-in-next', 'evn-page-anim-in-prev');

    const all = (typeof CaseFileState !== 'undefined' ? CaseFileState.getCaseEntries() : [])
      .filter(e => e.kind === 'evidence' || e.kind === 'testimony');
    const pool = state.mode === 'present'
      ? all.filter(e => e.presentable && e.status !== 'superseded' && e.status !== 'invalid')
      : all;
    const bySection = { witness: [], evidence: [], photo: [] };
    pool.forEach(e => { bySection[CaseEntryModel.getNotebookSection(e)].push(e); });
    Object.keys(bySection).forEach(k => bySection[k].sort((a, b) => (a.discoveredAt || 0) - (b.discoveredAt || 0)));
    state.entriesBySection = bySection;

    let startSection = state.section;
    if (opts.focusEntryId) {
      const found = SECTIONS.map(s => s.id).find(sec => bySection[sec].some(e => e.id === opts.focusEntryId));
      if (found) startSection = found;
    } else if (!bySection[startSection] || !bySection[startSection].length) {
      startSection = SECTIONS.map(s => s.id).find(sec => bySection[sec].length) || 'evidence';
    }
    state.section = startSection;
    const list = bySection[startSection] || [];
    if (opts.focusEntryId) {
      const idx = list.findIndex(e => e.id === opts.focusEntryId);
      state.index = idx > -1 ? idx : 0;
    } else {
      state.index = Math.min(lastViewedBySection[startSection] || 0, Math.max(0, list.length - 1));
    }

    state.isOpen = true;
    render();
    el.overlay.classList.remove('hidden');
    requestAnimationFrame(() => el.overlay.classList.add('show'));

    // Best-effort background asset load — never blocks the page from being usable.
    ensureNotebookConfig().then(() => { if (state.isOpen) render(); });
    ensureEvidencePhotoCatalog().then(() => { if (state.isOpen) hydrateAndRerender(); });
  }

  function close() {
    state.isOpen = false;
    el.overlay.classList.remove('show');
    setTimeout(() => { if (!state.isOpen) el.overlay.classList.add('hidden'); }, 220);
    if (state.onClose) state.onClose();
  }

  async function hydrateAndRerender() {
    const entry = currentEntry();
    if (!entry) return;
    const changed = await hydratePagePhoto(entry);
    if (changed && state.isOpen) render();
  }

  /* ===== 네비게이션 ===== */
  function switchSection(sectionId) {
    if (state.section === sectionId) return;
    state.section = sectionId;
    const list = currentEntries();
    state.index = Math.min(lastViewedBySection[sectionId] || 0, Math.max(0, list.length - 1));
    closeIndexPanel();
    render();
  }
  function goPrev() {
    if (state.index <= 0) return;
    runPageFlip('prev', () => { state.index -= 1; afterNav(); });
  }
  function goNext() {
    if (state.index >= currentEntries().length - 1) return;
    runPageFlip('next', () => { state.index += 1; afterNav(); });
  }
  function jumpTo(entryId) {
    const idx = currentEntries().findIndex(e => e.id === entryId);
    if (idx < 0) return;
    state.index = idx;
    closeIndexPanel();
    afterNav();
  }
  function afterNav() {
    lastViewedBySection[state.section] = state.index;
    const entry = currentEntry();
    if (entry && entry.status === 'new' && typeof CaseFileState !== 'undefined') {
      CaseFileState.markEvidenceReviewed(entry.id);
    }
    render();
    hydrateAndRerender();
  }

  /* ===== 페이지 넘김 효과 =====
     이전/다음 이동에 책장이 접히듯 휘어지는 전환을 준다(evnPageOutNext 등
     @keyframes, §CSS) — 단순 rotateY 대신 skewY와 scaleX/scaleY를 rotateY와
     함께 매 구간마다 바꿔가며 종이가 빳빳하지 않고 살짝 물결치듯 휘는
     인상을 준다. el.page 컨테이너 자체에 클래스를 걸어 애니메이션하므로,
     render()가 그 안의 내용(innerHTML)을 다시 그려도 애니메이션 진행에는
     영향이 없다 — 내용 교체(mutate)는 "넘어가는" 절반(에서 넘어간 뒤,
     animationend로 정확히 다음 절반이 시작되는 시점)에 실행한다.
     setTimeout으로 지속시간을 흉내내지 않고 animationend를 쓰는 이유는
     — 여러 keyframe 구간(overshoot 포함)이라 지속시간을 어긋나게 추정하면
     내용 교체 타이밍이 눈에 띄게 어긋나기 때문. animationName으로 걸러
     §evn-page::after의 별도 하이라이트 애니메이션(evnPageCurlShadow)이
     같은 엘리먼트에서 동시에 끝나며 보내는 animationend와 헷갈리지 않게
     한다. pageFlipToken은 넘기는 도중 다시 넘기기(연타)를 눌렀을 때 이전
     체인의 뒷부분이 뒤늦게 실행되는 것을 막는다. */
  let pageFlipToken = 0;
  const PAGE_FLIP_ANIM_NAMES = { next: { out: 'evnPageOutNext', in: 'evnPageInNext' }, prev: { out: 'evnPageOutPrev', in: 'evnPageInPrev' } };
  function runPageFlip(direction, mutate) {
    const token = ++pageFlipToken;
    const names = PAGE_FLIP_ANIM_NAMES[direction];
    const outClass = direction === 'next' ? 'evn-page-anim-out-next' : 'evn-page-anim-out-prev';
    const inClass = direction === 'next' ? 'evn-page-anim-in-next' : 'evn-page-anim-in-prev';
    el.page.classList.remove('evn-page-anim-out-next', 'evn-page-anim-out-prev', 'evn-page-anim-in-next', 'evn-page-anim-in-prev');
    void el.page.offsetWidth; // reflow — 연타로 같은 클래스를 다시 걸어도 애니메이션이 처음부터 다시 뛰게 한다
    el.page.classList.add(outClass);
    el.page.addEventListener('animationend', function onOut(e) {
      if (e.animationName !== names.out) return;
      el.page.removeEventListener('animationend', onOut);
      if (token !== pageFlipToken) return; // 그 사이 다른 넘김이 새로 시작됨 — 이 체인은 여기서 멈춘다
      mutate();
      el.page.classList.remove(outClass);
      void el.page.offsetWidth;
      el.page.classList.add(inClass);
      el.page.addEventListener('animationend', function onIn(e2) {
        if (e2.animationName !== names.in) return;
        el.page.removeEventListener('animationend', onIn);
        if (token === pageFlipToken) el.page.classList.remove(inClass);
      });
    });
  }

  /* ===== 색인 패널 열기/닫기 =====
     evn-overlay 전체의 open()/close()와 같은 방식(hidden 유지 + 클래스로
     트랜지션, 닫힐 때만 지연 후 hidden 재부착) — 색인도 책의 한 페이지처럼
     펼쳐지고 접히는 느낌을 주기 위해서다(evn-index-open, §CSS). */
  function openIndexPanel() {
    state.isIndexOpen = true;
    el.indexList.innerHTML = renderIndexHtml(currentEntries());
    el.indexPanel.classList.remove('hidden');
    requestAnimationFrame(() => el.indexPanel.classList.add('evn-index-open'));
  }
  function closeIndexPanel() {
    if (!state.isIndexOpen) return;
    state.isIndexOpen = false;
    el.indexPanel.classList.remove('evn-index-open');
    setTimeout(() => { if (!state.isIndexOpen) el.indexPanel.classList.add('hidden'); }, 340);
  }

  /* ===== 렌더 ===== */
  function templateFor(entry) {
    if (entry.kind === 'testimony') return 'statement';
    if (entry.subtype === 'photo' || entry.subtype === 'physical') return 'image';
    return 'document';
  }
  function fallbackIconFor(entry) { return entry.fallbackIcon || (typeof CaseEntryModel !== 'undefined' ? CaseEntryModel.caseEntryFallbackIcon(entry.kind, entry.subtype) : '📄'); }

  function render() {
    if (!state.isOpen) return;
    const section = SECTIONS.find(s => s.id === state.section) || SECTIONS[1];
    el.overlay.style.setProperty('--evn-tint', section.tint);

    // 실제 배경 아트가 하나라도 있으면 그림 자체에 탭/이전/색인/다음/제출
    // 버튼이 다 그려져 있으므로 CSS 탭바·하단 바·제출 버튼은 통째로 숨기고,
    // 각 페이지 안에 투명 히트존만 얹는다(renderImageModePageHtml). 배경이
    // 아예 없을 때만 이 CSS 크롬으로 대체한다.
    const showChromeTabs = !hasAnyRealBg();
    el.tabbar.classList.toggle('hidden', !showChromeTabs);
    el.footer.classList.toggle('hidden', !showChromeTabs);
    if (showChromeTabs) {
      el.tabbar.innerHTML = SECTIONS.map(s => `
        <button type="button" class="evn-tab evn-tab-${s.id}${s.id === state.section ? ' evn-tab-active' : ''}" data-evn-tab="${s.id}" style="${s.id === state.section ? `--evn-tab-tint:${s.tint}` : ''}">
          <span class="evn-tab-icon">${s.icon}</span><span class="evn-tab-label">${s.label}</span>
        </button>
      `).join('');
    }

    const list = currentEntries();
    const entry = currentEntry();
    el.page.innerHTML = entry ? renderPageHtml(entry, list.length) : renderEmptyPageHtml(section.label);

    el.prevBtn.disabled = state.index <= 0;
    el.nextBtn.disabled = state.index >= list.length - 1;
    el.submitBtn.classList.toggle('hidden', !showChromeTabs || state.mode !== 'present' || !entry);
    el.npcTag.classList.toggle('hidden', state.mode !== 'present');
    if (state.mode === 'present' && state.npcId) {
      el.npcTag.textContent = `제시 대상 · ${personName(state.npcId)}`;
    } else if (state.mode === 'present') {
      el.npcTag.textContent = '증거 제시';
    }

    el.zoomPanel.classList.toggle('hidden', !state.zoomEntry);
    if (state.zoomEntry) renderZoomHtml(state.zoomEntry);

    bindPageEvents();
  }

  function renderEmptyPageHtml(sectionLabel) {
    return `<div class="evn-sheet evn-sheet-empty">
      <div class="evn-empty-icon">📓</div>
      <div class="evn-empty-text">아직 확보한 ${escapeHtml(sectionLabel)} 항목이 없습니다.</div>
    </div>`;
  }

  function renderIndexHtml(list) {
    if (!list.length) return '<div class="evn-index-empty">항목이 없습니다.</div>';
    return list.map((e, i) => `
      <button type="button" class="evn-index-row${i === state.index ? ' evn-index-row-active' : ''}" data-evn-jump="${e.id}">
        <span class="evn-index-code">${escapeHtml(e.code || '')}</span>
        <span class="evn-index-title">${escapeHtml(e.title)}</span>
        ${e.status === 'new' ? '<span class="evn-dot"></span>' : ''}
        ${e.status === 'updated' ? '<span class="evn-updated">갱신</span>' : ''}
      </button>
    `).join('');
  }

  function renderPageHtml(entry, total) {
    const bg = sectionBgUrl(state.section);
    return bg ? renderImageModePageHtml(entry, total, bg) : renderFallbackPageHtml(entry, total, state.index);
  }

  function regionStyle(labelId) {
    const r = regionFor(labelId);
    return r ? `left:${r.x * 100}%;top:${r.y * 100}%;width:${r.w * 100}%;height:${r.h * 100}%` : 'display:none';
  }
  // 텍스트형 라벨(code/title/description/discoveredLocationText/
  // relatedPerson) 전용 — 위치(regionStyle)에 관리자가 지정한 서식(글자
  // 크기·색·정렬·굵기, dev/upload/evidence-notebook/index.html의 "서식
  // 패널")을 더한다.
  function textRegionStyle(labelId) {
    const r = regionFor(labelId);
    if (!r) return 'display:none';
    return `left:${r.x * 100}%;top:${r.y * 100}%;width:${r.w * 100}%;height:${r.h * 100}%;${textStyleCss(labelId)}`;
  }
  // 버튼형 라벨(prevButton/indexButton/nextButton/submitButton) 전용 —
  // 그림에 이미 그려진 버튼 위에 얹는 투명 히트존이라 위치만 있으면 된다.
  function buttonHotspotHtml(labelId, dataAttr, ariaLabel) {
    const r = regionFor(labelId);
    if (!r) return '';
    return `<button type="button" class="evn-tab-hotspot" ${dataAttr} style="left:${r.x * 100}%;top:${r.y * 100}%;width:${r.w * 100}%;height:${r.h * 100}%" aria-label="${escapeHtml(ariaLabel)}"></button>`;
  }

  // 실제 배경 아트가 있는 책갈피 — 그림을 그대로 캔버스로 쓰고, 관리자가
  // "영역지정"으로 찍어둔 좌표(없으면 눈대중 기본값, DEFAULT_REGION_FALLBACK)
  // 위에 실제 데이터를 절대좌표로 얹는다. 탭도, 이전/색인/다음/제출
  // 버튼도 이미 그림 자체에 그려져 있으므로 투명 히트존만 얹는다 — 그래서
  // render()가 이 모드일 때 CSS 탭바/하단 바(.evn-footer)/제출 버튼
  // (.evn-submit-btn)을 통째로 숨긴다(showChromeTabs).
  function renderImageModePageHtml(entry, total, bgUrl) {
    const template = templateFor(entry);
    const photoUrl = photoUrlFor(entry);
    const pageNum = String(state.index + 1).padStart(2, '0');
    const totalStr = String(total).padStart(2, '0');
    const relatedNpc = (entry.relatedNpcIds && entry.relatedNpcIds[0]) ? personName(entry.relatedNpcIds[0]) : '';

    const mainIsPhoto = template === 'image' && !!photoUrl;
    const mainHtml = mainIsPhoto
      ? `<div class="evn-imgmode-photo" style="${regionStyle('photo')}" data-evn-zoom="1"><img src="${photoUrl}" alt="${escapeHtml(entry.title)}"></div>`
      : `<div class="evn-imgmode-text-main" style="${textRegionStyle('photo')}">${escapeHtml(entry.description || entry.summary || '')}</div>`;
    const extraDescHtml = (mainIsPhoto && entry.description)
      ? `<div class="evn-imgmode-desc" style="${textRegionStyle('description')}">${escapeHtml(entry.description)}</div>` : '';
    const locationHtml = entry.discoveredLocationText
      ? `<div class="evn-imgmode-location" style="${textRegionStyle('discoveredLocationText')}"><span class="evn-imgmode-meta-icon">📍</span>${escapeHtml(entry.discoveredLocationText)}</div>` : '';
    const relatedPersonHtml = relatedNpc
      ? `<div class="evn-imgmode-location" style="${textRegionStyle('relatedPerson')}"><span class="evn-imgmode-meta-icon">👤</span>${escapeHtml(relatedNpc)}</div>` : '';

    const hotspotW = TAB_HOTSPOT_BAND.width / SECTIONS.length;
    const tabHotspotsHtml = SECTIONS.map((s, i) => `<button type="button" class="evn-tab-hotspot" data-evn-tab="${s.id}" style="left:${(TAB_HOTSPOT_BAND.left + i * hotspotW) * 100}%;top:${TAB_HOTSPOT_BAND.top * 100}%;width:${hotspotW * 100}%;height:${TAB_HOTSPOT_BAND.height * 100}%" aria-label="${escapeHtml(s.label)}"></button>`).join('');
    const navHotspotsHtml = [
      state.index > 0 ? buttonHotspotHtml('prevButton', 'data-evn-prev="1"', '이전') : '',
      buttonHotspotHtml('indexButton', 'data-evn-index="1"', '색인'),
      state.index < total - 1 ? buttonHotspotHtml('nextButton', 'data-evn-next="1"', '다음') : '',
      state.mode === 'present' ? buttonHotspotHtml('submitButton', 'data-evn-submit="1"', '제출') : '',
    ].join('');

    return `
      <div class="evn-sheet evn-sheet-imagemode">
        <img class="evn-imgmode-bg" src="${bgUrl}" alt="">
        ${tabHotspotsHtml}
        ${navHotspotsHtml}
        <div class="evn-imgmode-code" style="${textRegionStyle('code')}">${escapeHtml(entry.code || '')} · ${pageNum}/${totalStr}</div>
        <div class="evn-imgmode-title" style="${textRegionStyle('title')}">${escapeHtml(entry.title)}${entry.status === 'updated' ? '<span class="evn-updated">업데이트됨</span>' : ''}</div>
        ${mainHtml}
        ${extraDescHtml}
        ${locationHtml}
        ${relatedPersonHtml}
      </div>
    `;
  }

  // 배경 아트가 아직 없는 책갈피 — 사진 배경 없이도 "직접 손으로 꾸민
  // 수사 노트"처럼 보이도록 CSS만으로 그린 페이지(§20 "아트 없어도 기능은
  // 항상 동작"). 이 경로에서만 render()가 CSS 탭바를 보여준다. pageIndex를
  // 인자로 받아(기본값 state.index) 외부(dev/upload/evidence-notebook의
  // "예시" 미리보기)에서도 모듈 내부 state 없이 그대로 재사용할 수 있게
  // 한다 — renderExamplePageHtml로 그대로 노출.
  function renderFallbackPageHtml(entry, total, pageIndex) {
    const template = templateFor(entry);
    const photoUrl = photoUrlFor(entry);
    const idx = pageIndex == null ? state.index : pageIndex;
    const pageNum = String(idx + 1).padStart(2, '0');
    const totalStr = String(total).padStart(2, '0');

    let mainHtml;
    if (template === 'image') {
      mainHtml = photoUrl
        ? `<div class="evn-frame evn-frame-photo" data-evn-zoom="1"><span class="evn-frame-tape evn-frame-tape-l"></span><span class="evn-frame-tape evn-frame-tape-r"></span><img src="${photoUrl}" alt="${escapeHtml(entry.title)}"></div>`
        : `<div class="evn-frame evn-frame-empty"><span class="evn-frame-fallback-icon">${fallbackIconFor(entry)}</span><span class="evn-frame-empty-label">사진 미첨부</span></div>`;
    } else if (template === 'statement') {
      mainHtml = `<div class="evn-frame evn-frame-statement">
        <span class="evn-quote-mark">“</span>
        ${photoUrl ? `<img class="evn-statement-portrait" src="${photoUrl}" alt="">` : `<span class="evn-statement-icon">${fallbackIconFor(entry)}</span>`}
        <div class="evn-statement-quote">${escapeHtml(entry.description || entry.summary || '')}</div>
      </div>`;
    } else {
      mainHtml = `<div class="evn-frame evn-frame-document">
        <span class="evn-doc-icon">${fallbackIconFor(entry)}</span>
        <div class="evn-doc-text">${escapeHtml(entry.description || entry.summary || '')}</div>
      </div>`;
    }

    const stages = (entry.stages || []).filter(s => s && s.summary);
    const relatedNpc = (entry.relatedNpcIds && entry.relatedNpcIds[0]) ? personName(entry.relatedNpcIds[0]) : '';

    return `
      <div class="evn-sheet">
        <span class="evn-sheet-pin">📌</span>
        <div class="evn-sheet-header">
          <span class="evn-sheet-code">${escapeHtml(entry.code || '')}</span>
          <span class="evn-sheet-page">PAGE ${pageNum} / ${totalStr}</span>
        </div>
        <div class="evn-sheet-title">${escapeHtml(entry.title)}${entry.status === 'updated' ? '<span class="evn-updated">업데이트됨</span>' : ''}</div>
        ${mainHtml}
        <div class="evn-sheet-scroll">
          ${template !== 'statement' && template !== 'document' && entry.description ? `<div class="evn-sheet-desc">${escapeHtml(entry.description)}</div>` : ''}
          <div class="evn-meta-table">
            ${relatedNpc ? `<div class="evn-meta-row"><span class="evn-meta-icon">👤</span><span class="evn-meta-label">관련 인물</span><span class="evn-meta-value">${escapeHtml(relatedNpc)}</span></div>` : ''}
            ${entry.discoveredLocationText ? `<div class="evn-meta-row"><span class="evn-meta-icon">📍</span><span class="evn-meta-label">발견 위치</span><span class="evn-meta-value">${escapeHtml(entry.discoveredLocationText)}</span></div>` : ''}
            ${stages.length ? `<div class="evn-meta-row"><span class="evn-meta-icon">✦</span><span class="evn-meta-label">조사 단계</span><span class="evn-meta-value">${stages.length}건</span></div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function bindPageEvents() {
    el.page.querySelectorAll('[data-evn-zoom]').forEach(node => {
      node.addEventListener('click', () => { state.zoomEntry = currentEntry(); render(); });
    });
    // 이미지 모드 전용 — 그림에 그려진 탭/이전/색인/다음/제출 버튼 위에
    // 얹은 투명 히트존(§상단 주석). CSS 크롬(evn-footer/evn-submit-btn)이
    // 이미 같은 동작(goPrev/goNext/openIndex/requestSubmit)을 쓰므로 그대로
    // 재사용한다.
    el.page.querySelectorAll('[data-evn-tab]').forEach(node => {
      node.addEventListener('click', () => switchSection(node.dataset.evnTab));
    });
    el.page.querySelectorAll('[data-evn-prev]').forEach(node => node.addEventListener('click', goPrev));
    el.page.querySelectorAll('[data-evn-next]').forEach(node => node.addEventListener('click', goNext));
    el.page.querySelectorAll('[data-evn-index]').forEach(node => node.addEventListener('click', openIndexPanel));
    el.page.querySelectorAll('[data-evn-submit]').forEach(node => node.addEventListener('click', requestSubmit));
  }

  /* ===== 확대 뷰어 (핀치/드래그/더블탭) ===== */
  let zoomScale = 1, zoomX = 0, zoomY = 0;
  let zoomPointers = new Map();
  let zoomPinchStartDist = 0, zoomPinchStartScale = 1;
  let zoomPanStart = null;
  let zoomLastTap = 0;

  function renderZoomHtml(entry) {
    const url = photoUrlFor(entry);
    zoomScale = 1; zoomX = 0; zoomY = 0;
    el.zoomImgWrap.innerHTML = url
      ? `<img id="evnZoomImg" src="${url}" alt="${escapeHtml(entry.title)}">`
      : `<span class="evn-frame-fallback-icon evn-zoom-fallback">${fallbackIconFor(entry)}</span>`;
    applyZoomTransform();
  }
  function applyZoomTransform() {
    const img = document.getElementById('evnZoomImg');
    if (!img) return;
    img.style.transform = `translate(${zoomX}px, ${zoomY}px) scale(${zoomScale})`;
  }
  function closeZoom() { state.zoomEntry = null; render(); }

  function dist(p1, p2) { return Math.hypot(p1.x - p2.x, p1.y - p2.y); }

  function onZoomPointerDown(e) {
    zoomPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (zoomPointers.size === 2) {
      const pts = Array.from(zoomPointers.values());
      zoomPinchStartDist = dist(pts[0], pts[1]);
      zoomPinchStartScale = zoomScale;
      zoomPanStart = null;
    } else if (zoomPointers.size === 1) {
      const now = Date.now();
      if (now - zoomLastTap < 300) {
        zoomScale = zoomScale > 1 ? 1 : 2.5;
        zoomX = 0; zoomY = 0;
        applyZoomTransform();
      }
      zoomLastTap = now;
      zoomPanStart = { x: e.clientX, y: e.clientY, panX: zoomX, panY: zoomY };
    }
  }
  function onZoomPointerMove(e) {
    if (!zoomPointers.has(e.pointerId)) return;
    zoomPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (zoomPointers.size === 2) {
      const pts = Array.from(zoomPointers.values());
      const d = dist(pts[0], pts[1]);
      if (zoomPinchStartDist > 0) {
        zoomScale = Math.min(4, Math.max(1, zoomPinchStartScale * (d / zoomPinchStartDist)));
        applyZoomTransform();
      }
    } else if (zoomPointers.size === 1 && zoomPanStart && zoomScale > 1) {
      zoomX = zoomPanStart.panX + (e.clientX - zoomPanStart.x);
      zoomY = zoomPanStart.panY + (e.clientY - zoomPanStart.y);
      applyZoomTransform();
    }
  }
  function onZoomPointerUp(e) {
    zoomPointers.delete(e.pointerId);
    if (zoomPointers.size < 2) zoomPinchStartDist = 0;
    if (zoomPointers.size === 0) zoomPanStart = null;
  }

  /* ===== 제출 확인 ===== */
  function requestSubmit() {
    const entry = currentEntry();
    if (!entry || !state.onPresent) return;
    const npcName = state.npcId ? personName(state.npcId) : '대상';
    el.confirmText.innerHTML = `${escapeHtml(npcName)}에게<br>'${escapeHtml(entry.title)}'을(를)<br>제시하시겠습니까?`;
    el.confirmPanel.classList.remove('hidden');
    el.confirmPanel.dataset.entryId = entry.id;
  }
  function cancelSubmit() { el.confirmPanel.classList.add('hidden'); }
  function confirmSubmit() {
    const entryId = el.confirmPanel.dataset.entryId;
    el.confirmPanel.classList.add('hidden');
    if (entryId && state.onPresent) state.onPresent(entryId);
  }

  /* ===== 마운트 ===== */
  function ensureMounted() {
    if (mounted) return;
    injectStyles();
    const overlay = document.createElement('div');
    overlay.className = 'evn-overlay hidden';
    overlay.innerHTML = `
      <div class="evn-book">
        <div class="evn-tabbar" id="evnTabbar"></div>
        <div class="evn-book-body">
          <button type="button" class="evn-close-btn" id="evnCloseBtn2">✕</button>
          <div class="evn-page" id="evnPage"></div>
          <div class="evn-npc-tag hidden" id="evnNpcTag"></div>
          <div class="evn-footer" id="evnFooter">
            <button type="button" class="evn-nav-btn" id="evnPrevBtn">‹ 이전</button>
            <button type="button" class="evn-nav-btn evn-nav-btn-index" id="evnIndexBtn">☰ 색인</button>
            <button type="button" class="evn-nav-btn" id="evnNextBtn">다음 ›</button>
          </div>
          <button type="button" class="evn-submit-btn hidden" id="evnSubmitBtn">제출</button>
        </div>
        <div class="evn-index-panel hidden" id="evnIndexPanel">
          <div class="evn-index-header">
            <div class="evn-index-panel-title">색인</div>
            <button type="button" class="evn-close-btn" id="evnIndexCloseBtn">✕</button>
          </div>
          <div class="evn-index-list" id="evnIndexList"></div>
        </div>
        <div class="evn-zoom-panel hidden" id="evnZoomPanel">
          <button type="button" class="evn-close-btn evn-zoom-close" id="evnZoomCloseBtn">✕</button>
          <div class="evn-zoom-stage" id="evnZoomStage">
            <div class="evn-zoom-img-wrap" id="evnZoomImgWrap"></div>
          </div>
        </div>
        <div class="evn-confirm-panel hidden" id="evnConfirmPanel">
          <div class="evn-confirm-card">
            <div class="evn-confirm-text" id="evnConfirmText"></div>
            <div class="evn-confirm-actions">
              <button type="button" class="evn-confirm-cancel" id="evnConfirmCancelBtn">취소</button>
              <button type="button" class="evn-confirm-ok" id="evnConfirmOkBtn">제출</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    el = {
      overlay,
      tabbar: overlay.querySelector('#evnTabbar'),
      footer: overlay.querySelector('#evnFooter'),
      page: overlay.querySelector('#evnPage'),
      npcTag: overlay.querySelector('#evnNpcTag'),
      prevBtn: overlay.querySelector('#evnPrevBtn'),
      nextBtn: overlay.querySelector('#evnNextBtn'),
      indexBtn: overlay.querySelector('#evnIndexBtn'),
      submitBtn: overlay.querySelector('#evnSubmitBtn'),
      indexPanel: overlay.querySelector('#evnIndexPanel'),
      indexList: overlay.querySelector('#evnIndexList'),
      zoomPanel: overlay.querySelector('#evnZoomPanel'),
      zoomStage: overlay.querySelector('#evnZoomStage'),
      zoomImgWrap: overlay.querySelector('#evnZoomImgWrap'),
      confirmPanel: overlay.querySelector('#evnConfirmPanel'),
      confirmText: overlay.querySelector('#evnConfirmText'),
    };

    overlay.querySelector('#evnCloseBtn2').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    el.prevBtn.addEventListener('click', goPrev);
    el.nextBtn.addEventListener('click', goNext);
    el.indexBtn.addEventListener('click', openIndexPanel);
    overlay.querySelector('#evnIndexCloseBtn').addEventListener('click', closeIndexPanel);
    el.indexPanel.addEventListener('click', (e) => {
      const row = e.target.closest('[data-evn-jump]');
      if (row) jumpTo(row.dataset.evnJump);
    });
    el.tabbar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-evn-tab]');
      if (btn) switchSection(btn.dataset.evnTab);
    });
    el.submitBtn.addEventListener('click', requestSubmit);
    overlay.querySelector('#evnConfirmCancelBtn').addEventListener('click', cancelSubmit);
    overlay.querySelector('#evnConfirmOkBtn').addEventListener('click', confirmSubmit);
    overlay.querySelector('#evnZoomCloseBtn').addEventListener('click', closeZoom);
    el.zoomPanel.addEventListener('click', (e) => { if (e.target === el.zoomPanel) closeZoom(); });
    el.zoomStage.addEventListener('pointerdown', onZoomPointerDown);
    el.zoomStage.addEventListener('pointermove', onZoomPointerMove);
    ['pointerup', 'pointercancel'].forEach(evt => el.zoomStage.addEventListener(evt, onZoomPointerUp));

    // Swipe left/right on the page itself (outside the zoom viewer) moves
    // between entries in the current bookmark — kept simple (no live drag
    // feedback) so it can't fight the zoom viewer's own pan/pinch handlers,
    // which live in a separate panel entirely.
    let swipeStartX = null, swipeStartY = null;
    el.page.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      swipeStartX = e.touches[0].clientX; swipeStartY = e.touches[0].clientY;
    }, { passive: true });
    el.page.addEventListener('touchend', (e) => {
      if (swipeStartX == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - swipeStartX, dy = t.clientY - swipeStartY;
      swipeStartX = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) goNext(); else goPrev();
      }
    }, { passive: true });

    mounted = true;
  }

  function injectStyles() {
    if (document.getElementById('evidenceNotebookStyles')) return;
    const style = document.createElement('style');
    style.id = 'evidenceNotebookStyles';
    style.textContent = `
      .evn-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;padding:calc(env(safe-area-inset-top,0) + 14px) 14px calc(env(safe-area-inset-bottom,0) + 14px);opacity:0;transition:opacity .25s ease,background .25s ease;-webkit-tap-highlight-color:transparent}
      .evn-overlay.hidden{display:none}
      .evn-overlay.show{opacity:1;background:rgba(0,0,0,.72)}
      .evn-book{position:relative;width:100%;max-width:420px;height:100%;max-height:820px;display:flex;flex-direction:column;transform:translateY(36px) scale(.96);transition:transform .28s cubic-bezier(0.2,0.8,0.2,1)}
      .evn-overlay.show .evn-book{transform:translateY(0) scale(1)}

      .evn-tabbar{display:flex;justify-content:flex-end;gap:6px;padding-right:10px;flex-shrink:0}
      .evn-tabbar.hidden{display:none}
      .evn-tab{font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:12px;font-weight:700;color:#c7b98a;background:#14161b;border:1px solid rgba(214,168,75,.35);border-bottom:none;border-radius:8px 8px 0 0;padding:9px 12px 12px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;transform:translateY(6px);transition:transform .2s ease,background .2s ease,color .2s ease}
      .evn-tab-icon{font-size:14px;line-height:1}
      .evn-tab-active{transform:translateY(0);color:#fff;background:var(--evn-tab-tint,#1f3a6e);border-color:var(--evn-tab-tint,#1f3a6e);box-shadow:0 -2px 10px rgba(0,0,0,.35)}

      .evn-book-body{position:relative;flex:1;min-height:0;background:linear-gradient(135deg,#12213f,#0c1730);border-radius:4px 14px 14px 14px;border:1px solid rgba(214,168,75,.4);box-shadow:0 20px 50px rgba(0,0,0,.5);padding:16px;display:flex;flex-direction:column}
      .evn-close-btn{position:absolute;top:-14px;right:-6px;z-index:5;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.4)}
      .evn-close-btn:active{opacity:.8}

      .evn-page{flex:1;min-height:0;display:flex;flex-direction:column;overflow-y:auto;overscroll-behavior:contain;position:relative;transform-origin:center left;will-change:transform}
      /* ===== 페이지 넘김 효과 (runPageFlip) =====
         단순 rotateY 트랜지션 대신 @keyframes로 구간마다 rotateY·skewY·
         scaleX/scaleY·filter(brightness)를 함께 바꿔, 빳빳한 판이 아니라
         종이 한 장이 접히듯 살짝 물결치며 넘어가는 인상을 준다 — skewY가
         "위쪽 모서리가 아래쪽보다 더 많이 들리는" 비대칭 휨을 만들고,
         scaleX/scaleY가 종이가 눌렸다 펴지는 두께감을 준다. 들어오는 쪽
         (evnPageIn*)은 완전히 넘어간 반대쪽 각도에서 시작해 0도를 살짝
         지나쳤다 되돌아오는 오버슈트(55%→80%→100%)로 "탁" 내려앉는 종이의
         탄성을 흉내낸다. evn-page::after는 넘어가는 순간 접힌 면에 빛이
         스치는 하이라이트/그림자를 얹는 보조 효과(evnPageCurlShadow). */
      .evn-page::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;background:linear-gradient(100deg,rgba(0,0,0,0) 28%,rgba(255,255,255,.38) 46%,rgba(0,0,0,.26) 56%,rgba(0,0,0,0) 74%)}
      @keyframes evnPageOutNext{
        0%{transform:perspective(1100px) rotateY(0deg) skewY(0deg) scaleX(1) scaleY(1);filter:brightness(1)}
        40%{transform:perspective(1100px) rotateY(-17deg) skewY(-2.6deg) scaleX(.97) scaleY(1.015);filter:brightness(.93)}
        100%{transform:perspective(1100px) rotateY(-46deg) skewY(-5.5deg) scaleX(.87) scaleY(1.045);opacity:.15;filter:brightness(.76)}
      }
      @keyframes evnPageOutPrev{
        0%{transform:perspective(1100px) rotateY(0deg) skewY(0deg) scaleX(1) scaleY(1);filter:brightness(1)}
        40%{transform:perspective(1100px) rotateY(17deg) skewY(2.6deg) scaleX(.97) scaleY(1.015);filter:brightness(.93)}
        100%{transform:perspective(1100px) rotateY(46deg) skewY(5.5deg) scaleX(.87) scaleY(1.045);opacity:.15;filter:brightness(.76)}
      }
      @keyframes evnPageInNext{
        0%{transform:perspective(1100px) rotateY(38deg) skewY(5deg) scaleX(.87) scaleY(1.05);opacity:0;filter:brightness(.8)}
        55%{transform:perspective(1100px) rotateY(-9deg) skewY(-1.6deg) scaleX(1.025) scaleY(.978);opacity:1;filter:brightness(1.1)}
        80%{transform:perspective(1100px) rotateY(3deg) skewY(.6deg) scaleX(.99) scaleY(1.008);filter:brightness(.98)}
        100%{transform:perspective(1100px) rotateY(0deg) skewY(0deg) scaleX(1) scaleY(1);opacity:1;filter:brightness(1)}
      }
      @keyframes evnPageInPrev{
        0%{transform:perspective(1100px) rotateY(-38deg) skewY(-5deg) scaleX(.87) scaleY(1.05);opacity:0;filter:brightness(.8)}
        55%{transform:perspective(1100px) rotateY(9deg) skewY(1.6deg) scaleX(1.025) scaleY(.978);opacity:1;filter:brightness(1.1)}
        80%{transform:perspective(1100px) rotateY(-3deg) skewY(-.6deg) scaleX(.99) scaleY(1.008);filter:brightness(.98)}
        100%{transform:perspective(1100px) rotateY(0deg) skewY(0deg) scaleX(1) scaleY(1);opacity:1;filter:brightness(1)}
      }
      @keyframes evnPageCurlShadow{0%{opacity:0}45%{opacity:.55}100%{opacity:0}}
      .evn-page.evn-page-anim-out-next{animation:evnPageOutNext .3s cubic-bezier(.5,0,.85,.4) forwards}
      .evn-page.evn-page-anim-out-prev{animation:evnPageOutPrev .3s cubic-bezier(.5,0,.85,.4) forwards}
      .evn-page.evn-page-anim-in-next{animation:evnPageInNext .46s cubic-bezier(.22,.85,.32,1) forwards}
      .evn-page.evn-page-anim-in-prev{animation:evnPageInPrev .46s cubic-bezier(.22,.85,.32,1) forwards}
      .evn-page.evn-page-anim-out-next::after,.evn-page.evn-page-anim-out-prev::after{animation:evnPageCurlShadow .3s ease forwards}
      .evn-page.evn-page-anim-in-next::after,.evn-page.evn-page-anim-in-prev::after{animation:evnPageCurlShadow .46s ease forwards}

      /* ===== 직접 디자인 페이지 — 배경 아트 없이도 손으로 꾸민 수사 노트
         처럼 보이도록 CSS만으로 그린다(renderFallbackPageHtml). 압정
         (evn-sheet-pin)·줄노트 배경·마스킹 테이프(evn-frame-tape)·점선
         구분선으로 "사진을 올리지 않아도 노트답게" 보이는 게 목표라, 사진이
         없는 항목(evn-frame-empty)도 빈 프레임이 아니라 완성된 디자인
         요소로 보이게 한다. */
      .evn-sheet{position:relative;flex:1;display:flex;flex-direction:column;min-height:0;background:repeating-linear-gradient(180deg,rgba(138,114,69,.09) 0,rgba(138,114,69,.09) 1px,transparent 1px,transparent 27px),linear-gradient(180deg,#f8efd9,#efe0bd);border-radius:3px 12px 12px 3px;padding:26px 18px 14px;box-shadow:inset 0 0 0 1px rgba(214,168,75,.5),inset 6px 0 0 rgba(199,117,44,.18),0 8px 22px rgba(0,0,0,.32);color:#3a2f1c;transform:rotate(-.3deg)}
      .evn-sheet-empty{align-items:center;justify-content:center;gap:10px;color:#7a6a45;transform:none}
      .evn-sheet-pin{position:absolute;top:0;left:50%;transform:translateX(-50%) rotate(-8deg);font-size:20px;filter:drop-shadow(0 3px 4px rgba(0,0,0,.4));pointer-events:none}

      /* ===== 이미지 모드 — 실제 배경 아트가 있는 책갈피 (§상단 주석) =====
         .evn-sheet-imagemode는 flex:none이라 자식 <img>의 자연 비율 높이로만
         커진다(늘려 채우지 않음) — .evn-page가 세로 스크롤을 대신 맡는다. */
      .evn-sheet-imagemode{flex:none;position:relative;width:100%;padding:0;border-radius:10px;overflow:hidden;background:none;box-shadow:none;display:block}
      .evn-imgmode-bg{width:100%;display:block;pointer-events:none;user-select:none;-webkit-user-drag:none}
      .evn-tab-hotspot{position:absolute;background:transparent;border:none;padding:0;margin:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
      .evn-imgmode-code{position:absolute;font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:10.5px;color:#8a7245;overflow:hidden;white-space:nowrap}
      .evn-imgmode-title{position:absolute;font-size:14px;font-weight:800;color:#2c2311;line-height:1.25;overflow:hidden}
      .evn-imgmode-photo{position:absolute;border-radius:6px;overflow:hidden;cursor:zoom-in;background:rgba(255,255,255,.25)}
      .evn-imgmode-photo img{width:100%;height:100%;object-fit:cover;display:block}
      .evn-imgmode-text-main{position:absolute;overflow-y:auto;font-size:12px;line-height:1.5;color:#3a2f1c;padding:4px}
      .evn-imgmode-desc{position:absolute;overflow-y:auto;font-size:11px;line-height:1.5;color:#4a3d22}
      /* discoveredLocationText/relatedPerson 각각 자기 영역에 아이콘+텍스트
         한 줄로 표시 — 글자 크기/색은 textRegionStyle의 인라인 스타일이
         우선한다(관리자 서식 패널, dev/upload/evidence-notebook/index.html). */
      .evn-imgmode-location{position:absolute;overflow:hidden;display:flex;align-items:baseline;gap:5px;white-space:nowrap}
      .evn-imgmode-meta-icon{opacity:.8;flex-shrink:0}
      .evn-empty-icon{font-size:34px;opacity:.7}
      .evn-empty-text{font-size:13px;font-weight:600}

      .evn-sheet-header{display:flex;justify-content:space-between;align-items:center;font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:10.5px;font-weight:700;letter-spacing:.08em;color:#8a5a2c;border-bottom:1px dashed rgba(138,114,69,.45);padding-bottom:8px;margin-bottom:10px}
      .evn-sheet-code{background:rgba(199,117,44,.14);border:1px solid rgba(199,117,44,.4);border-radius:4px;padding:2px 7px}
      .evn-sheet-title{font-size:16.5px;font-weight:800;color:#2c2311;margin-bottom:12px;line-height:1.35;padding-bottom:8px;border-bottom:2px solid rgba(44,35,17,.14)}
      .evn-updated{display:inline-block;margin-left:8px;font-size:10px;font-weight:700;color:#fff;background:#c7752c;border-radius:8px;padding:2px 7px;vertical-align:middle}

      .evn-frame{position:relative;border:1px solid rgba(138,114,69,.4);border-radius:6px;background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;min-height:150px;max-height:38vh;box-shadow:0 3px 10px rgba(58,47,28,.18)}
      .evn-frame-photo{cursor:zoom-in;overflow:visible;padding:10px 10px 22px;background:#fffdf6;border:1px solid rgba(0,0,0,.08)}
      .evn-frame-photo img{width:100%;height:100%;object-fit:cover;display:block;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}
      .evn-frame-tape{position:absolute;width:44px;height:15px;background:rgba(214,168,75,.4);border:1px solid rgba(214,168,75,.55);opacity:.8;z-index:2}
      .evn-frame-tape-l{top:-6px;left:12px;transform:rotate(-8deg)}
      .evn-frame-tape-r{top:-6px;right:12px;transform:rotate(7deg)}
      .evn-frame-empty{flex-direction:column;gap:6px;border-style:dashed}
      .evn-frame-empty .evn-frame-fallback-icon{font-size:40px;opacity:.5}
      .evn-frame-empty-label{font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:11px;color:#8a7245}
      .evn-frame-document{flex-direction:column;gap:8px;padding:14px 14px 14px 20px;align-items:flex-start;justify-content:flex-start;overflow-y:auto;background:repeating-linear-gradient(180deg,transparent 0,transparent 22px,rgba(138,114,69,.16) 23px),#fffdf6;border-left:3px solid rgba(199,65,65,.35)}
      .evn-doc-icon{font-size:20px}
      .evn-doc-text{font-size:13.5px;line-height:23px;color:#3a2f1c;white-space:pre-wrap}
      .evn-frame-statement{position:relative;flex-direction:column;gap:8px;padding:18px 16px 14px;background:#fffdf6}
      .evn-quote-mark{position:absolute;top:-6px;left:10px;font-size:52px;line-height:1;color:rgba(199,117,44,.25);font-family:Georgia,serif}
      .evn-statement-portrait{width:60px;height:60px;border-radius:50%;object-fit:cover;border:3px solid #fffdf6;box-shadow:0 0 0 1px rgba(138,114,69,.5)}
      .evn-statement-icon{font-size:34px}
      .evn-statement-quote{font-size:14px;line-height:1.7;color:#3a2f1c;text-align:center;font-style:italic}

      .evn-sheet-scroll{flex:1;min-height:0;overflow-y:auto;margin-top:12px}
      .evn-sheet-desc{font-size:13px;line-height:1.7;color:#4a3d22;margin-bottom:12px;padding:10px 12px;background:rgba(255,255,255,.4);border-radius:6px;border:1px dashed rgba(138,114,69,.3)}
      .evn-meta-table{border-top:1px dashed rgba(138,114,69,.4);padding-top:10px;display:flex;flex-direction:column;gap:7px}
      .evn-meta-row{display:flex;align-items:baseline;gap:8px;font-size:12.5px}
      .evn-meta-icon{width:18px;text-align:center;opacity:.85}
      .evn-meta-label{font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:10.5px;color:#8a7245;flex-shrink:0}
      .evn-meta-value{color:#2c2311;font-weight:700}

      .evn-npc-tag{position:absolute;top:12px;left:16px;z-index:4;font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:11px;font-weight:700;color:#fff;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.25);border-radius:20px;padding:5px 12px}
      .evn-npc-tag.hidden{display:none}

      .evn-footer{display:flex;gap:8px;margin-top:10px;flex-shrink:0}
      .evn-footer.hidden{display:none}
      .evn-nav-btn{flex:1;font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:12.5px;font-weight:700;color:#fff;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:12px 8px;cursor:pointer;min-height:44px}
      .evn-nav-btn:disabled{opacity:.35;pointer-events:none}
      .evn-nav-btn:active{opacity:.8}
      .evn-submit-btn{margin-top:10px;flex-shrink:0;font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:14px;font-weight:800;color:#2c2311;background:linear-gradient(135deg,#e9c467,#c7942f);border:none;border-radius:12px;padding:14px;cursor:pointer;min-height:48px}
      .evn-submit-btn.hidden{display:none}
      .evn-submit-btn:active{opacity:.85}

      /* ===== 색인 패널 — 기존 노트 페이지(evn-sheet)와 같은 종이/파치먼트
         양식을 그대로 차용한다(어두운 팝업 대신 노트의 한 페이지처럼 보이게).
         열고 닫을 때도 evn-overlay와 같은 방식(hidden 유지 + 클래스 트랜지션,
         §openIndexPanel/closeIndexPanel)으로 책장이 넘어가듯 펼쳐진다. */
      .evn-index-panel{position:absolute;inset:0;z-index:6;background:repeating-linear-gradient(180deg,rgba(138,114,69,.09) 0,rgba(138,114,69,.09) 1px,transparent 1px,transparent 27px),linear-gradient(180deg,#f8efd9,#efe0bd);border-radius:3px 12px 12px 3px;box-shadow:inset 0 0 0 1px rgba(214,168,75,.5),inset 6px 0 0 rgba(199,117,44,.18),0 8px 22px rgba(0,0,0,.32);display:flex;flex-direction:column;padding:18px 16px 16px;transform-origin:left center;transform:perspective(1200px) rotateY(-88deg);opacity:0;transition:transform .32s cubic-bezier(0.2,0.8,0.2,1),opacity .26s ease}
      .evn-index-panel.hidden{display:none}
      .evn-index-panel.evn-index-open{transform:perspective(1200px) rotateY(0deg);opacity:1}
      .evn-index-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px dashed rgba(138,114,69,.45)}
      .evn-index-panel-title{font-size:15px;font-weight:800;color:#2c2311}
      .evn-index-panel .evn-close-btn{position:static;background:rgba(44,35,17,.12);border:1px solid rgba(138,114,69,.4);color:#4a3d22}
      .evn-index-list{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px}
      .evn-index-row{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.45);border:1px solid rgba(138,114,69,.3);border-radius:8px;padding:11px 12px;cursor:pointer;text-align:left;font-family:inherit;color:#3a2f1c;min-height:44px}
      .evn-index-row-active{border-color:rgba(199,117,44,.7);background:rgba(199,117,44,.16)}
      .evn-index-code{font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:10.5px;color:#8a7245;flex-shrink:0}
      .evn-index-title{font-size:13px;font-weight:600;color:#2c2311;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .evn-dot{width:7px;height:7px;border-radius:50%;background:#c7752c;flex-shrink:0}
      .evn-index-empty{color:#8a7245;font-size:13px;text-align:center;padding:20px 0}

      .evn-zoom-panel{position:absolute;inset:0;z-index:8;background:#000;border-radius:4px 14px 14px 14px;overflow:hidden}
      .evn-zoom-panel.hidden{display:none}
      .evn-zoom-close{position:absolute;top:10px;right:10px;z-index:9}
      .evn-zoom-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;touch-action:none;overflow:hidden}
      .evn-zoom-img-wrap img{max-width:100%;max-height:100%;object-fit:contain;transform-origin:center;will-change:transform;user-select:none;-webkit-user-drag:none}
      .evn-zoom-fallback{font-size:64px;opacity:.6}

      .evn-confirm-panel{position:absolute;inset:0;z-index:10;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:24px}
      .evn-confirm-panel.hidden{display:none}
      .evn-confirm-card{width:100%;max-width:300px;background:#171c22;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:22px 18px}
      .evn-confirm-text{font-size:14.5px;line-height:1.5;color:#fff;text-align:center;margin-bottom:18px}
      .evn-confirm-actions{display:flex;gap:8px}
      .evn-confirm-cancel,.evn-confirm-ok{flex:1;font-family:var(--mono,'IBM Plex Mono',ui-monospace,monospace);font-size:13px;font-weight:700;border-radius:10px;padding:11px;cursor:pointer;min-height:44px}
      .evn-confirm-cancel{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff}
      .evn-confirm-ok{background:var(--cyan,#59b8c8);border:none;color:#04181c}

      @media (max-width:374px){
        .evn-sheet-title{font-size:14.5px}
        .evn-frame{min-height:120px}
      }
    `;
    document.head.appendChild(style);
  }

  // SECTIONS/renderExamplePageHtml는 dev/upload/evidence-notebook/index.html의
  // "예시" 미리보기 전용 — 이 파일이 사진 배경 없이 그리는 직접 디자인
  // 페이지(renderFallbackPageHtml)를 관리자 설정 화면에서도 똑같이 재사용해
  // 두 곳의 디자인이 벌어지지 않게 한다(§상단 주석 "순수 표시 계층 하나").
  return { open, close, isOpen: () => state.isOpen, injectStyles, SECTIONS, renderExamplePageHtml: renderFallbackPageHtml };
})();
