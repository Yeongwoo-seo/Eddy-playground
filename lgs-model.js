/* LGS Frame Y1 재무모델 — 슬라이더(일괄 적용) + 엑셀식 월별 셀 편집 + 구성요소 브레이크다운 */

const MONTH_PHASE = ['Closing', 'Closing', 'Build', 'Build', 'Pilot', 'Pilot', 'Scale', 'Scale', 'Scale', 'Expand', 'Expand', 'Expand'];
const PHASE_ORDER = ['Closing', 'Build', 'Pilot', 'Scale', 'Expand'];
const PHASE_RANGE = { Closing: 'M1-M2', Build: 'M3-M4', Pilot: 'M5-M6', Scale: 'M7-M9', Expand: 'M10-M12' };

const DEFAULTS = {
  salePrice: 44917,
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
  houses: [0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 2, 1]
};

function buildDefaultMonths() {
  return DEFAULTS.houses.map(houses => {
    const revenue = houses * DEFAULTS.salePrice;
    return {
      houses,
      salePrice: DEFAULTS.salePrice,
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

let state = {
  equityRaise: DEFAULTS.equityRaise,
  stage1Amount: DEFAULTS.stage1Amount,
  stage1Month: DEFAULTS.stage1Month,
  stage2Amount: DEFAULTS.stage2Amount,
  stage2Month: DEFAULTS.stage2Month,
  months: buildDefaultMonths()
};

let activeMetric = null;
let rowRefs = [];

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
        { label: '설비투자 (Stage 1+2)', value: -totals.totalCapex, sign: '-' }
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
}

function syncInputsFromState() {
  rowRefs.forEach((row, i) => {
    const m = state.months[i];
    EDIT_KEYS.forEach(key => { row.inputs[key].value = m[key]; });
  });
}

function renderComputed() {
  const { months, totals } = computeAll();

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

function applySalePriceAll(v) { state.months.forEach(m => { m.salePrice = v; }); }
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
  const defaultVal = DEFAULTS[id];
  elx.value = defaultVal;
  setSliderFill(elx);
  if (label) label.textContent = isPct ? defaultVal + '%' : fmt(defaultVal);
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    setSliderFill(elx);
    if (label) label.textContent = isPct ? val + '%' : fmt(val);
    applyFn(val);
    syncInputsFromState();
    renderComputed();
  });
}

function bindScalarSlider(id, key) {
  const elx = q(id);
  const label = q(id + 'Val');
  elx.value = DEFAULTS[key];
  setSliderFill(elx);
  if (label) label.textContent = fmt(DEFAULTS[key]);
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state[key] = val;
    setSliderFill(elx);
    if (label) label.textContent = fmt(val);
    renderComputed();
  });
}

function bindSelect(id, key) {
  const elx = q(id);
  elx.value = DEFAULTS[key];
  elx.addEventListener('change', () => {
    state[key] = parseInt(elx.value, 10);
    renderComputed();
  });
}

function resetAll() {
  state = {
    equityRaise: DEFAULTS.equityRaise,
    stage1Amount: DEFAULTS.stage1Amount,
    stage1Month: DEFAULTS.stage1Month,
    stage2Amount: DEFAULTS.stage2Amount,
    stage2Month: DEFAULTS.stage2Month,
    months: buildDefaultMonths()
  };
  activeMetric = null;
  document.querySelectorAll('[data-metric]').forEach(o => o.classList.remove('active'));
  q('breakdownCard').style.display = 'none';

  ['salePrice', 'coilPct', 'screwPct', 'detailPct', 'otherVarPct', 'fixedProdCost', 'sgaMonthly', 'otherCostMonthly', 'equityRaise', 'stage1Amount', 'stage2Amount'].forEach(id => {
    const elx = q(id);
    elx.value = DEFAULTS[id];
    setSliderFill(elx);
    const label = q(id + 'Val');
    if (label) label.textContent = label.dataset.fmt === 'pct' ? (DEFAULTS[id] + '%') : fmt(DEFAULTS[id]);
  });
  q('stage1Month').value = DEFAULTS.stage1Month;
  q('stage2Month').value = DEFAULTS.stage2Month;

  syncInputsFromState();
  renderComputed();
}

function initControls() {
  bindBulkSlider('salePrice', false, applySalePriceAll);
  bindBulkSlider('coilPct', true, v => applyPctAll('coil', v));
  bindBulkSlider('screwPct', true, v => applyPctAll('screw', v));
  bindBulkSlider('detailPct', true, v => applyPctAll('detail', v));
  bindBulkSlider('otherVarPct', true, v => applyPctAll('otherVar', v));
  bindBulkSlider('fixedProdCost', false, v => applyFixedAll('fixedProd', v));
  bindBulkSlider('sgaMonthly', false, v => applyFixedAll('sga', v));
  bindBulkSlider('otherCostMonthly', false, v => applyFixedAll('otherCost', v));
  bindScalarSlider('equityRaise', 'equityRaise');
  bindScalarSlider('stage1Amount', 'stage1Amount');
  bindScalarSlider('stage2Amount', 'stage2Amount');
  bindSelect('stage1Month', 'stage1Month');
  bindSelect('stage2Month', 'stage2Month');
}

window.addEventListener('DOMContentLoaded', () => {
  initControls();
  buildTableSkeleton();
  bindMetricClicks();
  renderComputed();
  q('resetBtn').addEventListener('click', resetAll);
});
