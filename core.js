/**
 * INTEGRATION ENGINE & ORCHESTRATOR (core.js)
 * Controlador de Renderização Responsiva Mobile-First e Filtros Relacionais
 */

window.addEventListener('DOMContentLoaded', () => {
    renderizarTodosModulosCards();
    document.getElementById('engine-omnibox').addEventListener('input', (e) => {
        executarVarreduraOmnibox(e.target.value);
    });
});

function mudarAbaAtiva(idAba, botao) {
    document.querySelectorAll('.data-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(idAba).classList.add('active');
    botao.classList.add('active');
}

function renderizarTodosModulosCards() {
    // Bloco 1: Usinagem
    const usTarget = document.getElementById('target-cards-usinagem');
    if(usTarget) {
        usTarget.innerHTML = BASE_USINAGEM.map(r => `
            <div class="industrial-card relative-card">
                <span class="badge-sector">${r.setor}</span>
                <div class="card-header-tech">${r.bitola}</div>
                <div class="tech-data-row">
                    <div class="data-item-box"><span class="data-item-title">Tipo Perfil</span><span class="data-item-value">${r.tipo}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Passo Nominal</span><span class="data-item-value">${r.passo}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Ø Menor Interno</span><span class="data-item-value">${r.d_menor}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Ø Broca Furo</span><span class="data-item-value" style="color:var(--primary);">${r.broca}</span></div>
                </div>
            </div>
        `).join('');
    }

    // Bloco 2: Tolerâncias
    const tolTarget = document.getElementById('target-cards-tolerancias');
    if(tolTarget) {
        tolTarget.innerHTML = BASE_TOLERANCIAS.map(a => `
            <div class="industrial-card relative-card">
                <span class="badge-sector">${a.setor}</span>
                <div class="card-header-tech">Classe ISO [ ${a.classe} ]</div>
                <div class="tech-data-row">
                    <div class="data-item-box"><span class="data-item-title">Elemento Alvo</span><span class="data-item-value">${a.tipo}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Afast. Superior</span><span class="data-item-value" style="color:var(--warning);">${a.es}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Afast. Inferior</span><span class="data-item-value" style="color:var(--warning);">${a.ei}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Acoplamento</span><span class="data-item-value">${a.acopl}</span></div>
                </div>
                <div class="data-item-desc"><strong>Aplicação Técnica:</strong> ${a.aplicacao}</div>
            </div>
        `).join('');
    }

    // Bloco 3: Eletrônica
    const elTarget = document.getElementById('target-cards-eletronica');
    if(elTarget) {
        elTarget.innerHTML = BASE_ELETRONICA.map(e => `
            <div class="industrial-card relative-card">
                <span class="badge-sector">${e.setor}</span>
                <div class="card-header-tech">${e.interface}</div>
                <div class="tech-data-row">
                    <div class="data-item-box"><span class="data-item-title">Família Sinal</span><span class="data-item-value">${e.tipo}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Níveis Físicos</span><span class="data-item-value" style="color:var(--secondary);">${e.niveis}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Impedância Z</span><span class="data-item-value">${e.impedancia}</span></div>
                </div>
                <div class="data-item-desc"><strong>Conduta em Malha:</strong> ${e.uso}</div>
            </div>
        `).join('');
    }

    // Bloco 4: Ultrassom
    const utTarget = document.getElementById('target-cards-ultrassom');
    if(utTarget) {
        utTarget.innerHTML = BASE_ULTRASSOM.map(u => `
            <div class="industrial-card relative-card">
                <span class="badge-sector">${u.setor}</span>
                <div class="card-header-tech">${u.material}</div>
                <div class="tech-data-row">
                    <div class="data-item-box"><span class="data-item-title">Vel. Longitudinal</span><span class="data-item-value" style="color:var(--success);">${u.v_long}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Vel. Transversal</span><span class="data-item-value">${u.v_trans}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Impedância Acústica</span><span class="data-item-value">${u.impedancia}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Atenuação</span><span class="data-item-value">${u.atenuacao}</span></div>
                </div>
            </div>
        `).join('');
    }

    // Bloco 5: Fundição
    const fundTarget = document.getElementById('target-cards-fundicao');
    if(fundTarget) {
        fundTarget.innerHTML = BASE_FUNDICAO.map(f => `
            <div class="industrial-card relative-card">
                <span class="badge-sector">${f.setor}</span>
                <div class="card-header-tech">${f.liga}</div>
                <div class="tech-data-row">
                    <div class="data-item-box"><span class="data-item-title">Taxa Contraç. Linear</span><span class="data-item-value" style="color:var(--secondary);">${f.contracao}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Temp. Vazamento</span><span class="data-item-value">${f.temp_vaz}</span></div>
                    <div class="data-item-box"><span class="data-item-title">Fluidez Relativa</span><span class="data-item-value">${f.fluidez}</span></div>
                </div>
                <div class="data-item-desc" style="color:var(--warning);"><strong>Defeito Comum:</strong> ${f.anomalias}</div>
            </div>
        `).join('');
    }
}

// ==========================================
// INTERCEPTOR COGNITIVO GLOBAL (HEURÍSTICA EM CARD BATCH)
// ==========================================
function executarVarreduraOmnibox(busca) {
    const painelNeural = document.getElementById('neural-box');
    const alvoInsights = document.getElementById('neural-insights-target');
    const query = busca.toLowerCase().trim().replace(',', '.');

    if (query === "") {
        painelNeural.style.display = "none";
        document.querySelectorAll('.tech-data-row > .industrial-card').forEach(c => c.classList.remove('hide'));
        return;
    }

    let insightsCoincidentes = [];

    // Cruzamentos Semânticos Heurísticos Rápidos para a Caixa Superior
    BASE_USINAGEM.filter(r => r.bitola.toLowerCase().includes(query)).forEach(r => {
        insightsCoincidentes.push(`<div class="neural-card">⚠️ <strong>Usinagem Direta:</strong> Rosca <strong>${r.bitola}</strong> requer broca de <strong>${r.broca}</strong> no pré-furo CNC.</div>`);
    });

    BASE_TOLERANCIAS.filter(t => t.classe.toLowerCase() === query).forEach(t => {
        insightsCoincidentes.push(`<div class="neural-card" style="border-left-color: var(--warning);">📏 <strong>Metrologia Fina:</strong> Campo ${t.classe} ([${t.faixa}]). Desvios: ES: ${t.es} | EI: ${t.ei}.</div>`);
    });

    BASE_ELETRONICA.filter(e => e.interface.toLowerCase().includes(query)).forEach(e => {
        insightsCoincidentes.push(`<div class="neural-card" style="border-left-color: var(--secondary);">⚡ <strong>Automação:</strong> Protocolo ${e.interface} opera em <code>${e.niveis}</code>.</div>`);
    });

    if (insightsCoincidentes.length > 0) {
        painelNeural.style.display = "block";
        alvoInsights.innerHTML = insightsCoincidentes.join('');
    } else {
        painelNeural.style.display = "none";
    }

    // Filtro imperativo estrutural de visibilidade dos cards inferiores
    document.querySelectorAll('.tech-data-row > .industrial-card').forEach(card => {
        const payloadTexto = card.textContent.toLowerCase().replace(',', '.');
        if (payloadTexto.includes(query)) {
            card.classList.remove('hide');
        } else {
            card.classList.add('hide');
        }
    });
}
