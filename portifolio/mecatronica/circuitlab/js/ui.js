export const UI = {
   
   question(text) {
      document.getElementById("question").innerText = text;
   },
   
   feedback(text, type) {
      const el = document.getElementById("feedback");
      
      el.innerHTML = `<span class="feedback-${type}">${text}</span>`;
   },
   
   stats({ acc, total, correct }) {
      document.getElementById("acc").innerText = acc + "%";
      document.getElementById("total").innerText = total;
      document.getElementById("correct").innerText = correct;
      
      document.getElementById("progressFill").style.width = acc + "%";
   },
   
   animateCard(success) {
      const card = document.querySelector(".card:first-child");
      
      card.classList.remove("success", "error");
      
      if (success) {
         card.classList.add("success");
      } else {
         card.classList.add("error");
         setTimeout(() => card.classList.remove("error"), 400);
      }
   }
   
};