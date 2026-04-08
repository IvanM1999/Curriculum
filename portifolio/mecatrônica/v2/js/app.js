import { Engine } from './engine.js';
import { Exercises } from './exercises.js';
import { Progress } from './progress.js';

let current;

function newExercise() {
   const ex = Exercises[Math.floor(Math.random() * Exercises.length)];
   current = ex.generate();
   
   document.getElementById("q").innerText = current.question;
   document.getElementById("feedback").innerHTML = "";
   
   const card = document.querySelector(".card");
   card.classList.remove("success", "error");
}

function check() {
   const user = parseFloat(document.getElementById("a").value);
   const correct = current.solve(Engine);
   
   const card = document.querySelector(".card");
   
   const ok = Math.abs(user - correct) < 0.1;
   
   Progress.update(current.type, ok);
   
   if (ok) {
      document.getElementById("feedback").innerHTML =
         "<span class='feedback-ok'>✔ Correto!</span>";
      
      card.classList.remove("error");
      card.classList.add("success");
      
   } else {
      document.getElementById("feedback").innerHTML =
         `<span class='feedback-err'>✖ Errado<br>${current.formula}</span>`;
      
      card.classList.remove("success");
      card.classList.add("error");
      
      // remove shake depois
      setTimeout(() => card.classList.remove("error"), 400);
   }
   
   updateStats();
}

function updateStats() {
   document.getElementById("acc").innerText =
      Progress.accuracy() + "%";
}

window.newExercise = newExercise;
window.check = check;