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

  // ── SDG 1 Radar Chart Modal ──
  const sdgCard1 = document.getElementById('sdg-card-1');
  const modalOverlay = document.getElementById('sdg-modal-overlay');
  const modalCloseBtn = document.getElementById('sdg-modal-close');
  let radarChartInstance = null;

  // SDG 1 — No Poverty: criteria labels & simulated UIUC scores (out of 100)
  const sdg1Data = {
    labels: [
      'Research on poverty',
      'Students receiving financial aid',
      'University anti-poverty programmes',
      'Community anti-poverty programmes'
    ],
    // Simulated UIUC scores — replace with real data later
    scores: [72, 65, 58, 81]
  };

  function openSdgModal() {
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Destroy previous chart instance if it exists (prevent canvas reuse errors)
    if (radarChartInstance) {
      radarChartInstance.destroy();
      radarChartInstance = null;
    }

    const ctx = document.getElementById('sdg-radar-chart').getContext('2d');

    radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: sdg1Data.labels,
        datasets: [{
          label: 'UIUC Score',
          data: sdg1Data.scores,
          backgroundColor: 'rgba(229, 36, 59, 0.15)',   // SDG 1 red, semi-transparent fill
          borderColor: '#e5243b',                         // SDG 1 red border
          borderWidth: 2,
          pointBackgroundColor: '#e5243b',
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 25,
              color: '#9ca3af',
              font: { size: 10 },
              backdropColor: 'transparent'
            },
            grid: {
              color: 'rgba(255,255,255,0.08)'
            },
            angleLines: {
              color: 'rgba(255,255,255,0.1)'
            },
            pointLabels: {
              color: '#e5e7eb',
              font: { size: 11 },
              padding: 12
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Score: ${ctx.raw} / 100`
            }
          }
        }
      }
    });
  }

  function closeSdgModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (sdgCard1) {
    sdgCard1.addEventListener('click', openSdgModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSdgModal);
  }

  // Close when clicking the backdrop (outside the modal box)
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeSdgModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
      closeSdgModal();
    }
  });
});
