// =============================
// UI CORE (Render Engine)
// =============================
export const UI = {
  
  mount(id, html) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`UI.mount: elemento #${id} não encontrado`);
      return;
    }
    
    el.innerHTML = html;
  },
  
  append(id, html) {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.innerHTML += html;
  }
  
};

// =============================
// UTILIDADES
// =============================

// Escapa HTML (segurança básica)
function escapeHTML(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// =============================
// COMPONENTES BASE
// =============================

// CARD
export const Card = ({ title, content, className = "" }) => `
  <div class="card ${className}">
    ${title ? `<div class="title">${escapeHTML(title)}</div>` : ""}
    ${content || ""}
  </div>
`;

// BOTÃO
export const Button = ({
  text,
  action,
  type = "primary",
  full = false
}) => `
  <button 
    class="btn btn-${type} ${full ? "w-100" : ""}" 
    onclick="${action}"
  >
    ${escapeHTML(text)}
  </button>
`;

// INPUT
export const Input = ({
  id,
  placeholder = "",
  type = "text"
}) => `
  <input 
    id="${id}" 
    type="${type}"
    class="input" 
    placeholder="${escapeHTML(placeholder)}"
  >
`;

// FEEDBACK
export const Feedback = ({ message, type }) => `
  <div class="feedback-${type}">
    ${message}
  </div>
`;

// =============================
// COMPONENTES DE UI
// =============================

// PROGRESS BAR
export const ProgressBar = ({ value = 0 }) => {
  
  const safe = Math.max(0, Math.min(100, value));
  
  return `
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        style="width:${safe}%"
      ></div>
    </div>
  `;
};

// STATS CARD (reutilizável)
export const StatsCard = ({ title, value }) => `
  <div class="card">
    <div class="title">${escapeHTML(title)}</div>
    <h2>${value}</h2>
  </div>
`;

// BADGE (nível / medalha)
export const Badge = ({ text, type }) => `
  <span class="badge badge-${type}">
    ${escapeHTML(text)}
  </span>
`;

// =============================
// COMPONENTES COMPLEXOS
// =============================

// CARD DE EXERCÍCIO
export const ExerciseCard = ({ question }) => `
  <div class="card" id="exerciseCard">
    
    <div class="title">Exercício</div>

    <p>${question}</p>

    ${Input({
      id: "answer",
      placeholder: "Digite sua resposta"
    })}

    <div class="actions">
      ${Button({ text: "Verificar", action: "check()" })}
      ${Button({ text: "Novo", action: "newExercise()", type: "secondary" })}
    </div>

    <div id="feedback"></div>

  </div>
`;

// DASHBOARD RESUMO
export const DashboardStats = ({ acc, total, correct }) => `
  ${StatsCard({ title: "Aproveitamento", value: acc + "%" })}
  ${StatsCard({ title: "Total", value: total })}
  ${StatsCard({ title: "Acertos", value: correct })}
`;