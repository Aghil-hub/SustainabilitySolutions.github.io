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
  const sdgData = {
    1: {
      title: 'SDG 1: No Poverty',
      color: '#e5243b',
      labels: ['Research on poverty', 'Proportion of students receiving financial aid', 'University anti-poverty programmes', 'Community anti-poverty programmes'],
      weights: ['27%', '27%', '23%', '23%'],
      scores: [72, 65, 58, 81]
    },
    2: {
      title: 'SDG 2: Zero Hunger',
      color: '#dda63a',
      labels: ['Research on hunger', 'Campus food waste', 'Student hunger', 'Proportion of graduates in agriculture/aquaculture', 'National hunger'],
      weights: ['27%', '15.4%', '19.2%', '19.2%', '19.2%'],
      scores: [68, 55, 74, 60, 50]
    },
    3: {
      title: 'SDG 3: Good Health and Well-being',
      color: '#4c9f38',
      labels: ['Research on health and well-being', 'Number graduating in health professions', 'Collaborations and health services'],
      weights: ['27%', '34.6%', '38.4%'],
      scores: [85, 78, 70]
    },
    4: {
      title: 'SDG 4: Quality Education',
      color: '#c5192d',
      labels: ['Research on early years and lifelong learning', 'Proportion of graduates with teaching qualification', 'Lifelong learning measures', 'Proportion of first-generation students'],
      weights: ['27%', '15.4%', '26.8%', '30.8%'],
      scores: [80, 62, 55, 70]
    },
    5: {
      title: 'SDG 5: Gender Equality',
      color: '#ff3a21',
      labels: ['Research on gender equality', 'Proportion of first-generation female students', 'Student access measures', 'Proportion of senior female academics', 'Proportion of women receiving degrees', "Women's progress measures"],
      weights: ['27%', '15.4%', '15.4%', '15.4%', '11.5%', '15.3%'],
      scores: [74, 68, 72, 60, 78, 65]
    },
    6: {
      title: 'SDG 6: Clean Water and Sanitation',
      color: '#26bde2',
      labels: ['Research on water', 'Water consumption per person', 'Water usage and care', 'Water reuse', 'Water in the community'],
      weights: ['27%', '19%', '23%', '12%', '19%'],
      scores: [70, 58, 65, 50, 62]
    },
    7: {
      title: 'SDG 7: Affordable and Clean Energy',
      color: '#fcc30b',
      labels: ['Research on clean energy', 'University measures towards clean energy', 'Energy use density', 'Energy and the community', 'Low-carbon energy use'],
      weights: ['27%', '23%', '17%', '23%', '10%'],
      scores: [88, 75, 68, 72, 60]
    },
    8: {
      title: 'SDG 8: Decent Work and Economic Growth',
      color: '#a21942',
      labels: ['Research on economic growth and employment', 'Employment practice', 'Expenditure per employee', 'Proportion of students taking work placements', 'Proportion of employees on secure contracts'],
      weights: ['27%', '19.6%', '15.4%', '19%', '19%'],
      scores: [77, 70, 65, 58, 80]
    },
    9: {
      title: 'SDG 9: Industry, Innovation and Infrastructure',
      color: '#fd6925',
      labels: ['Research on industry, innovation and infrastructure', 'Patents citing university research', 'University spin-offs', 'Research income from industry and commerce'],
      weights: ['11.6%', '15.4%', '34.6%', '38.4%'],
      scores: [90, 82, 75, 88]
    },
    10: {
      title: 'SDG 10: Reduced Inequalities',
      color: '#dd1367',
      labels: ['Research on reduced inequalities', 'First-generation students', 'International students from developing countries', 'Proportion of students with disabilities', 'Proportion of employees with disabilities', 'Measures against discrimination'],
      weights: ['27%', '15.5%', '15.5%', '11.5%', '11.5%', '19%'],
      scores: [72, 68, 60, 55, 52, 78]
    },
    11: {
      title: 'SDG 11: Sustainable Cities and Communities',
      color: '#fd9d24',
      labels: ['Research on sustainable cities and communities', 'Support of arts and heritage', 'Expenditure on arts and heritage', 'Sustainable practices'],
      weights: ['27%', '22.6%', '15.3%', '35.1%'],
      scores: [74, 80, 68, 77]
    },
    12: {
      title: 'SDG 12: Responsible Consumption and Production',
      color: '#bf8b2e',
      labels: ['Research on responsible consumption and production', 'Operational measures', 'Proportion of recycled waste', 'Publication of a sustainability report'],
      weights: ['27%', '26.7%', '27%', '19.3%'],
      scores: [70, 65, 58, 90]
    },
    13: {
      title: 'SDG 13: Climate Action',
      color: '#3f7e44',
      labels: ['Research on climate action', 'Low-carbon energy use', 'Environmental education measures', 'Commitment to carbon neutral university'],
      weights: ['27%', '27%', '23%', '23%'],
      scores: [85, 70, 75, 65]
    },
    14: {
      title: 'SDG 14: Life Below Water',
      color: '#0a97d9',
      labels: ['Research on life below water', 'Supporting aquatic ecosystems through education', 'Supporting aquatic ecosystems through action', 'Water sensitive waste disposal', 'Maintaining a local ecosystem'],
      weights: ['27%', '15.3%', '19.4%', '19.3%', '19%'],
      scores: [62, 55, 58, 70, 65]
    },
    15: {
      title: 'SDG 15: Life on Land',
      color: '#56c02b',
      labels: ['Research on land ecosystems', 'Supporting land ecosystems through education', 'Supporting land ecosystems through action', 'Land sensitive waste disposal'],
      weights: ['27%', '23%', '27%', '23%'],
      scores: [68, 60, 72, 65]
    },
    16: {
      title: 'SDG 16: Peace, Justice and Strong Institutions',
      color: '#00689d',
      labels: ['Research on peace and justice', 'University governance measures', 'Academic freedom and data', 'Proportion of graduates in law and civil enforcement'],
      weights: ['27%', '26.6%', '23%', '23.2%'],
      scores: [75, 80, 85, 60]
    },
    17: {
      title: 'SDG 17: Partnerships for the Goals',
      color: '#19486a',
      labels: ['Research into partnership for the goals', 'SDG collaboration measures', 'Publication of SDG reports', 'Education for SDGs'],
      weights: ['27%', '18.5%', '27.2%', '18.12%'],
      scores: [78, 70, 88, 65]
    }
  };

  function openSdgModal(sdgNumber) {
    const data = sdgData[sdgNumber];
    if (!data) return;

    modalTitle.textContent = `${data.title} — UIUC Performance`;
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (radarChartInstance) {
      radarChartInstance.destroy();
      radarChartInstance = null;
    }

    const ctx = document.getElementById('sdg-radar-chart').getContext('2d');
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
              padding: 20,
              callback: function(label, index) {
                const weight = data.weights ? data.weights[index] : null;
                const maxLen = 16;
                const weightStr = weight ? ` (wt - ${weight})` : '';
                if (label.length <= maxLen) return weightStr ? [label, weightStr] : label;
                const words = label.split(' ');
                const lines = [];
                let current = '';
                words.forEach(word => {
                  if ((current + ' ' + word).trim().length > maxLen) {
                    if (current) lines.push(current);
                    current = word;
                  } else {
                    current = (current + ' ' + word).trim();
                  }
                });
                if (current) lines.push(current);
                if (weightStr) lines.push(weightStr);
                return lines;
              }
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

  // ── Enhanced Interactive Comparative Analysis Chart ──
  
  // University comparison data for all 17 SDGs
  const universityComparativeData = {
    'all': {
      title: 'All SDGs Overview',
      labels: ['SDG 1', 'SDG 2', 'SDG 3', 'SDG 4', 'SDG 5', 'SDG 6', 'SDG 7', 'SDG 8', 'SDG 9', 'SDG 10', 'SDG 11', 'SDG 12', 'SDG 13', 'SDG 14', 'SDG 15', 'SDG 16', 'SDG 17']
    },
    '1': { title: 'SDG 1: No Poverty', labels: ['Research', 'Student Aid', 'Uni Programs', 'Community Programs'] },
    '2': { title: 'SDG 2: Zero Hunger', labels: ['Research', 'Food Waste', 'Student Hunger', 'Agriculture', 'National Hunger'] },
    '3': { title: 'SDG 3: Good Health', labels: ['Research', 'Health Professions', 'Collaborations'] },
    '4': { title: 'SDG 4: Quality Education', labels: ['Research', 'Teaching', 'Lifelong Learning', 'First-Gen'] },
    '5': { title: 'SDG 5: Gender Equality', labels: ['Research', 'Female Students', 'Access', 'Female Academics', 'Degrees', 'Progress'] },
    '6': { title: 'SDG 6: Clean Water', labels: ['Research', 'Consumption', 'Usage & Care', 'Reuse', 'Community'] },
    '7': { title: 'SDG 7: Clean Energy', labels: ['Research', 'Uni Measures', 'Energy Density', 'Community', 'Low-Carbon'] },
    '8': { title: 'SDG 8: Decent Work', labels: ['Research', 'Employment', 'Expenditure', 'Work Placements', 'Secure Contracts'] },
    '9': { title: 'SDG 9: Innovation', labels: ['Research', 'Patents', 'Spin-offs', 'Industry Income'] },
    '10': { title: 'SDG 10: Reduced Inequalities', labels: ['Research', 'First-Gen', 'International', 'Disabilities (S)', 'Disabilities (E)', 'Anti-Discrimination'] },
    '11': { title: 'SDG 11: Sustainable Cities', labels: ['Research', 'Arts Support', 'Arts Expenditure', 'Practices'] },
    '12': { title: 'SDG 12: Responsible Consumption', labels: ['Research', 'Operational', 'Recycling', 'Reports'] },
    '13': { title: 'SDG 13: Climate Action', labels: ['Research', 'Low-Carbon', 'Education', 'Carbon Neutral'] },
    '14': { title: 'SDG 14: Life Below Water', labels: ['Research', 'Education', 'Action', 'Waste Disposal', 'Ecosystems'] },
    '15': { title: 'SDG 15: Life on Land', labels: ['Research', 'Education', 'Action', 'Waste Disposal'] },
    '16': { title: 'SDG 16: Peace & Justice', labels: ['Research', 'Governance', 'Academic Freedom', 'Law Graduates'] },
    '17': { title: 'SDG 17: Partnerships', labels: ['Research', 'Collaboration', 'Reports', 'Education'] }
  };

  // University performance data
  const universityData = {
    'UIUC': {
      'all': [65.25, 58.3, 72.67, 62.75, 63.67, 54.0, 68.6, 64.0, 78.75, 58.17, 70.75, 65.75, 69.75, 55.0, 62.25, 70.0, 70.25],
      '1': [62, 55, 48, 71],
      '2': [58, 48, 64, 52, 44],
      '3': [76, 70, 62],
      '4': [72, 58, 50, 64],
      '5': [66, 60, 64, 54, 70, 58],
      '6': [62, 50, 58, 44, 54],
      '7': [80, 68, 62, 66, 54],
      '8': [70, 62, 59, 52, 72],
      '9': [84, 76, 69, 80],
      '10': [64, 60, 52, 48, 45, 70],
      '11': [66, 72, 60, 69],
      '12': [62, 58, 50, 82],
      '13': [77, 62, 68, 58],
      '14': [54, 48, 50, 62, 57],
      '15': [60, 52, 66, 58],
      '16': [67, 74, 78, 52],
      '17': [70, 62, 80, 57]
    },
    'ASU': {
      'all': [82.25, 78.3, 86.67, 79.75, 81.67, 75.0, 85.6, 83.0, 92.75, 76.17, 86.75, 82.75, 84.75, 72.0, 78.25, 85.0, 87.25],
      '1': [85, 78, 71, 92],
      '2': [80, 69, 85, 76, 65],
      '3': [94, 88, 82],
      '4': [90, 75, 68, 83],
      '5': [85, 81, 83, 73, 89, 78],
      '6': [82, 71, 78, 66, 76],
      '7': [97, 85, 80, 84, 72],
      '8': [88, 82, 78, 71, 92],
      '9': [99, 92, 86, 97],
      '10': [83, 79, 75, 67, 65, 89],
      '11': [85, 91, 79, 88],
      '12': [81, 76, 71, 99],
      '13': [94, 81, 85, 77],
      '14': [75, 69, 71, 83, 78],
      '15': [79, 75, 84, 77],
      '16': [86, 91, 95, 73],
      '17': [89, 83, 99, 78]
    },
    'MSU': {
      'all': [78.25, 73.3, 82.67, 75.75, 78.67, 70.0, 81.6, 79.0, 88.75, 72.17, 82.75, 79.75, 80.75, 68.0, 74.25, 81.0, 82.25],
      '1': [80, 73, 66, 89],
      '2': [76, 63, 82, 70, 59],
      '3': [90, 86, 78],
      '4': [86, 72, 65, 80],
      '5': [82, 78, 80, 70, 86, 75],
      '6': [79, 67, 74, 61, 72],
      '7': [93, 82, 76, 80, 68],
      '8': [85, 78, 74, 67, 88],
      '9': [96, 89, 83, 94],
      '10': [80, 76, 70, 64, 62, 86],
      '11': [82, 88, 76, 85],
      '12': [78, 74, 67, 96],
      '13': [91, 78, 82, 74],
      '14': [71, 65, 67, 80, 75],
      '15': [76, 71, 80, 74],
      '16': [83, 88, 92, 70],
      '17': [86, 80, 96, 75]
    },
    'Penn State': {
      'all': [72.25, 65.3, 78.67, 70.75, 73.67, 63.0, 76.6, 74.0, 84.75, 66.17, 78.75, 74.75, 75.75, 62.0, 68.25, 77.0, 77.25],
      '1': [78, 71, 64, 85],
      '2': [72, 59, 78, 66, 54],
      '3': [88, 82, 74],
      '4': [84, 70, 63, 76],
      '5': [80, 74, 76, 66, 82, 71],
      '6': [74, 62, 70, 56, 68],
      '7': [92, 80, 74, 78, 66],
      '8': [81, 74, 71, 62, 84],
      '9': [94, 87, 81, 92],
      '10': [78, 74, 68, 60, 58, 82],
      '11': [80, 86, 72, 81],
      '12': [74, 70, 64, 94],
      '13': [89, 76, 80, 70],
      '14': [66, 60, 64, 74, 71],
      '15': [74, 68, 78, 71],
      '16': [81, 86, 90, 66],
      '17': [84, 78, 94, 71]
    },
    'FIU': {
      'all': [70.25, 63.3, 76.67, 68.75, 71.67, 61.0, 74.6, 72.0, 82.75, 64.17, 76.75, 72.75, 73.75, 60.0, 66.25, 75.0, 75.25],
      '1': [74, 67, 60, 83],
      '2': [70, 57, 76, 64, 52],
      '3': [86, 80, 72],
      '4': [82, 68, 61, 74],
      '5': [78, 72, 74, 64, 80, 69],
      '6': [72, 60, 68, 54, 66],
      '7': [90, 78, 72, 76, 64],
      '8': [79, 72, 69, 60, 82],
      '9': [92, 85, 79, 90],
      '10': [76, 72, 66, 58, 56, 80],
      '11': [78, 84, 70, 79],
      '12': [72, 69, 62, 92],
      '13': [87, 74, 78, 68],
      '14': [64, 58, 62, 72, 69],
      '15': [72, 66, 76, 69],
      '16': [79, 84, 88, 64],
      '17': [82, 76, 92, 69]
    }
  };

  const universityColors = {
    'UIUC': '#16a34a',
    'ASU': '#1e40af',
    'MSU': '#7c3aed',
    'Penn State': '#db2777',
    'FIU': '#ea580c'
  };

  const sdgColors = {
    '1': '#e5243b',
    '2': '#dda63a',
    '3': '#4c9f38',
    '4': '#c5192d',
    '5': '#ff3a21',
    '6': '#26bde2',
    '7': '#fcc30b',
    '8': '#a21942',
    '9': '#fd6925',
    '10': '#dd1c3b',
    '11': '#f9a825',
    '12': '#bf8b2e',
    '13': '#407d46',
    '14': '#0a97d9',
    '15': '#56c596',
    '16': '#002868',
    '17': '#1b4b7c',
    'all': '#0f172a'
  };

  const sdgEmojis = {
    '1': '🙅',
    '2': '🍽️',
    '3': '💊',
    '4': '📚',
    '5': '👩',
    '6': '💧',
    '7': '⚡',
    '8': '💼',
    '9': '🏭',
    '10': '👥',
    '11': '🏙️',
    '12': '♻️',
    '13': '🌍',
    '14': '🐠',
    '15': '🌲',
    '16': '⚖️',
    '17': '🤝'
  };

  let comparisonChartInstance = null;
  const compareSelect = document.getElementById('compare-sdg-select');
  const universityCheckboxes = document.querySelectorAll('.university-checkbox');
  const comparisonCanvas = document.getElementById('comparison-radar-chart');
  const dynamicLegend = document.getElementById('dynamic-legend');
  const chartContainer = document.querySelector('.comparative-chart-container');
  const hoverTooltip = document.getElementById('hover-tooltip');

  // Close tooltip when mouse leaves chart container
  if (chartContainer) {
    chartContainer.addEventListener('mouseleave', () => {
      if (hoverTooltip) {
        hoverTooltip.style.display = 'none';
      }
    });
  }

  function getSelectedUniversities() {
    const selected = [];
    universityCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selected.push(checkbox.value);
      }
    });
    return selected;
  }

  function updateDynamicLegend(universities, sdgKey = 'all') {
    dynamicLegend.innerHTML = '';
    
    universities.forEach(uni => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.innerHTML = `
        <span class="legend-dot" style="background-color: ${universityColors[uni]};"></span>
        <span>${uni}</span>
      `;
      dynamicLegend.appendChild(legendItem);
    });
  }

  function createComparisonChart(sdgKey = 'all') {
    const chartConfig = universityComparativeData[sdgKey];
    const selectedUniversities = getSelectedUniversities();

    if (!chartConfig || selectedUniversities.length === 0) {
      if (comparisonChartInstance) {
        comparisonChartInstance.destroy();
        comparisonChartInstance = null;
      }
      return;
    }

    if (comparisonChartInstance) {
      comparisonChartInstance.destroy();
      comparisonChartInstance = null;
    }

    // Build datasets for selected universities
    const datasets = selectedUniversities.map(uni => {
      const color = universityColors[uni];
      const performanceData = universityData[uni][sdgKey] || [];
      
      // Parse RGB values from hex color for transparency
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return {
        label: uni,
        data: performanceData,
        borderColor: color,
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)`,
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        tension: 0.3
      };
    });

    const ctx = comparisonCanvas.getContext('2d');
    
    comparisonChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: chartConfig.labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'r',
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              color: '#9ca3af',
              font: { size: 11, weight: '500' },
              backdropColor: 'transparent',
              padding: 8
            },
            grid: {
              color: 'rgba(255,255,255,0.12)',
              drawBorder: true,
              borderColor: 'rgba(255,255,255,0.2)'
            },
            angleLines: {
              color: 'rgba(255,255,255,0.15)',
              lineWidth: 1
            },
            pointLabels: {
              color: '#e5e7eb',
              font: { size: 12, weight: '600' },
              padding: 12
            }
          }
        },
        plugins: {
          filler: { propagate: true },
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            borderColor: '#1f2937',
            borderWidth: 1,
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              title: (context) => {
                return context[0].label;
              },
              label: (context) => {
                return ` ${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        onHover: (event, activeElements) => {
          if (activeElements.length > 0 && event.native) {
            const activeElement = activeElements[0];
            const datasetIndex = activeElement.datasetIndex;
            const dataset = datasets[datasetIndex];
            const university = dataset.label;
            const labels = chartConfig.labels;

            hoverTooltip.innerHTML = '';
            
            // Add university header with color accent
            const headerItem = document.createElement('div');
            headerItem.style.cssText = `
              font-weight: 700;
              color: ${universityColors[university]};
              font-size: 12px;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid ${universityColors[university]};
              padding-bottom: 5px;
            `;
            headerItem.textContent = `${university}`;
            hoverTooltip.appendChild(headerItem);

            // Add all scores in compact 2-column grid format
            const scoresContainer = document.createElement('div');
            scoresContainer.style.cssText = `
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 5px;
              margin-bottom: 8px;
            `;

            dataset.data.forEach((score, idx) => {
              const label = labels[idx];
              const scoreItem = document.createElement('div');
              
              const hex = universityColors[university].replace('#', '');
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              
              scoreItem.style.cssText = `
                padding: 5px 6px;
                background-color: rgba(${r}, ${g}, ${b}, 0.2);
                border: 1px solid rgba(${r}, ${g}, ${b}, 0.5);
                border-radius: 3px;
                display: flex;
                flex-direction: column;
                gap: 2px;
                font-size: 10px;
              `;

              const scoreSpan = document.createElement('span');
              scoreSpan.style.cssText = `
                color: ${universityColors[university]};
                font-weight: 700;
                font-size: 10px;
                white-space: nowrap;
              `;
              scoreSpan.textContent = `${score}`;

              const labelSpan = document.createElement('span');
              labelSpan.style.cssText = 'color: #d1d5db; font-size: 9px; line-height: 1.1;';
              labelSpan.textContent = label;

              scoreItem.appendChild(scoreSpan);
              scoreItem.appendChild(labelSpan);
              scoresContainer.appendChild(scoreItem);
            });

            hoverTooltip.appendChild(scoresContainer);

            // Add average score with SDG logo styling
            const avgScore = (dataset.data.reduce((a, b) => a + b, 0) / dataset.data.length).toFixed(1);
            const avgItem = document.createElement('div');
            avgItem.style.cssText = `
              padding: 6px 8px;
              background: linear-gradient(135deg, ${universityColors[university]}, ${universityColors[university]}cc);
              border-radius: 3px;
              font-weight: 700;
              color: #fff;
              text-align: center;
              font-size: 10px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            `;
            avgItem.innerHTML = `⭐ Avg: <strong>${avgScore}/100</strong>`;
            hoverTooltip.appendChild(avgItem);

            // Position tooltip at cursor with boundary checking
            hoverTooltip.style.display = 'block';
            
            // Get tooltip dimensions after rendering
            const tooltipRect = hoverTooltip.getBoundingClientRect();
            const tooltipWidth = tooltipRect.width || 280;
            const tooltipHeight = tooltipRect.height || 300;
            
            let tooltipX = event.native.clientX + 15;
            let tooltipY = event.native.clientY + 15;
            
            // Keep tooltip within viewport (right edge)
            if (tooltipX + tooltipWidth > window.innerWidth - 10) {
              tooltipX = event.native.clientX - tooltipWidth - 15;
            }
            
            // Keep tooltip within viewport (bottom edge)
            if (tooltipY + tooltipHeight > window.innerHeight - 10) {
              tooltipY = event.native.clientY - tooltipHeight - 15;
            }
            
            // Ensure tooltip doesn't go off-screen (left edge)
            if (tooltipX < 10) {
              tooltipX = 10;
            }
            
            // Ensure tooltip doesn't go off-screen (top edge)
            if (tooltipY < 10) {
              tooltipY = 10;
            }
            
            hoverTooltip.style.left = tooltipX + 'px';
            hoverTooltip.style.top = tooltipY + 'px';
          } else {
            hoverTooltip.style.display = 'none';
          }
        }
      }
    });
    
    // Update the side legend with current SDG values
    updateDynamicLegend(selectedUniversities, sdgKey);
  }

  // Initialize chart on page load
  createComparisonChart('all');

  // Update chart when SDG selection changes
  if (compareSelect) {
    compareSelect.addEventListener('change', () => {
      createComparisonChart(compareSelect.value);
    });
  }

  // Update chart when universities are selected/deselected
  universityCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      createComparisonChart(compareSelect.value);
    });
  });
  
  // ── Funding Trends Line Chart ──
  const fundingCtx = document.getElementById('fundingLineChart');
  if (fundingCtx) {
    new Chart(fundingCtx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'UIUC',
            data: [48, 55, 61, 68, 72],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.85)',
            pointBorderColor: '#22c55e',
            pointBackgroundColor: '#fff',
            tension: 0.3,
            pointRadius: 4
          },
          {
            label: 'UIC',
            data: [34, 39, 44, 49, 54],
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96,165,250,0.85)',
            pointBorderColor: '#60a5fa',
            pointBackgroundColor: '#fff',
            tension: 0.3,
            pointRadius: 4
          },
          {
            label: 'UIS',
            data: [12, 15, 18, 20, 23],
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167,139,250,0.85)',
            pointBorderColor: '#a78bfa',
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
          legend: { labels: { color: '#e5e7eb' } }
        }
      }
    });
  }
});
