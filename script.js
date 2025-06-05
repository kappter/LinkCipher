let currentQuestionIndex = 0;
let responses = {};
let userCode = null;
let selectedRelationship = 'romantic';
let themeColor = '#2E6DB4';

function showScreen(screenId) {
  document.querySelectorAll('#main-content > div').forEach(div => div.classList.add('hidden'));
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.remove('hidden');
  } else {
    console.error(`Screen with ID ${screenId} not found`);
  }
}

function renderQuestion() {
  const question = questions[currentQuestionIndex];
  const container = document.getElementById('question-container');
  container.innerHTML = `
    <p class="mb-4">${question.text}</p>
    <div class="flex justify-between">
      ${[1, 2, 3, 4, 5].map(i => `
        <label class="spectrum-radio">
          <input type="radio" name="answer" value="${i}" class="mr-2">${i}
        </label>
      `).join('')}
    </div>
  `;
}

function generateCode(responses) {
  const traumaKeys = ['violence', 'divorce', 'neglect', 'illness', 'money', 'estrangement', 'addiction', 'death'];
  const valueKeys = ['trust', 'communication', 'conflict', 'religion', 'politics', 'resilience', 'extroversion', 'risk', 'empathy', 'tradition'];
  const traumaSum = traumaKeys.reduce((sum, key) => sum + (responses[key] || 3), 0);
  const valueSum = valueKeys.reduce((sum, key) => sum + (responses[key] || 3), 0);
  const now = new Date();
  const timestamp = `${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const traumaHex = traumaSum.toString(16).padStart(2, '0').toUpperCase();
  const valueHex = valueSum.toString(16).padStart(2, '0').toUpperCase();
  const code = `${traumaHex}${valueHex}${timestamp}`;
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

function isValidCode(code) {
  return /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
}

function compareCodes(code1, code2) {
  if (!isValidCode(code1) || !isValidCode(code2)) {
    throw new Error('Invalid code format');
  }
  try {
    const decodeSegment = (code) => {
      const hexPart = code.split('-')[0];
      const traumaSum = parseInt(hexPart.slice(0, 2), 16);
      const valueSum = parseInt(hexPart.slice(2, 4), 16);
      return { traumaSum, valueSum };
    };
    const { traumaSum: t1, valueSum: v1 } = decodeSegment(code1);
    const { traumaSum: t2, valueSum: v2 } = decodeSegment(code2);
    const traumaDiff = Math.abs(t1 - t2);
    const valueDiff = Math.abs(v1 - v2);
    const links = traumaDiff < 10 && valueDiff < 10 ? 'You share similar values and experiences.' : 'You have some alignment but may differ in key areas.';
    const disconnects = traumaDiff > 15 ? 'Significant differences in life experiences may require discussion.' : 'Minor differences in experiences exist.';
    const caveats = traumaDiff > 10 || valueDiff > 10 ? 'Open communication is key to bridge gaps.' : 'Few caveats; alignment is strong.';
    console.log('Decoded values:', { t1, v1, t2, v2, traumaDiff, valueDiff });
    return { links, disconnects, caveats, traumaDiff, valueDiff };
  } catch (e) {
    throw new Error('Invalid code format or decoding failed: ' + e.message);
  }
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function renderBarChart(data) {
  const canvas = document.getElementById('visualization');
  console.log('Visualization element for Bar Chart:', canvas);
  if (!canvas) {
    console.error('Visualization div not found');
    return;
  }
  canvas.innerHTML = '<canvas id="chart"></canvas>';
  const chartCanvas = document.getElementById('chart');
  console.log('Chart canvas element:', chartCanvas);
  if (!chartCanvas) {
    console.error('Chart canvas not found after creation');
    return;
  }
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }
  const rgb = hexToRGB(themeColor);
  const backgroundColor = document.body.classList.contains('dark-mode') ? '#333' : '#fff';
  const textColor = document.body.classList.contains('dark-mode') ? '#ccc' : '#333';
  const chart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: ['Trauma', 'Values'],
      datasets: [{
        label: 'Difference',
        data: [data.traumaDiff, data.valueDiff],
        backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`,
        borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 30,
          ticks: { color: textColor },
          grid: { color: textColor }
        },
        x: {
          ticks: { color: textColor },
          grid: { color: textColor }
        }
      },
      plugins: {
        legend: { labels: { color: textColor } }
      },
      backgroundColor: backgroundColor
    }
  });
  console.log('Bar Chart rendered with data:', JSON.stringify(data));
  return chart;
}

function renderVennDiagram(data) {
  const canvas = document.getElementById('visualization');
  console.log('Visualization element for Venn Diagram:', canvas);
  if (!canvas) {
    console.error('Visualization div not found');
    return;
  }
  const rgb = hexToRGB(themeColor);
  const textColor = document.body.classList.contains('dark-mode') ? '#ccc' : '#333';
  canvas.innerHTML = `
    <div class="venn-container">
      <div class="venn-circle venn-left" style="border-color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]});"></div>
      <div class="venn-circle venn-right" style="border-color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]});"></div>
      <div class="venn-overlap" style="color: ${textColor};">Overlap</div>
    </div>
  `;
  console.log('Venn Diagram rendered with data:', JSON.stringify(data));
  return null; // No Chart.js instance to return
}

function renderLinesView(data) {
  const canvas = document.getElementById('visualization');
  console.log('Visualization element for Vertical Lines:', canvas);
  if (!canvas) {
    console.error('Visualization div not found');
    return;
  }
  canvas.innerHTML = '<canvas id="chart"></canvas>';
  const chartCanvas = document.getElementById('chart');
  console.log('Chart canvas element:', chartCanvas);
  if (!chartCanvas) {
    console.error('Chart canvas not found after creation');
    return;
  }
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }
  const rgb = hexToRGB(themeColor);
  const backgroundColor = document.body.classList.contains('dark-mode') ? '#333' : '#fff';
  const textColor = document.body.classList.contains('dark-mode') ? '#ccc' : '#333';
  const chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: ['You', 'Other'],
      datasets: [
        {
          label: 'Trauma',
          data: [data.traumaDiff, data.traumaDiff],
          borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Values',
          data: [data.valueDiff, data.valueDiff],
          borderColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`,
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 30,
          ticks: { color: textColor },
          grid: { color: textColor }
        },
        x: {
          ticks: { color: textColor },
          grid: { color: textColor }
        }
      },
      plugins: {
        legend: { labels: { color: textColor } }
      },
      backgroundColor: backgroundColor
    }
  });
  console.log('Vertical Lines rendered with data:', JSON.stringify(data));
  return chart;
}

function generateReport(code1, code2, result) {
  const now = new Date();
  const formattedDateTime = now.toLocaleString();
  const relationship = document.getElementById('relationship-select').value || selectedRelationship;
  const reportContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width", initial-scale=1.0">
      <title>LinkCipher Talking Points</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        body { font-family: Arial, sans-serif; }
        .header { background-color: ${themeColor}; }
      </style>
    </head>
    <body class="bg-gray-100">
      <header class="header text-white text-center py-4">
        <h1 class="text-2xl font-bold">LinkCipher Talking Points</h1>
        <p>Generated on ${formattedDateTime}</p>
      </header>
      <main class="container mx-auto p-4">
        <section class="bg-white p-6 rounded-lg shadow-lg mb-4">
          <h2 class="text-xl font-semibold mb-2">Overview</h2>
          <p><strong>Relationship Type:</strong> ${relationship.charAt(0).toUpperCase() + relationship.slice(1)}</p>
          <p><strong>Code 1:</strong> ${code1}</p>
          <p><strong>Code 2:</strong> ${code2}</p>
        </section>
        <section class="bg-white p-6 rounded-lg shadow-lg mb-4">
          <h2 class="text-xl font-semibold mb-2">Compatibility Summary</h2>
          <h3 class="text-lg font-medium">Links</h3>
          <p>${result.links}</p>
          <h3 class="text-lg font-medium">Disconnects</h3>
          <p>${result.disconnects}</p>
          <h3 class="text-lg font-medium">Caveats</h3>
          <p>${result.caveats}</p>
        </section>
        <section class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-xl font-semibold mb-2">Discussion Points</h2>
          <ul class="list-disc pl-5">
            <li>Explore shared values and experiences to strengthen the relationship.</li>
            <li>Discuss areas of difference to understand potential challenges.</li>
            <li>Consider communication strategies to address identified caveats.</li>
          </ul>
        </section>
      </main>
      <button class="no-print fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onclick="window.print()">Print Report</button>
    </body>
  `;
  const blob = new Blob([reportContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LinkCipher_TalkingPoints_${formattedDateTime.replace(/[, :]/g, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  document.getElementById('dark-mode-toggle').textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
  localStorage.setItem('darkMode', isDarkMode);
  // Re-render the current chart if it exists
  if (currentChart) {
    const data = currentChart.data;
    currentChart.destroy();
    setTimeout(() => {
      if (currentView === 'bar') {
        currentChart = renderBarChart(data);
      } else if (currentView === 'lines') {
        currentChart = renderLinesView(data);
      }
    }, 100);
  }
}

document.getElementById('start-survey').addEventListener('click', () => {
  showScreen('survey-screen');
  renderQuestion();
});

document.getElementById('enter-codes').addEventListener('click', () => {
  showScreen('code-entry-screen');
  if (userCode) document.getElementById('code1').value = userCode;
});

document.getElementById('next-question').addEventListener('click', () => {
  const answer = document.querySelector('input[name="answer"]:checked');
  if (answer) {
    const question = questions[currentQuestionIndex];
    responses[question.id] = parseInt(answer.value);
    if (question.followUp && answer.value >= question.followUp.condition) {
      questions.splice(currentQuestionIndex + 1, 0, { id: question.followUp.key, text: question.followUp.text, followUp: null });
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      renderQuestion();
    } else {
      userCode = generateCode(responses);
      showScreen('code-entry-screen');
      document.getElementById('code1').value = userCode;
    }
  }
});

document.getElementById('skip-question').addEventListener('click', () => {
  responses[questions[currentQuestionIndex].id] = 3;
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
      renderQuestion();
  } else {
      userCode = generateCode(responses);
      showScreen('code-entry-screen');
      document.getElementById('code1').value = userCode;
  }
});

document.getElementById('random-code').addEventListener('click', () => {
  const randomResponses = {};
  questions.forEach(q => randomResponses[q.id] = Math.floor(Math.random() * 5) + 1);
  document.getElementById('code2').value = generateCode(randomResponses);
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
      setTimeout(() => {
        currentView = 'bar';
        currentChart = renderBarChart(result);
        console.log('Initial Bar Chart render triggered');
      }, 100);
      const barView = document.getElementById('bar-view');
      const vennView = document.getElementById('venn-view');
      const linesView = document.getElementById('lines-view');
      const printReport = document.getElementById('print-report');
      const barClone = barView.cloneNode(true);
      const vennClone = vennView.cloneNode(true);
      const linesClone = linesView.cloneNode(true);
      const printClone = printReport.cloneNode(true);
      barView.replaceWith(barClone);
      vennView.replaceWith(vennClone);
      linesView.replaceWith(linesClone);
      printReport.replaceWith(printClone);
      barClone.addEventListener('click', () => {
        if (currentChart) currentChart.destroy();
        currentView = 'bar';
        setTimeout(() => {
          currentChart = renderBarChart(result);
        }, 100);
      });
      vennClone.addEventListener('click', () => {
        if (currentChart) currentChart.destroy();
        currentView = 'venn';
        setTimeout(() => {
          currentChart = renderVennDiagram(result);
        }, 100);
      });
      linesClone.addEventListener('click', () => {
        if (currentChart) currentChart.destroy();
        currentView = 'lines';
        setTimeout(() => {
          currentChart = renderLinesView(result);
        }, 100);
      });
      printClone.addEventListener('click', () => generateReport(code1, code2, result));
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
  // Re-render the current chart if it exists
  if (currentChart) {
    const data = currentChart.data;
    currentChart.destroy();
    setTimeout(() => {
      if (currentView === 'bar') {
        currentChart = renderBarChart(data);
      } else if (currentView === 'venn') {
        currentChart = renderVennDiagram(data);
      } else if (currentView === 'lines') {
        currentChart = renderLinesView(data);
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