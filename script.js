// ===== THEME =====
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

if (themeToggle && html) {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  const applyTheme = (theme) => {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  };

  applyTheme(initialTheme);

  themeToggle.onclick = () => {
    const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  };
}

// ===== LANGUAGE DROPDOWN =====
const langToggle = document.getElementById("langToggle");
const langMenu = document.getElementById("langMenu");
const langItems = langMenu ? langMenu.querySelectorAll("li") : [];
const menuToggle = document.getElementById("menuToggle");
const controlStack = document.getElementById("controlStack");
let menuTimeout;

let currentLang = localStorage.getItem("lang") || "en";

const updateLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem("lang", currentLang);
  html.setAttribute("lang", currentLang);

  if (langToggle) {
    langToggle.textContent = currentLang.toUpperCase();
  }

  document.querySelectorAll("[data-en]").forEach((el) => {
    const nextText = el.dataset[currentLang];
    if (nextText) {
      el.textContent = nextText;
    }
  });
};

updateLanguage(currentLang);

// ===== MOBILE MENU (toggle controls) =====
const closeControlStack = () => {
  if (controlStack) {
    controlStack.classList.remove("open");
  }
  if (menuToggle) {
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  if (menuTimeout) {
    clearTimeout(menuTimeout);
    menuTimeout = null;
  }
};

if (menuToggle && controlStack) {
  menuToggle.onclick = (e) => {
    e.stopPropagation();
    const isOpen = controlStack.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    if (isOpen) {
      menuTimeout = setTimeout(() => closeControlStack(), 30000);
    } else {
      closeControlStack();
    }
  };

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".controls")) {
      closeControlStack();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeControlStack();
    }
  });
}

// Toggle menu
if (langToggle && langMenu) {
  langToggle.onclick = () => {
    if (controlStack && controlStack.classList.contains("open")) {
      // keep controls open while toggling languages
      menuToggle?.setAttribute("aria-expanded", "true");
    }
    const isOpen = langMenu.classList.toggle("show");
    langToggle.setAttribute("aria-expanded", isOpen);
  };

  // Select language
  langItems.forEach((item) => {
    const setLanguage = () => {
      updateLanguage(item.dataset.lang);
      langMenu.classList.remove("show");
      langToggle.setAttribute("aria-expanded", "false");
      langToggle.focus();
    };

    item.onclick = setLanguage;
    item.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setLanguage();
      }
    };
  });
}

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (langMenu && langToggle && !e.target.closest(".lang-selector")) {
    langMenu.classList.remove("show");
    langToggle.setAttribute("aria-expanded", "false");
  }
});

// Close menu with Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && langMenu && langMenu.classList.contains("show")) {
    langMenu.classList.remove("show");
    if (langToggle) {
      langToggle.setAttribute("aria-expanded", "false");
      langToggle.focus();
    }
  }
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach(el => observer.observe(el));
