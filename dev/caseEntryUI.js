/* OPERATION MK DEV — CaseEntry 제시 시트 공용 렌더 (§11 공용 컴포넌트).
   dev/game/index.html(대화 중 제시 시트)과 dev/explore/index.html(탐색허브
   제시 시트)이 각각 따로 구현하던 필터/그룹핑 로직을 하나로 합친다.
   순수 HTML 문자열 생성만 담당 — 실제 DOM 교체와 이벤트 재바인딩은 호스트
   페이지가 기존에 쓰던 방식(innerHTML 교체 후 querySelectorAll로 재바인딩,
   caseMenu.js의 render()/onBodyClick과 동일한 관용구)을 그대로 따른다.
   escapeHtml/cm-filter-row/cm-tab 등은 caseMenu.js가 이미 전역으로 선언·
   주입해두므로 재사용한다 — 두 호스트 페이지 다 caseMenu.js를 먼저 로드. */

const CASE_ENTRY_PRESENT_TABS = [
  { id: 'related', label: '관련 항목' },
  { id: 'evidence', label: '증거' },
  { id: 'testimony', label: '증언' },
  { id: 'all', label: '전체' },
];

function presentSheetEntriesForTab(presentableEntries, ctx) {
  if (ctx.activeTab === 'evidence') return presentableEntries.filter(e => e.kind === 'evidence');
  if (ctx.activeTab === 'testimony') return presentableEntries.filter(e => e.kind === 'testimony');
  if (ctx.activeTab === 'all') return presentableEntries;
  return CaseEntryModel.getRelevantPresentEntries(presentableEntries, ctx);
}

// 오답 카드도 일부 섞여 있어야 한다는 원칙(§9.3 "정답 하나만 남도록 강하게
// 필터링하지 않는다")은 scorePresentRelevance/getRelevantPresentEntries 쪽
// 책임이고, 여기는 그 결과를 그대로 그린다.
function renderPresentSheetHtml(allEntries, ctx) {
  ctx = ctx || {};
  const activeTab = ctx.activeTab || 'related';
  const presentable = allEntries.filter(e => e.presentable && e.status !== 'superseded' && e.status !== 'invalid');
  if (!presentable.length) return '<div class="cm-empty">아직 제시할 수 있는 증거나 증언이 없습니다.</div>';
  const tabBar = `<div class="cm-tabbar ces-tabbar">${CASE_ENTRY_PRESENT_TABS.map(t => `<button class="cm-tab${t.id === activeTab ? ' cm-tab-active' : ''}" data-present-tab="${t.id}">${t.label}</button>`).join('')}</div>`;
  const list = presentSheetEntriesForTab(presentable, Object.assign({}, ctx, { activeTab }));
  const selected = ctx.selectedId ? list.find(e => e.id === ctx.selectedId) : null;
  const emptyMsg = activeTab === 'related' ? '현재 대화와 관련된 항목이 없습니다. 다른 탭에서 골라보세요.' : '표시할 항목이 없습니다.';
  const gridHtml = list.length ? `<div class="ces-grid">${list.map(e => caseEntryPresentCardHtml(e, e.id === ctx.selectedId)).join('')}</div>` : `<div class="cm-empty">${emptyMsg}</div>`;
  // 카드 탭 = 선택만, 즉시 제출 안 함(§9.4 오탭 방지) — 실제 제시는 호스트
  // 페이지가 이 버튼의 data-present-confirm 클릭을 받아 처리한다.
  const confirmHtml = selected ? `
    <div class="ces-confirm-bar">
      <div class="ces-confirm-summary">${escapeHtml(selected.title)}${selected.summary ? ' — ' + escapeHtml(selected.summary) : ''}</div>
      <button class="ces-confirm-btn" data-present-confirm="${selected.id}">제시하기</button>
    </div>
  ` : '';
  return tabBar + gridHtml + confirmHtml;
}

function caseEntryPresentCardHtml(entry, selected) {
  return `
    <button class="ces-card${selected ? ' ces-card-selected' : ''}" data-present-entry="${entry.id}">
      ${caseEntryIconHtml(entry)}
      <div class="ces-card-body">
        <div class="ces-card-title">${escapeHtml(entry.title)}${entry.status === 'updated' ? '<span class="cm-updated-tag">업데이트됨</span>' : ''}</div>
        <div class="ces-card-summary">${escapeHtml(entry.summary || '')}</div>
      </div>
      <div class="ces-card-kind">${entry.kind === 'testimony' ? '증언' : '증거'}</div>
    </button>
  `;
}

/* ===== 개별 이미지 / 폴백 아이콘 (§10.14 우선순위) =====
   1. 승인된 카드별 iconAssetId(=entry.imageAssetId, §Phase 5 관리자가
      승인할 때만 채워짐 — 자동 분할 직후엔 채워지지 않으므로 미승인
      아이콘은 여기 도달하지 않는다, §18 "승인 없이 곧바로 공개하지 않는다")
   2/3. iconKey 공통 이미지·subtype 기본 아이콘은 이번 범위에서는 생략하고
      바로 4) kind별 최종 폴백 이모지로 넘어간다 — caseEntryFallbackIcon이
      이미 subtype별로 갈라주므로(🧾/📷/🗣️/📄 등) 실사용상 구분은 충분하고,
      iconKey 공용 이미지 계층까지 넣으려면 카탈로그가 하나 더 필요해
      "이미지 없어도 시스템이 먼저 동작"이라는 원칙엔 영향이 없다.
   imageAssetId가 있으면 비동기로 실제 이미지를 가져와 갈아끼워야 하므로
   (AssetDB.getAssetsByIds는 async, 카드 HTML은 동기 생성) 우선 폴백
   이모지로 그린 뒤 hydrateCaseEntryIcons가 나중에 <img>로 교체한다. */
function caseEntryIconHtml(entry) {
  if (entry.imageAssetId) {
    return `<span class="ces-card-icon" data-icon-asset="${entry.imageAssetId}">${entry.fallbackIcon}</span>`;
  }
  return `<span class="ces-card-icon">${entry.fallbackIcon}</span>`;
}

// 카드 HTML을 DOM에 꽂은 직후 호출 — data-icon-asset이 달린 아이콘만
// 배치 조회해 <img>로 교체한다. 승인된 이미지가 없는 카드는 그대로
// 이모지 폴백을 유지(§10.14 마지막 단계이자 §Phase5 완료 조건 "이미지 없어도
// 폴백 아이콘이 정상 표시").
async function hydrateCaseEntryIcons(root) {
  if (typeof AssetDB === 'undefined' || !root) return;
  const nodes = Array.from(root.querySelectorAll('[data-icon-asset]'));
  if (!nodes.length) return;
  const ids = Array.from(new Set(nodes.map(n => n.dataset.iconAsset)));
  let assets = [];
  try { assets = await AssetDB.getAssetsByIds(ids); } catch (e) { return; }
  const byId = new Map(assets.map(a => [a.id, a]));
  nodes.forEach(n => {
    const asset = byId.get(n.dataset.iconAsset);
    if (asset && asset.dataUrl) n.innerHTML = `<img src="${asset.dataUrl}" alt="" class="ces-icon-img">`;
  });
}

function injectCaseEntryUIStyles() {
  if (document.getElementById('caseEntryUIStyles')) return;
  const style = document.createElement('style');
  style.id = 'caseEntryUIStyles';
  style.textContent = `
    .ces-tabbar{margin-bottom:10px}
    .ces-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .ces-card{display:flex;flex-direction:column;align-items:flex-start;gap:6px;background:#171F29;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:10px 12px;text-align:left;cursor:pointer;font-family:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
    .ces-card-selected{border-color:rgba(76,184,212,.7);background:rgba(76,184,212,.1)}
    .ces-card-icon{font-size:20px;line-height:1;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex-shrink:0}
    .ces-icon-img{width:32px;height:32px;object-fit:cover;border-radius:8px}
    .ces-card-title{font-size:13px;font-weight:700;color:#E7ECF1}
    .ces-card-summary{font-size:11.5px;color:#7E8791;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:2px}
    .ces-card-kind{font-size:10px;color:#4CB8D4;font-weight:700;letter-spacing:.04em}
    .ces-confirm-bar{position:sticky;bottom:0;display:flex;align-items:center;gap:10px;background:#0E141B;border-top:1px solid rgba(255,255,255,.10);padding:10px 4px 4px;margin-top:12px}
    .ces-confirm-summary{flex:1;font-size:12px;color:#C9D1D9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .ces-confirm-btn{background:#4CB8D4;color:#0B1116;border:none;border-radius:12px;padding:10px 16px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;flex-shrink:0}
  `;
  document.head.appendChild(style);
}

const CaseEntryUI = { renderPresentSheetHtml, caseEntryIconHtml, hydrateCaseEntryIcons, injectCaseEntryUIStyles, CASE_ENTRY_PRESENT_TABS };
