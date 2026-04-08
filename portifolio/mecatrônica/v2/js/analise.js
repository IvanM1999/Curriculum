import { parseCircuit } from './parser.js';
import { solveNodalWithSteps } from './engine.js';

const state = {
   lastResult: null
};

function showResult(result) {
   
   if (!result || result.error) {
      document.getElementById("output").innerText = "Erro no circuito";
      return;
   }
   
   document.getElementById("output").innerText =
      JSON.stringify(result.nodes, null, 2);
}

function showSteps(result) {
   
   if (!result) return;
   
   const div = document.getElementById("steps");
   
   let html = "<div class='title'>Passo a passo</div>";
   
   result.steps.forEach((s, i) => {
      html += `<p><b>Etapa ${i+1}:</b> ${s}</p>`;
   });
   
   div.innerHTML = html;
}

window.resolver = () => {
   
   const text = document.getElementById("input").value;
   
   try {
      const parsed = parseCircuit(text);
      const result = solveNodalWithSteps(parsed);
      
      state.lastResult = result;
      
      showResult(result);
      
   } catch (e) {
      document.getElementById("output").innerText =
         "Erro ao processar circuito";
   }
};

window.toggleSteps = () => {
   
   const div = document.getElementById("steps");
   
   if (!state.lastResult) return;
   
   const visible = div.style.display === "block";
   
   div.style.display = visible ? "none" : "block";
   
   if (!visible) {
      showSteps(state.lastResult);
   }
};