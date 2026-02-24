// Lista de arquivos (ordenada em ordem alfabética)
const files = [
  "Certificado Code.org - Curso 1.pdf",
  "Certificado Code.org - Curso 2.pdf",
  "Certificado Code.org - Minecraft.pdf",
  "certificado_JavaScript.pdf",
  "certificado_Python.pdf",
  "documento-modelo.docx",
  "foto-campeonato.jpg",
  "imagem-exemplo.png"
];

const wrapper = document.getElementById("fileWrapper");
files.sort();

files.forEach(file => {
  const ext = file.split('.').pop().toLowerCase();
  const title = file.replace(/\.[^/.]+$/, "");
  let viewerHTML = "";

  if (ext === "pdf") {
    // PDF
    viewerHTML = `<iframe src="src/docs/certificado/${file}" title="${title}"></iframe>`;
  } else if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
    // Imagem
    viewerHTML = `<img src="src/docs/certificado/${file}" alt="${title}" title="${title}"/>`;
  } else if (["doc", "docx"].includes(ext)) {
    // Word via Office Viewer
    const fileURL = encodeURIComponent(
      window.location.origin + `/src/docs/certificado/${file}`
    );
    viewerHTML = `
      <iframe 
        src="https://view.officeapps.live.com/op/embed.aspx?src=${fileURL}" 
        title="${title}">
      </iframe>
    `;
  } else {
    // Fallback para download
    viewerHTML = `
      <div style="text-align:center; padding:50px 0;">
        <a href="src/docs/certificado/${file}" download>
          Baixar ${file}
        </a>
      </div>
    `;
  }

  const slide = document.createElement("div");
  slide.className = "swiper-slide";
  slide.innerHTML = `
    <div style="text-align:center; margin-bottom:10px; font-weight:bold;">
      ${title}
    </div>
    ${viewerHTML}
  `;
  wrapper.appendChild(slide);
});

// Inicializa o Swiper
new Swiper(".mySwiper", {
  loop: false,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  slidesPerView: 1,
  spaceBetween: 20,
  breakpoints: {
    640: { slidesPerView: 1 },
    1024: { slidesPerView: 2 }
  }
});