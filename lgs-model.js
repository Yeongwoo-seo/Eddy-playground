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

const SUB_TABS = [
  { id: 'revenue', label: '매출' },
  { id: 'fixed', label: '고정비' },
  { id: 'variable', label: '변동비' }
];
let curSubTab = 0;

const DEFAULTS = {
  pricePerSqm: 200,
  houseTypes: [
    { label: '그래니플랫', sqm: 55, targetQty: 8 },
    { label: '듀플렉스', sqm: 150, targetQty: 2 },
    { label: '타운하우스', sqm: 130, targetQty: 2 }
  ],
  coilPct: 30,
  screwPct: 5,
  detailPct: 10,
  otherVarPct: 5,
  fixedProdCost: 24125,
  sgaMonthly: 58333,
  otherCostMonthly: 6917,
  equityRaise: 350000,
  stage1Amount: 40000,
  stage1Month: 1,
  stage2Amount: 40000,
  stage2Month: 5,
  stage3Amount: 0,
  stage3Month: 9,
  houses: [0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 2, 1],
  equipmentMonth: 1,
  equipmentItems: [
    { label: '포크리프트 (중고)', note: 'Facebook Marketplace Sydney', unitPrice: 4000, qty: 1 },
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
  let totalQty = 0, totalRevenue = 0;
  const rows = houseTypes.map(t => {
    const unitPrice = t.sqm * pricePerSqm;
    const subtotal = unitPrice * t.targetQty;
    totalQty += t.targetQty;
    totalRevenue += subtotal;
    return { label: t.label, sqm: t.sqm, targetQty: t.targetQty, unitPrice, subtotal };
  });
  const blendedPrice = totalQty > 0 ? totalRevenue / totalQty : 0;
  return { rows, totalQty, totalRevenue, blendedPrice };
}

function buildDefaultMonths() {
  const blendedPrice = Math.round(computeHouseTypeTotals(DEFAULTS.houseTypes, DEFAULTS.pricePerSqm).blendedPrice);
  return DEFAULTS.houses.map(houses => {
    const revenue = houses * blendedPrice;
    return {
      houses,
      salePrice: blendedPrice,
      coil: revenue * DEFAULTS.coilPct / 100,
      screw: revenue * DEFAULTS.screwPct / 100,
      detail: revenue * DEFAULTS.detailPct / 100,
      otherVar: revenue * DEFAULTS.otherVarPct / 100,
      fixedProd: DEFAULTS.fixedProdCost,
      sga: DEFAULTS.sgaMonthly,
      otherCost: DEFAULTS.otherCostMonthly
    };
  });
}

function buildDefaultEquipment() {
  return DEFAULTS.equipmentItems.map(item => ({ ...item }));
}

function buildDefaultState() {
  return {
    pricePerSqm: DEFAULTS.pricePerSqm,
    coilPct: DEFAULTS.coilPct,
    screwPct: DEFAULTS.screwPct,
    detailPct: DEFAULTS.detailPct,
    otherVarPct: DEFAULTS.otherVarPct,
    fixedProdCost: DEFAULTS.fixedProdCost,
    sgaMonthly: DEFAULTS.sgaMonthly,
    otherCostMonthly: DEFAULTS.otherCostMonthly,
    houseTypes: DEFAULTS.houseTypes.map(t => ({ ...t })),
    equityRaise: DEFAULTS.equityRaise,
    stage1Amount: DEFAULTS.stage1Amount,
    stage1Month: DEFAULTS.stage1Month,
    stage2Amount: DEFAULTS.stage2Amount,
    stage2Month: DEFAULTS.stage2Month,
    stage3Amount: DEFAULTS.stage3Amount,
    stage3Month: DEFAULTS.stage3Month,
    equipmentMonth: DEFAULTS.equipmentMonth,
    equipmentItems: buildDefaultEquipment(),
    months: buildDefaultMonths()
  };
}

let state = buildDefaultState();

let activeMetric = null;
let rowRefs = [];
let equipRowRefs = [];
let houseTypeRowRefs = [];

/* ---------- auto-save to server ---------- */
// Fill in after `npx wrangler deploy` in worker/ (see worker/README.md) —
// blank means auto-save/load is a no-op and the page behaves as before.
const API_URL = '';

let saveTimer = null;
function scheduleSave() {
  if (!API_URL) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fetch(API_URL + '/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app: 'lgs-model', data: state })
    }).catch(() => {});
  }, 800);
}

async function loadStateFromServer() {
  if (!API_URL) return;
  try {
    const res = await fetch(API_URL + '/state?app=lgs-model');
    if (!res.ok) return;
    const payload = await res.json();
    if (payload && payload.data && Object.keys(payload.data).length) {
      state = Object.assign(buildDefaultState(), payload.data);
    }
  } catch (e) {
    // offline or Worker unreachable — keep local defaults
  }
}

function fmt(n) {
  const r = Math.round(n);
  return (r < 0 ? '-A$' : 'A$') + Math.abs(r).toLocaleString('en-US');
}

function fmtK(n) {
  const r = Math.round(n / 1000);
  return (r < 0 ? '-A$' : 'A$') + Math.abs(r) + 'k';
}

function q(id) { return document.getElementById(id); }

function computeAll() {
  const months = [];
  let cash = state.equityRaise;
  const totalEquipmentCapex = state.equipmentItems.reduce((s, it) => s + it.unitPrice * it.qty, 0);

  state.months.forEach((m, i) => {
    const revenue = m.houses * m.salePrice;
    const varCost = m.coil + m.screw + m.detail + m.otherVar;
    const cogs = varCost + m.fixedProd;
    const grossProfit = revenue - cogs;
    const ebitda = grossProfit - m.sga;
    const netIncome = ebitda - m.otherCost;

    let capex = 0;
    if (i + 1 === Number(state.stage1Month)) capex += state.stage1Amount;
    if (i + 1 === Number(state.stage2Month)) capex += state.stage2Amount;
    if (i + 1 === Number(state.stage3Month)) capex += state.stage3Amount;
    if (i + 1 === Number(state.equipmentMonth)) capex += totalEquipmentCapex;
    cash += ebitda - capex;

    months.push({
      idx: i, phase: MONTH_PHASE[i], houses: m.houses, salePrice: m.salePrice,
      coil: m.coil, screw: m.screw, detail: m.detail, otherVar: m.otherVar,
      fixedProd: m.fixedProd, sga: m.sga, otherCost: m.otherCost,
      revenue, varCost, cogs, grossProfit, ebitda, netIncome, capex, cashEnd: cash
    });
  });

  const totals = {
    totalRevenue: sum(months, 'revenue'),
    totalCOGS: sum(months, 'cogs'),
    totalCoil: sum(months, 'coil'),
    totalScrew: sum(months, 'screw'),
    totalDetail: sum(months, 'detail'),
    totalOtherVar: sum(months, 'otherVar'),
    totalFixedProd: sum(months, 'fixedProd'),
    totalSGA: sum(months, 'sga'),
    totalOtherCost: sum(months, 'otherCost'),
    totalEBITDA: sum(months, 'ebitda'),
    totalNI: sum(months, 'netIncome'),
    totalCapex: sum(months, 'capex'),
    totalMachineCapex: state.stage1Amount + state.stage2Amount + state.stage3Amount,
    totalEquipmentCapex,
    totalHouses: sum(months, 'houses'),
    endCash: months[11].cashEnd,
    minCash: Math.min(state.equityRaise, ...months.map(m => m.cashEnd))
  };
  totals.totalGP = totals.totalRevenue - totals.totalCOGS;

  return { months, totals };
}

function sum(months, key) { return months.reduce((s, m) => s + m[key], 0); }

function phaseAgg(months, key) {
  const agg = {};
  PHASE_ORDER.forEach(p => agg[p] = 0);
  months.forEach(m => { agg[m.phase] += m[key]; });
  return agg;
}

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
  const ebitdaArr = months.map(m => m.ebitda);
  let maxVal = Math.max(...revs, ...cogsArr, 0, 1000);
  let minVal = Math.min(...ebitdaArr, 0);
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

  const pts = months.map((m, i) => `${padL + slotW * i + slotW / 2},${y(m.ebitda)}`).join(' ');
  svg.appendChild(el('polyline', { points: pts, fill: 'none', stroke: 'var(--info-blue)', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  months.forEach((m, i) => {
    const xCenter = padL + slotW * i + slotW / 2;
    svg.appendChild(el('circle', { cx: xCenter, cy: y(m.ebitda), r: 2.6, fill: 'var(--info-blue)' }));
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

  const series = [state.equityRaise, ...months.map(m => m.cashEnd)];
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

/* ---------- breakdown panel ---------- */

function getBreakdown(metric, months, totals) {
  switch (metric) {
    case 'revenue': {
      const revAgg = phaseAgg(months, 'revenue');
      const houseAgg = phaseAgg(months, 'houses');
      const rows = PHASE_ORDER.map(p => ({
        label: `${p} (${PHASE_RANGE[p]})`,
        sub: houseAgg[p] + '채',
        value: revAgg[p],
        barPct: totals.totalRevenue > 0 ? revAgg[p] / totals.totalRevenue * 100 : 0
      }));
      return { title: '매출 구성 (단계별)', rows, totalLabel: 'Y1 총 매출', totalValue: totals.totalRevenue, showBar: true };
    }
    case 'cogs': {
      const items = [
        ['코일(철강)', totals.totalCoil],
        ['스크류/파스너', totals.totalScrew],
        ['외주 디테일링', totals.totalDetail],
        ['기타(설치 등)', totals.totalOtherVar],
        ['고정 생산비(램프업)', totals.totalFixedProd]
      ];
      const rows = items.map(([label, value]) => ({ label, value, barPct: totals.totalCOGS > 0 ? value / totals.totalCOGS * 100 : 0 }));
      return { title: '매출원가 구성', rows, totalLabel: 'Y1 매출원가', totalValue: totals.totalCOGS, showBar: true };
    }
    case 'grossProfit': {
      const rows = [
        { label: '매출', value: totals.totalRevenue, sign: '+' },
        { label: '매출원가', value: -totals.totalCOGS, sign: '-' }
      ];
      return { title: '매출총이익 계산', rows, totalLabel: 'Y1 매출총이익', totalValue: totals.totalGP, showBar: false };
    }
    case 'ebitda': {
      const rows = [
        { label: '매출총이익', value: totals.totalGP, sign: '+' },
        { label: '판매관리비 (SG&A)', value: -totals.totalSGA, sign: '-' }
      ];
      return { title: 'EBITDA 계산', rows, totalLabel: 'Y1 EBITDA', totalValue: totals.totalEBITDA, showBar: false };
    }
    case 'netIncome': {
      const rows = [
        { label: 'EBITDA', value: totals.totalEBITDA, sign: '+' },
        { label: '기타비용 (감가상각/이자)', value: -totals.totalOtherCost, sign: '-' }
      ];
      return { title: '순이익 계산', rows, totalLabel: 'Y1 순이익', totalValue: totals.totalNI, showBar: false };
    }
    case 'cash': {
      const rows = [
        { label: '초기 투자금', value: state.equityRaise, sign: '+' },
        { label: '누적 EBITDA', value: totals.totalEBITDA, sign: totals.totalEBITDA >= 0 ? '+' : '-' },
        { label: 'SP120 설비투자 (Stage 1+2+3)', value: -totals.totalMachineCapex, sign: '-' },
        { label: '장비·공구 구입', value: -totals.totalEquipmentCapex, sign: '-' }
      ];
      return { title: '기말 현금 계산', rows, totalLabel: 'Y1 말 현금', totalValue: totals.endCash, showBar: false };
    }
  }
}

function renderBreakdown(months, totals) {
  if (!activeMetric) return;
  const bd = getBreakdown(activeMetric, months, totals);
  q('breakdownTitle').textContent = bd.title;
  const list = q('breakdownList');
  list.innerHTML = '';
  bd.rows.forEach(r => {
    const wrap = document.createElement('div');
    const signPrefix = r.sign ? r.sign + ' ' : '';
    wrap.innerHTML = `
      <div class="breakdown-row">
        <span class="breakdown-label">${r.label}${r.sub ? ' · ' + r.sub : ''}</span>
        <span class="breakdown-value ${r.value < 0 ? 'neg' : ''}">${signPrefix}${fmt(Math.abs(r.value))}</span>
      </div>
      ${bd.showBar ? `<div class="breakdown-bar-track"><div class="breakdown-bar-fill" style="width:${Math.max(r.barPct, 0).toFixed(1)}%"></div></div>` : ''}
    `;
    list.appendChild(wrap);
  });
  q('breakdownTotalLabel').textContent = bd.totalLabel;
  const totalEl = q('breakdownTotalValue');
  totalEl.textContent = fmt(bd.totalValue);
  totalEl.className = bd.totalValue < 0 ? 'neg' : '';
}

function bindMetricClicks() {
  document.querySelectorAll('[data-metric]').forEach(elx => {
    elx.addEventListener('click', () => {
      const metric = elx.dataset.metric;
      if (activeMetric === metric) {
        activeMetric = null;
        document.querySelectorAll('[data-metric]').forEach(o => o.classList.remove('active'));
        q('breakdownCard').style.display = 'none';
        return;
      }
      activeMetric = metric;
      document.querySelectorAll('[data-metric]').forEach(o => o.classList.remove('active'));
      elx.classList.add('active');
      q('breakdownCard').style.display = 'block';
      const { months, totals } = computeAll();
      renderBreakdown(months, totals);
      q('breakdownCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
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
    labelTd.innerHTML = `<span class="equip-label">${item.label}</span><span class="equip-note">${item.note}</span>`;
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
    priceTd.appendChild(priceInput);
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

function syncEquipInputsFromState() {
  equipRowRefs.forEach((row, i) => {
    const item = state.equipmentItems[i];
    row.priceInput.value = item.unitPrice;
    row.qtyInput.value = item.qty;
  });
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

/* ---------- house type pricing & targets (editable) ---------- */

function applyBlendedPriceToMonths() {
  const blendedPrice = Math.round(computeHouseTypeTotals(state.houseTypes, state.pricePerSqm).blendedPrice);
  state.months.forEach(m => { m.salePrice = blendedPrice; });
  return blendedPrice;
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
}

/* ---------- table (editable) ---------- */

const EDIT_KEYS = ['houses', 'salePrice', 'coil', 'screw', 'detail', 'otherVar', 'fixedProd', 'sga', 'otherCost'];

function buildTableSkeleton() {
  const tbody = q('tableBody');
  tbody.innerHTML = '';
  rowRefs = [];

  for (let i = 0; i < 12; i++) {
    const tr = document.createElement('tr');
    const m = state.months[i];

    const monthTd = document.createElement('td');
    monthTd.className = 'tcell tcell-month';
    monthTd.innerHTML = `M${i + 1}<span class="tphase">${MONTH_PHASE[i]}</span>`;
    tr.appendChild(monthTd);

    const inputs = {};
    EDIT_KEYS.forEach(key => {
      const td = document.createElement('td');
      td.className = 'tcell';
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'tinput';
      input.min = '0';
      input.step = key === 'houses' ? '1' : '1';
      input.value = m[key];
      input.dataset.i = i;
      input.dataset.key = key;
      input.addEventListener('input', onCellInput);
      td.appendChild(input);
      tr.appendChild(td);
      inputs[key] = input;

      // insert revenue as a computed cell right after salePrice
      if (key === 'salePrice') {
        const revTd = document.createElement('td');
        revTd.className = 'tcell tcell-computed';
        tr.appendChild(revTd);
        inputs._revenue = revTd;
      }
    });

    const gpTd = document.createElement('td');
    gpTd.className = 'tcell tcell-computed';
    tr.appendChild(gpTd);
    const ebitdaTd = document.createElement('td');
    ebitdaTd.className = 'tcell tcell-computed';
    tr.appendChild(ebitdaTd);
    const cashTd = document.createElement('td');
    cashTd.className = 'tcell tcell-computed';
    tr.appendChild(cashTd);

    tbody.appendChild(tr);
    rowRefs.push({ inputs, gpTd, ebitdaTd, cashTd });
  }

  const totalTr = document.createElement('tr');
  totalTr.className = 'trow-total';
  totalTr.id = 'totalRow';
  tbody.appendChild(totalTr);
}

function onCellInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  const key = inp.dataset.key;
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.months[i][key] = val;
  renderComputed();
  scheduleSave();
}

function syncInputsFromState() {
  rowRefs.forEach((row, i) => {
    const m = state.months[i];
    EDIT_KEYS.forEach(key => { row.inputs[key].value = m[key]; });
  });
}

function renderComputed() {
  const { months, totals } = computeAll();

  renderEquipTable();

  q('statRevenue').textContent = fmt(totals.totalRevenue);
  q('statRevenueSub').textContent = totals.totalHouses + '채 평균 ' + fmt(totals.totalHouses > 0 ? totals.totalRevenue / totals.totalHouses : 0) + '/채';
  q('statCOGS').textContent = fmt(totals.totalCOGS);
  const varTotal = totals.totalCoil + totals.totalScrew + totals.totalDetail + totals.totalOtherVar;
  q('statCOGSSub').textContent = '변동비 ' + fmt(varTotal) + ' + 고정생산비 ' + fmt(totals.totalFixedProd);
  const gpEl = q('statGP');
  gpEl.textContent = fmt(totals.totalGP);
  gpEl.className = 'stat-value ' + (totals.totalGP >= 0 ? 'pos' : 'neg');
  q('statGPSub').textContent = '매출총이익률 ' + (totals.totalRevenue > 0 ? (totals.totalGP / totals.totalRevenue * 100).toFixed(1) : '0.0') + '%';
  const cashEl = q('statCash');
  cashEl.textContent = fmt(totals.endCash);
  cashEl.className = 'stat-value ' + (totals.endCash >= 0 ? 'pos' : 'neg');
  q('statCashSub').textContent = '최저 현금 ' + fmt(totals.minCash);

  q('statEBITDA').textContent = fmt(totals.totalEBITDA);
  q('statNI').textContent = fmt(totals.totalNI);
  const beIdx = months.findIndex(m => m.ebitda >= 0);
  q('statBreakeven').textContent = beIdx >= 0 ? ('M' + (beIdx + 1)) : 'Y1 내 미달성';

  const warnBanner = q('cashWarning');
  if (totals.minCash < 0) {
    warnBanner.style.display = 'flex';
    warnBanner.querySelector('span').textContent = '현금이 초기 투자금 아래로 내려갑니다 — 최저 ' + fmt(totals.minCash) + '. 판매가·비용·초기 투자금을 조정해보세요.';
  } else {
    warnBanner.style.display = 'none';
  }

  const totalVarPct = totals.totalRevenue > 0 ? (varTotal / totals.totalRevenue * 100) : 0;
  const varPctEl = q('varPctTotal');
  if (varPctEl) varPctEl.textContent = totalVarPct.toFixed(1) + '%';

  months.forEach((m, i) => {
    const row = rowRefs[i];
    row.inputs._revenue.textContent = fmt(m.revenue);
    row.gpTd.textContent = fmt(m.grossProfit);
    row.gpTd.className = 'tcell tcell-computed' + (m.grossProfit < 0 ? ' neg' : '');
    row.ebitdaTd.textContent = fmt(m.ebitda);
    row.ebitdaTd.className = 'tcell tcell-computed' + (m.ebitda < 0 ? ' neg' : ' pos');
    row.cashTd.textContent = fmt(m.cashEnd);
    row.cashTd.className = 'tcell tcell-computed' + (m.cashEnd < 0 ? ' neg' : '');
  });

  const totalTr = q('totalRow');
  totalTr.innerHTML = `
    <td class="tcell tcell-month">Y1 합계</td>
    <td class="tcell">${totals.totalHouses}</td>
    <td class="tcell">-</td>
    <td class="tcell">${fmt(totals.totalRevenue)}</td>
    <td class="tcell">${fmt(totals.totalCoil)}</td>
    <td class="tcell">${fmt(totals.totalScrew)}</td>
    <td class="tcell">${fmt(totals.totalDetail)}</td>
    <td class="tcell">${fmt(totals.totalOtherVar)}</td>
    <td class="tcell">${fmt(totals.totalFixedProd)}</td>
    <td class="tcell">${fmt(totals.totalSGA)}</td>
    <td class="tcell">${fmt(totals.totalOtherCost)}</td>
    <td class="tcell ${totals.totalGP < 0 ? 'neg' : ''}">${fmt(totals.totalGP)}</td>
    <td class="tcell ${totals.totalEBITDA < 0 ? 'neg' : 'pos'}">${fmt(totals.totalEBITDA)}</td>
    <td class="tcell ${totals.endCash < 0 ? 'neg' : ''}">${fmt(totals.endCash)}</td>
  `;

  buildMainChart(months);
  buildCashChart(months);
  renderBreakdown(months, totals);
}

/* ---------- bulk-apply sliders ---------- */

function applyPctAll(field, pct) {
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

function resetAll() {
  state = buildDefaultState();
  activeMetric = null;
  document.querySelectorAll('[data-metric]').forEach(o => o.classList.remove('active'));
  q('breakdownCard').style.display = 'none';

  ['coilPct', 'screwPct', 'detailPct', 'otherVarPct', 'fixedProdCost', 'sgaMonthly', 'otherCostMonthly'].forEach(id => {
    const elx = q(id);
    elx.value = DEFAULTS[id];
    setSliderFill(elx);
    const label = q(id + 'Val');
    if (label) label.textContent = label.dataset.fmt === 'pct' ? (DEFAULTS[id] + '%') : fmt(DEFAULTS[id]);
  });
  ['equityRaise', 'stage1Amount', 'stage2Amount', 'stage3Amount'].forEach(id => {
    q(id).value = DEFAULTS[id];
  });
  const ppsElx = q('pricePerSqm');
  ppsElx.value = DEFAULTS.pricePerSqm;
  setSliderFill(ppsElx);
  q('pricePerSqmVal').textContent = fmt(DEFAULTS.pricePerSqm) + '/sqm';

  q('stage1Month').value = DEFAULTS.stage1Month;
  q('stage2Month').value = DEFAULTS.stage2Month;
  q('stage3Month').value = DEFAULTS.stage3Month;
  q('equipmentMonth').value = DEFAULTS.equipmentMonth;

  buildHouseTypeSkeleton();
  syncInputsFromState();
  syncEquipInputsFromState();
  renderHouseTypeTable();
  renderComputed();
  scheduleSave();
}

function initControls() {
  bindPricePerSqmSlider();
  bindBulkSlider('coilPct', true, v => applyPctAll('coil', v));
  bindBulkSlider('screwPct', true, v => applyPctAll('screw', v));
  bindBulkSlider('detailPct', true, v => applyPctAll('detail', v));
  bindBulkSlider('otherVarPct', true, v => applyPctAll('otherVar', v));
  bindBulkSlider('fixedProdCost', false, v => applyFixedAll('fixedProd', v));
  bindBulkSlider('sgaMonthly', false, v => applyFixedAll('sga', v));
  bindBulkSlider('otherCostMonthly', false, v => applyFixedAll('otherCost', v));
  bindScalarInput('equityRaise', 'equityRaise');
  bindScalarInput('stage1Amount', 'stage1Amount');
  bindScalarInput('stage2Amount', 'stage2Amount');
  bindScalarInput('stage3Amount', 'stage3Amount');
  bindSelect('stage1Month', 'stage1Month');
  bindSelect('stage2Month', 'stage2Month');
  bindSelect('stage3Month', 'stage3Month');
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

function renderSubTabNav() {
  const el = q('subTabBar');
  el.innerHTML = `<div class="sub-tab-thumb" id="subTabThumb" style="width:calc((100% - 8px) / ${SUB_TABS.length})"></div>` +
    SUB_TABS.map((t, i) => `<button class="sub-tab-item" data-subtab-index="${i}">${t.label}</button>`).join('');
  el.querySelectorAll('.sub-tab-item').forEach(btn => {
    btn.addEventListener('click', () => goSubTab(Number(btn.dataset.subtabIndex)));
  });
  updateSubTabActive();
}

function updateSubTabActive() {
  document.querySelectorAll('#subTabBar .sub-tab-item').forEach((el, i) => el.classList.toggle('on', i === curSubTab));
  const thumb = q('subTabThumb');
  if (thumb) thumb.style.transform = `translateX(${curSubTab * 100}%)`;
}

function goSubTab(i) {
  curSubTab = i;
  SUB_TABS.forEach((t, idx) => {
    q('subtab-' + t.id).classList.toggle('on', idx === i);
  });
  updateSubTabActive();
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadStateFromServer();
  initControls();
  buildTableSkeleton();
  buildEquipSkeleton();
  buildHouseTypeSkeleton();
  bindMetricClicks();
  renderHouseTypeTable();
  renderComputed();
  renderBottomNav();
  goTab(0);
  renderSubTabNav();
  goSubTab(0);
  q('resetBtn').addEventListener('click', resetAll);
  q('houseTypeAddBtn').addEventListener('click', onHouseTypeAdd);
});
