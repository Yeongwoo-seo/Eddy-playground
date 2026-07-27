# 2주차 탐색허브 재도입 — 진행 상황 정리

> 작성 시점: 구현 + 브라우저 검증 완료, 커밋 직전 스냅샷
> 브랜치: `claude/week2-exploration-hub-restructure-os5u3e`

## 1. 요청 배경

2주차 v4 전면 재설계(`docs/week2-storyline-outline-v4.md`, `dev/dialogueData.js`)는
22챕터(26개 등록 씬) 전부를 `nextSceneId`로 잇는 **완전 선형 구조**로 구현되어
있었다. 그런데 v4 아웃라인 문서 자신이 Ch4("전시장 자유 관람")을 "자유 탐색
허브에서 다섯 인물과 순차적으로" 만난다고 서술하는 등, 원래는 역전재판처럼
"조사(자유 탐색) ↔ 심문(선형 압박)"이 번갈아 나오는 구조를 의도하고 있었다.
실제 구현에서는 이 조사 구간까지 전부 하나의 긴 대사 배열로 눌려 있었다.

사용자 확인 결과 합의된 범위:
- **조사/탐색 구간만 허브화**, 심문 라운드 내부(윤민아/레오/다니엘 심문의
  단계별 압박 순서)는 **그대로 선형 유지**.
- 문서만이 아니라 **실제로 동작하는 허브 연결**을 구현.

## 2. 이미 존재하던 인프라 (재사용)

`dev/state/explorationState.js` + `play/explore/index.html` (위치-그래프형
허브 엔진, 지도/장소/인물 메뉴/대화 재생, 인라인 씬 재생 `playSceneInline`,
가상 라우팅 `MINIGAME_ROUTES`)와 `dev/data/locationDefs.js` /
`interactionDefs.js` (장소·상호작용 정의)는 v4 이전부터 이미 구현되어 있었다.
v4가 스토리를 완전 선형으로 갈아엎으면서 이 인프라의 2주차 관련 항목들이
**옛 씬 id를 참조한 채 고아(orphan)**가 되어 있었다(허브 자체는 삭제되지
않았지만 더 이상 어디서도 진입시키지 않았고, 진입해도 잘못된 씬을 재생하는
상태). 이번 작업은 이 인프라를 v4의 새 씬 번호에 맞게 다시 연결하고, 필요한
곳은 새로 확장한 것이다.

## 3. 최종 구조 — 허브 3곳 + 선형 구간

```
week2-scene-001 (아침, 열쇠) — 선형
  ↓
week2-scene-002 (서큘러키, 다니엘 첫 만남) — 선형
  ↓
week2-scene-003 (더 록스, 보관함) — 선형
  ↓ nextSceneId: 'week2-hub-entry-exhibit'
┌─────────────────────────────────────────────┐
│ 허브 A: W2_EXHIBIT_FREE_LOOK                 │
│ 장소: w2-exhibit-floor (전시장 내부)          │
│ 자유 순서 상호작용: 소피/윤민아/애드리언/     │
│   레오/K-01 자세히 보기 (5개 topic)           │
│ 진입 도입부(phaseIntro): 클레어 환영 인사      │
│ 나가기(enterSceneId): week2-scene-006         │
└─────────────────────────────────────────────┘
  ↓
week2-scene-006 (단체사진) → 007 (도난 발생) → 008 (사진 도입)
  → minigame-photo-zoom → 008-review (사진 분석 마무리) — 전부 선형
  ↓ nextSceneId: 'week2-hub-entry-suspects'
┌─────────────────────────────────────────────┐
│ 허브 B: W2_SUSPECT_INTERVIEWS (기존 인프라)   │
│ 장소: w2-hub-plaza(광장) + 3개 용의자 스팟     │
│ 자유 순서:                                    │
│  - 윤민아 스팟 → week2-scene-009 (심문, 선형) │
│  - 애드리언 스팟 → week2-scene-010 (짧은 응대)│
│  - 레오 스팟 → week2-scene-010b (물증 포착)   │
│    → minigame-timeline → week2-scene-011      │
│    (레오 자백, 선형) → 이후 허브로 안 돌아옴   │
│    (레오 확정 이후는 사건이 진행되므로 의도됨) │
│  윤민아/애드리언 완료 후엔 'week2-suspect-     │
│  interview-return'으로 허브 복귀               │
└─────────────────────────────────────────────┘
  ↓ (레오 라인을 타면) week2-scene-012 (K-01 회수, 반전3)
  → week2-scene-013 (사건 재명명) — 선형
  ↓ nextSceneId: 'week2-hub-entry-reverify'
┌─────────────────────────────────────────────┐
│ 허브 C: W2_REVERIFICATION (기존 인프라 확장)  │
│ 장소: w2-hub-plaza + 6개 재조사 스팟           │
│ 자유 순서:                                    │
│  - 마틴 통화 스팟 → week2-scene-014           │
│  - 애드리언 스팟(공용) → week2-scene-015      │
│  - 레오 스팟(공용) → week2-scene-016 (신규)   │
│  - 소피 스팟(신규 장소) → week2-scene-017     │
│  - 광장(다니엘) → week2-scene-018 (신규)      │
│  - 서큘러키(공용) → week2-scene-019 (신규)    │
│  전부 'week2-reverify-interview-return'으로    │
│  허브 복귀. 윤민아는 v4에 재조사 챕터가 없어   │
│  (역할이 이미 012에서 소화됨) 스팟 없음.       │
│  나가기(enterSceneId): week2-scene-020         │
└─────────────────────────────────────────────┘
  ↓
week2-scene-020 (일정표 재해석) → 021 (다니엘 최종 심문, 8단계 선형)
  → 022 (최종 재구성) → 023 (엔딩) — 전부 선형
```

## 4. 파일별 변경 내역

### `dev/dialogueData.js`
- 파일 헤더 주석을 "완전 선형 구조" 설명에서 "허브 3곳 재도입" 설명으로
  전면 교체.
- `week2-scene-003`: `nextSceneId`를 `'week2-scene-004'` → `'week2-hub-entry-exhibit'`.
- `week2-scene-004`/`005`: 더 이상 재생 경로에 없음을 명시하는 주석만 추가,
  내용은 원본 그대로 보존(v3 orphan 씬과 동일한 관례).
- `week2-scene-008-review`: `nextSceneId` → `'week2-hub-entry-suspects'`.
- `week2-scene-009`(윤민아 심문): `nextSceneId` → `'week2-suspect-interview-return'`.
- **`week2-scene-010` 분리**: 원래 애드리언(회피성 답변)+레오(물증 발견)가
  하나의 씬이었던 것을, 허브 자유 순서를 위해 둘로 나눔.
  - `week2-scene-010`(애드리언 단독, 원본 앞부분): `nextSceneId` →
    `'week2-suspect-interview-return'`.
  - `week2-scene-010b`(신규, 레오 물증 포착 — 원본 뒷부분 그대로 id만 재부여):
    `nextSceneId` → `'week2-scene-010-minigame'`(기존 그대로).
- `week2-scene-013`: `nextSceneId` → `'week2-hub-entry-reverify'`.
- `week2-scene-014`~`019`: `nextSceneId`를 각각 다음 챕터 번호에서
  `'week2-reverify-interview-return'`으로 변경(자유 순서 방문 후 허브 복귀).
  `020`은 그대로 `021`로 이어짐(허브 나간 뒤는 선형 유지).
- `week2SceneGroups`(PART 1)에 `'week2-scene-010b'` 추가.

### `dev/data/sceneRoutes.js`
`MINIGAME_ROUTES`에 허브 진입/복귀용 가상 id 5개 추가:
```js
'week2-hub-entry-exhibit': '/play/explore/?phase=W2_EXHIBIT_FREE_LOOK&location=w2-exhibit-floor',
'week2-hub-entry-suspects': '/play/explore/?phase=W2_SUSPECT_INTERVIEWS&location=w2-hub-plaza',
'week2-suspect-interview-return': '/play/explore/?phase=W2_SUSPECT_INTERVIEWS&location=w2-hub-plaza',
'week2-hub-entry-reverify': '/play/explore/?phase=W2_REVERIFICATION&location=w2-hub-plaza',
'week2-reverify-interview-return': '/play/explore/?phase=W2_REVERIFICATION&location=w2-hub-plaza',
```

### `dev/data/locationDefs.js`
- **신규 장소** `w2-exhibit-floor` (phase `W2_EXHIBIT_FREE_LOOK`) — 클레어/소피/
  윤민아/애드리언/레오 5인 상주, `enterSceneId: 'week2-scene-006'`.
- **신규 장소** `w2-reverify-sophie-spot` (phase `W2_REVERIFICATION`) — 카페,
  소피.
- `w2-suspect-leo-spot`: `phases`에 `'W2_REVERIFICATION'` 추가(레오 재심문 공용).
- `w2-circular-quay`: `phases`에 `'W2_REVERIFICATION'` 추가(관광객 재조사 공용),
  `mapPosition`을 byPhase로 전환.
- `w2-hub-plaza`: `enterSceneId.W2_REVERIFICATION`을 `'week2-scene-012'`(오류
  — v4에서 그 번호는 이제 "K-01 회수"라는 다른 비트)에서 `'week2-scene-020'`
  (일정표 재해석, v4의 실제 "사건 재구성" 대응 챕터)로 수정. `characters`에
  `W2_REVERIFICATION: ['daniel-guide']` 추가(신원 확인 상호작용 대상).
  `exits`에서 삭제된 `w2-reverify-mina-spot` 제거.
- **`w2-reverify-mina-spot` 삭제** — v4 Part 2엔 윤민아 재조사 챕터가 없음
  (아래 5절 참고).

### `dev/data/interactionDefs.js`
- **신규**: `W2_EXHIBIT_FREE_LOOK` phase 블록 — `w2-exhibit-phase-intro`
  (phaseIntro, 클레어 환영) + `w2ef-topic-sophie`/`w2ef-topic-minah`/
  `w2ef-topic-adrian`/`w2ef-topic-leo`/`w2ef-topic-k01` 5개 topic. 대사는
  `week2Scene004Lines`/`005Lines`에서 그대로 옮겨와 인물별로 재배치.
- 기존 `w1suspect-mina-interview`/`adrian-interview`/`leo-interview`의
  `sceneId`를 각각 옛 번호(`006`/`007`/`008`)에서 새 번호(`009`/`010`/`010b`)로
  수정.
- `w1reverify-adrian-interview.sceneId`: `'week2-scene-011a'`(존재하지 않음)
  → `'week2-scene-015'`.
- `w1reverify-martin-call`: `type:'minigame'+route`(완전 페이지 이동)에서
  다른 재검증 항목과 동일한 `type:'scene'+sceneId:'week2-scene-014'`
  (허브 인라인 재생 + 복귀)로 전환.
- **신규**: `w1reverify-leo-interview`(`week2-scene-016`, 레오 스팟 공용),
  `w1reverify-sophie-interview`(`week2-scene-017`, 신규 소피 스팟),
  `w1reverify-daniel-interview`(`week2-scene-018`, 광장),
  `w1reverify-tourists-interview`(`week2-scene-019`, 서큘러키 공용).
- **삭제**: `w1reverify-mina-interview`(대응 씬 없음).

## 5. 설계 판단 — 윤민아는 왜 재조사 허브에 없는가

v4 아웃라인상 윤민아의 2부 역할("나사 방향·결합선 차이를 가장 먼저 알아보는
시각 자료 전문가")은 실제로는 **1부 마지막 장면인 `week2-scene-012`(K-01
회수 — 반전 3)**에서 이미 등장해 소화된다. v4 Part 2(Ch13~22)의 실제 6개
투자 챕터(마틴/애드리언/레오/소피/다니엘/관광객)에는 윤민아가 없다 — 옛 Phase
5 인프라의 `w1reverify-mina-interview`가 가리키던 옛 `week2-scene-011`은
새 번호 체계에서 "레오, 무너지다"라는 전혀 다른 내용이라 그대로 두면
명백한 오류였다. 대응하는 v4 챕터 자체가 없으므로 새 번호를 붙이는 대신
항목/장소를 삭제하는 쪽을 택했다.

## 6. 브라우저 테스트 (Playwright, 진행 중)

로컬 정적 서버(`python3 -m http.server`) + Chromium(프록시 우회, 인증서
검증 무시 플래그)로 실제 클릭 시나리오를 검증했다. Supabase 자산 fetch는
샌드박스 네트워크 제약으로 전부 실패하지만(기존에도 알려진 제약) 게임
로직 자체는 정상 동작.

**확인 완료**:
- `week2-scene-003` 끝 → `W2_EXHIBIT_FREE_LOOK` 허브(`w2-exhibit-floor`)
  정상 진입, phaseIntro 자동 재생, 5인 캐릭터 chip 표시.
- 윤민아 topic(`w2ef-topic-minah`) 대화 정상 재생(Ch4+Ch5 병합 내용 확인),
  완료 후 허브로 정상 복귀.
- 허브 나가기 버튼("이제 단체사진 찍으러 가자") → `week2-scene-006` 정상
  진입, 이후 `007`→`008`→`minigame-photo-zoom`까지 기존 선형 체인 무사고
  확인(회귀 없음).
- `week2-scene-008-review` 끝 → `W2_SUSPECT_INTERVIEWS` 허브 정상 진입.
- 윤민아 스팟: `autoPlayOnFirstVisit`으로 `week2-scene-009` 자동 재생 →
  완료 후 허브(`w2-hub-plaza`)로 정상 복귀.
- 애드리언 스팟: `week2-scene-010`(애드리언 단독) 정상 재생 → 허브 복귀.
- 레오 스팟: `week2-scene-010b`(레오 물증 포착, 분리된 신규 씬) 정상 재생
  → `minigame-timeline`으로 정상 핸드오프.
- `week2-scene-013` 끝 → `W2_REVERIFICATION` 허브 정상 진입.

**추가로 확인 완료**:
- 재검증 허브의 6개 스팟 전부 개별 클릭 테스트 — 마틴 통화(`week2-scene-014`),
  애드리언 재심문(`015`), 레오 재심문(`016`), 소피(`017`), 다니엘 신원 확인
  (`018`, `w2-hub-plaza`에서 플로팅 심문 버튼으로 노출), 관광객 재조사(`019`,
  `w2-circular-quay`) 전부 정상 재생 후 허브로 복귀 확인.
- 허브 나가기("지금까지의 단서로 사건을 재구성한다") → `week2-scene-020`
  (일정표 재해석) → `week2-scene-021`(다니엘 최종 심문, 8단계) 정상 진입,
  회귀 없음 확인.
- 전 구간에서 `pageerror` 이벤트 0건.

**아직 확인 안 함**:
- 저장/불러오기(`__EXPLORE_HUB__` 센티널) 왕복이 새 phase 3개에서도
  정상 동작하는지.
- 화면 스크린샷 기반 레이아웃 확인(5인 동시 standing 시 겹침 여부 등
  `charPositions` 조정 필요성 — 배경/캐릭터 이미지 자체가 이 샌드박스에서
  Supabase 자산 로드가 막혀 있어(CORS/네트워크 제약) 실제 비주얼 검증은
  이 환경에서 불가능, 로직 검증만 수행함).
- 테스트 중 발견한 사실(버그 아님): 같은 브라우저 세션에서 `?phase=`가
  같고 `?location=`만 다른 URL로 직접 이동하면 허브의 `phaseChanged` 부팅
  가드가 위치 이동을 건너뛴다 — 실제 플레이에서는 "이동하기" UI로만
  움직이므로 문제 없음(URL 직접 조작으로만 재현되는 테스트 아티팩트).

## 7. 아직 안 한 일 / 알려진 제약

- `presentEvidenceRules`(증거 제시 판정, §8/§14.8 flavor)는 이미 v4 이전부터
  실제 `addEvidence`와 연결되지 않은 테스트용 채움 데이터였다(v4는
  `addEvidence`/`addFact` 같은 실제 이펙트를 전혀 쓰지 않고 전부 대사
  브래킷 텍스트로만 표기). 이번 작업 범위 밖으로 판단해 손대지 않음 —
  윤민아 스팟 삭제로 인해 `W2_REVERIFICATION`+`minah` 규칙 2건이 도달 불가
  상태가 됐지만, 원래도 비연결 상태였던 flavor라 별도로 정리하지 않았다.
- v4 스크립트 자체(증거/가설/조건 실제 연동)는 여전히 순수 대사 브래킷
  텍스트뿐 — 이번 작업은 구조(허브 vs 선형)만 되돌렸고, 판정 로직을
  새로 붙이지는 않았다(범위 밖).
- 아직 **커밋/푸시하지 않음** — 워킹 트리에만 존재.

## 8. 변경 파일 요약

```
 dev/data/interactionDefs.js | +215 -줄일부
 dev/data/locationDefs.js    | +98  -줄일부
 dev/data/sceneRoutes.js     | +21  -줄일부
 dev/dialogueData.js         | +142 -줄일부
```
(정확한 diff는 `git diff` 참고)
