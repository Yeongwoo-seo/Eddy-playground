const state = {
    width: 0, height: 0, hasNG: true, ngCount: 1,
    autoGap: true, manualGap: 400,
    currentPart: 'ST1', calculatedGap: 0, st2Count: 0
};

const el = {
    width: document.getElementById('inputWidth'),
    height: document.getElementById('inputHeight'),
    ng: document.getElementById('toggleNG'),
    ngCount: document.getElementById('ngCount'),
    autoGap: document.getElementById('toggleAutoGap'),
    manualGap: document.getElementById('inputGap'),
    preview: document.getElementById('svgContainer'),
    modal: document.getElementById('modalOverlay'),
    partName: document.getElementById('displayPartName'),
    partDesc: document.getElementById('displayPartDesc'),
    tableBody: document.getElementById('resultTableBody'),
    btns: document.querySelectorAll('.part-btn')
};

// --- 입력 및 실시간 업데이트 로직 ---
const updateAll = () => { updatePreview(); };

el.width.addEventListener('input', (e) => { state.width = Number(e.target.value); updateAll(); });
el.height.addEventListener('input', (e) => { state.height = Number(e.target.value); updateAll(); });
el.ng.addEventListener('change', (e) => { 
    state.hasNG = e.target.checked; 
    document.getElementById('ngCountWrapper').classList.toggle('disabled', !state.hasNG);
    updateAll(); 
});
el.ngCount.addEventListener('input', (e) => { state.ngCount = Number(e.target.value); updateAll(); });
el.autoGap.addEventListener('change', (e) => { 
    state.autoGap = e.target.checked; 
    document.getElementById('manualGapWrapper').classList.toggle('disabled', state.autoGap);
    document.getElementById('inputGap').readOnly = state.autoGap;
    updateAll(); 
});
el.manualGap.addEventListener('input', (e) => { state.manualGap = Number(e.target.value); updateAll(); });

// --- 계산 함수 ---
function calculateGap(L) {
    if (L <= 0) return 400;
    let x = 1;
    while (L / x > 450) x++; // 450mm 이하가 되는 최소 x구간 찾기
    return L / x;
}

// --- SVG 동적 시각화 (도면 느낌) ---
function updatePreview() {
    const wVal = state.width || 0;
    const hVal = state.height || 0;
    el.preview.innerHTML = '';
    if (wVal <= 0 || hVal <= 0) return;

    const maxD = 220; // 최대 출력 사이즈 (px)
    const scale = maxD / Math.max(wVal, hVal, 1000);
    const dW = Math.max(wVal * scale, 80);
    const dH = Math.max(hVal * scale, 80);
    const gap = state.autoGap ? calculateGap(wVal) : (state.manualGap || 400);
    const padding = 40;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", dW + padding);
    svg.setAttribute("height", dH + padding);
    
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("transform", `translate(${padding}, ${padding/2})`);
    svg.appendChild(g);

    // 메인 사각형 (프레임 외곽)
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", dW); rect.setAttribute("height", dH);
    rect.setAttribute("fill", "white"); rect.setAttribute("stroke", "#191F28"); rect.setAttribute("stroke-width", "2");
    g.appendChild(rect);

    // 가로 치수 텍스트
    const tT = document.createElementNS(svgNS, "text");
    tT.setAttribute("x", dW/2); tT.setAttribute("y", -10); tT.setAttribute("text-anchor", "middle");
    tT.setAttribute("class", "dim-text"); tT.textContent = `${wVal} mm`;
    g.appendChild(tT);

    // 세로 치수 텍스트
    const lT = document.createElementNS(svgNS, "text");
    lT.setAttribute("x", -padding + 5); lT.setAttribute("y", dH/2);
    lT.setAttribute("class", "dim-text"); lT.setAttribute("style", "writing-mode: vertical-lr; transform: rotate(180deg); transform-origin: center;");
    lT.textContent = `${hVal} mm`;
    g.appendChild(lT);

    // ST2 기둥 시각화 (세로 점선)
    const st2Cnt = Math.floor(wVal / gap);
    for (let i = 1; i < st2Cnt; i++) {
        const xPos = (gap * i / wVal) * dW;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", xPos); line.setAttribute("y1", 0); line.setAttribute("x2", xPos); line.setAttribute("y2", dH);
        line.setAttribute("stroke", "#D1D6DB"); line.setAttribute("stroke-dasharray", "4,3"); g.appendChild(line);
    }

    // NG 지지대 시각화 (가로 파란 실선)
    if (state.hasNG) {
        for (let i = 1; i <= state.ngCount; i++) {
            const yPos = (i / (state.ngCount + 1)) * dH;
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", 0); line.setAttribute("y1", yPos); line.setAttribute("x2", dW); line.setAttribute("y2", yPos);
            line.setAttribute("stroke", "#3182F6"); line.setAttribute("stroke-width", "1.5"); g.appendChild(line);
        }
    }
    el.preview.appendChild(svg);
}

// --- 모달 및 결과 테이블 렌더링 ---
function openModal() {
    if (!state.width || !state.height) return alert("가로, 세로 수치를 입력해주세요.");
    state.calculatedGap = state.autoGap ? calculateGap(state.width) : (state.manualGap || 400);
    state.st2Count = Math.max(0, Math.floor(state.width / state.calculatedGap) - 1);
    renderTable();
    el.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() { el.modal.classList.remove('active'); document.body.style.overflow = ''; }

function selectPart(part) {
    state.currentPart = part;
    el.btns.forEach(btn => btn.classList.toggle('active', btn.innerText === part));
    el.partName.innerText = `${part} 데이터`;
    renderTable();
}

function renderTable() {
    const type = state.currentPart;
    const len = type.includes('ST') ? state.height : state.width;
    const gap = state.calculatedGap;
    const ngCount = state.hasNG ? state.ngCount : 0;
    let html = '';

    // 3열 테이블용 헬퍼 함수
    const addRow = (label, v1, v2 = null) => {
        if (v2 !== null) html += `<tr><td class="data-key">${label}</td><td class="data-value">${v1}</td><td class="data-value">${v2}</td></tr>`;
        else html += `<tr><td class="data-key">${label}</td><td colspan="2" class="data-value-center">${v1}</td></tr>`;
    };

    if (type === 'ST1' || type === 'ST2') {
        el.partDesc.innerText = type === 'ST1' ? '양 끝 기둥 (2개)' : `중간 기둥 (${state.st2Count}개)`;
        
        // 시작부: Swage + Dimple
        addRow('Swage', '0', '41'); 
        addRow('Dimple', '18.5');

        // 중간부 (NG 결합): Lip Cut + Dimple
        if (state.hasNG) {
            for (let i = 1; i <= ngCount; i++) {
                let pos = (len / (ngCount + 1)) * i;
                addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Dimple', pos.toFixed(1));
            }
        }

        // 끝부: Swage + Dimple
        addRow('Swage', (len - 41).toFixed(1), (len - 4).toFixed(1)); 
        addRow('Dimple', (len - 18.5).toFixed(1));
    } 
    
    else if (type === 'TP1') {
        el.partDesc.innerText = '상/하부 트랙 (2개)';
        addRow('Lip Cut', '0', '41'); addRow('Dimple', '18.5');
        let k = 1;
        while (gap * k < len - 25) {
            let pos = gap * k;
            addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
            addRow('Dimple', pos.toFixed(1));
            k++;
        }
        addRow('Lip Cut', (len - 41).toFixed(1), (len - 4).toFixed(1)); addRow('Dimple', (len - 18.5).toFixed(1));
    } 
    
    else if (type === 'NG1') {
        el.partDesc.innerText = state.hasNG ? `중간 지지대 (${state.ngCount}개)` : '미사용';
        if (!state.hasNG) {
            html = '<tr><td colspan="3" style="text-align:center; padding:40px; color:#B0B8C1;">NG 미사용</td></tr>';
        } else {
            addRow('Swage', '0', '41'); addRow('Dimple', '18.5');
            let k = 1;
            while (gap * k < len - 25) {
                let pos = gap * k;
                const start = (pos - 20.5).toFixed(1);
                const end = (pos + 20.5).toFixed(1);
                addRow('WebNotch', start, end);
                addRow('Lip Cut', start, end);
                addRow('Dimple', pos.toFixed(1));
                k++;
            }
            addRow('Swage', (len - 41).toFixed(1), (len - 4).toFixed(1)); addRow('Dimple', (len - 18.5).toFixed(1));
        }
    }
    el.tableBody.innerHTML = html;
}
