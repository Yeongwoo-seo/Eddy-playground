/* LGS Frame Y1 재무모델 — 슬라이더(일괄 적용) + 엑셀식 월별 셀 편집 + 구성요소 브레이크다운 */

const MONTH_PHASE = ['Closing', 'Closing', 'Build', 'Build', 'Pilot', 'Pilot', 'Scale', 'Scale', 'Scale', 'Expand', 'Expand', 'Expand'];
const PHASE_ORDER = ['Closing', 'Build', 'Pilot', 'Scale', 'Expand'];
const PHASE_RANGE = { Closing: 'M1-M2', Build: 'M3-M4', Pilot: 'M5-M6', Scale: 'M7-M9', Expand: 'M10-M12' };

const TABS = [
  { id: 'summary', icon: '📊', label: '요약' },
  { id: 'assumptions', icon: '⚙️', label: '가정' },
  { id: 'capex', icon: '🏗️', label: '설비투자' },
  { id: 'table', icon: '🧮', label: '월별표' }
];
let curTab = 0;

const SUB_TAB_GROUPS = {
  assumptions: {
    barId: 'subTabBar',
    cur: 0,
    tabs: [
      { id: 'revenue', label: '매출', amountId: 'revenueTabAmount' },
      { id: 'fixed', label: '고정비', amountId: 'fixedTabAmount' },
      { id: 'variable', label: '변동비', amountId: 'variableTabAmount' }
    ]
  },
  capex: {
    barId: 'subTabBarCapex',
    cur: 0,
    tabs: [
      { id: 'capex-funding', label: '자금조달' },
      { id: 'capex-equipment', label: '장비·공구' }
    ]
  },
  table: {
    barId: 'subTabBarTable',
    cur: 0,
    tabs: [
      { id: 'is', label: '손익계산서' },
      { id: 'var', label: '변동비' },
      { id: 'cf', label: '현금흐름표' },
      { id: 'bs', label: '대차대조표' }
    ]
  }
};

const DEFAULTS = {
  pricePerSqm: 200,
  houseTypes: [
    { label: '싱글', sqm: 120, targetQty: 1 },
    { label: '더블', sqm: 180, targetQty: 1 },
    { label: '그래니플랫', sqm: 55, targetQty: 8 },
    { label: '듀플렉스', sqm: 150, targetQty: 2 }
  ],
  coilPricePerLm: 2.6,
  screwPricePer1000: 50,
  productionLaborHourlyWage: 28.125,
  detailPct: 10,
  otherVarPct: 5,
  coilLmPerSqm: 16,
  screwsPerSqm: 12,
  laborProductivitySqmPerHour: 2.5,
  dailyOperatingHours: 8,
  workingDaysPerMonth: 20,
  rollformerCapacitySqmPerDay: 150,
  setupMinutesPerBatch: 25,
  scrapRatePct: 4,
  materialLeadTimeDays: 14,
  detailingDaysPerHouse: 3,
  deliveryDaysPerHouse: 2,
  fixedCostItems: [
    { category: 'fixedProd', label: '공장·창고 임대료', note: 'Western Sydney 산업단지 창고 (~450㎡, 순임대료 ~$160/㎡/yr 기준)', monthly: 6000 },
    { category: 'fixedProd', label: '공장 전기·수도', note: 'SP120 롤포밍기 가동 전력 + 용수/폐수', monthly: 1500 },
    { category: 'fixedProd', label: '소모품·공구 유지보수', note: '드릴비트·블레이드·윤활유 등 소모품 교체', monthly: 1000, calc: { qty: 1, unitPrice: 1000 } },
    { category: 'fixedProd', label: '산업폐기물 처리', note: '철스크랩·자재 폐기물 수거', monthly: 400 },
    { category: 'fixedProd', label: '포크리프트 렌탈', note: '중고 구매 대신 월 렌탈로 전환 — 렌탈업체 시세 조사 전 추정치, 확인되면 직접 입력하세요', monthly: 650 },
    { category: 'sga', label: '대표이사 급여', note: '경영·전략·영업 총괄. 시급 × 조건 탭의 1일 가동시간 × 월 가동일수로 계산', monthly: 10000, calc: { qty: 1, hourlyWage: 62.5, hourly: true } },
    { category: 'sga', label: '견적·영업 담당 급여', note: '고객 상담, 견적, 계약 관리', monthly: 7500, calc: { qty: 1, unitPrice: 7500 } },
    { category: 'sga', label: '관리·회계 담당 급여 (파트타임)', note: '경리, 총무, 발주 관리', monthly: 3500, calc: { qty: 1, unitPrice: 3500 } },
    { category: 'sga', label: '사업 보험료', note: '배상책임(Public Liability) + icare 산재보험 (제조업 평균 요율 ~1.8~4.8%)', monthly: 2900 },
    { category: 'sga', label: 'FrameCAD Steelwise 라이선스', note: '설계·디테일링·엔지니어링 소프트웨어 구독', monthly: 1500 },
    { category: 'sga', label: '회계·법무 자문료', note: '외부 회계사 기장, 세무신고, 계약 검토', monthly: 1800 },
    { category: 'sga', label: '마케팅·영업비', note: '웹사이트, 온라인 광고, 전시 참가', monthly: 2000 },
    { category: 'sga', label: '차량 유지비', note: '배송·현장방문용 유트(Ute) 리스+연료+보험', monthly: 1600 },
    { category: 'sga', label: '사무실 임대료·유틸리티', note: '공장 내 사무 공간 또는 소규모 별도 사무실', monthly: 1200 },
    { category: 'sga', label: '통신·IT', note: '인터넷, 휴대폰, 클라우드 SaaS 구독', monthly: 600 },
    { category: 'sga', label: '인증·컴플라이언스', note: '구조 엔지니어 서명, WHS 컴플라이언스, CDC 인증 관련', monthly: 1800 },
    { category: 'sga', label: '기타 관리비', note: '사무용품, 소모품, 예비비', monthly: 1000 },
    { category: 'other', type: 'depreciation', label: '설비 감가상각비', note: 'SP120 1대, Stage1~3 분할지급 총 $40,000 (2020년형 중고, 2026년 취득) — 기준내용연수 7년, 경과연수 6년으로 중고자산 내용연수 특례(기준내용연수 50% 하한, 1년 미만 절사) 적용, 수정내용연수 3년 정액법', monthly: 1111 },
    { category: 'other', type: 'depreciation', label: '장비·공구 감가상각비', note: '소모성 공구·장비 (포크리프트 제외, 렌탈 전환), 내용연수 5년', monthly: 19 }
  ],
  equityAmount: 270000,
  debtAmount: 80000,
  debtAnnualRatePct: 8,
  debtTermMonths: 60,
  stage1Amount: 20000,
  stage1Month: 1,
  stage2Amount: 10000,
  stage2Month: 5,
  stage3Amount: 10000,
  stage3Month: 9,
  // 7200 = 공장·창고($6000) + 사무실($1200) 임대료 합산 기준액; 고정비 항목과 별개로 편집 가능
  rentDepositMonthlyRent: 7200,
  rentDepositMonths: 2,
  rentDepositMonth: 1,
  houses: [0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 2, 1],
  equipmentMonth: 1,
  equipmentItems: [
    { label: '임팩 드라이버', note: 'Bunnings', unitPrice: 99, qty: 1 },
    { label: '임팩 렌치', note: 'Bunnings', unitPrice: 299, qty: 1 },
    { label: '스크류 (경량철골용, 1000팩)', note: 'Bunnings', unitPrice: 84.5, qty: 1 },
    { label: '그라인더 (125mm)', note: 'Bunnings', unitPrice: 104, qty: 1 },
    { label: '커팅 소 (금속절단)', note: 'Bunnings', unitPrice: 169, qty: 1 },
    { label: '스트랩 (밴딩 툴)', note: 'Total Tools', unitPrice: 238, qty: 1 },
    { label: '망치', note: 'Bunnings', unitPrice: 10.48, qty: 1 },
    { label: '빠루 (크로바)', note: 'Bunnings', unitPrice: 14.98, qty: 1 },
    { label: '가위 (항공가위/틴스니퍼)', note: 'Bunnings', unitPrice: 18.98, qty: 1 },
    { label: '가구용 드릴', note: 'Bunnings', unitPrice: 89.98, qty: 1 },
    { label: '가구용 스크류 (칩보드)', note: 'Bunnings · 단가 확인 필요', unitPrice: 0, qty: 1 }
  ]
};

function computeHouseTypeTotals(houseTypes, pricePerSqm) {
  let totalQty = 0, totalRevenue = 0, totalSqm = 0;
  const rows = houseTypes.map(t => {
    const unitPrice = t.sqm * pricePerSqm;
    const subtotal = unitPrice * t.targetQty;
    totalQty += t.targetQty;
    totalRevenue += subtotal;
    totalSqm += t.sqm * t.targetQty;
    return { label: t.label, sqm: t.sqm, targetQty: t.targetQty, unitPrice, subtotal };
  });
  const blendedPrice = totalQty > 0 ? totalRevenue / totalQty : 0;
  const avgSqm = totalQty > 0 ? totalSqm / totalQty : 0;
  return { rows, totalQty, totalRevenue, totalSqm, blendedPrice, avgSqm };
}

/* scrap adds to how much raw material has to be bought, not to the sqm actually
   built — e.g. a 4% scrap rate means 4% more coil/screws purchased than the sqm
   output alone would suggest. shared by coil usage, condition metrics, and the
   variable cost engine so all three stay consistent with one "조건" input. */
function scrapMultiplier(scrapRatePct) {
  return 1 + (scrapRatePct || 0) / 100;
}

/* coil usage: physical coil consumed per sqm of frame produced (linear metres, "L")
   default sourced from FRAMECAD's published steel-weight estimate for single-storey
   residential (~18kg/sqm) divided by a blended profile weight (~1.1kg/lm across the
   stud/track/nogging mix a FrameCAD roll-former typically runs) — see table-hint below.
   this is the production-volume metric the future per-L incentive scheme will pay against. */
function computeCoilUsage(houseTypeTotals, coilLmPerSqm, scrapRatePct) {
  const totalCoilLm = houseTypeTotals.totalSqm * coilLmPerSqm * scrapMultiplier(scrapRatePct);
  const avgLmPerHouse = houseTypeTotals.totalQty > 0 ? totalCoilLm / houseTypeTotals.totalQty : 0;
  return { totalSqm: houseTypeTotals.totalSqm, totalCoilLm, avgLmPerHouse };
}

/* 조건(Conditions) tab metrics: physical/operational assumptions needed for
   later cost & capacity calcs (screw usage, labor hours, production capacity,
   scrap & lead times). Material usage is screws only for now — other fasteners
   (brackets/bolts/sealant) can be added back once their per-unit rates are confirmed.
   scrap rate inflates purchased quantities (see scrapMultiplier) so this total
   matches what recomputeVariableCosts actually charges for. */
function computeConditionMetrics(houseTypeTotals, s) {
  const totalSqm = houseTypeTotals.totalSqm;
  const totalQty = houseTypeTotals.totalQty;
  const totalScrews = totalSqm * s.screwsPerSqm * scrapMultiplier(s.scrapRatePct);
  const totalLaborHours = s.laborProductivitySqmPerHour > 0 ? totalSqm / s.laborProductivitySqmPerHour : 0;
  const requiredProductionDays = s.rollformerCapacitySqmPerDay > 0 ? totalSqm / s.rollformerCapacitySqmPerDay : 0;
  const availableProductionDaysYear = s.workingDaysPerMonth * 12;
  const capacityUtilizationPct = availableProductionDaysYear > 0 ? (requiredProductionDays / availableProductionDaysYear * 100) : 0;
  const totalDetailingDays = totalQty * s.detailingDaysPerHouse;
  const totalDeliveryDays = totalQty * s.deliveryDaysPerHouse;
  return {
    totalScrews,
    totalLaborHours, requiredProductionDays, availableProductionDaysYear, capacityUtilizationPct,
    totalDetailingDays, totalDeliveryDays
  };
}

function computeFixedCostTotals(items) {
  const totals = { fixedProd: 0, sga: 0, other: 0, depreciation: 0, interest: 0 };
  items.forEach(it => {
    totals[it.category] += it.monthly;
    if (it.category === 'other') {
      if (it.type === 'interest') totals.interest += it.monthly;
      else totals.depreciation += it.monthly;
    }
  });
  totals.grandTotal = totals.fixedProd + totals.sga + totals.other;
  return totals;
}

function buildDefaultMonths() {
  const htTotals = computeHouseTypeTotals(DEFAULTS.houseTypes, DEFAULTS.pricePerSqm);
  const blendedPrice = Math.round(htTotals.blendedPrice);
  const avgSqm = htTotals.avgSqm;
  const scrapMult = scrapMultiplier(DEFAULTS.scrapRatePct);
  const fc = computeFixedCostTotals(DEFAULTS.fixedCostItems);
  return DEFAULTS.houses.map(houses => {
    const revenue = houses * blendedPrice;
    const sqm = houses * avgSqm;
    const laborHours = DEFAULTS.laborProductivitySqmPerHour > 0 ? sqm / DEFAULTS.laborProductivitySqmPerHour : 0;
    return {
      houses,
      salePrice: blendedPrice,
      coil: sqm * DEFAULTS.coilLmPerSqm * scrapMult * DEFAULTS.coilPricePerLm,
      screw: sqm * DEFAULTS.screwsPerSqm * scrapMult / 1000 * DEFAULTS.screwPricePer1000,
      labor: laborHours * DEFAULTS.productionLaborHourlyWage,
      detail: revenue * DEFAULTS.detailPct / 100,
      otherVar: revenue * DEFAULTS.otherVarPct / 100,
      fixedProd: fc.fixedProd,
      sga: fc.sga,
      depreciation: fc.depreciation,
      interest: fc.interest
    };
  });
}

function buildDefaultEquipment() {
  return DEFAULTS.equipmentItems.map(item => ({ ...item }));
}

function buildDefaultFixedCostItems() {
  return DEFAULTS.fixedCostItems.map(item => {
    const copy = { ...item };
    if (item.calc) copy.calc = { ...item.calc };
    return copy;
  });
}

function buildDefaultState() {
  return {
    pricePerSqm: DEFAULTS.pricePerSqm,
    houseTypes: DEFAULTS.houseTypes.map(t => ({ ...t })),
    coilPricePerLm: DEFAULTS.coilPricePerLm,
    screwPricePer1000: DEFAULTS.screwPricePer1000,
    productionLaborHourlyWage: DEFAULTS.productionLaborHourlyWage,
    detailPct: DEFAULTS.detailPct,
    otherVarPct: DEFAULTS.otherVarPct,
    coilLmPerSqm: DEFAULTS.coilLmPerSqm,
    screwsPerSqm: DEFAULTS.screwsPerSqm,
    laborProductivitySqmPerHour: DEFAULTS.laborProductivitySqmPerHour,
    dailyOperatingHours: DEFAULTS.dailyOperatingHours,
    workingDaysPerMonth: DEFAULTS.workingDaysPerMonth,
    rollformerCapacitySqmPerDay: DEFAULTS.rollformerCapacitySqmPerDay,
    setupMinutesPerBatch: DEFAULTS.setupMinutesPerBatch,
    scrapRatePct: DEFAULTS.scrapRatePct,
    materialLeadTimeDays: DEFAULTS.materialLeadTimeDays,
    detailingDaysPerHouse: DEFAULTS.detailingDaysPerHouse,
    deliveryDaysPerHouse: DEFAULTS.deliveryDaysPerHouse,
    fixedCostItems: buildDefaultFixedCostItems(),
    equityAmount: DEFAULTS.equityAmount,
    debtAmount: DEFAULTS.debtAmount,
    debtAnnualRatePct: DEFAULTS.debtAnnualRatePct,
    debtTermMonths: DEFAULTS.debtTermMonths,
    stage1Amount: DEFAULTS.stage1Amount,
    stage1Month: DEFAULTS.stage1Month,
    stage2Amount: DEFAULTS.stage2Amount,
    stage2Month: DEFAULTS.stage2Month,
    stage3Amount: DEFAULTS.stage3Amount,
    stage3Month: DEFAULTS.stage3Month,
    rentDepositMonthlyRent: DEFAULTS.rentDepositMonthlyRent,
    rentDepositMonths: DEFAULTS.rentDepositMonths,
    rentDepositMonth: DEFAULTS.rentDepositMonth,
    equipmentMonth: DEFAULTS.equipmentMonth,
    equipmentItems: buildDefaultEquipment(),
    months: buildDefaultMonths()
  };
}

const STORE_KEY = 'lgsModelStateV1';

/* one-time upgrade for states saved before 생산직/대표이사 급여 switched to
   시급 × 조건 탭의 시간·일수 — converts their old 수량 × 단가 calc to an
   equivalent 시급 so previously-saved monthly totals don't jump */
const HOURLY_WAGE_LABELS = ['생산직 기본급', '대표이사 급여'];
function migrateFixedCostItems(st) {
  st.fixedCostItems.forEach(item => {
    if (!item.calc || item.calc.hourly) return;
    if (!HOURLY_WAGE_LABELS.some(l => item.label.includes(l))) return;
    const hours = st.dailyOperatingHours || DEFAULTS.dailyOperatingHours;
    const days = st.workingDaysPerMonth || DEFAULTS.workingDaysPerMonth;
    const denom = hours * days;
    item.calc.hourlyWage = denom > 0 ? Math.round((item.calc.unitPrice / denom) * 100) / 100 : 0;
    item.calc.hourly = true;
    delete item.calc.unitPrice;
  });
  // 구 "설비 리스·대출 이자" 수동입력 항목(고정 $560/월) 제거 — 이제 대출이자는
  // 대출원금·이자율·상환기간(원리금균등상환 스케줄)에서 매월 자동 계산되므로,
  // 예전에 저장된 값이 남아있으면 이중 계산된다.
  st.fixedCostItems = st.fixedCostItems.filter(item => !(item.category === 'other' && item.type === 'interest'));

  // 생산직 기본급은 고정비(풀타임 가정)에서 변동비(그 달 판매량에 필요한 생산
  // 인시 × 시급)로 이전됐다 — 예전 저장분에 남아있는 고정비 항목은 제거하고,
  // 그 시급만 새 변동비 인건비 시급(productionLaborHourlyWage)으로 이어받는다.
  const legacyProdLabor = st.fixedCostItems.find(item => item.label && item.label.includes('생산직 기본급'));
  if (legacyProdLabor) {
    if (legacyProdLabor.calc && legacyProdLabor.calc.hourlyWage != null) {
      st.productionLaborHourlyWage = legacyProdLabor.calc.hourlyWage;
    }
    st.fixedCostItems = st.fixedCostItems.filter(item => item !== legacyProdLabor);
  }
  return st;
}

/* pre-split saves only have `equityRaise` (no equity/debt split) — treat the
   whole amount as equity with no debt rather than silently adopting the new
   defaults' debt split, so existing users' numbers aren't changed under them */
function migrateState(raw) {
  const merged = migrateFixedCostItems(Object.assign(buildDefaultState(), raw));
  if (raw && raw.equityRaise != null && raw.equityAmount == null) {
    merged.equityAmount = raw.equityRaise;
    if (raw.debtAmount == null) merged.debtAmount = 0;
  }
  return merged;
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return migrateState(JSON.parse(raw));
  } catch (e) {}
  return buildDefaultState();
}

let state = loadLocalState();

let isRowRefs = {};
let cfRowRefs = {};
let bsRowRefs = {};
let varRowRefs = {};
let equipRowRefs = [];
let houseTypeRowRefs = [];
let fixedCostRowRefs = [];

/* ---------- cloud sync (Supabase) ---------- */
// same shared Supabase project as planner.html/boarding-pass.html/deposit.js —
// anon key is meant to be public/client-side, safe to ship in this static page.
// requires a `lgs_model_data` table (id text primary key, data jsonb,
// updated_at timestamptz) with anon select/insert/update, same shape as
// planner.html's `schedule_data` table.
const SUPABASE_URL = 'https://dhtstqnksjoyyshnhksv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHN0cW5rc2pveXlzaG5oa3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjIyNzQsImV4cCI6MjA5ODUzODI3NH0.FMZdCXntYJKxQeYNwfrsy1liJcHIkD2inJ4NzbwLzd4';
const SUPABASE_TABLE = 'lgs_model_data';
const SUPABASE_ROW_ID = 'lgs-model';

function supabaseHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };
}

function pushToRemote() {
  fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?on_conflict=id`, {
    method: 'POST',
    headers: Object.assign(supabaseHeaders(), { 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({ id: SUPABASE_ROW_ID, data: state, updated_at: new Date().toISOString() })
  }).catch(() => {});
}

let saveTimer = null;
function scheduleSave() {
  state.lastModified = Date.now();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  clearTimeout(saveTimer);
  saveTimer = setTimeout(pushToRemote, 800);
}

// pulls the shared copy on load (and periodically) so every device sees the
// same numbers; only applies it if actually newer than what's local, so a
// pull raced against an in-flight save can't stomp on it (same guard as
// planner.html's syncFromRemote). Falls back to local-only if offline or
// the table isn't set up yet.
async function syncFromRemote() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?id=eq.${SUPABASE_ROW_ID}&select=data`, {
      headers: supabaseHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('sync failed: HTTP ' + res.status);
    const rows = await res.json();
    if (!rows || !rows.length || !rows[0].data) return;
    const remote = rows[0].data;
    if ((remote.lastModified || 0) <= (state.lastModified || 0)) return;
    state = migrateState(remote);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
    rebuildAllUIFromState();
  } catch (e) {}
}

function fmt(n) {
  const r = Math.round(n);
  return (r < 0 ? '-$' : '$') + Math.abs(r).toLocaleString('en-US');
}

function fmtK(n) {
  const r = Math.round(n / 1000);
  return (r < 0 ? '-$' : '$') + Math.abs(r) + 'k';
}

/* wrap a money input with a "$" prefix shown inside the box (variant matches the input's own class: money-n/money-t/money-e) */
function wrapMoneyInput(input, variant) {
  const wrap = document.createElement('span');
  wrap.className = 'money-field ' + variant;
  wrap.appendChild(input);
  return wrap;
}

function q(id) { return document.getElementById(id); }
function setText(id, text) { const el = q(id); if (el) el.textContent = text; }

/* 원리금균등상환(equal payment) 방식 부채 상환 스케줄. termMonths가 numMonths(보통 12,
   Y1 기준)보다 길면 Y1 안에서는 잔액이 남은 채로 계속 상환 중인 상태로 표시된다. */
function computeDebtSchedule(principal, annualRatePct, termMonths, numMonths) {
  const p = Math.max(0, principal || 0);
  const n = Math.max(1, Math.round(termMonths) || 1);
  const monthlyRate = Math.max(0, annualRatePct || 0) / 100 / 12;
  const payment = p <= 0 ? 0 : (monthlyRate === 0 ? p / n : p * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n)));

  const rows = [];
  let balance = p;
  for (let i = 0; i < numMonths; i++) {
    if (i >= n || balance <= 0) {
      rows.push({ interest: 0, principal: 0, payment: 0, balanceEnd: balance });
      continue;
    }
    const interest = balance * monthlyRate;
    let princ = payment - interest;
    if (princ > balance) princ = balance;
    balance = Math.max(0, balance - princ);
    rows.push({ interest, principal: princ, payment: interest + princ, balanceEnd: balance });
  }
  return rows;
}

function computeAll() {
  const months = [];
  const debtSchedule = computeDebtSchedule(state.debtAmount, state.debtAnnualRatePct, state.debtTermMonths, 12);
  let cash = state.equityAmount + state.debtAmount;
  let cumCapex = 0, cumDep = 0, cumAccruedInterest = 0, cumNetIncome = 0, cumRentDeposit = 0;
  const totalEquipmentCapex = state.equipmentItems.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  const rentDepositAmount = Number(state.rentDepositMonthlyRent) * Number(state.rentDepositMonths);

  state.months.forEach((m, i) => {
    const revenue = m.houses * m.salePrice;
    const varCost = m.coil + m.screw + m.labor + m.detail + m.otherVar;
    const cogs = varCost + m.fixedProd;
    const grossProfit = revenue - cogs;
    const ebitda = grossProfit - m.sga;
    const loan = debtSchedule[i];
    const interest = m.interest + loan.interest;
    const netIncome = ebitda - m.depreciation - interest;

    let capex = 0;
    if (i + 1 === Number(state.stage1Month)) capex += state.stage1Amount;
    if (i + 1 === Number(state.stage2Month)) capex += state.stage2Amount;
    if (i + 1 === Number(state.stage3Month)) capex += state.stage3Amount;
    if (i + 1 === Number(state.equipmentMonth)) capex += totalEquipmentCapex;

    // 임대료 디파짓: 손익(고정비·변동비)에는 반영되지 않는 보증금성 지출 — 지급월에
    // 현금이 일시 유출되고 동액만큼 대차대조표상 자산(임차보증금)으로 남는다고 가정.
    const rentDepositOutflow = (i + 1 === Number(state.rentDepositMonth)) ? rentDepositAmount : 0;

    // CF: 감가상각비는 비현금이라 EBITDA에 이미 반영 안 됨. 대출 원리금(원금+이자)은
    // 실제 현금 상환이라 재무활동 현금흐름에 반영. 그 외 수동입력 이자비용(m.interest)은
    // 이 모델에서 발생주의로 비용 인식만 하고 현금 지급 없이 미지급이자(BS 부채)로 누적된다고 가정.
    const cashBegin = cash;
    const operatingCF = ebitda;
    const investingCF = -capex - rentDepositOutflow;
    const financingCF = -(loan.principal + loan.interest);
    const netCF = operatingCF + investingCF + financingCF;
    cash += netCF;
    const cashEnd = cash;

    cumCapex += capex;
    cumDep += m.depreciation;
    cumAccruedInterest += m.interest;
    cumNetIncome += netIncome;
    cumRentDeposit += rentDepositOutflow;

    const ppe = cumCapex - cumDep;
    const accruedInterest = cumAccruedInterest;
    const loanBalance = loan.balanceEnd;
    const totalAssets = cashEnd + ppe + cumRentDeposit;
    const totalLiabilities = accruedInterest + loanBalance;
    const retainedEarnings = cumNetIncome;
    const equity = state.equityAmount + retainedEarnings;

    months.push({
      idx: i, phase: MONTH_PHASE[i], houses: m.houses, salePrice: m.salePrice,
      coil: m.coil, screw: m.screw, labor: m.labor, detail: m.detail, otherVar: m.otherVar,
      fixedProd: m.fixedProd, sga: m.sga, depreciation: m.depreciation, interest,
      loanInterest: loan.interest, loanPrincipal: loan.principal, loanPayment: loan.payment, loanBalance,
      revenue, varCost, cogs, grossProfit, ebitda, netIncome, capex,
      rentDepositOutflow, cumRentDeposit,
      cashBegin, operatingCF, investingCF, financingCF, netCF, cashEnd,
      ppe, accruedInterest, totalAssets, totalLiabilities, equityAmount: state.equityAmount,
      retainedEarnings, equity
    });
  });

  const totals = {
    totalRevenue: sum(months, 'revenue'),
    totalCOGS: sum(months, 'cogs'),
    totalCoil: sum(months, 'coil'),
    totalScrew: sum(months, 'screw'),
    totalLabor: sum(months, 'labor'),
    totalDetail: sum(months, 'detail'),
    totalOtherVar: sum(months, 'otherVar'),
    totalFixedProd: sum(months, 'fixedProd'),
    totalSGA: sum(months, 'sga'),
    totalDepreciation: sum(months, 'depreciation'),
    totalInterest: sum(months, 'interest'),
    totalLoanPrincipal: sum(months, 'loanPrincipal'),
    totalEBITDA: sum(months, 'ebitda'),
    totalNI: sum(months, 'netIncome'),
    totalCapex: sum(months, 'capex'),
    totalOperatingCF: sum(months, 'operatingCF'),
    totalInvestingCF: sum(months, 'investingCF'),
    totalFinancingCF: sum(months, 'financingCF'),
    totalNetCF: sum(months, 'netCF'),
    totalMachineCapex: state.stage1Amount + state.stage2Amount + state.stage3Amount,
    totalEquipmentCapex,
    totalRentDeposit: rentDepositAmount,
    totalHouses: sum(months, 'houses'),
    endCash: months[11].cashEnd,
    endPPE: months[11].ppe,
    endAccruedInterest: months[11].accruedInterest,
    endLoanBalance: months[11].loanBalance,
    endRentDeposit: months[11].cumRentDeposit,
    endTotalAssets: months[11].totalAssets,
    endTotalLiabilities: months[11].totalLiabilities,
    endRetainedEarnings: months[11].retainedEarnings,
    endEquity: months[11].equity,
    minCash: Math.min(state.equityAmount + state.debtAmount, ...months.map(m => m.cashEnd))
  };
  totals.totalGP = totals.totalRevenue - totals.totalCOGS;

  return { months, totals };
}

function sum(months, key) { return months.reduce((s, m) => s + m[key], 0); }

function setSliderFill(el) {
  const min = Number(el.min), max = Number(el.max), val = Number(el.value);
  const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  el.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--grey-200) ${pct}%, var(--grey-200) 100%)`;
}

/* ---------- charts ---------- */

const SVGNS = 'http://www.w3.org/2000/svg';
function el(tag, attrs) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function buildMainChart(months) {
  const svg = q('mainChart');
  svg.innerHTML = '';
  const W = 460, H = 210, padL = 46, padR = 8, padT = 10, padB = 24;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const revs = months.map(m => m.revenue);
  const cogsArr = months.map(m => m.cogs);
  const netIncomeArr = months.map(m => m.netIncome);
  let maxVal = Math.max(...revs, ...cogsArr, 0, 1000);
  let minVal = Math.min(...netIncomeArr, 0);
  const range = (maxVal - minVal) || 1;
  const y = v => padT + (maxVal - v) / range * plotH;
  const zeroY = y(0);
  const slotW = plotW / 12;
  const barW = Math.max(slotW * 0.3, 4);

  svg.appendChild(el('line', { x1: padL, y1: zeroY, x2: W - padR, y2: zeroY, stroke: 'var(--grey-300)', 'stroke-width': 1 }));

  months.forEach((m, i) => {
    const xCenter = padL + slotW * i + slotW / 2;
    const xRev = xCenter - barW - 1.5;
    const xCogs = xCenter + 1.5;
    const revY = Math.min(y(m.revenue), zeroY);
    const cogsY = Math.min(y(m.cogs), zeroY);
    svg.appendChild(el('rect', { x: xRev, y: revY, width: barW, height: Math.max(Math.abs(y(m.revenue) - zeroY), 0.5), rx: 2, fill: 'var(--primary)' }));
    svg.appendChild(el('rect', { x: xCogs, y: cogsY, width: barW, height: Math.max(Math.abs(y(m.cogs) - zeroY), 0.5), rx: 2, fill: 'var(--grey-300)' }));
  });

  const pts = months.map((m, i) => `${padL + slotW * i + slotW / 2},${y(m.netIncome)}`).join(' ');
  svg.appendChild(el('polyline', { points: pts, fill: 'none', stroke: 'var(--info-blue)', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  months.forEach((m, i) => {
    const xCenter = padL + slotW * i + slotW / 2;
    svg.appendChild(el('circle', { cx: xCenter, cy: y(m.netIncome), r: 2.6, fill: 'var(--info-blue)' }));
  });

  months.forEach((m, i) => {
    const xCenter = padL + slotW * i + slotW / 2;
    const t = el('text', { x: xCenter, y: H - 6, 'text-anchor': 'middle', 'font-size': 8.5, fill: 'var(--grey-500)', 'font-weight': 600 });
    t.textContent = 'M' + (i + 1);
    svg.appendChild(t);
  });

  const tMax = el('text', { x: padL - 6, y: y(maxVal) + 8, 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
  tMax.textContent = fmtK(maxVal);
  svg.appendChild(tMax);
  const tZero = el('text', { x: padL - 6, y: zeroY + 3, 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
  tZero.textContent = '0';
  svg.appendChild(tZero);
  if (minVal < 0) {
    const tMin = el('text', { x: padL - 6, y: y(minVal), 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
    tMin.textContent = fmtK(minVal);
    svg.appendChild(tMin);
  }
}

function buildCashChart(months) {
  const svg = q('cashChart');
  svg.innerHTML = '';
  const W = 460, H = 160, padL = 52, padR = 8, padT = 10, padB = 24;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const series = [state.equityAmount + state.debtAmount, ...months.map(m => m.cashEnd)];
  let maxVal = Math.max(...series, 1000);
  let minVal = Math.min(...series, 0);
  const range = (maxVal - minVal) || 1;
  const y = v => padT + (maxVal - v) / range * plotH;
  const zeroY = y(0);
  const slotW = plotW / (series.length - 1);

  if (minVal < 0) {
    svg.appendChild(el('line', { x1: padL, y1: zeroY, x2: W - padR, y2: zeroY, stroke: 'var(--grey-300)', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
  }

  const pts = series.map((v, i) => `${padL + slotW * i},${y(v)}`).join(' ');
  const areaPts = `${padL},${zeroY} ${pts} ${padL + slotW * (series.length - 1)},${zeroY}`;
  svg.appendChild(el('polygon', { points: areaPts, fill: 'var(--primary-light)', opacity: 0.7 }));
  svg.appendChild(el('polyline', { points: pts, fill: 'none', stroke: 'var(--primary)', 'stroke-width': 2.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));

  series.forEach((v, i) => {
    if (i === 0 || i % 2 === 1) {
      const label = i === 0 ? '초기' : 'M' + i;
      const t = el('text', { x: padL + slotW * i, y: H - 6, 'text-anchor': 'middle', 'font-size': 8.5, fill: 'var(--grey-500)', 'font-weight': 600 });
      t.textContent = label;
      svg.appendChild(t);
    }
  });

  [maxVal, minVal < 0 ? minVal : null].forEach(v => {
    if (v === null) return;
    const t = el('text', { x: padL - 6, y: y(v) + (v === maxVal ? 8 : -2), 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
    t.textContent = fmtK(v);
    svg.appendChild(t);
  });
}

/* ---------- equipment/tools table (editable) ---------- */

function buildEquipSkeleton() {
  const tbody = q('equipBody');
  tbody.innerHTML = '';
  equipRowRefs = [];

  state.equipmentItems.forEach((item, i) => {
    const tr = document.createElement('tr');

    const labelTd = document.createElement('td');
    labelTd.className = 'equip-label-cell';
    const labelBtn = document.createElement('button');
    labelBtn.type = 'button';
    labelBtn.className = 'equip-label-btn';
    labelBtn.innerHTML = `<span class="equip-label">${item.label}</span>`;
    labelBtn.addEventListener('click', () => openItemModal('equip', i));
    labelTd.appendChild(labelBtn);
    tr.appendChild(labelTd);

    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.className = 'equip-input';
    priceInput.min = '0';
    priceInput.step = '0.01';
    priceInput.value = item.unitPrice;
    priceInput.dataset.i = i;
    priceInput.dataset.key = 'unitPrice';
    priceInput.addEventListener('input', onEquipInput);
    const priceTd = document.createElement('td');
    priceTd.appendChild(wrapMoneyInput(priceInput, 'money-e'));
    tr.appendChild(priceTd);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'equip-input';
    qtyInput.min = '0';
    qtyInput.step = '1';
    qtyInput.value = item.qty;
    qtyInput.dataset.i = i;
    qtyInput.dataset.key = 'qty';
    qtyInput.addEventListener('input', onEquipInput);
    const qtyTd = document.createElement('td');
    qtyTd.appendChild(qtyInput);
    tr.appendChild(qtyTd);

    const subtotalTd = document.createElement('td');
    subtotalTd.className = 'equip-subtotal';
    tr.appendChild(subtotalTd);

    const removeTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ht-remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.dataset.i = i;
    removeBtn.addEventListener('click', onEquipRemove);
    removeTd.appendChild(removeBtn);
    tr.appendChild(removeTd);

    tbody.appendChild(tr);
    equipRowRefs.push({ priceInput, qtyInput, subtotalTd });
  });
}

function onEquipInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  const key = inp.dataset.key;
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.equipmentItems[i][key] = val;
  renderComputed();
  scheduleSave();
}

function onEquipRemove(e) {
  const i = Number(e.currentTarget.dataset.i);
  state.equipmentItems.splice(i, 1);
  buildEquipSkeleton();
  renderComputed();
  scheduleSave();
}

function renderEquipTable() {
  let total = 0;
  equipRowRefs.forEach((row, i) => {
    const item = state.equipmentItems[i];
    const subtotal = item.unitPrice * item.qty;
    total += subtotal;
    row.subtotalTd.textContent = fmt(subtotal);
  });
  q('equipTotal').textContent = fmt(total);
}

/* ---------- debt (부채) repayment schedule — read-only, derives from 대출원금/연이자율/상환기간 ---------- */

function renderDebtScheduleTable() {
  const tbody = q('debtScheduleBody');
  if (!tbody) return;
  const schedule = computeDebtSchedule(state.debtAmount, state.debtAnnualRatePct, state.debtTermMonths, 12);
  tbody.innerHTML = schedule.map((row, i) => `
    <tr>
      <td class="equip-label-cell"><span class="equip-label">M${i + 1}</span></td>
      <td class="equip-subtotal">${fmt(row.principal)}</td>
      <td class="equip-subtotal">${fmt(row.interest)}</td>
      <td class="equip-subtotal">${fmt(row.payment)}</td>
      <td class="equip-subtotal">${fmt(row.balanceEnd)}</td>
    </tr>
  `).join('');

  const noteEl = q('debtScheduleNote');
  if (!noteEl) return;
  const term = Math.max(1, Math.round(state.debtTermMonths) || 1);
  if (state.debtAmount <= 0) {
    noteEl.textContent = '대출원금이 없으면 상환 스케줄도 발생하지 않아요.';
  } else if (term > 12) {
    noteEl.textContent = `원리금균등상환 기준, 상환기간 ${term}개월 중 1년차만 표시돼요. Y1 말 대출잔액 ${fmt(schedule[11].balanceEnd)}은 2년차부터 계속 상환돼요.`;
  } else {
    noteEl.textContent = `원리금균등상환 기준 상환 스케줄이에요. 상환기간 ${term}개월로 Y1 안에 상환이 완료돼요.`;
  }
}

/* ---------- fixed cost items (editable, grouped by category) ---------- */

const FIXED_COST_CATEGORIES = [
  { id: 'fixedProd', bodyId: 'fixedProdBody', subtotalId: 'fixedProdSubtotal' },
  { id: 'sga', bodyId: 'sgaBody', subtotalId: 'sgaSubtotal' },
  { id: 'other', bodyId: 'otherCostBody', subtotalId: 'otherCostSubtotal' }
];

function buildFixedCostSkeleton() {
  fixedCostRowRefs = [];
  FIXED_COST_CATEGORIES.forEach(cat => {
    const tbody = q(cat.bodyId);
    tbody.innerHTML = '';
    state.fixedCostItems.forEach((item, i) => {
      if (item.category !== cat.id) return;
      const tr = document.createElement('tr');

      const labelTd = document.createElement('td');
      labelTd.className = 'equip-label-cell';
      const labelBtn = document.createElement('button');
      labelBtn.type = 'button';
      labelBtn.className = 'equip-label-btn';
      labelBtn.innerHTML = `<span class="equip-label">${item.label}</span>`;
      labelBtn.addEventListener('click', () => openItemModal('fixed', i));
      labelTd.appendChild(labelBtn);
      tr.appendChild(labelTd);

      const monthlyTd = document.createElement('td');
      if (item.calc) {
        const monthlySpan = document.createElement('span');
        monthlySpan.className = 'equip-subtotal';
        monthlySpan.textContent = fmt(item.monthly);
        monthlyTd.appendChild(monthlySpan);
        tr.appendChild(monthlyTd);
        fixedCostRowRefs.push({ i, span: monthlySpan });
      } else {
        const monthlyInput = document.createElement('input');
        monthlyInput.type = 'number';
        monthlyInput.className = 'equip-input';
        monthlyInput.min = '0';
        monthlyInput.step = '1';
        monthlyInput.value = item.monthly;
        monthlyInput.dataset.i = i;
        monthlyInput.addEventListener('input', onFixedCostInput);
        monthlyTd.appendChild(wrapMoneyInput(monthlyInput, 'money-e'));
        tr.appendChild(monthlyTd);
        fixedCostRowRefs.push({ i, input: monthlyInput });
      }

      const removeTd = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'ht-remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.dataset.i = i;
      removeBtn.addEventListener('click', onFixedCostRemove);
      removeTd.appendChild(removeBtn);
      tr.appendChild(removeTd);

      tbody.appendChild(tr);
    });

    if (cat.id === 'other') {
      const tr = document.createElement('tr');
      const labelTd = document.createElement('td');
      labelTd.className = 'equip-label-cell';
      labelTd.innerHTML = '<span class="equip-label">대출이자 (월평균)</span>';
      tr.appendChild(labelTd);

      const monthlyTd = document.createElement('td');
      const span = document.createElement('span');
      span.className = 'equip-subtotal';
      span.id = 'loanInterestRowValue';
      monthlyTd.appendChild(span);
      tr.appendChild(monthlyTd);

      tr.appendChild(document.createElement('td'));
      tbody.appendChild(tr);
    }
  });
}

function onFixedCostInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.fixedCostItems[i].monthly = val;
  applyFixedCostTotals();
  syncInputsFromState();
  renderFixedCostTable();
  renderComputed();
  scheduleSave();
}

function onFixedCostRemove(e) {
  const i = Number(e.currentTarget.dataset.i);
  state.fixedCostItems.splice(i, 1);
  buildFixedCostSkeleton();
  applyFixedCostTotals();
  syncInputsFromState();
  renderFixedCostTable();
  renderComputed();
  scheduleSave();
}

function applyFixedCostTotals() {
  const totals = computeFixedCostTotals(state.fixedCostItems);
  applyFixedAll('fixedProd', totals.fixedProd);
  applyFixedAll('sga', totals.sga);
  applyFixedAll('depreciation', totals.depreciation);
  applyFixedAll('interest', totals.interest);
}

/* items with a `calc` block derive their monthly amount instead of a manually-typed
   flat number. Two modes:
   - 수량 × 단가 (e.g. 견적·영업 담당 급여 = 인원수 × 1인당 급여)
   - 수량 × 시급 × 1일 가동시간 × 월 가동일수 (calc.hourly, e.g. 생산직·대표이사 급여) —
     the hours/days come from the 조건 탭 so those sliders drive these salaries directly */
function recomputeFixedCostCalcItem(i) {
  const item = state.fixedCostItems[i];
  if (!item.calc) return;
  let qty = parseFloat(item.calc.qty);
  if (isNaN(qty) || qty < 0) qty = 0;
  item.calc.qty = qty;
  if (item.calc.hourly) {
    let hourlyWage = parseFloat(item.calc.hourlyWage);
    if (isNaN(hourlyWage) || hourlyWage < 0) hourlyWage = 0;
    item.calc.hourlyWage = hourlyWage;
    item.monthly = qty * hourlyWage * state.dailyOperatingHours * state.workingDaysPerMonth;
  } else {
    let unitPrice = parseFloat(item.calc.unitPrice);
    if (isNaN(unitPrice) || unitPrice < 0) unitPrice = 0;
    item.calc.unitPrice = unitPrice;
    item.monthly = qty * unitPrice;
  }
}

/* re-derives every hourly-wage-based fixed cost item's monthly amount —
   called whenever 조건 탭's 1일 가동시간/월 가동일수 sliders change, since those
   items don't otherwise get touched by that slider's own input handler */
function recomputeHourlyFixedCostItems() {
  let changed = false;
  state.fixedCostItems.forEach((item, i) => {
    if (!item.calc || !item.calc.hourly) return;
    recomputeFixedCostCalcItem(i);
    updateFixedCostRowDisplay(i);
    changed = true;
  });
  if (changed) {
    applyFixedCostTotals();
    renderFixedCostTable();
  }
}

function updateFixedCostRowDisplay(i) {
  const row = fixedCostRowRefs.find(r => r.i === i);
  if (!row) return;
  const item = state.fixedCostItems[i];
  if (row.input) row.input.value = item.monthly;
  if (row.span) row.span.textContent = fmt(item.monthly);
}

function refreshFixedCostItem(i) {
  applyFixedCostTotals();
  syncInputsFromState();
  renderFixedCostTable();
  updateFixedCostRowDisplay(i);
  renderComputed();
  scheduleSave();
}

function syncFixedCostInputsFromState() {
  fixedCostRowRefs.forEach(row => { row.input.value = state.fixedCostItems[row.i].monthly; });
}

/* 대출이자는 원리금균등상환 스케줄에 따라 매월 잔액이 줄며 감소하므로(고정비처럼
   매월 동일하지 않음), 이 카드에서는 Y1 월평균으로 대표해 보여준다. 정확한 월별
   금액은 설비투자 > 자금조달 탭의 상환 스케줄 표를 참고. */
function avgLoanInterest() {
  const schedule = computeDebtSchedule(state.debtAmount, state.debtAnnualRatePct, state.debtTermMonths, 12);
  return schedule.reduce((s, r) => s + r.interest, 0) / 12;
}

function renderFixedCostTable() {
  const totals = computeFixedCostTotals(state.fixedCostItems);
  const loanInterest = avgLoanInterest();
  const loanInterestEl = q('loanInterestRowValue');
  if (loanInterestEl) loanInterestEl.textContent = fmt(loanInterest);
  q('fixedProdSubtotal').textContent = fmt(totals.fixedProd);
  q('sgaSubtotal').textContent = fmt(totals.sga);
  q('otherCostSubtotal').textContent = fmt(totals.other + loanInterest);
  q('fixedCostGrandTotal').textContent = fmt(totals.grandTotal + loanInterest);
  setText('fixedTabAmount', fmt(totals.grandTotal + loanInterest) + '/월');
}

/* ---------- item detail/settings modal (equipment & fixed cost items) ---------- */

function buildModalNumberField(labelText, value, step, onChange, isMoney) {
  const wrap = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  wrap.appendChild(label);
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'num-input';
  input.min = '0';
  input.step = step;
  input.value = value;
  input.addEventListener('input', () => {
    let val = parseFloat(input.value);
    if (isNaN(val) || val < 0) val = 0;
    onChange(val);
  });
  wrap.appendChild(isMoney ? wrapMoneyInput(input, 'money-n') : input);
  return wrap;
}

function openItemModal(type, i) {
  const title = q('itemModalTitle');
  const settings = q('itemModalSettings');
  const detail = q('itemModalDetail');
  settings.innerHTML = '';

  if (type === 'equip') {
    const item = state.equipmentItems[i];
    const row = equipRowRefs[i];
    title.textContent = item.label;
    settings.appendChild(buildModalNumberField('단가', item.unitPrice, '0.01', val => {
      row.priceInput.value = val;
      row.priceInput.dispatchEvent(new Event('input', { bubbles: true }));
    }, true));
    settings.appendChild(buildModalNumberField('수량', item.qty, '1', val => {
      row.qtyInput.value = val;
      row.qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
    }));
    detail.innerHTML = item.note ? `<span class="modal-detail-label">상세 정보</span>${item.note}` : '';
    detail.style.display = item.note ? '' : 'none';
  } else if (type === 'fixed') {
    const item = state.fixedCostItems[i];
    title.textContent = item.label;

    const toggleRow = document.createElement('label');
    toggleRow.className = 'calc-toggle-row';
    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.checked = !!item.calc;
    toggleRow.appendChild(toggleCheckbox);
    const toggleText = document.createElement('span');
    toggleText.textContent = item.calc && item.calc.hourly ? '계산식 사용 (수량 × 시급 × 시간 × 일수)' : '계산식 사용 (수량 × 단가)';
    toggleRow.appendChild(toggleText);
    settings.appendChild(toggleRow);

    const fieldsWrap = document.createElement('div');
    fieldsWrap.className = 'calc-fields';
    settings.appendChild(fieldsWrap);

    let computedEl = null;
    function renderFields() {
      fieldsWrap.innerHTML = '';
      computedEl = null;
      if (item.calc) {
        fieldsWrap.appendChild(buildModalNumberField('수량 (인원수 등)', item.calc.qty, '1', val => {
          item.calc.qty = val;
          recomputeFixedCostCalcItem(i);
          if (computedEl) computedEl.textContent = '= 월 ' + fmt(item.monthly);
          refreshFixedCostItem(i);
        }));
        if (item.calc.hourly) {
          fieldsWrap.appendChild(buildModalNumberField('시급', item.calc.hourlyWage, '0.01', val => {
            item.calc.hourlyWage = val;
            recomputeFixedCostCalcItem(i);
            if (computedEl) computedEl.textContent = '= 월 ' + fmt(item.monthly);
            refreshFixedCostItem(i);
          }, true));
          const hoursNote = document.createElement('div');
          hoursNote.className = 'calc-hours-note';
          hoursNote.textContent = `1일 ${state.dailyOperatingHours}시간 × 월 ${state.workingDaysPerMonth}일 = 월 ${state.dailyOperatingHours * state.workingDaysPerMonth}시간 (조건 탭 · 생산성·인건비 조건에서 조정)`;
          fieldsWrap.appendChild(hoursNote);
        } else {
          fieldsWrap.appendChild(buildModalNumberField('단가', item.calc.unitPrice, '1', val => {
            item.calc.unitPrice = val;
            recomputeFixedCostCalcItem(i);
            if (computedEl) computedEl.textContent = '= 월 ' + fmt(item.monthly);
            refreshFixedCostItem(i);
          }, true));
        }
        computedEl = document.createElement('div');
        computedEl.className = 'calc-computed';
        computedEl.textContent = '= 월 ' + fmt(item.monthly);
        fieldsWrap.appendChild(computedEl);
      } else {
        fieldsWrap.appendChild(buildModalNumberField('월 금액', item.monthly, '1', val => {
          item.monthly = val;
          refreshFixedCostItem(i);
        }, true));
      }
    }
    renderFields();

    toggleCheckbox.addEventListener('change', () => {
      if (toggleCheckbox.checked) {
        item.calc = { qty: 1, unitPrice: item.monthly };
      } else {
        delete item.calc;
      }
      buildFixedCostSkeleton();
      renderFields();
      refreshFixedCostItem(i);
    });

    detail.innerHTML = '';
    const noteLabel = document.createElement('span');
    noteLabel.className = 'modal-detail-label';
    noteLabel.textContent = '설명';
    detail.appendChild(noteLabel);
    const noteTextarea = document.createElement('textarea');
    noteTextarea.className = 'note-textarea';
    noteTextarea.placeholder = '이 항목에 대한 설명을 입력하세요';
    noteTextarea.value = item.note || '';
    noteTextarea.addEventListener('input', () => {
      item.note = noteTextarea.value;
      scheduleSave();
    });
    detail.appendChild(noteTextarea);
    detail.style.display = '';
  }

  q('itemModalOverlay').classList.add('on');
}

function closeItemModal() {
  q('itemModalOverlay').classList.remove('on');
}

/* ---------- house type pricing & targets (editable) ---------- */

function applyBlendedPriceToMonths() {
  const blendedPrice = Math.round(computeHouseTypeTotals(state.houseTypes, state.pricePerSqm).blendedPrice);
  state.months.forEach(m => { m.salePrice = blendedPrice; });
  recomputeVariableCosts();
  return blendedPrice;
}

/* coil/screw are physical materials, so their cost is driven by the production
   volume (sqm of frame) that each month's house count actually requires, inflated
   by the 조건 탭's scrap rate (more raw material bought than ends up in the frame) —
   not a % of revenue. detailing/other stay a % of revenue since they scale with
   contract value rather than physical output. whenever a sales assumption, usage
   rate, scrap rate, or unit price changes, recompute so months stay in sync. */
function recomputeVariableCosts(indices) {
  const idxs = indices || state.months.map((_, i) => i);
  const avgSqm = computeHouseTypeTotals(state.houseTypes, state.pricePerSqm).avgSqm;
  const scrapMult = scrapMultiplier(state.scrapRatePct);
  idxs.forEach(i => {
    const m = state.months[i];
    const revenue = m.houses * m.salePrice;
    const sqm = m.houses * avgSqm;
    m.coil = sqm * state.coilLmPerSqm * scrapMult * state.coilPricePerLm;
    m.screw = sqm * state.screwsPerSqm * scrapMult / 1000 * state.screwPricePer1000;
    const laborHours = state.laborProductivitySqmPerHour > 0 ? sqm / state.laborProductivitySqmPerHour : 0;
    m.labor = laborHours * state.productionLaborHourlyWage;
    m.detail = revenue * state.detailPct / 100;
    m.otherVar = revenue * state.otherVarPct / 100;
  });
}

function buildHouseTypeSkeleton() {
  const tbody = q('houseTypeBody');
  tbody.innerHTML = '';
  houseTypeRowRefs = [];

  state.houseTypes.forEach((t, i) => {
    const tr = document.createElement('tr');

    const labelTd = document.createElement('td');
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.className = 'equip-input ht-label-input';
    labelInput.value = t.label;
    labelInput.dataset.i = i;
    labelInput.dataset.key = 'label';
    labelInput.addEventListener('input', onHouseTypeInput);
    labelTd.appendChild(labelInput);
    tr.appendChild(labelTd);

    const sqmInput = document.createElement('input');
    sqmInput.type = 'number';
    sqmInput.className = 'equip-input';
    sqmInput.min = '0';
    sqmInput.step = '1';
    sqmInput.value = t.sqm;
    sqmInput.dataset.i = i;
    sqmInput.dataset.key = 'sqm';
    sqmInput.addEventListener('input', onHouseTypeInput);
    const sqmTd = document.createElement('td');
    sqmTd.appendChild(sqmInput);
    tr.appendChild(sqmTd);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'equip-input';
    qtyInput.min = '0';
    qtyInput.step = '1';
    qtyInput.value = t.targetQty;
    qtyInput.dataset.i = i;
    qtyInput.dataset.key = 'targetQty';
    qtyInput.addEventListener('input', onHouseTypeInput);
    const qtyTd = document.createElement('td');
    qtyTd.appendChild(qtyInput);
    tr.appendChild(qtyTd);

    const unitPriceTd = document.createElement('td');
    unitPriceTd.className = 'equip-subtotal';
    tr.appendChild(unitPriceTd);

    const subtotalTd = document.createElement('td');
    subtotalTd.className = 'equip-subtotal';
    tr.appendChild(subtotalTd);

    const removeTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ht-remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.dataset.i = i;
    removeBtn.addEventListener('click', onHouseTypeRemove);
    removeTd.appendChild(removeBtn);
    tr.appendChild(removeTd);

    tbody.appendChild(tr);
    houseTypeRowRefs.push({ labelInput, sqmInput, qtyInput, unitPriceTd, subtotalTd });
  });
}

function onHouseTypeInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  const key = inp.dataset.key;
  if (key === 'label') {
    state.houseTypes[i].label = inp.value;
  } else {
    let val = parseFloat(inp.value);
    if (isNaN(val) || val < 0) val = 0;
    state.houseTypes[i][key] = val;
  }
  applyBlendedPriceToMonths();
  syncInputsFromState();
  renderHouseTypeTable();
  renderComputed();
  scheduleSave();
}

function onHouseTypeRemove(e) {
  if (state.houseTypes.length <= 1) return;
  const i = Number(e.currentTarget.dataset.i);
  state.houseTypes.splice(i, 1);
  buildHouseTypeSkeleton();
  applyBlendedPriceToMonths();
  syncInputsFromState();
  renderHouseTypeTable();
  renderComputed();
  scheduleSave();
}

function onHouseTypeAdd() {
  state.houseTypes.push({ label: '신규 구분', sqm: 60, targetQty: 1 });
  buildHouseTypeSkeleton();
  applyBlendedPriceToMonths();
  syncInputsFromState();
  renderHouseTypeTable();
  renderComputed();
  scheduleSave();
}

function renderHouseTypeTable() {
  const totals = computeHouseTypeTotals(state.houseTypes, state.pricePerSqm);
  houseTypeRowRefs.forEach((row, i) => {
    const r = totals.rows[i];
    row.unitPriceTd.textContent = fmt(r.unitPrice);
    row.subtotalTd.textContent = fmt(r.subtotal);
  });
  q('houseTypeTotalQty').textContent = totals.totalQty + '채';
  q('houseTypeBlendedPrice').textContent = fmt(totals.blendedPrice) + '/채';
  q('houseTypeTotalRevenue').textContent = fmt(totals.totalRevenue);
  q('revenueTabAmount').textContent = fmt(totals.totalRevenue / 12) + '/월';
}

/* ---------- monthly sales ramp (drives monthly revenue directly) ---------- */

let monthlyRampRowRefs = [];

function buildMonthlyRampSkeleton() {
  const tbody = q('monthlyRampBody');
  tbody.innerHTML = '';
  monthlyRampRowRefs = [];

  for (let i = 0; i < 12; i++) {
    const tr = document.createElement('tr');

    const monthTd = document.createElement('td');
    monthTd.className = 'equip-label-cell';
    monthTd.innerHTML = `<span class="equip-label">M${i + 1}<span class="tphase">${MONTH_PHASE[i]}</span></span>`;
    tr.appendChild(monthTd);

    const utilTd = document.createElement('td');
    utilTd.className = 'equip-subtotal';
    tr.appendChild(utilTd);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'equip-input';
    qtyInput.min = '0';
    qtyInput.step = '1';
    qtyInput.value = state.months[i].houses;
    qtyInput.dataset.i = i;
    qtyInput.addEventListener('input', onMonthlyRampInput);
    const qtyTd = document.createElement('td');
    qtyTd.appendChild(qtyInput);
    tr.appendChild(qtyTd);

    const revTd = document.createElement('td');
    revTd.className = 'equip-subtotal';
    tr.appendChild(revTd);

    tbody.appendChild(tr);
    monthlyRampRowRefs.push({ utilTd, qtyInput, revTd });
  }
}

function onMonthlyRampInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.months[i].houses = val;
  recomputeVariableCosts([i]);
  syncInputsFromState();
  renderComputed();
  scheduleSave();
}

/* per-month capacity utilization: sqm that month's house count requires,
   vs. sqm the roll-former can physically produce that month (조건 탭의
   롤포머 생산능력 × 월 가동일수) — the monthly counterpart to the annual
   가동률 shown in computeConditionMetrics. lm shown alongside it is that
   same sqm converted to coil length via 조건 탭의 코일 사용량(L/sqm). */
function renderMonthlyRampTable() {
  let totalQty = 0;
  const avgSqm = computeHouseTypeTotals(state.houseTypes, state.pricePerSqm).avgSqm;
  const monthlyCapacitySqm = state.rollformerCapacitySqmPerDay * state.workingDaysPerMonth;
  monthlyRampRowRefs.forEach((row, i) => {
    const m = state.months[i];
    totalQty += m.houses;
    row.revTd.textContent = fmt(m.houses * m.salePrice);
    const sqm = m.houses * avgSqm;
    const lm = sqm * state.coilLmPerSqm;
    const utilPct = monthlyCapacitySqm > 0 ? sqm / monthlyCapacitySqm * 100 : 0;
    row.utilTd.textContent = `${utilPct.toFixed(0)}% (${Math.round(lm).toLocaleString('en-US')}L)`;
    row.utilTd.style.color = utilPct > 100 ? 'var(--danger)' : '';
  });
  const totalQtyEl = q('monthlyRampTotalQty');
  if (totalQtyEl) totalQtyEl.textContent = totalQty + '채';
}

/* ---------- table (big categories, months as columns; split into IS/CF/BS) ---------- */

function signClass(val, rowDef) {
  if (rowDef.posNeg) return val < 0 ? ' neg' : ' pos';
  if (rowDef.negOnly) return val < 0 ? ' neg' : '';
  return '';
}

const IS_TABLE_ROWS = [
  { key: 'houses', label: '주택수', editable: true, money: false },
  { key: 'revenue', label: '매출', editable: false, money: true },
  { key: 'cogs', label: '매출원가', editable: false, money: true },
  { key: 'grossProfit', label: '매출총이익', editable: false, money: true, negOnly: true },
  { key: 'sga', label: 'SG&A', editable: false, money: true },
  { key: 'ebitda', label: 'EBITDA', editable: false, money: true, posNeg: true },
  { key: 'depreciation', label: '감가상각비', editable: false, money: true },
  { key: 'interest', label: '이자비용', editable: false, money: true },
  { key: 'netIncome', label: '당기순이익', editable: false, money: true, posNeg: true }
];

const CF_TABLE_ROWS = [
  { key: 'cashBegin', label: '기초현금', editable: false, money: true },
  { key: 'operatingCF', label: '영업활동 현금흐름', editable: false, money: true, posNeg: true },
  { key: 'investingCF', label: '투자활동 현금흐름', editable: false, money: true, negOnly: true },
  { key: 'financingCF', label: '재무활동 현금흐름', editable: false, money: true },
  { key: 'netCF', label: '순현금흐름', editable: false, money: true, posNeg: true },
  { key: 'cashEnd', label: '기말현금', editable: false, money: true, negOnly: true }
];

const VAR_TABLE_ROWS = [
  { key: 'coil', label: '코일(철강)', editable: false, money: true },
  { key: 'screw', label: '스크류/파스너', editable: false, money: true },
  { key: 'labor', label: '생산 인건비', editable: false, money: true },
  { key: 'detail', label: '외주 디테일링', editable: false, money: true },
  { key: 'otherVar', label: '기타(설치 등)', editable: false, money: true },
  { key: 'varCost', label: '변동비 합계', editable: false, money: true }
];

const BS_TABLE_ROWS = [
  { key: 'cashEnd', label: '현금', editable: false, money: true, negOnly: true },
  { key: 'ppe', label: '순유형자산', editable: false, money: true },
  { key: 'cumRentDeposit', label: '임차보증금', editable: false, money: true },
  { key: 'totalAssets', label: '자산총계', editable: false, money: true },
  { key: 'accruedInterest', label: '미지급이자', editable: false, money: true },
  { key: 'loanBalance', label: '대출잔액 (부채)', editable: false, money: true },
  { key: 'totalLiabilities', label: '부채총계', editable: false, money: true },
  { key: 'equityAmount', label: '자본금 (에쿼티)', editable: false, money: true },
  { key: 'retainedEarnings', label: '이익잉여금', editable: false, money: true, negOnly: true },
  { key: 'equity', label: '자본총계', editable: false, money: true }
];

function buildStatementTableSkeleton(headRowId, bodyId, rowsDef, totalLabel) {
  const headRow = q(headRowId);
  headRow.innerHTML = '<th>항목</th>' +
    MONTH_PHASE.map((phase, i) => `<th>M${i + 1}<span class="tphase">${phase}</span></th>`).join('') +
    `<th class="tcol-total">${totalLabel}</th>`;

  const tbody = q(bodyId);
  tbody.innerHTML = '';
  const refs = {};

  rowsDef.forEach(rowDef => {
    const tr = document.createElement('tr');
    const labelTd = document.createElement('td');
    labelTd.className = 'tcell tcell-month';
    labelTd.textContent = rowDef.label;
    tr.appendChild(labelTd);

    const cells = [];
    for (let i = 0; i < 12; i++) {
      const td = document.createElement('td');
      td.className = 'tcell';
      if (rowDef.editable) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'tinput';
        input.min = '0';
        input.step = '1';
        input.value = state.months[i][rowDef.key];
        input.dataset.i = i;
        input.dataset.key = rowDef.key;
        input.addEventListener('input', onCellInput);
        td.appendChild(input);
        cells.push(input);
      } else {
        td.classList.add('tcell-computed');
        cells.push(td);
      }
      tr.appendChild(td);
    }

    const totalTd = document.createElement('td');
    totalTd.className = 'tcell tcol-total';
    tr.appendChild(totalTd);

    tbody.appendChild(tr);
    refs[rowDef.key] = { cells, totalTd };
  });

  return refs;
}

function buildTableSkeleton() {
  isRowRefs = buildStatementTableSkeleton('isHeadRow', 'isTableBody', IS_TABLE_ROWS, 'Y1 합계');
  cfRowRefs = buildStatementTableSkeleton('cfHeadRow', 'cfTableBody', CF_TABLE_ROWS, 'Y1 합계');
  bsRowRefs = buildStatementTableSkeleton('bsHeadRow', 'bsTableBody', BS_TABLE_ROWS, 'Y1 말');
  varRowRefs = buildStatementTableSkeleton('varHeadRow', 'varTableBody', VAR_TABLE_ROWS, 'Y1 합계');
}

function onCellInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.months[i].houses = val;
  recomputeVariableCosts([i]);
  syncInputsFromState();
  renderComputed();
  scheduleSave();
}

function syncInputsFromState() {
  const row = isRowRefs.houses;
  if (row) row.cells.forEach((input, i) => { input.value = state.months[i].houses; });
  monthlyRampRowRefs.forEach((row, i) => { row.qtyInput.value = state.months[i].houses; });
}

function renderComputed() {
  const { months, totals } = computeAll();

  renderEquipTable();
  renderMonthlyRampTable();

  const varTotal = totals.totalCoil + totals.totalScrew + totals.totalLabor + totals.totalDetail + totals.totalOtherVar;
  setText('variableTabAmount', fmt(varTotal / 12) + '/월');

  q('mainQuickStats').innerHTML = `
    <div><div class="quick-stat-label">Y1 매출</div><div class="quick-stat-value">${fmt(totals.totalRevenue)}</div></div>
    <div><div class="quick-stat-label">Y1 매출원가</div><div class="quick-stat-value">${fmt(totals.totalCOGS)}</div></div>
    <div><div class="quick-stat-label">Y1 세전순이익</div><div class="quick-stat-value ${totals.totalNI >= 0 ? 'pos' : 'neg'}">${fmt(totals.totalNI)}</div></div>
  `;
  q('cashQuickStats').innerHTML = `
    <div><div class="quick-stat-label">Y1 말 현금</div><div class="quick-stat-value ${totals.endCash >= 0 ? 'pos' : 'neg'}">${fmt(totals.endCash)}</div></div>
    <div><div class="quick-stat-label">최저 현금</div><div class="quick-stat-value ${totals.minCash >= 0 ? 'pos' : 'neg'}">${fmt(totals.minCash)}</div></div>
  `;
  setText('rentDepositTotal', fmt(totals.totalRentDeposit));

  const totalVarPct = totals.totalRevenue > 0 ? (varTotal / totals.totalRevenue * 100) : 0;
  const varPctEl = q('varPctTotal');
  if (varPctEl) varPctEl.textContent = totalVarPct.toFixed(1) + '%';

  const htTotals = computeHouseTypeTotals(state.houseTypes, state.pricePerSqm);
  const coilUsage = computeCoilUsage(htTotals, state.coilLmPerSqm, state.scrapRatePct);
  const coilUsageSqmEl = q('coilUsageTotalSqm');
  if (coilUsageSqmEl) coilUsageSqmEl.textContent = coilUsage.totalSqm.toLocaleString('en-US') + ' sqm';
  const coilUsageLmEl = q('coilUsageTotalLm');
  if (coilUsageLmEl) coilUsageLmEl.textContent = Math.round(coilUsage.totalCoilLm).toLocaleString('en-US') + ' L';
  const coilUsagePerHouseEl = q('coilUsagePerHouse');
  if (coilUsagePerHouseEl) coilUsagePerHouseEl.textContent = Math.round(coilUsage.avgLmPerHouse).toLocaleString('en-US') + ' L/채';

  const cond = computeConditionMetrics(htTotals, state);
  setText('totalScrewsVal', Math.round(cond.totalScrews).toLocaleString('en-US') + '개');
  setText('materialsUsageSummary', Math.round(cond.totalScrews).toLocaleString('en-US') + '개');
  setText('totalLaborHoursVal', Math.round(cond.totalLaborHours).toLocaleString('en-US') + '시간');
  setText('requiredProductionDaysVal', Math.round(cond.requiredProductionDays).toLocaleString('en-US') + '일');
  setText('availableProductionDaysVal', Math.round(cond.availableProductionDaysYear).toLocaleString('en-US') + '일');
  setText('capacityUtilizationVal', cond.capacityUtilizationPct.toFixed(1) + '%');
  setText('laborConditionsSummary', Math.round(cond.totalLaborHours).toLocaleString('en-US') + '시간');
  setText('totalDetailingDaysVal', Math.round(cond.totalDetailingDays).toLocaleString('en-US') + '일');
  setText('totalDeliveryDaysVal', Math.round(cond.totalDeliveryDays).toLocaleString('en-US') + '일');
  setText('qualityConditionsSummary', state.scrapRatePct + '%');

  const isRowTotals = {
    houses: totals.totalHouses,
    revenue: totals.totalRevenue,
    cogs: totals.totalCOGS,
    grossProfit: totals.totalGP,
    sga: totals.totalSGA,
    ebitda: totals.totalEBITDA,
    depreciation: totals.totalDepreciation,
    interest: totals.totalInterest,
    netIncome: totals.totalNI
  };
  renderStatementTable(IS_TABLE_ROWS, isRowRefs, months, isRowTotals);

  const cfRowTotals = {
    cashBegin: state.equityAmount + state.debtAmount,
    operatingCF: totals.totalOperatingCF,
    investingCF: totals.totalInvestingCF,
    financingCF: totals.totalFinancingCF,
    netCF: totals.totalNetCF,
    cashEnd: totals.endCash
  };
  renderStatementTable(CF_TABLE_ROWS, cfRowRefs, months, cfRowTotals);

  const bsRowTotals = {
    cashEnd: totals.endCash,
    ppe: totals.endPPE,
    cumRentDeposit: totals.endRentDeposit,
    totalAssets: totals.endTotalAssets,
    accruedInterest: totals.endAccruedInterest,
    loanBalance: totals.endLoanBalance,
    totalLiabilities: totals.endTotalLiabilities,
    equityAmount: state.equityAmount,
    retainedEarnings: totals.endRetainedEarnings,
    equity: totals.endEquity
  };
  renderStatementTable(BS_TABLE_ROWS, bsRowRefs, months, bsRowTotals);

  const varRowTotals = {
    coil: totals.totalCoil,
    screw: totals.totalScrew,
    labor: totals.totalLabor,
    detail: totals.totalDetail,
    otherVar: totals.totalOtherVar,
    varCost: varTotal
  };
  renderStatementTable(VAR_TABLE_ROWS, varRowRefs, months, varRowTotals);

  renderDebtScheduleTable();
  buildMainChart(months);
  buildCashChart(months);
  syncAllCollapsibleAmounts();
}

/* ---------- collapsible cards ---------- */

function initCollapsibleCards() {
  document.querySelectorAll('.card[data-collapsible]').forEach(card => {
    card.classList.add('collapsed');
    const label = card.querySelector('.section-label');
    if (!label) return;
    const toggle = document.createElement('span');
    toggle.className = 'section-collapse-toggle';
    toggle.innerHTML = '<span class="section-collapse-amount"></span><span class="section-collapse-chevron"></span>';
    label.appendChild(toggle);
    label.addEventListener('click', e => {
      if (e.target.closest('.unit-toggle')) return;
      card.classList.toggle('collapsed');
    });
  });
  syncAllCollapsibleAmounts();
}

function syncAllCollapsibleAmounts() {
  document.querySelectorAll('.card[data-collapsible]').forEach(card => {
    const totalEl = q(card.dataset.totalId);
    const amountEl = card.querySelector('.section-collapse-amount');
    if (totalEl && amountEl) amountEl.textContent = totalEl.textContent;
  });
}

function renderStatementTable(rowsDef, refs, months, rowTotals) {
  rowsDef.forEach(rowDef => {
    if (!rowDef.editable) {
      const row = refs[rowDef.key];
      months.forEach((m, i) => {
        const val = m[rowDef.key];
        const cell = row.cells[i];
        cell.textContent = fmt(val);
        cell.className = 'tcell tcell-computed' + signClass(val, rowDef);
      });
    }
    const val = rowTotals[rowDef.key];
    const totalTd = refs[rowDef.key].totalTd;
    totalTd.textContent = rowDef.money ? fmt(val) : val;
    totalTd.className = 'tcell tcol-total' + signClass(val, rowDef);
  });
}

/* ---------- bulk-apply sliders ---------- */

function applyPctAll(field, pct) {
  state[field + 'Pct'] = pct;
  state.months.forEach(m => {
    const revenue = m.houses * m.salePrice;
    m[field] = revenue * pct / 100;
  });
}
function applyFixedAll(field, v) { state.months.forEach(m => { m[field] = v; }); }

function bindBulkSlider(id, isPct, applyFn) {
  const elx = q(id);
  const label = q(id + 'Val');
  const val0 = state[id];
  elx.value = val0;
  setSliderFill(elx);
  if (label) label.textContent = isPct ? val0 + '%' : fmt(val0);
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state[id] = val;
    setSliderFill(elx);
    if (label) label.textContent = isPct ? val + '%' : fmt(val);
    applyFn(val);
    syncInputsFromState();
    renderComputed();
    scheduleSave();
  });
}

function bindPricePerSqmSlider() {
  const elx = q('pricePerSqm');
  const label = q('pricePerSqmVal');
  elx.value = state.pricePerSqm;
  setSliderFill(elx);
  label.textContent = fmt(state.pricePerSqm) + '/sqm';
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state.pricePerSqm = val;
    setSliderFill(elx);
    label.textContent = fmt(val) + '/sqm';
    applyBlendedPriceToMonths();
    syncInputsFromState();
    renderHouseTypeTable();
    renderComputed();
    scheduleSave();
  });
}

function bindCoilLmPerSqmSlider() {
  const elx = q('coilLmPerSqm');
  const label = q('coilLmPerSqmVal');
  elx.value = state.coilLmPerSqm;
  setSliderFill(elx);
  label.textContent = state.coilLmPerSqm.toFixed(1) + ' L/sqm';
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state.coilLmPerSqm = val;
    setSliderFill(elx);
    label.textContent = val.toFixed(1) + ' L/sqm';
    if (productivityUnit === 'lm') refreshProductivitySliders();
    recomputeVariableCosts();
    renderComputed();
    scheduleSave();
  });
}

function bindCoilPricePerLmSlider() {
  const elx = q('coilPricePerLm');
  const label = q('coilPricePerLmVal');
  elx.value = state.coilPricePerLm;
  setSliderFill(elx);
  label.textContent = '$' + state.coilPricePerLm.toFixed(2) + '/L';
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state.coilPricePerLm = val;
    setSliderFill(elx);
    label.textContent = '$' + val.toFixed(2) + '/L';
    recomputeVariableCosts();
    renderComputed();
    scheduleSave();
  });
}

function bindScrewPricePer1000Slider() {
  const elx = q('screwPricePer1000');
  const label = q('screwPricePer1000Val');
  elx.value = state.screwPricePer1000;
  setSliderFill(elx);
  label.textContent = fmt(state.screwPricePer1000) + '/1000개';
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state.screwPricePer1000 = val;
    setSliderFill(elx);
    label.textContent = fmt(val) + '/1000개';
    recomputeVariableCosts();
    renderComputed();
    scheduleSave();
  });
}

/* 생산 인건비: 그 달 판매량에 필요한 생산면적(sqm)을 조건 탭의 노무 생산성으로
   나눠 실제 필요 인시를 구하고, 그 인시에 이 시급을 곱해 변동비로 계산한다 —
   더 팔린 만큼만 인건비가 늘어나는 구조. 조건 탭의 노무 생산성 슬라이더가
   바뀌어도 이 값이 재계산되도록 recomputeVariableCosts를 함께 호출한다. */
function bindProductionLaborHourlyWageSlider() {
  const elx = q('productionLaborHourlyWage');
  const label = q('productionLaborHourlyWageVal');
  elx.value = state.productionLaborHourlyWage;
  setSliderFill(elx);
  label.textContent = '$' + state.productionLaborHourlyWage.toFixed(2) + '/인시';
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state.productionLaborHourlyWage = val;
    setSliderFill(elx);
    label.textContent = '$' + val.toFixed(2) + '/인시';
    recomputeVariableCosts();
    renderComputed();
    scheduleSave();
  });
}

/* 노무 생산성 / 롤포머 생산능력: sqm 기준으로 state에 저장하지만, 화면에서는
   코일 사용량(L/sqm, state.coilLmPerSqm)을 환산비로 써서 sqm ↔ lm(코일 선형미터)
   단위를 전환해 보여줄 수 있다. 슬라이더 자체의 min/max/step/value도 현재 단위에
   맞게 다시 계산해서 반영한다. */
let productivityUnit = 'sqm';

const PRODUCTIVITY_RATE_FIELDS = {
  laborProductivitySqmPerHour: { min: 0.5, max: 6, step: 0.1, decimals: 1, sqmSuffix: ' sqm/인시', lmSuffix: ' L/인시' },
  rollformerCapacitySqmPerDay: { min: 50, max: 400, step: 10, decimals: 0, sqmSuffix: ' sqm/일', lmSuffix: ' L/일' }
};

function refreshProductivitySliders() {
  const rate = state.coilLmPerSqm;
  Object.entries(PRODUCTIVITY_RATE_FIELDS).forEach(([id, cfg]) => {
    const elx = q(id);
    const label = q(id + 'Val');
    const displayVal = productivityUnit === 'lm' ? state[id] * rate : state[id];
    elx.min = productivityUnit === 'lm' ? cfg.min * rate : cfg.min;
    elx.max = productivityUnit === 'lm' ? cfg.max * rate : cfg.max;
    elx.step = productivityUnit === 'lm' ? cfg.step * rate : cfg.step;
    elx.value = displayVal;
    setSliderFill(elx);
    if (label) label.textContent = displayVal.toFixed(cfg.decimals) + (productivityUnit === 'lm' ? cfg.lmSuffix : cfg.sqmSuffix);
  });
}

function bindProductivityRateSlider(id, onChange) {
  const elx = q(id);
  const cfg = PRODUCTIVITY_RATE_FIELDS[id];
  const label = q(id + 'Val');
  elx.addEventListener('input', () => {
    const raw = parseFloat(elx.value);
    const sqmVal = productivityUnit === 'lm' ? raw / state.coilLmPerSqm : raw;
    state[id] = sqmVal;
    setSliderFill(elx);
    if (label) label.textContent = raw.toFixed(cfg.decimals) + (productivityUnit === 'lm' ? cfg.lmSuffix : cfg.sqmSuffix);
    if (onChange) onChange(sqmVal);
    renderComputed();
    scheduleSave();
  });
}

function bindProductivityUnitToggle() {
  const wrap = q('productivityUnitToggle');
  if (!wrap) return;
  wrap.querySelectorAll('.unit-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.unit === productivityUnit) return;
      productivityUnit = btn.dataset.unit;
      wrap.querySelectorAll('.unit-toggle-btn').forEach(b => b.classList.toggle('on', b === btn));
      refreshProductivitySliders();
    });
  });
}

/* generic binder for 조건(conditions) sliders: state[id] <-> #id, label #id+'Val'
   suffixed with `unit`. `onChange` is an optional extra side effect (e.g.
   screwsPerSqm needs to recompute the screw variable cost) run before render. */
function bindConditionSlider(id, unit, decimals, onChange) {
  const elx = q(id);
  const label = q(id + 'Val');
  const fmtVal = v => (decimals ? v.toFixed(decimals) : v) + unit;
  elx.value = state[id];
  setSliderFill(elx);
  if (label) label.textContent = fmtVal(state[id]);
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state[id] = val;
    setSliderFill(elx);
    if (label) label.textContent = fmtVal(val);
    if (onChange) onChange(val);
    renderComputed();
    scheduleSave();
  });
}

function bindScalarInput(id, key) {
  const elx = q(id);
  elx.value = state[key];
  elx.addEventListener('input', () => {
    let val = parseFloat(elx.value);
    if (isNaN(val) || val < 0) val = 0;
    state[key] = val;
    renderComputed();
    scheduleSave();
  });
}

function bindSelect(id, key) {
  const elx = q(id);
  elx.value = state[key];
  elx.addEventListener('change', () => {
    state[key] = parseInt(elx.value, 10);
    renderComputed();
    scheduleSave();
  });
}

/* re-reads every slider/scalar/select control from `state` — used both after
   a reset-to-defaults and after a remote sync pulls in another device's data */
function syncControlInputsFromState() {
  ['detailPct', 'otherVarPct'].forEach(id => {
    const elx = q(id);
    elx.value = state[id];
    setSliderFill(elx);
    const label = q(id + 'Val');
    if (label) label.textContent = label.dataset.fmt === 'pct' ? (state[id] + '%') : fmt(state[id]);
  });
  ['equityAmount', 'debtAmount', 'debtAnnualRatePct', 'debtTermMonths', 'stage1Amount', 'stage2Amount', 'stage3Amount', 'rentDepositMonthlyRent', 'rentDepositMonths'].forEach(id => {
    q(id).value = state[id];
  });
  const coilLmElx = q('coilLmPerSqm');
  coilLmElx.value = state.coilLmPerSqm;
  setSliderFill(coilLmElx);
  q('coilLmPerSqmVal').textContent = state.coilLmPerSqm.toFixed(1) + ' L/sqm';

  const coilPriceElx = q('coilPricePerLm');
  coilPriceElx.value = state.coilPricePerLm;
  setSliderFill(coilPriceElx);
  q('coilPricePerLmVal').textContent = '$' + state.coilPricePerLm.toFixed(2) + '/L';

  const screwPriceElx = q('screwPricePer1000');
  screwPriceElx.value = state.screwPricePer1000;
  setSliderFill(screwPriceElx);
  q('screwPricePer1000Val').textContent = fmt(state.screwPricePer1000) + '/1000개';

  const laborWageElx = q('productionLaborHourlyWage');
  laborWageElx.value = state.productionLaborHourlyWage;
  setSliderFill(laborWageElx);
  q('productionLaborHourlyWageVal').textContent = '$' + state.productionLaborHourlyWage.toFixed(2) + '/인시';

  [
    ['screwsPerSqm', '개/sqm', 0],
    ['dailyOperatingHours', '시간', 1],
    ['workingDaysPerMonth', '일', 0],
    ['setupMinutesPerBatch', '분', 0],
    ['scrapRatePct', '%', 1],
    ['materialLeadTimeDays', '일', 0],
    ['detailingDaysPerHouse', '일/세대', 1],
    ['deliveryDaysPerHouse', '일/세대', 1]
  ].forEach(([id, unit, decimals]) => {
    const condElx = q(id);
    if (!condElx) return;
    condElx.value = state[id];
    setSliderFill(condElx);
    const label = q(id + 'Val');
    if (label) label.textContent = (decimals ? state[id].toFixed(decimals) : state[id]) + unit;
  });
  refreshProductivitySliders();

  const ppsElx = q('pricePerSqm');
  ppsElx.value = state.pricePerSqm;
  setSliderFill(ppsElx);
  q('pricePerSqmVal').textContent = fmt(state.pricePerSqm) + '/sqm';

  q('stage1Month').value = state.stage1Month;
  q('stage2Month').value = state.stage2Month;
  q('stage3Month').value = state.stage3Month;
  q('rentDepositMonth').value = state.rentDepositMonth;
  q('equipmentMonth').value = state.equipmentMonth;
}

function rebuildAllUIFromState() {
  syncControlInputsFromState();
  buildHouseTypeSkeleton();
  buildFixedCostSkeleton();
  buildEquipSkeleton();
  buildMonthlyRampSkeleton();
  syncInputsFromState();
  recomputeHourlyFixedCostItems();
  recomputeVariableCosts();
  renderHouseTypeTable();
  renderFixedCostTable();
  renderComputed();
}

function resetAll() {
  state = buildDefaultState();
  rebuildAllUIFromState();
  scheduleSave();
}

function initControls() {
  bindPricePerSqmSlider();
  bindCoilPricePerLmSlider();
  bindScrewPricePer1000Slider();
  bindProductionLaborHourlyWageSlider();
  bindBulkSlider('detailPct', true, v => applyPctAll('detail', v));
  bindBulkSlider('otherVarPct', true, v => applyPctAll('otherVar', v));
  bindCoilLmPerSqmSlider();
  bindConditionSlider('screwsPerSqm', '개/sqm', 0, () => recomputeVariableCosts());
  bindProductivityRateSlider('laborProductivitySqmPerHour', () => recomputeVariableCosts());
  bindProductivityRateSlider('rollformerCapacitySqmPerDay');
  bindProductivityUnitToggle();
  refreshProductivitySliders();
  bindConditionSlider('dailyOperatingHours', '시간', 1);
  bindConditionSlider('workingDaysPerMonth', '일', 0);
  q('dailyOperatingHours').addEventListener('input', recomputeHourlyFixedCostItems);
  q('workingDaysPerMonth').addEventListener('input', recomputeHourlyFixedCostItems);
  bindConditionSlider('setupMinutesPerBatch', '분', 0);
  bindConditionSlider('scrapRatePct', '%', 1, () => recomputeVariableCosts());
  bindConditionSlider('materialLeadTimeDays', '일', 0);
  bindConditionSlider('detailingDaysPerHouse', '일/세대', 1);
  bindConditionSlider('deliveryDaysPerHouse', '일/세대', 1);
  bindScalarInput('equityAmount', 'equityAmount');
  bindScalarInput('debtAmount', 'debtAmount');
  bindScalarInput('debtAnnualRatePct', 'debtAnnualRatePct');
  bindScalarInput('debtTermMonths', 'debtTermMonths');
  bindScalarInput('stage1Amount', 'stage1Amount');
  bindScalarInput('stage2Amount', 'stage2Amount');
  bindScalarInput('stage3Amount', 'stage3Amount');
  bindSelect('stage1Month', 'stage1Month');
  bindSelect('stage2Month', 'stage2Month');
  bindSelect('stage3Month', 'stage3Month');
  bindScalarInput('rentDepositMonthlyRent', 'rentDepositMonthlyRent');
  bindScalarInput('rentDepositMonths', 'rentDepositMonths');
  bindSelect('rentDepositMonth', 'rentDepositMonth');
  bindSelect('equipmentMonth', 'equipmentMonth');
}

/* ---------- tabs (floating bottom nav) ---------- */

function renderBottomNav() {
  const el = q('bottomNav');
  el.innerHTML = `<div class="bn-thumb" id="bnThumb" style="width:calc((100% - 16px) / ${TABS.length})"></div>` +
    TABS.map((t, i) => `
      <button class="nav-item" data-tab-index="${i}">
        <div class="n-ic">${t.icon}</div>
        <div class="n-lb-row"><span class="n-num">${i + 1}</span><span class="n-lb">${t.label}</span></div>
      </button>
    `).join('');
  el.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => goTab(Number(btn.dataset.tabIndex)));
  });
  updateBottomNavActive();
}

function updateBottomNavActive() {
  document.querySelectorAll('#bottomNav .nav-item').forEach((el, i) => el.classList.toggle('on', i === curTab));
  const thumb = q('bnThumb');
  if (thumb) thumb.style.transform = `translateX(${curTab * 100}%)`;
}

function goTab(i) {
  curTab = i;
  TABS.forEach((t, idx) => {
    q('tab-' + t.id).classList.toggle('on', idx === i);
  });
  updateBottomNavActive();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- sub-tabs (segmented, sliding thumb) ---------- */

function renderSubTabNav(groupKey) {
  const group = SUB_TAB_GROUPS[groupKey];
  const bar = q(group.barId);
  bar.innerHTML = `<div class="sub-tab-thumb" style="width:calc((100% - 8px) / ${group.tabs.length})"></div>` +
    group.tabs.map((t, i) => `<button class="sub-tab-item" data-subtab-index="${i}"><span>${t.label}</span>${t.amountId ? `<span class="sub-tab-amount" id="${t.amountId}">-</span>` : ''}</button>`).join('');
  bar.querySelectorAll('.sub-tab-item').forEach(btn => {
    btn.addEventListener('click', () => goSubTab(groupKey, Number(btn.dataset.subtabIndex)));
  });
  updateSubTabActive(groupKey);
}

function updateSubTabActive(groupKey) {
  const group = SUB_TAB_GROUPS[groupKey];
  const bar = q(group.barId);
  bar.querySelectorAll('.sub-tab-item').forEach((el, i) => el.classList.toggle('on', i === group.cur));
  const thumb = bar.querySelector('.sub-tab-thumb');
  if (thumb) thumb.style.transform = `translateX(${group.cur * 100}%)`;
}

function goSubTab(groupKey, i) {
  const group = SUB_TAB_GROUPS[groupKey];
  group.cur = i;
  group.tabs.forEach((t, idx) => {
    q('subtab-' + t.id).classList.toggle('on', idx === i);
  });
  updateSubTabActive(groupKey);
}

/* ---------- 가정 탭 상단의 재무/조건 switcher (small floating pill, top-left) ---------- */

const ASSUMPTIONS_MODE_TABS = [
  { id: 'finance', label: '재무' },
  { id: 'conditions', label: '조건' }
];
let curAssumptionsMode = 0;

function renderModeTabs() {
  const bar = q('modeTabs');
  bar.innerHTML = `<div class="mt-thumb" id="mtThumb" style="width:calc((100% - 6px) / ${ASSUMPTIONS_MODE_TABS.length})"></div>` +
    ASSUMPTIONS_MODE_TABS.map((t, i) => `<button class="mode-tab" data-mode-index="${i}">${t.label}</button>`).join('');
  bar.querySelectorAll('.mode-tab').forEach(btn => {
    btn.addEventListener('click', () => goAssumptionsMode(Number(btn.dataset.modeIndex)));
  });
  updateModeTabActive();
}

function updateModeTabActive() {
  const bar = q('modeTabs');
  bar.querySelectorAll('.mode-tab').forEach((el, i) => el.classList.toggle('on', i === curAssumptionsMode));
  const thumb = q('mtThumb');
  if (thumb) thumb.style.transform = `translateX(${curAssumptionsMode * 100}%)`;
}

function goAssumptionsMode(i) {
  curAssumptionsMode = i;
  ASSUMPTIONS_MODE_TABS.forEach((t, idx) => {
    q('modePanel-' + t.id).classList.toggle('on', idx === i);
  });
  updateModeTabActive();
}

window.addEventListener('DOMContentLoaded', () => {
  initControls();
  initCollapsibleCards();
  buildTableSkeleton();
  buildEquipSkeleton();
  buildHouseTypeSkeleton();
  buildFixedCostSkeleton();
  buildMonthlyRampSkeleton();
  recomputeHourlyFixedCostItems();
  recomputeVariableCosts();
  renderSubTabNav('assumptions');
  goSubTab('assumptions', 0);
  renderSubTabNav('capex');
  goSubTab('capex', 0);
  renderSubTabNav('table');
  goSubTab('table', 0);
  renderHouseTypeTable();
  renderFixedCostTable();
  renderComputed();
  renderBottomNav();
  goTab(0);
  renderModeTabs();
  goAssumptionsMode(0);
  const resetBtn = q('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  q('houseTypeAddBtn').addEventListener('click', onHouseTypeAdd);

  q('itemModalClose').addEventListener('click', closeItemModal);
  q('itemModalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeItemModal();
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeItemModal();
  });

  syncFromRemote();
  setInterval(syncFromRemote, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncFromRemote(); });
});
