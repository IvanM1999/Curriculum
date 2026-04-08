import { Engine } from './engine.js';
import { Exercises } from './exercises.js';
import { Progress } from './progress.js';
import { UI } from './ui.js';

const App = {
   
   current: null,
   
   newExercise() {
      
import { getAdaptiveExercise } from './exercises.js';

this.current = getAdaptiveExercise(Progress, Exercises);

UI.question(this.current.question);
      UI.feedback("", "");
      UI.clearInput?.("answer");
      
      // foco automático
      document.getElementById("answer")?.focus();
   },
   
   check() {
      
      // proteção
      if (!this.current) {
         UI.feedback("Gere um exercício primeiro", "err");
         return;
      }
      
      const inputEl = document.getElementById("answer");
      const raw = inputEl.value;
      
      // validação
      if (!raw) {
         UI.feedback("Digite uma resposta", "err");
         return;
      }
      
      const user = parseFloat(raw);
      
      if (isNaN(user)) {
         UI.feedback("Valor inválido", "err");
         return;
      }
      
      const correct = this.current.solve(Engine);
      
      const ok = Math.abs(user - correct) < 0.1;
      
      Progress.update(this.current.type, ok);
      
      if (ok) {
         UI.feedback("✔ Correto!", "ok");
         
         // preparação futura (modo desafio)
         if (window.Challenge?.active) {
            window.Challenge.hit();
            setTimeout(() => this.newExercise(), 300);
         }
         
      } else {
         UI.feedback(
            `✖ Errado<br>${this.current.formula}`,
            "err"
         );
      }
      
      UI.animateCard(ok);
      this.updateStats();
   },
   
   updateStats() {
      
      const p = Progress.load();
      
      UI.stats({
         acc: parseFloat(Progress.accuracy()),
         total: p.total,
         correct: p.correct
      });
   }
   
};

// EVENTOS
window.newExercise = () => App.newExercise();
window.check = () => App.check();

// ENTER = responder
document.getElementById("answer")?.addEventListener("keydown", e => {
   if (e.key === "Enter") App.check();
});

// INIT
App.updateStats();