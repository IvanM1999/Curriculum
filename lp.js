// Animação suave da engrenagem
const gear = document.querySelector(".gear");

setInterval(() => {
  gear.style.transform = `rotate(${Date.now() / 50}deg)`;
}, 30);

// Efeito neon pulsante no texto
const neonText = document.querySelector(".neon");

setInterval(() => {
  neonText.classList.toggle("pulse");
}, 1200);

// Hover com brilho nos cards
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.classList.add("glow");
  });
  card.addEventListener("mouseleave", () => {
    card.classList.remove("glow");
  });
});