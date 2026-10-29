// ============ AJUSTES QUE PUEDES CAMBIAR ============
// Cuando tengas el CV listo, guárdalo en assets/ y pon aquí su ruta, p. ej. "assets/CV-Aitana-Canto.pdf".
const CV_URL = null;
// Pega aquí la dirección de tu perfil, p. ej. "https://www.linkedin.com/in/tu-usuario/".
const LINKEDIN_URL = "https://www.linkedin.com/in/aitana-cant%C3%B3-rico-557204309/";
// Repositorios que ya sean públicos en GitHub: solo esos muestran el enlace en su proyecto.
const PUBLIC_REPOS = [
  "StreamingTransitForecasting",
  "AcademicPaperSearch",
  "BasementBand-MusicMashup",
  "Bookink-TiendaOnlineDeLibros",
  "EasyCab-Sistemas-Distribuidos",
  "ComputerVision-Labs",
  "NLP-Transformers-Labs",
  "CaminoMinimo-RamificacionYPoda",
];
const GITHUB_USER = "aitanacanto";
// ====================================================

const root = document.documentElement;

// Idioma
const titles = { es: "Aitana Cantó Rico · Portfolio", en: "Aitana Cantó Rico · Portfolio" };
function setLang(lang) {
  root.dataset.lang = lang;
  root.lang = lang;
  document.title = titles[lang];
  try { localStorage.setItem("lang", lang); } catch (_) {}
}
document.getElementById("lang-toggle").addEventListener("click", () => {
  setLang(root.dataset.lang === "es" ? "en" : "es");
  updateThemeLabel();
  updateMenuLabel();
});

// Menú en móvil: se abre con el botón y se cierra al elegir sección, con Esc o tocando fuera
const navBar = document.querySelector(".nav");
const menuBtn = document.getElementById("menu-toggle");
function updateMenuLabel() {
  const open = navBar.classList.contains("menu-open");
  menuBtn.setAttribute("aria-label", root.dataset.lang === "es"
    ? (open ? "Cerrar menú" : "Abrir menú")
    : (open ? "Close menu" : "Open menu"));
}
function setMenu(open) {
  navBar.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  updateMenuLabel();
}
menuBtn.addEventListener("click", () => setMenu(!navBar.classList.contains("menu-open")));
document.querySelectorAll(".nav nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
document.addEventListener("click", (e) => { if (!navBar.contains(e.target)) setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 900) setMenu(false); });
updateMenuLabel();

// Modo claro / oscuro: por defecto el del navegador; el botón lo cambia y lo recuerda
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const themeBtn = document.getElementById("theme-toggle");
const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");
function updateThemeLabel() {
  const now = currentTheme();
  root.dataset.themeNow = now;
  const toDark = now === "light";
  themeBtn.setAttribute("aria-label", root.dataset.lang === "es"
    ? (toDark ? "Cambiar a modo oscuro" : "Cambiar a modo claro")
    : (toDark ? "Switch to dark mode" : "Switch to light mode"));
  themeBtn.title = themeBtn.getAttribute("aria-label");
}
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  // Si coincide con el del navegador, se vuelve a seguir al navegador
  const followsSystem = next === (systemDark.matches ? "dark" : "light");
  try {
    if (followsSystem) localStorage.removeItem("theme");
    else localStorage.setItem("theme", next);
  } catch (_) {}
  if (followsSystem) delete root.dataset.theme;
  else root.dataset.theme = next;
  updateThemeLabel();
});
systemDark.addEventListener("change", updateThemeLabel);
updateThemeLabel();

// Foto: si todavía no existe, se queda el monograma
const portrait = document.getElementById("portrait-img");
portrait.addEventListener("error", () => portrait.remove());
if (portrait.complete && portrait.naturalWidth === 0) portrait.remove();

// CV y LinkedIn
if (CV_URL) {
  const cv = document.getElementById("cv-link");
  cv.href = CV_URL;
  cv.hidden = false;
}
if (LINKEDIN_URL) {
  document.getElementById("linkedin-link").href = LINKEDIN_URL;
  document.getElementById("linkedin-item").hidden = false;
}

// Enlaces a GitHub de los repos públicos
document.querySelectorAll(".repo-link").forEach((a) => {
  if (PUBLIC_REPOS.includes(a.dataset.repo)) {
    a.href = `https://github.com/${GITHUB_USER}/${a.dataset.repo}`;
    a.rel = "noopener";
    a.hidden = false;
  }
});

// TFG: alterna entre la versión corta y la larga en el mismo sitio
const tfgText = document.getElementById("tfg-text");
const tfgToggle = document.getElementById("tfg-toggle");
const tfgShort = document.getElementById("tfg-short");
const tfgLong = document.getElementById("tfg-long");
const tfgAside = document.getElementById("tfg-aside");
const tfgMrz = document.querySelector(".mrz");
tfgToggle.addEventListener("click", () => {
  const toLong = tfgText.dataset.view === "short";
  const [from, to] = toLong ? [tfgShort, tfgLong] : [tfgLong, tfgShort];
  from.classList.add("fading");
  tfgMrz.classList.add("fading");
  setTimeout(() => {
    // La MRZ acompaña al cambio: bajo los datos con el texto largo, bajo el texto con el corto
    (toLong ? tfgAside : tfgText).appendChild(tfgMrz);
    from.hidden = true;
    from.classList.remove("fading");
    to.classList.add("fading");
    to.hidden = false;
    tfgText.dataset.view = toLong ? "long" : "short";
    tfgToggle.setAttribute("aria-expanded", String(toLong));
    // Al volver a la corta, que el texto no se quede por encima de la pantalla
    if (!toLong && tfgText.getBoundingClientRect().top < 0) {
      tfgText.scrollIntoView({ block: "start" });
    }
    requestAnimationFrame(() => { to.classList.remove("fading"); tfgMrz.classList.remove("fading"); });
  }, 220);
});

// Visor: las imágenes se amplían en la propia página en vez de abrirse aparte
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-cap");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");
let lbGroup = [];
let lbIndex = 0;

function captionFor(link) {
  const cap = link.closest("figure").querySelector("figcaption");
  if (cap) return cap.innerText.trim();
  const title = link.closest(".project")?.querySelector("h3");
  return title ? title.innerText.trim() : "";
}
function showLightbox(i) {
  lbIndex = (i + lbGroup.length) % lbGroup.length;
  const link = lbGroup[lbIndex];
  lbImg.src = link.href;
  lbImg.alt = link.querySelector("img").alt;
  lbCap.textContent = captionFor(link);
  lbPrev.hidden = lbNext.hidden = lbGroup.length < 2;
}
document.querySelectorAll(".shot a, .project-media a, .photo-strip a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // Las imágenes de una misma galería o fila se recorren con las flechas
    const group = link.closest(".gallery, .photo-strip");
    lbGroup = group ? [...group.querySelectorAll("a")] : [link];
    showLightbox(lbGroup.indexOf(link));
    lightbox.showModal();
  });
});
document.getElementById("lb-close").addEventListener("click", () => lightbox.close());
lbPrev.addEventListener("click", () => showLightbox(lbIndex - 1));
lbNext.addEventListener("click", () => showLightbox(lbIndex + 1));
// Clic fuera de la imagen o de los botones: cerrar
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target.classList.contains("lb-figure")) lightbox.close();
});
lightbox.addEventListener("keydown", (e) => {
  if (lbGroup.length < 2) return;
  if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
});

// Borde de la barra al hacer scroll
const nav = document.querySelector(".nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

// Aparición suave de las secciones
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".project, .gallery, .more, .timeline, .side, .beyond-grid").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}
