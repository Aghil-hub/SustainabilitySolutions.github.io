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

  // Tab active state with content panel switching
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetTab = tab.dataset.tab;
      panels.forEach(panel => {
        const isTarget = panel.dataset.panel === targetTab;
        panel.classList.toggle("active", isTarget);
      });
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

  // Funding trends line chart using Chart.js
  const ctx = document.getElementById('fundingLineChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'UIUC',
            data: [48, 55, 61, 68, 72],
            borderColor: '#FF6A00',
            backgroundColor: 'rgba(255,106,0,0.2)',
            pointBorderColor: '#FF6A00',
            pointBackgroundColor: '#fff',
            tension: 0.3,
            pointRadius: 4
          },
          {
            label: 'UIC',
            data: [34, 39, 44, 49, 54],
            borderColor: '#D72638',
            backgroundColor: 'rgba(215,38,56,0.2)',
            pointBorderColor: '#D72638',
            pointBackgroundColor: '#fff',
            tension: 0.3,
            pointRadius: 4
          },
          {
            label: 'UIS',
            data: [12, 15, 18, 20, 23],
            borderColor: '#2A6FBB',
            backgroundColor: 'rgba(42,111,187,0.2)',
            pointBorderColor: '#2A6FBB',
            pointBackgroundColor: '#fff',
            tension: 0.3,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#e5e7eb' },
            grid: { color: 'rgba(31,41,55,0.3)' }
          },
          y: {
            ticks: { color: '#e5e7eb' },
            grid: { color: 'rgba(31,41,55,0.3)' },
            title: {
              display: true,
              text: 'Funding (Millions USD)',
              color: '#e5e7eb'
            }
          }
        },
        plugins: {
          legend: { labels: { color: '#e5e7eb' } },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#e5e7eb',
            font: {
              size: 12
            }
          }
        }
      }
    });
  }
});
