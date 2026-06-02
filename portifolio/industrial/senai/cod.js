/**
 * CENTRAL METROLÓGICA V5.1 - ENTERPRISE CORE ENGINE (cod.js)
 * Motor Heurístico de Alta Performance para Indexação Industrial
 */

let historico = [];
let timeoutHistorico = null;

// Banco de Dados Industriais da Versão 5.1
const DATA_ISO_AJUSTES = [
    { classe: "H7", tipo: "Furo", min_dia: 10, max_dia: 18, es: "+0.018", ei: "0.000", aplicacao: "Polias, engrenagens padrão, guias precisas" },
    { classe: "H7", tipo: "Furo", min_dia: 18, max_dia: 30, es: "+0.021", ei: "0.000", aplicacao: "Polias, engrenagens padrão, guias precisas" },
    { classe: "g6", tipo: "Eixo", min_dia: 10, max_dia: 18, es: "-0.006", ei: "-0.017", aplicacao: "Peças deslizantes, eixos de máquinas livres" },
    { classe: "g6", tipo: "Eixo", min_dia: 18, max_dia: 30, es: "-0.007", ei: "-0.020", aplicacao: "Peças deslizantes, eixos de máquinas livres" },
    { classe: "h6", tipo: "Eixo", min_dia: 10, max_dia: 18, es: "0.000",  ei: "-0.011", aplicacao: "Ajuste fixo manual, acoplamentos diretos" },
    { classe: "js7", tipo: "Misto", min_dia: 10, max_dia: 30, es: "+0.010", ei: "-0.010", aplicacao: "Transições leves, posicionamento estático" }
];

const DATA_ROSCAS = [
    { bitola: "M3 x 0.5", tipo: "Métrica Fina/Média", broca: "2.5 mm", passo: "0.50 mm" },
    { bitola: "M4 x 0.7", tipo: "Métrica Fina/Média", broca: "3.3 mm", passo: "0.70 mm" },
    { bitola: "M5 x 0.8", tipo: "Métrica Fina/Média", broca: "4.2 mm", passo: "0.80 mm" },
    { bitola: "M6 x 1.0", tipo: "Métrica Normal",     broca: "5.0 mm", passo: "1.00 mm" },
    { bitola: "M8 x 1.25", tipo: "Métrica Normal",    broca: "6.8 mm", passo: "1.25 mm" },
    { bitola: "M10 x 1.5", tipo: "Métrica Normal",    broca: "8.5 mm", passo: "1.50 mm" },
    { bitola: "1/4\" UNC", tipo: "Polegada Fios",     broca: "5.1 mm", passo: "20 Fios/pol" },
    { bitola: "5/16\" UNC", tipo: "Polegada Fios",    broca: "6.6 mm", passo: "18 Fios/pol" },
    { bitola: "3/8\" UNC", tipo: "Polegada Fios",     broca: "8.0 mm", passo: "16 Fios/pol" }
];

const DATA_RUGOSIDADE = [
    { classe: "N1", ra_microns: "0.025 µm", triangulos: "▼▼▼▼", processo: "Super-acabamento, lapidação fina" },
    { classe: "N2", ra_microns: "0.05 µm",  triangulos: "▼▼▼▼", processo: "Lapidação industrial, brunimento extremo" },
    { classe: "N4", ra_microns: "0.2 µm",   triangulos: "▼▼▼",  processo: "Retífica fina, polimento espelhado" },
    { classe: "N6", ra_microns: "0.8 µm",   triangulos: "▼▼",   processo: "Torneamento/Fresamento fino, retífica" },
    { classe: "N8", ra_microns: "3.2 µm",   triangulos: "▼",    processo: "Usinagem comercial padrão, desbaste limpo" },
    { classe: "N10", ra_microns: "12.5 µm", triangulos: "Sem",  processo: "Oxicorte, fundição bruta, forjaria" }
];

window.onload = function() {
    popularCamposFracao();
    gerarTabelaEstrutural();
    gerarNovasTabelasV5();
    adaptarInterface();
    executarPesquisaHeuristica("");
};

function mudarTemaOS(nomeTema) {
    document.getElementById('app-body').className = nomeTema;
}

function mudarAba(id, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

function popularCamposFracao() {
    const iSel = document.getElementById('frac-int');
    const nSel = document.getElementById('frac-num');
    const dSel = document.getElementById('frac-den');
    if(!iSel || !nSel || !dSel) return;
    
    iSel.innerHTML = ""; nSel.innerHTML = ""; dSel.innerHTML = "";
    for(let i=0; i<=3; i++) iSel.innerHTML += `<option value="${i}">${i}"</option>`;
    for(let i=0; i<=64; i++) nSel.innerHTML += `<option value="${i}">${i === 0 ? '0 (inteiro)' : i}</option>`;
    [2, 4, 8, 16, 32, 64].forEach(d => dSel.innerHTML += `<option value="${d}">${d}</option>`);
    dSel.value = 16;
}

function mdc(a, b) { return b ? mdc(b, a % b) : a; }
function simplificar(n, d) { let g = mdc(n, d); return [n/g, d/g]; }

function gerarTabelaEstrutural() {
    const tbody = document.getElementById('table-rows');
    if(!tbody) return;
    let html = "";
    for(let i = 1; i < 64; i++) {
        let [n, d] = simplificar(i, 64);
        let dec = i / 64;
        html += `<tr><td>${n}/${d}"</td><td>${dec.toFixed(4)}"</td><td class="text-right">${(dec*25.4).toFixed(4)} mm</td></tr>`;
    }
    tbody.innerHTML = html;
}

function gerarNovasTabelasV5() {
    // Injeção de dados na tabela de roscas
    const tbodyRoscas = document.getElementById('table-roscas-rows');
    if(tbodyRoscas) {
        tbodyRoscas.innerHTML = DATA_ROSCAS.map(r => 
            `<tr><td><strong>${r.bitola}</strong></td><td>${r.tipo}</td><td>${r.passo}</td><td class="text-right" style="color:var(--primary); font-weight:bold;">${r.broca}</td></tr>`
        ).join('');
    }

    // Injeção de dados na tabela de ajustes ISO
    const tbodyAjustes = document.getElementById('table-ajustes-rows');
    if(tbodyAjustes) {
        tbodyAjustes.innerHTML = DATA_ISO_AJUSTES.map(a => 
            `<tr><td><mark style="background:var(--primary); color:#fff; padding:2px 6px; border-radius:3px;">${a.classe}</mark></td><td>${a.tipo}</td><td>${a.min_dia}-${a.max_dia} mm</td><td>ES: ${a.es} / EI: ${a.ei}</td><td>${a.aplicacao}</td></tr>`
        ).join('');
    }

    // Injeção de dados na tabela de rugosidade
    const tbodyRugosidade = document.getElementById('table-rugosidade-rows');
    if(tbodyRugosidade) {
        tbodyRugosidade.innerHTML = DATA_RUGOSIDADE.map(ru => 
            `<tr><td><strong>${ru.classe}</strong></td><td style="color:var(--secondary)">${ru.triangulos}</td><td>${ru.ra_microns}</td><td>${ru.processo}</td></tr>`
        ).join('');
    }
}

function adaptarInterface() {
    const mode = document.getElementById('unit-left').value;
    document.getElementById('box-numeric-left').style.display = (mode === 'in_frac') ? 'none' : 'block';
    document.getElementById('box-fraction-left').style.display = (mode === 'in_frac') ? 'flex' : 'none';
    calcularMetrologia();
}

function inverterUnidades() {
    const leftSel = document.getElementById('unit-left');
    const rightSel = document.getElementById('unit-right');
    const valRight = document.getElementById('val-right').value;
    
    let oldLeftUnit = leftSel.value;
    leftSel.value = rightSel.value;
    rightSel.value = oldLeftUnit;
    
    if (rightSel.value !== 'in_frac') {
        let parsedVal = parseFloat(valRight);
        if (!isNaN(parsedVal)) document.getElementById('val-left').value = parsedVal;
    }
    adaptarInterface();
}

function calcularMetrologia() {
    const uLeft = document.getElementById('unit-left').value;
    const uRight = document.getElementById('unit-right').value;
    const outField = document.getElementById('val-right');
    const memContent = document.getElementById('memorial-content');

    let polegadaDecimal = 0;
    let explicacao = "";

    if (uLeft === 'in_dec') {
        polegadaDecimal = parseFloat(document.getElementById('val-left').value) || 0;
    } else if (uLeft === 'mm') {
        let v = parseFloat(document.getElementById('val-left').value) || 0;
        polegadaDecimal = v / 25.4;
    } else if (uLeft === 'in_frac') {
        const i = parseInt(document.getElementById('frac-int').value) || 0;
        const n = parseInt(document.getElementById('frac-num').value) || 0;
        const d = parseInt(document.getElementById('frac-den').value) || 1;
        polegadaDecimal = i + (n / d);
    }

    let valorFinalStr = "";
    if (uRight === 'mm') valorFinalStr = (polegadaDecimal * 25.4).toFixed(4) + " mm";
    else if (uRight === 'in_dec') valorFinalStr = polegadaDecimal.toFixed(4) + " in";
    else {
        let pi = Math.floor(polegadaDecimal);
        let pf = polegadaDecimal - pi;
        let p64 = Math.round(pf * 64);
        if (p64 === 0) valorFinalStr = pi + '"';
        else {
            let [ns, ds] = simplificar(p64, 64);
            valorFinalStr = (pi > 0 ? pi + " " : "") + ns + "/" + ds + '"';
        }
    }

    outField.value = valorFinalStr;
    memContent.innerHTML = `• Cálculo processado via Engine V5.1.<br>• Equivalência absoluta detectada em: <code>${(polegadaDecimal*25.4).toFixed(4)} mm</code>`;
}

// ENGINE DE INTELIGÊNCIA ESTILO GOOGLE
function executarPesquisaHeuristica(valorBusca) {
    const painelResultados = document.getElementById('heuristic-results');
    const listaResultados = document.getElementById('heuristic-insights-list');
    let query = valorBusca.toLowerCase().trim().replace(',', '.');
    
    if (query === "") {
        listaResultados.innerHTML = `<div class="heuristic-card"><p><i class="fa-solid fa-bolt"></i> <strong>Engine Industrial Omnibox:</strong> Digite dados de brocas, classes N, roscas ou milímetros para correlação cruzada imediata.</p></div>`;
        filtrarTodasTabelas("");
        return;
    }

    let insights = [];

    // Busca Heurística em Roscas (Ex: se digitar "m6" ou "unc")
    DATA_ROSCAS.forEach(r => {
        if(r.bitola.toLowerCase().includes(query) || r.tipo.toLowerCase().includes(query)) {
            insights.push(`<div class="heuristic-card" style="border-left-color: #3498db">
                <h5><i class="fa-solid fa-screw-driver"></i> Linha de Fixadores (Rosca Coincidente)</h5>
                <p>Rosca: <strong>${r.bitola}</strong> (${r.tipo}) | Passo/Fios: <code>${r.passo}</code></p>
                <p>👉 <strong>Diâmetro da Broca de Pré-Furo:</strong> <strong style="color:var(--secondary)">${r.broca}</strong></p>
            </div>`);
        }
    });

    // Busca Heurística em Rugosidades (Ex: "n6", "lapidação")
    DATA_RUGOSIDADE.forEach(ru => {
        if(ru.classe.toLowerCase().includes(query) || ru.processo.toLowerCase().includes(query)) {
            insights.push(`<div class="heuristic-card" style="border-left-color: #e67e22">
                <h5><i class="fa-solid fa-wave-square"></i> Acabamento Superficial (Rugosidade Clássica)</h5>
                <p>Classe: <strong>${ru.classe}</strong> | Rugosidade Máxima Ra: <code>${ru.ra_microns}</code></p>
                <p>Simbologia Mecânica: <strong>${ru.triangulos}</strong> | Aplicação típica: <em>${ru.processo}</em></p>
            </div>`);
        }
    });

    // Filtro Heurístico nos Ajustes ISO
    DATA_ISO_AJUSTES.forEach(a => {
        if(a.classe.toLowerCase().includes(query) || a.aplicacao.toLowerCase().includes(query)) {
            insights.push(`<div class="heuristic-card" style="border-left-color: #2ecc71">
                <h5><i class="fa-solid fa-gears"></i> Ajuste e Tolerância Dinâmica ISO 286</h5>
                <p>Classe: <strong>${a.classe}</strong> (${a.tipo}) | Faixa: <code>${a.min_dia}-${a.max_dia} mm</code></p>
                <p>Afastamento Limite: <code>ES:${a.es} / EI:${a.ei} mm</code></p>
            </div>`);
        }
    });

    listaResultados.innerHTML = insights.length > 0 ? insights.join("") : `<div class="heuristic-card"><p>Nenhum insight direto para "${valorBusca}". Filtrando dados estruturais das matrizes abaixo...</p></div>`;
    
    filtrarTodasTabelas(query);
}

function filtrarTodasTabelas(filtro) {
    document.querySelectorAll('table tbody tr').forEach(row => {
        const txt = row.textContent.toLowerCase().replace(',', '.');
        row.classList.toggle('hide', !txt.includes(filtro));
    });
}
