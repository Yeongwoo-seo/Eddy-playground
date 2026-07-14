/* OPERATION MK DEV — CaseEntry normalization layer (증거·증언·추리 메모 재설계).
   Pure data functions, no DOM. Sits between CaseFileState (evidence[]/
   questions[], untouched — see caseFileState.js header) and the render
   layer (caseEntryUI.js + caseMenu.js/game/explore's present sheets).

   Why a separate layer instead of rewriting evidence/questions: the ~58
   existing addEvidence/addQuestion call sites (dialogueData.js,
   interactionDefs.js, several minigames) inline their full content and are
   referenced by exact id from dialogue gates (line.evidenceIds),
   interaction unlock conditions (interactionDefs.js unlockConditions
   type:'hasEvidence'), free-roam reaction rules (presentEvidenceRules), and
   question links (linkedEvidenceIds). Rewriting those 58 call sites to fit
   a new schema would be the highest-risk, highest-effort way to get here.
   Instead this file normalizes the *existing* records into a common
   CaseEntry shape at render time, and a metadata catalog (AssetDB.
   getCaseEntryMeta, see assetDb.js) overlays grouping/presentability/tags
   without ever touching the original records or their ids.

   CaseEntry shape (see normalizeLegacyEvidence/normalizeLegacyQuestion):
   { id, kind: 'evidence'|'testimony'|'memo', subtype, code, title, summary,
     description, presentable, status, discoveredAt, discoveredLocationText,
     groupId, representativeId, relatedNpcIds, relatedLocationIds,
     topicTags, week, iconKey, imageAssetId, detailImageAssetId,
     fallbackIcon, stages[], history[], sourceIds[] } */

/* ===== 타입별 폴백 아이콘 (§10.14 우선순위의 마지막 단계) ===== */
const CASE_ENTRY_EVIDENCE_ICON_BY_SUBTYPE = { physical: '🧾', photo: '📷', testimony: '🗣️', record: '📄', etc: '📦' };
function caseEntryFallbackIcon(kind, subtype) {
  if (kind === 'testimony') return '🗣️';
  if (kind === 'memo') return '❓';
  return CASE_ENTRY_EVIDENCE_ICON_BY_SUBTYPE[subtype] || CASE_ENTRY_EVIDENCE_ICON_BY_SUBTYPE.etc;
}

/* ===== 레거시 → CaseEntry 변환 (§7.2 자동 분류 규칙) ===== */
function inferCaseEntryKind(evidenceItem) { return evidenceItem.category === 'testimony' ? 'testimony' : 'evidence'; }

// 레거시 증언은 reviseTestimony(Phase 3) 이전 콘텐츠라 이력이 비어 있을 수
// 있다 — 그 경우 최초 description을 버전 1로 합성해, 새로 작성된 증언과
// 상세 화면 구조가 항상 동일하게 보이도록 한다.
function testimonyHistoryFor(item) {
  const explicit = (typeof CaseFileState !== 'undefined' && CaseFileState.getTestimonyHistory) ? CaseFileState.getTestimonyHistory(item.id) : [];
  if (explicit && explicit.length) return explicit;
  return [{ version: 1, statement: item.description || '', reason: '최초 진술', sceneId: null, active: true, revisedAt: item.discoveredAt || null }];
}

function normalizeLegacyEvidence(item, meta) {
  meta = meta || {};
  const kind = meta.kind || inferCaseEntryKind(item);
  return {
    id: item.id,
    kind,
    subtype: item.category || 'etc',
    code: item.code || '',
    title: item.title || '',
    summary: item.description || '',
    description: item.description || '',
    presentable: meta.presentable !== undefined ? !!meta.presentable : true,
    status: item.status,
    discoveredAt: item.discoveredAt || 0,
    discoveredLocationText: item.discoveredLocationText || '',
    groupId: meta.groupId || null,
    representativeId: meta.representativeId || null,
    mergeAsStage: !!meta.mergeAsStage,
    stageOrder: meta.stageOrder || 0,
    speakerId: meta.speakerId || null,
    speakerName: meta.speakerName || null,
    relatedNpcIds: meta.relatedNpcIds || [],
    relatedLocationIds: meta.relatedLocationIds || [],
    topicTags: meta.topicTags || [],
    week: meta.week != null ? meta.week : null,
    iconKey: meta.iconKey || null,
    imageAssetId: meta.imageAssetId || null,
    detailImageAssetId: meta.detailImageAssetId || null,
    fallbackIcon: caseEntryFallbackIcon(kind, item.category || 'etc'),
    stages: ownEvidenceStages(item),
    history: kind === 'testimony' ? testimonyHistoryFor(item) : [],
    sourceIds: [item.id],
    relatedQuestionIds: item.relatedQuestionIds || [],
    _legacy: item,
  };
}

// updateEvidence(id, { addStage }) (§7.5) 로 신규 API가 직접 쌓은 조사
// 단계 — 카탈로그 그룹 병합으로 흡수되는 레거시 sourceIds의 단계와는 다른
// 통로다. 둘 다 최종적으로 같은 entry.stages 배열에 합쳐지고 order로
// 정렬된다(mergeGroupedEntries 참고).
function ownEvidenceStages(item) {
  const raw = (typeof CaseFileState !== 'undefined' && CaseFileState.getEvidenceStages) ? CaseFileState.getEvidenceStages(item.id) : [];
  return raw.map((s, i) => ({ id: s.id || (item.id + '-stage-' + (i + 1)), title: s.title, detail: s.detail, order: s.order || (i + 1), unlocked: s.unlocked !== false }));
}

function normalizeLegacyQuestion(item, meta) {
  meta = meta || {};
  return {
    id: item.id,
    kind: 'memo',
    subtype: 'question',
    code: '',
    title: item.title || '',
    summary: item.description || '',
    description: item.description || '',
    // 추리 메모는 카탈로그로도 절대 제시 가능하게 만들 수 없다 (§5.4/§18).
    presentable: false,
    status: item.status,
    discoveredAt: item.createdAt || 0,
    discoveredLocationText: '',
    groupId: null,
    representativeId: null,
    mergeAsStage: false,
    stageOrder: 0,
    speakerId: null,
    speakerName: null,
    relatedNpcIds: meta.relatedNpcIds || [],
    relatedLocationIds: meta.relatedLocationIds || [],
    topicTags: meta.topicTags || [],
    week: meta.week != null ? meta.week : null,
    iconKey: meta.iconKey || null,
    imageAssetId: null,
    detailImageAssetId: null,
    fallbackIcon: caseEntryFallbackIcon('memo'),
    stages: [],
    history: [],
    sourceIds: [item.id],
    resolutionText: item.resolutionText,
    isNew: item.isNew,
    linkedEvidenceIds: item.linkedEvidenceIds || [],
    _legacy: item,
  };
}

/* ===== 참조 감사 (§7.3/§13.3의 "안전하게 병합/제외" 근거) =====
   실제 소스 텍스트를 정규식으로 스캔하는 대신, 이미 로드된 전역 데이터
   구조(allScenes/interactionDefs/presentEvidenceRules)를 그대로 순회한다 —
   이 페이지들은 항상 dialogueData.js/interactionDefs.js를 스크립트로 먼저
   불러오므로 더 정확하고 더 가볍다. 반환된 Set에 있는 id는 대화 게이트,
   상호작용 잠금 조건, 또는 제시 반응 규칙이 그 정확한 id를 요구한다는
   뜻이므로, 카탈로그가 그 id를 mergeAsStage/presentable:false로 지정해도
   mergeGroupedEntries가 무시하고 경고만 남긴다. */
let _hardReferencedEvidenceIdsCache = null;
function auditEvidenceReferences() {
  if (_hardReferencedEvidenceIdsCache) return _hardReferencedEvidenceIdsCache;
  const ids = new Set();
  if (typeof allScenes !== 'undefined') {
    allScenes.forEach(scene => (scene.lines || []).forEach(line => {
      (line.evidenceIds || []).forEach(id => ids.add(id));
      (line.choices || []).forEach(choice => {
        if (choice.condition && choice.condition.hasEvidence) choice.condition.hasEvidence.forEach(id => ids.add(id));
      });
    }));
  }
  if (typeof interactionDefs !== 'undefined') {
    Object.values(interactionDefs).forEach(def => (def.unlockConditions || []).forEach(cond => {
      if (cond.type === 'hasEvidence') (cond.ids || (cond.id ? [cond.id] : [])).forEach(id => ids.add(id));
    }));
  }
  if (typeof presentEvidenceRules !== 'undefined') {
    presentEvidenceRules.forEach(rule => { if (rule.evidenceId) ids.add(rule.evidenceId); });
  }
  _hardReferencedEvidenceIdsCache = ids;
  return ids;
}
// dev/upload에서 카탈로그를 고치고 다시 감사를 돌릴 때만 필요 — 플레이 중
// allScenes/interactionDefs는 페이지 로드 후 바뀌지 않으므로 평소엔 불필요.
function resetCaseEntryAuditCache() { _hardReferencedEvidenceIdsCache = null; }

/* ===== 그룹 병합 (§6.3) ===== */
function mergeGroupedEntries(entries, metaCatalog) {
  metaCatalog = metaCatalog || {};
  const hardReferenced = auditEvidenceReferences();
  const byId = new Map(entries.map(e => [e.id, e]));
  const result = [];
  entries.forEach(entry => {
    const meta = metaCatalog[entry.id] || {};
    const wantsMerge = meta.mergeAsStage && meta.representativeId && meta.representativeId !== entry.id;
    if (wantsMerge && hardReferenced.has(entry.id)) {
      console.warn('[CaseEntryModel] 대화/상호작용 게이트가 참조하는 id는 병합할 수 없어 개별 카드로 유지합니다:', entry.id);
    } else if (wantsMerge && byId.has(meta.representativeId)) {
      const rep = byId.get(meta.representativeId);
      rep.stages.push({
        id: entry.id,
        title: entry.title,
        detail: entry.summary,
        order: meta.stageOrder || (rep.stages.length + 1),
        unlocked: true,
      });
      rep.sourceIds.push(entry.id);
      if (entry.discoveredAt > rep.discoveredAt) { rep.discoveredAt = entry.discoveredAt; rep.status = 'updated'; }
      return; // 대표 카드에 흡수 — 목록에 별도 카드로 노출하지 않음
    }
    result.push(entry);
  });
  result.forEach(entry => entry.stages.sort((a, b) => a.order - b.order));
  return result;
}

/* ===== 코드 내장 기본 카탈로그 (§Phase 2 "50개 재조립") =====
   AssetDB.getCaseEntryMeta()는 Supabase에 실제로 값을 올려야 반영되는
   비동기 카탈로그라, 관리자가 아직 아무것도 저장하지 않은 상태에서도
   화면이 바로 동작하도록 코드에 기본값을 실어둔다(§10.14 "이미지 없어도
   시스템이 먼저 작동" 원칙을 메타데이터에도 동일 적용). 여기 실린 병합은
   전부 auditEvidenceReferences()로 "어떤 대화 게이트/상호작용 조건/
   presentEvidenceRules도 이 정확한 id를 요구하지 않음"을 실제로 확인한
   항목만 넣었다 — 그렇지 않은 항목(예: 윤민아 디지털 포렌식 체인 E-M02~
   A04는 각 단계가 심문 대화의 개별 제시 게이트라 병합하면 특정 증거를
   정확히 골라 제시해야 하는 게임플레이가 깨진다)은 넣지 않았다. 확신이
   서지 않는 나머지 후보는 병합하지 않고 개별 카드로 유지 — 관리자
   페이지(§Phase 5)의 "병합 후보" 필터에서 사람이 검토해 추가할 수 있다.

   1) 레오 의뢰 스레드 — 의뢰 메시지 → 참고 이미지 → 각인 확대 요청 →
      중개 계정, 넷 다 게이트 비참조 확인됨.
   2) K-01 출품 사진 — 출품 당시 사진 → (나중에) 하단 각인 선명도 변화,
      둘 다 게이트 비참조 확인됨.
   3) 애드리언 문의 메일 — 외부 문의 기록에 보낸메일 캐시가 이어붙는
      스테이지. adrian-sender/adrian-email-re-prefix/adrian-once-only-claim/
      adrian-tablet-history는 각각 별도 게이트·규칙이 있어(hard-referenced)
      병합하지 않고 topicTags만 공유해 Phase 4 관련도 계산에 묶인다. */
const CASE_ENTRY_META_DEFAULTS = {
  'evidence-leo-commission-message': { topicTags: ['leo-commission', 'mk'], relatedNpcIds: ['leo'] },
  'evidence-leo-reference-image': { mergeAsStage: true, representativeId: 'evidence-leo-commission-message', stageOrder: 2, topicTags: ['leo-commission', 'mk'], relatedNpcIds: ['leo'] },
  'evidence-k01-inscription-request': { mergeAsStage: true, representativeId: 'evidence-leo-commission-message', stageOrder: 3, topicTags: ['leo-commission', 'mk'], relatedNpcIds: ['leo'] },
  'evidence-mk-consult-account': { mergeAsStage: true, representativeId: 'evidence-leo-commission-message', stageOrder: 4, topicTags: ['leo-commission', 'mk'], relatedNpcIds: ['leo'] },

  'evidence-k01-submission-photo': { topicTags: ['k01-submission'], relatedNpcIds: ['martin'] },
  'evidence-k01-inscription-sharper': { mergeAsStage: true, representativeId: 'evidence-k01-submission-photo', stageOrder: 2, topicTags: ['k01-submission'], relatedNpcIds: ['martin'] },

  'evidence-adrian-inquiry': { topicTags: ['mk-inquiry', 'adrian-email'], relatedNpcIds: ['adrian'] },
  'evidence-adrian-sent-mail-cache': { mergeAsStage: true, representativeId: 'evidence-adrian-inquiry', stageOrder: 2, topicTags: ['mk-inquiry', 'adrian-email'], relatedNpcIds: ['adrian'] },
  'evidence-adrian-sender': { topicTags: ['mk-inquiry', 'adrian-email'], relatedNpcIds: ['adrian'] },
  'evidence-adrian-email-re-prefix': { topicTags: ['mk-inquiry', 'adrian-email'], relatedNpcIds: ['adrian'] },
  'evidence-adrian-once-only-claim': { topicTags: ['mk-inquiry', 'adrian-email'], relatedNpcIds: ['adrian'] },
  'evidence-adrian-tablet-history': { topicTags: ['mk-inquiry', 'adrian-email'], relatedNpcIds: ['adrian'] },
};

// 코드 내장 기본값 위에 Supabase 오버라이드를 얹은 "실제 적용되는" 카탈로그.
// 동기 렌더 경로(캐시된 값)와 관리자 페이지(await로 최신값을 직접 가져온
// 뒤 이 함수에 넘김) 양쪽에서 재사용한다.
function getEffectiveCaseEntryMeta(supabaseCatalog) {
  return Object.assign({}, CASE_ENTRY_META_DEFAULTS, supabaseCatalog || {});
}

/* ===== 정규화 진입점 ===== */
function getCaseEntryMetaCatalogSync() {
  const supabaseOverrides = (typeof AssetDB !== 'undefined' && AssetDB.getCaseEntryMetaCached) ? AssetDB.getCaseEntryMetaCached() : {};
  return getEffectiveCaseEntryMeta(supabaseOverrides);
}
function normalizeCaseFile({ evidence, questions, metaCatalog }) {
  metaCatalog = metaCatalog || getCaseEntryMetaCatalogSync();
  const fromEvidence = evidence.map(item => normalizeLegacyEvidence(item, metaCatalog[item.id]));
  const fromQuestions = questions.map(item => normalizeLegacyQuestion(item, metaCatalog[item.id]));
  return mergeGroupedEntries(fromEvidence.concat(fromQuestions), metaCatalog);
}

/* ===== 관련 항목 점수 (§9.3) — Phase 4 =====
   presentable=false/kind:'memo'/mergeAsStage로 흡수된 카드는 애초에 entries
   목록에 없으므로 별도 제외 처리가 필요 없다. 정답만 남기지 않도록(§9.3
   "중요") 상한선 밖으로 밀려나는 것 외에는 하드 필터링하지 않는다. */
function scorePresentRelevance(entry, ctx) {
  let score = 0;
  if (ctx.npcId && entry.relatedNpcIds.includes(ctx.npcId)) score += 5;
  if (ctx.topicTags && ctx.topicTags.length && entry.topicTags.some(t => ctx.topicTags.includes(t))) score += 4;
  if (ctx.locationId && entry.relatedLocationIds.includes(ctx.locationId)) score += 2;
  if (ctx.week != null && entry.week === ctx.week) score += 1;
  const RECENT_MS = 1000 * 60 * 30;
  if (entry.discoveredAt && (Date.now() - entry.discoveredAt) < RECENT_MS) score += 1;
  if (ctx.npcId && typeof CaseFileState !== 'undefined' && CaseFileState.hasFlag('presented:' + ctx.npcId + ':' + entry.id)) score -= 3;
  return score;
}
function getRelevantPresentEntries(entries, ctx) {
  const presentable = entries.filter(e => e.presentable && e.status !== 'superseded' && e.status !== 'invalid');
  const scored = presentable.map(e => ({ entry: e, score: scorePresentRelevance(e, ctx) }));
  scored.sort((a, b) => b.score - a.score || b.entry.discoveredAt - a.entry.discoveredAt);
  const max = ctx.maxSuggested || 8;
  const min = Math.min(4, scored.length);
  const count = Math.max(min, Math.min(max, scored.length));
  return scored.slice(0, count).map(s => s.entry);
}

const CaseEntryModel = {
  normalizeCaseFile,
  mergeGroupedEntries,
  auditEvidenceReferences,
  resetCaseEntryAuditCache,
  caseEntryFallbackIcon,
  scorePresentRelevance,
  getRelevantPresentEntries,
  getEffectiveCaseEntryMeta,
  CASE_ENTRY_META_DEFAULTS,
};
