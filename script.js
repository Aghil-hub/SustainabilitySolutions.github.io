// Simple "Scroll to top" behavior
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("scrollTopBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Tab active state (no real routing here, just visual)
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // Optional: remove filter chips visually
  const chips = document.querySelectorAll(".chip-remove");
  chips.forEach(btn => {
    btn.addEventListener("click", () => {
      const chip = btn.closest(".filter-chip");
      if (chip) chip.remove();
    });
  });
});
