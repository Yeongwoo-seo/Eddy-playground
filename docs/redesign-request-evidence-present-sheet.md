# 개편 의뢰서 — 증거 제시 시트 (`dev/game/index.html`)

> 발신인: (작성자 본인)
> 대상: 대화 중 "🔍 증거 제시하기" 눌렀을 때 뜨는 증거 목록 바텀시트 (`dev/game/index.html` `#evidenceSheetOverlay` / `renderEvidenceSheet()`)
> 계기: 스크린샷 — 코드(E-MV2 등) + 제목만 나열된 카드가 스크롤로 쭉 이어져서 "보기 어렵다"
> 목적: 무엇을 어떻게 바꿀지 결정하기 위한 의뢰서. 승인되면 그에 맞춰 `dev/game/index.html`(HTML/CSS/`renderEvidenceSheet`)을 수정한다.

---

## 1. 현재 구현

```js
// dev/game/index.html:903-920
function renderEvidenceSheet() {
  const items = CaseFileState.getEvidence();       // 전체 증거, 필터 없음
  el.evidenceSheetList.innerHTML = '';
  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'evidence-card';
    btn.innerHTML = `<div class="ec-code">${item.code}</div><div class="ec-title">${item.title}</div>`;
    ...
  });
}
```

- **필터/분류 없음.** `CaseFileState.getEvidence()`가 반환하는 순서(발견한 순서) 그대로 나열.
- **카드 정보량이 코드 + 제목 두 줄뿐.** `evidence` 아이템에는 실제로 `category`, `description`, `discoveredLocationText`, `status`(new/reviewed) 필드가 이미 있는데(`dev/caseFileState.js:68-79`) 이 시트는 그중 코드/제목만 쓴다.
- **스크롤이 유일한 탐색 수단.** `max-height:44vh; overflow-y:auto`(`dev/game/index.html:103`) 안에 전부 욱여넣는다.
- **규모**: `dialogueData.js` + `interactionDefs.js` 기준 `addEvidence` 호출이 **50건**(주차가 늘수록 계속 증가). 한 캐릭터에게 제시 가능한 증거가 아니라 **확보한 증거 전체**가 한 시트에 다 뜨므로, 게임 후반으로 갈수록 스크롤이 길어지기만 한다.

### 참고 — 이미 더 나은 패턴이 두 군데 있다

같은 저장소 안에 이미 이 문제를 어느 정도 풀어둔 화면이 두 개 있어서, 이번 개편은 그 패턴을 가져오면 된다:

1. **`dev/caseMenu.js` CASE FILE 메뉴 증거 탭** (`renderEvidenceTabBody`, `dev/caseMenu.js:239-278`) — 종류별 필터 칩(전체/물증/사진·영상/진술/기록, 각 개수 표시) + 칩을 하나 고르면 그 종류만 평평하게, "전체"면 종류별 섹션 라벨로 묶어서 보여줌. 필터 선택 상태(`ctx.evidenceFilter`)는 탭을 벗어나도 유지됨.
2. **`dev/explore/index.html` 탐색허브의 "증거 제시" 시트** (`openEvidenceSheet`, `dev/explore/index.html:767-789`, 오늘 커밋 `7ee0f26`로 개선됨) — `EVIDENCE_CATEGORY_ORDER`/`evidenceCategoryLabel`을 재사용해 종류별 섹션 라벨로 묶음.

문제는 **정작 스크린샷이 찍힌 화면(`dev/game/index.html`의 `renderEvidenceSheet`)만 이 개선을 안 받았다**는 것 — 대화 중 증거를 제시하는, 실제로 제일 자주 쓰이는 그 화면이 옛날 버전 그대로 남아 있다. 그래서 이번 개편은 **1)** 이 시트를 캐치업시키는 것과 **2)** 세 군데 UI(케이스 파일 탭 / 탐색허브 시트 / 대화 중 시트)가 다시 벌어지지 않게 로직을 하나로 합치는 것, 두 갈래로 볼 수 있다.

---

## 2. 요청 사항 (원 요청 3가지 정리)

### (1) 필터 — 종류별

- 기존 카테고리 체계를 그대로 쓴다: `EVIDENCE_CATEGORY_ORDER = ['physical', 'photo', 'testimony', 'record', 'etc']` (`dev/caseMenu.js:658`), 라벨은 `evidenceCategoryLabel` — 물증 / 사진·영상 / 진술 / 기록 / 기타.
- 결정할 것: 케이스 파일 탭처럼 **필터 칩(전체 + 종류별, 개수 배지)** 을 쓸지, 탐색허브 시트처럼 **섹션 라벨로 묶기만** 할지, 아니면 둘 다(평소엔 섹션 구분, 필요하면 칩으로 좁히기) 할지.
- 대화 중 시트는 캐릭터별로 "제시 가능한 결과가 정해진" 증거를 고르는 맥락이라, 케이스 파일 탭만큼 증거 수가 많지 않을 수도 있음 — 다만 후반 주차 기준 전체 확보량(50개 전후)을 감안하면 필터 없이는 이미 스크린샷 수준으로 못 보게 됨.

### (2) 아이템화

- "아이템화"를 두 가지로 해석할 수 있어 구분이 필요:
  - **(a) 카드에 정보량을 더 실어서 각 증거가 낱개 아이템처럼 식별되게 한다** — 이미 데이터에 있는 `category`(아이콘/색 태그), `description`(한 줄 요약), `status`(new 배지) 등을 카드에 노출. 현재는 코드+제목만 있어서 코드(E-MV2 같은 내부 식별자)가 시각적으로 제일 크게 강조돼 있는데, 정작 플레이어에게 의미 있는 건 제목/설명 쪽.
  - **(b) 그리드형 "아이템 인벤토리" 느낌으로 레이아웃 자체를 바꾼다** — 세로 리스트 대신 카드형 그리드(썸네일/아이콘 + 짧은 라벨), 탭하면 상세(설명/발견 장소)가 뜨는 2단 구조. 이 경우 `dev/inventory`류 UI(있다면) 참고 가능한지 확인 필요 — 현재 저장소에 증거용 이미지/썸네일 에셋은 없어 보이므로(각 아이템에 `image` 필드 없음), 아이콘은 카테고리 단위 심볼(예: 물증=🧾, 사진=📷, 진술=💬, 기록=📄) 정도가 현실적인 시작점.
- 결정할 것: (a)만 할지 (b)까지 갈지, (b)면 카테고리 아이콘 세트를 새로 정의해야 함(현재 저장소에 선례 없음).

### (3) 그외

원 요청에 구체 항목이 없어서, 위 조사 중 같이 눈에 띈 것들을 후보로 얹는다 — 각각 채택 여부만 결정하면 됨:

- **new 배지 미반영**: `evidence.status === 'new'`는 케이스 파일 탭(`cm-new-dot`, `dev/caseMenu.js:272`)엔 표시되는데 이 시트엔 없음. 방금 얻은 증거를 강조하면 탐색 흐름과도 자연스럽게 이어짐.
- **현재 상대에게 의미 없는 증거까지 다 나열됨**: `presentEvidenceRules`(`dev/data/interactionDefs.js`)에 해당 캐릭터·해당 phase 룰이 없으면 `defaultPresentReaction`(정형화된 "그건 여기서 할 얘기가 아닌 것 같은데" 류 반응)으로 처리되는 것으로 보임 — 즉 안 맞는 증거를 눌러도 페널티는 없지만, 애초에 그 목록이 안 맞는 항목까지 다 섞여 있어 탐색 비용만 큼. 룰이 있는 항목을 상단/강조로 올릴지, 최소한 필터에 "이 사람에게 유효" 옵션을 둘지 검토 가치 있음.
- **세 화면(케이스 파일 탭 / 탐색허브 시트 / 대화 중 시트) 로직 통합**: 지금처럼 각자 `EVIDENCE_CATEGORY_ORDER` 기반 필터/그룹핑을 따로 구현하면 다음에 또 하나만 뒤처지는 문제가 재발함. 공용 렌더 함수(예: `renderEvidenceListHtml(items, {mode})`)로 뽑아 세 곳에서 공유하는 것을 제안.
- **정렬 기준**: 지금은 발견 순서(추가된 순서) 그대로. 카테고리 필터가 생기면 카테고리 내부 정렬도 필요 — 발견 순 유지 vs 코드순 vs "new 먼저".

---

## 3. 결정이 필요한 사항

- [ ] 필터 UI: 칩(케이스 파일 탭 방식) vs 섹션 라벨만(탐색허브 시트 방식) vs 둘 다
- [ ] 아이템화 범위: (a) 카드 정보량만 보강 vs (b) 그리드형 레이아웃까지
- [ ] (b) 채택 시 카테고리별 아이콘/심볼 세트 확정 (현재 선례 없음, 새로 정의 필요)
- [ ] new 배지 추가 여부
- [ ] "이 캐릭터에게 유효한 증거만 강조/필터" 기능 추가 여부
- [ ] 세 화면(케이스 파일 탭·탐색허브 시트·대화 중 시트) 렌더 로직을 공용 함수로 합칠지, 지금처럼 각자 구현 유지할지
- [ ] 정렬 기준 (발견순 유지 / 코드순 / new 우선)

---

## 4. 참고

- 스크린샷 대상 화면: `dev/game/index.html:893-920`(`renderEvidenceSheet`), CSS `dev/game/index.html:103-108`(`.evidence-sheet-list`/`.evidence-card`/`.ec-code`/`.ec-title`)
- 증거 데이터 모델: `dev/caseFileState.js:66-86`(`addEvidence`/`getEvidence`/`markEvidenceReviewed`) — 필드: `id`, `code`, `title`, `category`, `description`, `discoveredLocationText`, `status`, `relatedQuestionIds`, `tags`, `discoveredAt`
- 카테고리 체계: `dev/caseMenu.js:658-659`(`EVIDENCE_CATEGORY_ORDER`, `evidenceCategoryLabel`)
- 이미 개선된 두 참고 화면:
  - `dev/caseMenu.js:239-278`(`renderEvidenceTabBody`, `evidenceRow`) — 필터 칩 + 섹션 그룹핑
  - `dev/explore/index.html:767-789`(`openEvidenceSheet`) — 섹션 그룹핑 (커밋 `7ee0f26`)
- 증거 제시 결과 판정 룰: `dev/data/interactionDefs.js`(`presentEvidenceRules`/`defaultPresentReaction`)
