// =============================
// TREINO - CONTROLADOR PRINCIPAL
// =============================

import { UI, Feedback, ExerciseCard, DashboardStats } from './ui.js';
import { Engine } from './engine.js';
import { Progress } from './progress.js';
import { getAdaptiveExercise } from './exercises.js';

// =============================
// UTIL
// =============================
function $(id) {
   return document.getElementById(id);
}

// =============================
// APP
// =============================
const App = {
   
   current: null,
   
   // =============================
   // INIT
   // =============================
   init() {
      this.newExercise();
      this.updateStats();
   },
   
   // =============================
   // NOVO EXERCÍCIO (FIXED)
   // =============================
   newExercise() {
      
      // 🔥 agora usa engine adaptativa
      this.current = getAdaptiveExercise(Progress);
      
      // render correto com componente
      UI.mount("exerciseContainer",
         ExerciseCard({
            question: this.current.question
         })
      );
   },
   
   // =============================
   // CHECK
   // =============================
   check() {
      
      const input = $("answer")?.value;
      const user = parseFloat(input);
      
      // validação
      if (isNaN(user)) {
         UI.mount("feedback",
            Feedback({ message: "Digite um número válido", type: "err" })
         );
         return;
      }
      
      const correct = this.current.solve(Engine);
      const ok = Math.abs(user - correct) < 0.1;
      
      // salva progresso
      Progress.update(this.current.type, ok);
      
      // feedback
      UI.mount("feedback",
         Feedback({
            message: ok ?
               "✔ Correto!" :
               `✖ Errado<br>${this.current.formula}`,
            type: ok ? "ok" : "err"
         })
      );
      
      this.animateCard(ok);
      this.updateStats();
   },
   
   // =============================
   // STATS (AGORA COMPONENTE)
   // =============================
   updateStats() {
      
      const p = Progress.load();
      
      UI.mount("statsContainer",
         DashboardStats({
            acc: Progress.accuracy(),
            total: p.total,
            correct: p.correct
         })
      );
   },
   
   // =============================
   // ANIMAÇÃO
   // =============================
   animateCard(ok) {
      
      const card = document.querySelector("#exerciseContainer .card");
      if (!card) return;
      
      card.classList.remove("success", "error");
      
      if (ok) {
         card.classList.add("success");
      } else {
         card.classList.add("error");
         
         setTimeout(() => {
            card.classList.remove("error");
         }, 400);
      }
   }
   
};

// =============================
// GLOBAL (onclick)
// =============================
window.newExercise = () => App.newExercise();
window.check = () => App.check();

// =============================
// START
// =============================
App.init();