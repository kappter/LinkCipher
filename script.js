let currentQuestionIndex = 0;
let responses = {};
let userCode = null;
let selectedRelationship = 'romantic';
let themeColor = '#2E6DB4';
let randomResponses2 = {};

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
    <div class="slider-container">
      <input type="range" id="answer-slider" name="answer" min="1" max="5" step="1" value="3" class="w-full">
      <div class="slider-markers">
        <div class="slider-marker left"></div>
        <div class="slider-marker middle"></div>
        <div class="slider-marker right"></div>
      </div>
      <div class="slider-labels">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
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
    const person1Responses = Object.keys(responses).length ? responses : { ...randomResponses2 };
    const person2Responses = Object.keys(randomResponses2).length ? randomResponses2 : { ...responses };
    return { links, disconnects, caveats, traumaDiff, valueDiff, t1, t2, v1, v2, person1Responses, person2Responses };
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
      datasets: [
        {
          label: 'Person 1',
          data: [data.t1, data.v1],
          backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`,
          borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          borderWidth: 1
        },
        {
          label: 'Person 2',
          data: [data.t2, data.v2],
          backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`,
          borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
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

function renderScatterChart(data) {
  const canvas = document.getElementById('visualization');
  console.log('Visualization element for Scatter Chart:', canvas);
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
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Person 1',
          data: [{ x: 'Trauma', y: data.t1 }, { x: 'Values', y: data.v1 }],
          backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`,
          borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          borderWidth: 1,
          pointRadius: 5
        },
        {
          label: 'Person 2',
          data: [{ x: 'Trauma', y: data.t2 }, { x: 'Values', y: data.v2 }],
          backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`,
          borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          borderWidth: 1,
          pointRadius: 5
        }
      ]
    },
    options: {
      scales: {
        x: {
          type: 'category',
          labels: ['Trauma', 'Values'],
          ticks: { color: textColor },
          grid: { color: textColor }
        },
        y: {
          beginAtZero: true,
          max: 50,
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
  console.log('Scatter Chart rendered with data:', JSON.stringify(data));
  return chart;
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

function renderClusteredComparison(data) {
  const canvas = document.getElementById('visualization');
  console.log('Visualization element for Clustered Comparison:', canvas);
  if (!canvas) {
    console.error('Visualization div not found');
    return;
  }
  canvas.innerHTML = '<canvas id="chart" width="600" height="400"></canvas>';
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
      datasets: [
        {
          label: 'Person 1',
          data: [data.t1, data.v1],
          backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`,
          borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          borderWidth: 1
        },
        {
          label: 'Person 2',
          data: [data.t2, data.v2],
          backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`,
          borderColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: textColor }
        },
        y: {
          beginAtZero: true,
          max: 50,
          ticks: { color: textColor },
          grid: { color: textColor }
        }
      },
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              label += context.raw;
              return label;
            }
          }
        }
      },
      backgroundColor: backgroundColor,
      indexAxis: 'y'
    }
  });
  console.log('Clustered Comparison rendered with data:', JSON.stringify(data));
  return chart;
}

function generateReport(code1, code2, result) {
  const now = new Date();
  const formattedDateTime = now.toLocaleString();
  const relationship = document.getElementById('relationship-select').value || selectedRelationship;
  
  const financialImpact = result.traumaDiff > 10 ? 'Potential misalignment in financial priorities due to differing life experiences.' : 'Likely alignment in financial priorities.';
  const healthImpact = result.valueDiff > 10 ? 'Differences in values may affect health-related decisions or stress levels.' : 'Shared values support aligned health decisions.';
  
  const traumaKeys = ['violence', 'divorce', 'neglect', 'illness', 'money', 'estrangement', 'addiction', 'death'];
  const valueKeys = ['trust', 'communication', 'conflict', 'religion', 'politics', 'resilience', 'extroversion', 'risk', 'empathy', 'tradition'];

  let traumaComparison = '';
  traumaComparison = traumaKeys.map(key => {
    const score1 = result.person1Responses[key] || 3;
    const score2 = result.person2Responses[key] || 3;
    const question = questions.find(q => q.id === key)?.text || key;
    return `<tr><td>${question}</td><td>${score1}</td><td>${score2}</td></tr>`;
  }).join('');
  traumaComparison += `<tr class="font-bold"><td>Total Trauma Score</td><td>${result.t1}</td><td>${result.t2}</td></tr>`;

  let valuesComparison = '';
  valuesComparison = valueKeys.map(key => {
    const score1 = result.person1Responses[key] || 3;
    const score2 = result.person2Responses[key] || 3;
    const question = questions.find(q => q.id === key)?.text || key;
    return `<tr><td>${question}</td><td>${score1}</td><td>${score2}</td></tr>`;
  }).join('');
  valuesComparison += `<tr class="font-bold"><td>Total Values Score</td><td>${result.v1}</td><td>${result.v2}</td></tr>`;

  const reportContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LinkCipher Talking Points</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        body { font-family: Arial, sans-serif; }
        .header {
          background-color: ${themeColor};
          background-image: url('logo.png');
          background-size: cover;
          background-position: center;
          position: relative;
          color: white;
          text-align: center;
          padding: 20px 0;
          height: 60px;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 1;
        }
        .header-content {
          position: relative;
          z-index: 2;
        }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        canvas { max-width: 600px; margin: auto; display: block; }
        .footer { position: fixed; bottom: 0; width: 100%; background-color: ${themeColor}; color: white; text-align: center; padding: 10px; font-size: 12px; }
      </style>
    </head>
    <body class="bg-gray-100 min-h-screen flex flex-col">
      <header class="header">
        <div class="header-content">
          <h1 class="text-xl font-bold">LinkCipher Talking Points</h1>
          <p class="text-sm">Generated on ${formattedDateTime}</p>
        </div>
      </header>
      <main class="container mx-auto p-4 flex-grow">
        <section class="bg-white p-6 rounded-lg shadow-lg mb-4">
          <h2 class="text-xl font-semibold mb-2">Overview</h2>
          <p><strong>Relationship Type:</strong> ${relationship.charAt(0).toUpperCase() + relationship.slice(1)}</p>
          <p><strong>Code 1 (Person 1):</strong> ${code1}</p>
          <p><strong>Code 2 (Person 2):</strong> ${code2}</p>
        </section>
        <section class="bg-white p-6 rounded-lg shadow-lg mb-4">
          <h2 class="text-xl font-semibold mb-2">Compatibility Summary</h2>
          <h3 class="text-lg font-medium">Links</h3>
          <p>${result.links}</p>
          <ul class="list-disc pl-5 mt-2">
            <li><strong>Finances:</strong> ${financialImpact}</li>
            <li><strong>Health:</strong> ${healthImpact}</li>
            <li><strong>Trauma Measurable:</strong> Person 1: ${result.t1}, Person 2: ${result.t2}</li>
            <li><strong>Values Measurable:</strong> Person 1: ${result.v1}, Person 2: ${result.v2}</li>
          </ul>
          <h3 class="text-lg font-medium mt-4">Disconnects</h3>
          <p>${result.disconnects}</p>
          <ul class="list-disc pl-5 mt-2">
            <li><strong>Finances:</strong> ${result.traumaDiff > 15 ? 'Significant differences may lead to financial disagreements.' : 'Minor differences may require occasional adjustments.'}</li>
            <li><strong>Health:</strong> ${result.valueDiff > 15 ? 'Value differences may cause health-related tensions.' : 'Minor value differences should be manageable.'}</li>
            <li><strong>Trauma Measurable Difference:</strong> ${result.traumaDiff}</li>
            <li><strong>Values Measurable Difference:</strong> ${result.valueDiff}</li>
          </ul>
          <h3 class="text-lg font-medium mt-4">Caveats</h3>
          <p>${result.caveats}</p>
          <ul class="list-disc pl-5 mt-2">
            <li><strong>Finances:</strong> ${result.traumaDiff > 10 || result.valueDiff > 10 ? 'Discuss financial goals to bridge gaps.' : 'Alignment supports shared financial planning.'}</li>
            <li><strong>Health:</strong> ${result.traumaDiff > 10 || result.valueDiff > 10 ? 'Monitor health impacts from differing experiences.' : 'Shared experiences support health alignment.'}</li>
            <li><strong>Trauma Consideration:</strong> Difference of ${result.traumaDiff} may ${result.traumaDiff > 10 ? 'require empathy' : 'be manageable'}</li>
            <li><strong>Values Consideration:</strong> Difference of ${result.valueDiff} may ${result.valueDiff > 10 ? 'need alignment' : 'be harmonious'}</li>
          </ul>
        </section>
        <section class="bg-white p-6 rounded-lg shadow-lg mb-4">
          <h2 class="text-xl font-semibold mb-2">Detailed Comparison of Scores</h2>
          <h3 class="text-lg font-medium">Trauma Comparison (Person 1 vs Person 2)</h3>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Person 1 Score</th>
                <th>Person 2 Score</th>
              </tr>
            </thead>
            <tbody>
              ${traumaComparison}
            </tbody>
          </table>
          <h3 class="text-lg font-medium mt-4">Values Comparison (Person 1 vs Person 2)</h3>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Person 1 Score</th>
                <th>Person 2 Score</th>
              </tr>
            </thead>
            <tbody>
              ${valuesComparison}
            </tbody>
          </table>
        </section>
        <section class="bg-white p-6 rounded-lg shadow-lg mb-4">
          <h2 class="text-xl font-semibold mb-2">Visualizations</h2>
          <h3 class="text-lg font-medium">Bar Chart</h3>
          <canvas id="bar-chart" width="400" height="300"></canvas>
          <h3 class="text-lg font-medium mt-4">Scatter Chart</h3>
          <canvas id="scatter-chart" width="400" height="300"></canvas>
          <h3 class="text-lg font-medium mt-4">Vertical Lines</h3>
          <canvas id="lines-chart" width="400" height="300"></canvas>
          <h3 class="text-lg font-medium mt-4">Clustered Comparison</h3>
          <canvas id="clustered-chart" width="600" height="400"></canvas>
          <h3 class="text-lg font-medium mt-4">Points Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Trauma Sum</th>
                <th>Values Sum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Person 1</td>
                <td>${result.t1}</td>
                <td>${result.v1}</td>
              </tr>
              <tr>
                <td>Person 2</td>
                <td>${result.t2}</td>
                <td>${result.v2}</td>
              </tr>
            </tbody>
          </table>
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
      <footer class="footer">
        © 2025 Ken Kapptie | For educational use only | All rights reserved | More tools like this
      </footer>
      <button class="no-print fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onclick="window.print()">Print Report</button>
      <script>
        const rgb = [${hexToRGB(themeColor).join(', ')}];
        const barChart = new Chart(document.getElementById('bar-chart'), {
          type: 'bar',
          data: {
            labels: ['Trauma', 'Values'],
            datasets: [
              {
                label: 'Person 1',
                data: [${result.t1}, ${result.v1}],
                backgroundColor: 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0.7)',
                borderColor: 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                borderWidth: 1
              },
              {
                label: 'Person 2',
                data: [${result.t2}, ${result.v2}],
                backgroundColor: 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0.3)',
                borderColor: 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: { beginAtZero: true, max: 50 },
              x: {}
            }
          }
        });
        const scatterChart = new Chart(document.getElementById('scatter-chart'), {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'Person 1',
                data: [{ x: 'Trauma', y: ${result.t1} }, { x: 'Values', y: ${result.v1} }],
                backgroundColor: 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0.7)',
                borderColor: 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                borderWidth: 1,
                pointRadius: 5
              },
              {
                label: 'Person 2',
                data: [{ x: 'Trauma', y: ${result.t2} }, { x: 'Values', y: ${result.v2} }],
                backgroundColor: 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0.3)',
                borderColor: 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                borderWidth: 1,
                pointRadius: 5
              }
            ]
          },
          options: {
            scales: {
              x: {
                type: 'category',
                labels: ['Trauma', 'Values'],
                ticks: {}
              },
              y: { beginAtZero: true, max: 50 }
            }
          }
        });
        const linesChart = new Chart(document.getElementById('lines-chart'), {
          type: 'line',
          data: {
            labels: ['You', 'Other'],
            datasets: [
              {
                label: 'Trauma',
                data: [${result.traumaDiff}, ${result.traumaDiff}],
                borderColor: 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                borderWidth: 2,
                pointRadius: 0,
                fill: false
              },
              {
                label: 'Values',
                data: [${result.valueDiff}, ${result.valueDiff}],
                borderColor: 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0.5)',
                borderWidth: 2,
                pointRadius: 0,
                fill: false
              }
            ]
          },
          options: {
            scales: {
              y: { beginAtZero: true, max: 30 },
              x: {}
            }
          }
        });
        const clusteredChart = new Chart(document.getElementById('clustered-chart'), {
          type: 'bar',
          data: {
            labels: ['Trauma', 'Values'],
            datasets: [
              {
                label: 'Person 1',
                data: [${result.t1}, ${result.v1}],
                backgroundColor: 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0.7)',
                borderColor: 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                borderWidth: 1
              },
              {
                label: 'Person 2',
                data: [${result.t2}, ${result.v2}],
                backgroundColor: 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', 0.3)',
                borderColor: 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: { beginAtZero: true, max: 50 },
              x: {}
            },
            indexAxis: 'y'
          }
        });
      </script>
    </body>
    </html>
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

document.getElementById('start-survey').addEventListener('click', () => {
  showScreen('survey-screen');
  renderQuestion();
});

document.getElementById('enter-codes').addEventListener('click', () => {
  showScreen('code-entry-screen');
  if (userCode) document.getElementById('code1').value = userCode;
});

document.getElementById('next-question').addEventListener('click', () => {
  const answer = document.getElementById('answer-slider');
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
  const traumaKeys = ['violence', 'divorce', 'neglect', 'illness', 'money', 'estrangement', 'addiction', 'death'];
  const valueKeys = ['trust', 'communication', 'conflict', 'religion', 'politics', 'resilience', 'extroversion', 'risk', 'empathy', 'tradition'];
  const targetInput = document.activeElement === document.getElementById('code1') ? 'code1' : 'code2';
  if (targetInput === 'code1') {
    responses = {};
    traumaKeys.forEach(key => responses[key] = Math.floor(Math.random() * 5) + 1);
    valueKeys.forEach(key => responses[key] = Math.floor(Math.random() * 5) + 1);
    userCode = generateCode(responses);
    document.getElementById('code1').value = userCode;
  } else {
    randomResponses2 = {};
    traumaKeys.forEach(key => randomResponses2[key] = Math.floor(Math.random() * 5) + 1);
    valueKeys.forEach(key => randomResponses2[key] = Math.floor(Math.random() * 5) + 1);
    const code2 = generateCode(randomResponses2);
    document.getElementById('code2').value = code2;
  }
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