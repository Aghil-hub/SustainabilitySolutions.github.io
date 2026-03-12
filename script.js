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

  // ── SDG Radar Chart Modal — All 17 SDGs ──

  const modalOverlay = document.getElementById('sdg-modal-overlay');
  const modalCloseBtn = document.getElementById('sdg-modal-close');
  const modalTitle = document.getElementById('sdg-modal-title');
  let radarChartInstance = null;

  // Master data object for all 17 SDGs
  // labels = criterion names (spokes), scores = simulated UIUC performance (0–100)
  const sdgData = {
    1: {
      title: 'SDG 1: No Poverty',
      color: '#e5243b',
      labels: [
        'Research on poverty',
        'Students receiving financial aid',
        'University anti-poverty programmes',
        'Community anti-poverty programmes'
      ],
      scores: [72, 65, 58, 81]
    },
    2: {
      title: 'SDG 2: Zero Hunger',
      color: '#dda63a',
          weights: ['27%', '27%', '23%', '23%']
      labels: [
        'Research on hunger',
        'Campus food waste',
        'Student hunger',
        'Graduates in agriculture/aquaculture',
        'National hunger'
      ],
      scores: [68, 55, 74, 60, 50]
    },
    3: {
      title: 'SDG 3: Good Health and Well-being',
      color: '#4c9f38',
      labels: [
        'Research on health and well-being',
        'Graduates in health professions',
        'Collaborations and health services'
      ],
      scores: [85, 78, 70]
    },
    4: {
      title: 'SDG 4: Quality Education',
      color: '#c5192d',
      labels: [
        'Research on education',
        'Graduates with teaching qualification',
        'Lifelong learning measures',
        'First-generation students'
      ],
      scores: [80, 62, 55, 70]
    },
    5: {
      title: 'SDG 5: Gender Equality',
      color: '#ff3a21',
      labels: [
        'Research on gender equality',
        'First-generation female students',
        'Student access measures',
        'Senior female academics',
        'Women receiving degrees',
        "Women's progress measures"
      ],
      scores: [74, 68, 72, 60, 78, 65]
    },
    6: {
      title: 'SDG 6: Clean Water and Sanitation',
      color: '#26bde2',
      labels: [
        'Research on water',
        'Water consumption per person',
        'Water usage and care',
        'Water reuse',
        'Water in the community'
      ],
      scores: [70, 58, 65, 50, 62]
    },
    7: {
      title: 'SDG 7: Affordable and Clean Energy',
      color: '#fcc30b',
      labels: [
        'Research on clean energy',
        'University clean energy measures',
        'Energy use density',
        'Energy and the community',
        'Low-carbon energy use'
      ],
      scores: [88, 75, 68, 72, 60]
    },
    8: {
      title: 'SDG 8: Decent Work and Economic Growth',
      color: '#a21942',
      labels: [
        'Research on economic growth',
        'Employment practice',
        'Expenditure per employee',
        'Students taking work placements',
        'Employees on secure contracts'
      ],
      scores: [77, 70, 65, 58, 80]
    },
    9: {
      title: 'SDG 9: Industry, Innovation and Infrastructure',
      color: '#fd6925',
      labels: [
        'Research on industry & innovation',
        'Patents citing university research',
        'University spin-offs',
        'Research income from industry'
      ],
      scores: [90, 82, 75, 88]
    },
    10: {
      title: 'SDG 10: Reduced Inequalities',
      color: '#dd1367',
      labels: [
        'Research on reduced inequalities',
        'First-generation students',
        'Students from developing countries',
        'Students with disabilities',
        'Employees with disabilities',
        'Measures against discrimination'
      ],
      scores: [72, 68, 60, 55, 52, 78]
    },
    11: {
      title: 'SDG 11: Sustainable Cities and Communities',
      color: '#fd9d24',
      labels: [
        'Research on sustainable cities',
        'Support of arts and heritage',
        'Expenditure on arts and heritage',
        'Sustainable practices'
      ],
      scores: [74, 80, 68, 77]
    },
    12: {
      title: 'SDG 12: Responsible Consumption and Production',
      color: '#bf8b2e',
      labels: [
        'Research on responsible consumption',
        'Operational measures',
        'Proportion of recycled waste',
        'Publication of sustainability report'
      ],
      scores: [70, 65, 58, 90]
    },
    13: {
      title: 'SDG 13: Climate Action',
      color: '#3f7e44',
      labels: [
        'Research on climate action',
        'Low-carbon energy use',
        'Environmental education measures',
        'Commitment to carbon neutrality'
      ],
      scores: [85, 70, 75, 65]
    },
    14: {
      title: 'SDG 14: Life Below Water',
      color: '#0a97d9',
      labels: [
        'Research on life below water',
        'Aquatic ecosystems — education',
        'Aquatic ecosystems — action',
        'Water sensitive waste disposal',
        'Maintaining a local ecosystem'
      ],
      scores: [62, 55, 58, 70, 65]
    },
    15: {
      title: 'SDG 15: Life on Land',
      color: '#56c02b',
      labels: [
        'Research on land ecosystems',
        'Land ecosystems — education',
        'Land ecosystems — action',
        'Land sensitive waste disposal'
      ],
      scores: [68, 60, 72, 65]
    },
    16: {
      title: 'SDG 16: Peace, Justice and Strong Institutions',
      color: '#00689d',
      labels: [
        'Research on peace and justice',
        'University governance measures',
        'Academic freedom and data',
        'Graduates in law and civil enforcement'
      ],
      scores: [75, 80, 85, 60]
    },
    17: {
      title: 'SDG 17: Partnerships for the Goals',
      color: '#19486a',
      labels: [
        'Research on partnerships',
        'SDG collaboration measures',
        'Publication of SDG reports',
        'Education for SDGs'
      ],
      scores: [78, 70, 88, 65]
    }
  };

  function openSdgModal(sdgNumber) {
    const data = sdgData[sdgNumber];
    if (!data) return;

    // Update modal title
    modalTitle.textContent = `${data.title} — UIUC Performance`;

    // Show modal
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Destroy previous chart instance to prevent canvas reuse error
    if (radarChartInstance) {
      radarChartInstance.destroy();
      radarChartInstance = null;
    }

    const ctx = document.getElementById('sdg-radar-chart').getContext('2d');

    // Convert hex color to rgba for fill
    const hex = data.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const fillColor = `rgba(${r}, ${g}, ${b}, 0.35)`;

    radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'UIUC Score',
          data: data.scores,
          backgroundColor: fillColor,
          borderColor: data.color,
          borderWidth: 2,
          pointBackgroundColor: data.color,
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
            grid: { color: 'rgba(255,255,255,0.25)' },
            angleLines: { color: 'rgba(255,255,255,0.3)' },
            pointLabels: {
              color: '#e5e7eb',
              font: { size: 11 },
              padding: 16,
              callback: function(label, index) {
                const maxLen = 20;
                                // Get the weight percentage for this criterion
                const weight = data.weights && data.weights[index] ? ` (${data.weights[index]})` : '';
                if (label.length <= maxLen) return label + weight;
                                const words = label.split(' ');
                const lines = [];
                let current = '';
                words.forEach(word => {const words = label.split(' ');
                const lines = [];
                let current = '';
                    if (current) lines.push(current);
                    current = word;
                  } else {
                    current = (current + ' ' + word).trim();
                  }
                });
                if (current) lines.push(current);
                // Append weight to the last line
                if (lines.length > 0) lines[lines.length - 1] += weight;
                                    // Append percentage to each label line
                                    lines[lines.length - 1] += ` (${weight})`;
                return lines;              }
            }
          }
        },
        plugins: {
          legend: { display: false },
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

  // Attach click listeners to all 17 SDG cards
  for (let i = 1; i <= 17; i++) {
    const card = document.getElementById(`sdg-card-${i}`);
    if (card) {
      card.addEventListener('click', () => openSdgModal(i));
    }
  }

  // Close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSdgModal);
  }

  // Click outside modal to close
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeSdgModal();
    });
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
      closeSdgModal();
    }
  });
});
