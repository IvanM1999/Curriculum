export const UI = {
   question(text) {
      document.getElementById("question").innerText = text;
   },
   
   feedback(text, type) {
      const el = document.getElementById("feedback");
      el.innerHTML = text;
      el.className = type === "ok" ? "feedback-ok" : "feedback-err";
   },
   
   stats({ acc, total, correct }) {
      document.getElementById("acc").innerText = acc + "%";
      document.getElementById("total").innerText = total;
      document.getElementById("correct").innerText = correct;
   },
   
   animateCard(ok) {
      const card = document.getElementById("exerciseCard");
      if (!card) return;
      
      card.classList.remove("success", "error");
      
      setTimeout(() => {
         card.classList.add(ok ? "success" : "error");
      }, 10);
   },
   
   clearInput(id) {
      document.getElementById(id).value = "";
   }
};