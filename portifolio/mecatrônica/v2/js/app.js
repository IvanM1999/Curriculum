import { Engine } from './engine.js';
import { Exercises } from './exercises.js';
import { Progress } from './progress.js';
import { UI } from './ui.js';

const App = {
   
   current: null,
   
   newExercise() {
      const ex = Exercises[Math.floor(Math.random() * Exercises.length)];
      this.current = ex.generate();
      
      UI.question(this.current.question);
      UI.feedback("", "");
   },
   
   check() {
      const user = parseFloat(document.getElementById("answer").value);
      const correct = this.current.solve(Engine);
      
      const ok = Math.abs(user - correct) < 0.1;
      
      Progress.update(this.current.type, ok);
      
      if (ok) {
         UI.feedback("✔ Correto!", "ok");
      } else {
         UI.feedback(`✖ Errado<br>${this.current.formula}`, "err");
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

window.newExercise = () => App.newExercise();
window.check = () => App.check();

App.updateStats();