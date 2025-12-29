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
    tableBody: document.getElementById('resultTableBody'),
    btns: document.querySelectorAll('.part-btn')
};

// --- 입력 처리 ---
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

function calculateGap(L) {
    if (L <= 0) return 400;
    let x = 1;
    while (L / x > 450) x++;
    return L / x;
}

// --- 스마트 시각화 (레이어 순서 수정됨) ---
function updatePreview() {
    const wVal = state.width || 0;
    const hVal = state.height || 0;
    
    const container = document.getElementById('visualizerArea');
    const svgContainer = document.getElementById('svgContainer');
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    
    // 1. SVG 구조 초기 생성
    let svg = svgContainer.querySelector('svg');
    if (!svg) {
        const svgNS = "http://www.w3.org/2000/svg";
        svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        
        const createGroup = (id) => {
            const g = document.createElementNS(svgNS, "g");
            g.setAttribute("id", id);
            svg.appendChild(g);
            return g;
        };

        // ★★★ 순서 중요: 먼저 그린 게 아래에 깔림 ★★★
        const frameG = createGroup("mainFrame"); // 1. 흰색 배경 프레임 (가장 밑)
        createGroup("innerParts");              // 2. 내부 부품 (프레임 위)
        createGroup("dimTop");                  // 3. 치수선 (맨 위)
        createGroup("dimLeft");

        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("id", "frameRect");
        rect.setAttribute("fill", "white");
        rect.setAttribute("stroke", "#191F28");
        rect.setAttribute("stroke-width", "2");
        frameG.appendChild(rect);
        svgContainer.appendChild(svg);
    }

    if (wVal <= 0 || hVal <= 0) return;

    // 2. 스케일 및 좌표 계산
    const padding = 60; 
    const availableW = containerW - (padding * 2);
    const availableH = containerH - (padding * 2);
    const scale = Math.min(availableW / wVal, availableH / hVal);

    const drawW = wVal * scale;
    const drawH = hVal * scale;
    const startX = (containerW - drawW) / 2;
    const startY = (containerH - drawH) / 2;

    // 3. 메인 프레임 업데이트
    const rect = document.getElementById("frameRect");
    rect.setAttribute("x", startX);
    rect.setAttribute("y", startY);
    rect.setAttribute("width", drawW);
    rect.setAttribute("height", drawH);

    // 4. 내부 부품 그리기
    const innerGroup = document.getElementById("innerParts");
    innerGroup.innerHTML = ''; 
    const svgNS = "http://www.w3.org/2000/svg";
    const gap = state.autoGap ? calculateGap(wVal) : (state.manualGap || 400);

    // ST2 (점선)
    const st2Cnt = Math.floor(wVal / gap);
    for (let i = 1; i < st2Cnt; i++) {
        const xPos = startX + (gap * i * scale);
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", xPos); line.setAttribute("y1", startY);
        line.setAttribute("x2", xPos); line.setAttribute("y2", startY + drawH);
        line.setAttribute("stroke", "#D1D6DB");
        line.setAttribute("stroke-dasharray", "4,3");
        innerGroup.appendChild(line);
    }

    // NG (파란 실선)
    if (state.hasNG) {
        for (let i = 1; i <= state.ngCount; i++) {
            const yPos = startY + ((drawH / (state.ngCount + 1)) * i);
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", startX); line.setAttribute("y1", yPos);
            line.setAttribute("x2", startX + drawW); line.setAttribute("y2", yPos);
            line.setAttribute("stroke", "#3182F6");
            line.setAttribute("stroke-width", "1.5");
            innerGroup.appendChild(line);
        }
    }

    // 5. 치수선 업데이트
    const updateDim = (groupId, x1, y1, x2, y2, val, isVert) => {
        const g = document.getElementById(groupId);
        g.innerHTML = ''; 

        // 선
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1); line.setAttribute("y1", y1);
        line.setAttribute("x2", x2); line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#8B95A1"); line.setAttribute("stroke-width", "1");
        g.appendChild(line);

        // Tick Marks
        const tSz = 5;
        const tick1 = document.createElementNS(svgNS, "line");
        const tick2 = document.createElementNS(svgNS, "line");
        if(isVert) {
            tick1.setAttribute("x1", x1-tSz); tick1.setAttribute("x2", x1+tSz); tick1.setAttribute("y1", y1); tick1.setAttribute("y2", y1);
            tick2.setAttribute("x1", x2-tSz); tick2.setAttribute("x2", x2+tSz); tick2.setAttribute("y1", y2); tick2.setAttribute("y2", y2);
        } else {
            tick1.setAttribute("x1", x1); tick1.setAttribute("x2", x1); tick1.setAttribute("y1", y1-tSz); tick1.setAttribute("y2", y1+tSz);
            tick2.setAttribute("x1", x2); tick2.setAttribute("x2", x2); tick2.setAttribute("y1", y2-tSz); tick2.setAttribute("y2", y2+tSz);
        }
        tick1.setAttribute("stroke", "#8B95A1"); tick2.setAttribute("stroke", "#8B95A1");
        g.appendChild(tick1); g.appendChild(tick2);

        // 텍스트
        const text = document.createElementNS(svgNS, "text");
        const cx = (x1+x2)/2, cy = (y1+y2)/2;
        text.setAttribute("x", cx); text.setAttribute("y", cy);
        text.setAttribute("text-anchor", "middle"); text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("font-size", "12"); text.setAttribute("font-weight", "700"); text.setAttribute("fill", "#4E5968");
        
        text.style.stroke = "#F9FAFB"; text.style.strokeWidth = "6px"; text.style.paintOrder = "stroke";

        if(isVert) {
            text.setAttribute("transform", `rotate(-90, ${cx}, ${cy})`);
            text.setAttribute("y", cy - 4);
        } else {
            text.setAttribute("y", cy + 1);
        }
        text.textContent = val;
        g.appendChild(text);
    };

    const offset = 25;
    updateDim("dimTop", startX, startY - offset, startX + drawW, startY - offset, `${wVal}`, false);
    updateDim("dimLeft", startX - offset, startY + drawH, startX - offset, startY, `${hVal}`, true);
}

// --- 모달 & 테이블 로직 ---
function openModal() {
    if (!state.width || !state.height) return alert("가로, 세로를 입력해주세요.");
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
    renderTable();
}

function renderTable() {
    const type = state.currentPart;
    const len = (type.includes('ST')) ? state.height : state.width;
    const gap = state.calculatedGap;
    
    document.getElementById('displayPartName').innerText = type;
    document.getElementById('displayStickLen').innerText = `${(len - 4).toLocaleString()} mm`;
    
    let makeCount = 2;
    if (type === 'ST2') makeCount = state.st2Count;
    if (type === 'NG1') makeCount = state.hasNG ? state.ngCount : 0;
    document.getElementById('displayMakeCount').innerText = `${makeCount} 개`;

    let html = '';
    
    // 헬퍼 함수 수정
    const addRow = (label, v1, v2 = null) => {
        if (v2 !== null) {
            html += `<tr><td class="data-key">${label}</td><td class="data-value">${v1}</td><td class="data-value">${v2}</td></tr>`;
        } else {
            // 병합된 셀 클래스 변경: data-value-merged
            html += `<tr><td class="data-key">${label}</td><td colspan="2" class="data-value-merged">${v1}</td></tr>`;
        }
    };

    // --- 이하 부품별 데이터 로직은 동일 ---
    if (type === 'ST1' || type === 'ST2') {
        addRow('Swage', '0', '41'); 
        addRow('Dimple', '18.5');
        if (state.hasNG) {
            for (let i = 1; i <= state.ngCount; i++) {
                let pos = (len / (state.ngCount + 1)) * i;
                addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Dimple', pos.toFixed(1));
            }
        }
        addRow('Swage', (len - 41).toFixed(1), (len - 4).toFixed(1)); 
        addRow('Dimple', (len - 18.5).toFixed(1));
    } else if (type === 'TP1') {
        addRow('Lip Cut', '0', '41'); 
        addRow('Dimple', '18.5');
        let k = 1;
        while (gap * k < len - 25) {
            let pos = gap * k;
            addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
            addRow('Dimple', pos.toFixed(1));
            k++;
        }
        addRow('Lip Cut', (len - 41).toFixed(1), (len - 4).toFixed(1)); 
        addRow('Dimple', (len - 18.5).toFixed(1));
    } else if (type === 'NG1') {
        if (!state.hasNG) html = '<tr><td colspan="3" style="text-align:center; padding:40px;">NG 미사용</td></tr>';
        else {
            addRow('Swage', '0', '41'); 
            addRow('Dimple', '18.5');
            let k = 1;
            while (gap * k < len - 25) {
                let pos = gap * k;
                addRow('WebNotch', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Dimple', pos.toFixed(1));
                k++;
            }
            addRow('Swage', (len - 41).toFixed(1), (len - 4).toFixed(1)); 
            addRow('Dimple', (len - 18.5).toFixed(1));
        }
    }
    el.tableBody.innerHTML = html;
}
