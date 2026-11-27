const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Reveal sections/cards as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Filter skill cards by category.
const filterButtons = document.querySelectorAll(".filter-btn");
const skillCards = document.querySelectorAll(".skill-card");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    skillCards.forEach((card) => {
      const show = selected === "all" || card.dataset.category === selected;
      card.classList.toggle("is-hidden", !show);
      if (show) card.classList.add("is-visible");
    });
  });
});

// Back-to-top control.
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}


// Rotating developer roles in the hero section.
const roleText = document.querySelector("#role-text");
if (roleText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const roles = ["PYTHON BACKEND DEVELOPER", "DJANGO & REST API DEVELOPER", "MACHINE LEARNING ENTHUSIAST"];
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  const typeRole = () => {
    const current = roles[roleIndex];
    if (deleting) { charIndex--; } else { charIndex++; }
    roleText.textContent = current.slice(0, charIndex);
    let delay = deleting ? 42 : 75;
    if (!deleting && charIndex === current.length) { deleting = true; delay = 1450; }
    else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 260; }
    window.setTimeout(typeRole, delay);
  };
  window.setTimeout(typeRole, 1800);
}

// Light/dark theme toggle; preference is kept for the current browser.
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  const savedTheme = localStorage.getItem("pratul-portfolio-theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");
  const updateThemeButton = () => {
    const light = document.body.classList.contains("light-theme");
    themeToggle.textContent = light ? "☾" : "☀";
    themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.title = light ? "Switch to dark theme" : "Switch to light theme";
  };
  updateThemeButton();
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("pratul-portfolio-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
    updateThemeButton();
  });
}

// Reading progress indicator.
const progressBar = document.querySelector("#scroll-progress");
const updateProgress = () => {
  if (!progressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// Highlight the navigation item for the section currently in view.
const observedSections = document.querySelectorAll("main section[id]");
const sectionLinks = document.querySelectorAll(".nav-links a[href^='#']");
if ("IntersectionObserver" in window && observedSections.length) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-28% 0px -58% 0px", threshold: 0 });
  observedSections.forEach((section) => activeObserver.observe(section));
}
