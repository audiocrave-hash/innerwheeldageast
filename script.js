// Inner Wheel Club of Dagupan East – simple interactions

document.addEventListener("DOMContentLoaded", () => {
  // Current year in footer
  const yearEls = document.querySelectorAll("#year");
  const year = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = year;
  });

  // Mobile side menu toggle
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      toggle.textContent = sidebar.classList.contains("open") ? "✕" : "☰";
    });

    // Close menu when a nav link is clicked (mobile)
    sidebar.querySelectorAll(".nav-item").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          sidebar.classList.remove("open");
          toggle.textContent = "☰";
        }
      });
    });
  }
});
