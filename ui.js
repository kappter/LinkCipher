function showScreen(screenId) {
  document.querySelectorAll('#main-content > div').forEach(div => div.classList.add('hidden'));
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.remove('hidden');
  } else {
    console.error(`Screen with ID ${screenId} not found`);
  }
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  document.getElementById('dark-mode-toggle').textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
  localStorage.setItem('darkMode', isDarkMode);
  if (currentChart) {
    const data = currentChart.data;
    currentChart.destroy();
    setTimeout(() => {
      if (currentView === 'bar') {
        currentChart = renderBarChart(data);
      } else if (currentView === 'scatter') {
        currentChart = renderScatterChart(data);
      } else if (currentView === 'lines') {
        currentChart = renderLinesView(data);
      } else if (currentView === 'clustered') {
        currentChart = renderClusteredComparison(data);
      }
    }, 100);
  }
}

document.getElementById('enter-codes').addEventListener('click', () => {
  showScreen('code-entry-screen');
  if (userCode) document.getElementById('code1').value = userCode;
});

let currentChart = null;
let currentView = 'bar';

document.getElementById('compare-codes').addEventListener('click', () => {
  const code1 = document.getElementById('code1').value;
  const code2 = document.getElementById('code2').value;
  const errorDiv = document.getElementById('code-error');
  errorDiv.classList.add('hidden');
  if (code1 && code2) {
    try {
      const result = compareCodes(code1, code2);
      showScreen('results-screen');
      document.getElementById('summary-text').innerHTML = `
        <p><strong>Links:</strong> ${result.links}</p>
        <p><strong>Disconnects:</strong> ${result.disconnects}</p>
        <p><strong>Caveats:</strong> ${result.caveats}</p>
      `;
      if (currentChart) {
        currentChart.destroy();
        currentChart = null;
      }
      currentView = 'bar';
      currentChart = renderBarChart(result);
      console.log('Initial Bar Chart render triggered');
      
      const viewElements = {
        'bar-view': () => {
          if (currentChart) currentChart.destroy();
          currentView = 'bar';
          currentChart = renderBarChart(result);
        },
        'scatter-view': () => {
          if (currentChart) currentChart.destroy();
          currentView = 'scatter';
          currentChart = renderScatterChart(result);
        },
        'lines-view': () => {
          if (currentChart) currentChart.destroy();
          currentView = 'lines';
          currentChart = renderLinesView(result);
        },
        'clustered-view': () => {
          if (currentChart) currentChart.destroy();
          currentView = 'clustered';
          currentChart = renderClusteredComparison(result);
        },
        'print-report': () => generateReport(code1, code2, result)
      };

      let missingElements = [];
      for (const [id, handler] of Object.entries(viewElements)) {
        const element = document.getElementById(id);
        if (element) {
          const clone = element.cloneNode(true);
          element.parentNode.replaceChild(clone, element);
          clone.addEventListener('click', handler);
        } else {
          missingElements.push(id);
        }
      }
      if (missingElements.length > 0) {
        console.error(`Missing view elements: ${missingElements.join(', ')}`);
      }
    } catch (e) {
      errorDiv.classList.remove('hidden');
      errorDiv.textContent = e.message;
    }
  } else {
    errorDiv.classList.remove('hidden');
    errorDiv.textContent = 'Please enter both codes.';
  }
});

document.getElementById('relationship-select').addEventListener('change', (e) => {
  selectedRelationship = e.target.value;
});

document.getElementById('theme-color').addEventListener('change', (e) => {
  themeColor = e.target.value;
  document.querySelector('header').style.backgroundColor = themeColor;
  document.querySelector('footer').style.backgroundColor = themeColor;
  document.querySelectorAll('button.bg-blue-500').forEach(btn => {
    btn.style.backgroundColor = themeColor;
    btn.classList.remove('bg-blue-500');
    btn.classList.add('bg-custom');
  });
  if (currentChart) {
    const data = currentChart.data;
    currentChart.destroy();
    setTimeout(() => {
      if (currentView === 'bar') {
        currentChart = renderBarChart(data);
      } else if (currentView === 'scatter') {
        currentChart = renderScatterChart(data);
      } else if (currentView === 'lines') {
        currentChart = renderLinesView(data);
      } else if (currentView === 'clustered') {
        currentChart = renderClusteredComparison(data);
      }
    }, 100);
  }
});

document.getElementById('dark-mode-toggle').addEventListener('click', (e) => {
  e.preventDefault();
  toggleDarkMode();
});

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('dark-mode-toggle').textContent = 'Toggle Light Mode';
}