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
  const timestamp = `${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`; // Use MMSS for brevity
  const traumaHex = traumaSum.toString(16).padStart(2, '0').toUpperCase(); // e.g., 15 -> "0F"
  const valueHex = valueSum.toString(16).padStart(2, '0').toUpperCase(); // e.g., 20 -> "14"
  const code = `${traumaHex}${valueHex}${timestamp}`; // e.g., "0F143252" for traumaSum=15, valueSum=20, MMSS=3252
  return `${code.slice(0, 4)}-${code.slice(4)}`; // e.g., "0F14-3252"
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
      const hexPart = code.split('-')[0]; // First 4 chars: traumaHex + valueHex
      const traumaSum = parseInt(hexPart.slice(0, 2), 16); // First 2 chars as hex
      const valueSum = parseInt(hexPart.slice(2, 4), 16); // Next 2 chars as hex
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
  if (typeof p5 === 'undefined') {
    console.error('p5.js is not loaded');
    return;
  }
  new p5(sketch => {
    sketch.setup = () => {
      sketch.createCanvas(400, 300).parent('chart');
      sketch.background(document.body.classList.contains('dark-mode') ? 50 : 255);
      const rgb = hexToRGB(themeColor);
      sketch.fill(...rgb);
      if (!isNaN(data.traumaDiff) && !isNaN(data.valueDiff)) {
        sketch.rect(50, 200 - data.traumaDiff * 5, 80, data.traumaDiff * 5);
        sketch.rect(150, 200 - data.valueDiff * 5, 80, data.valueDiff * 5);
      } else {
        console.error('Invalid data for Bar Chart:', data);
      }
      sketch.fill(document.body.classList.contains('dark-mode') ? 200 : 0);
      sketch.text('Trauma', 50, 220);
      sketch.text('Values', 150, 220);
      console.log('Bar Chart rendered with data:', JSON.stringify(data));
    };
  }, chartCanvas);
}

function renderVennDiagram(data) {
  const canvas = document.getElementById('visualization');
  console.log('Visualization element for Venn Diagram:', canvas);
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
  if (typeof p5 === 'undefined') {
    console.error('p5.js is not loaded');
    return;
  }
  new p5(sketch => {
    sketch.setup = () => {
      sketch.createCanvas(400, 300).parent('chart');
      sketch.background(document.body.classList.contains('dark-mode') ? 50 : 255);
      const rgb = hexToRGB(themeColor);
      sketch.noFill();
      sketch.stroke(...rgb);
      sketch.ellipse(150, 150, 100, 100);
      sketch.ellipse(250, 150, 100, 100);
      sketch.fill(150);
      sketch.ellipse(200, 150, 100, 100);
      sketch.fill(document.body.classList.contains('dark-mode') ? 200 : 0);
      sketch.text('Overlap', 180, 150);
      console.log('Venn Diagram rendered with data:', JSON.stringify(data));
    };
  }, chartCanvas);
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
  if (typeof p5 === 'undefined') {
    console.error('p5.js is not loaded');
    return;
  }
  new p5(sketch => {
    sketch.setup = () => {
      sketch.createCanvas(400, 300).parent('chart');
      sketch.background(document.body.classList.contains('dark-mode') ? 50 : 255);
      const rgb = hexToRGB(themeColor);
      sketch.stroke(...rgb);
      if (!isNaN(data.traumaDiff) && !isNaN(data.valueDiff)) {
        sketch.line(50, 300 - data.traumaDiff * 10, 50, 300);
        sketch.line(350, 300 - data.valueDiff * 10, 350, 300);
      } else {
        console.error('Invalid data for Vertical Lines:', data);
      }
      sketch.fill(document.body.classList.contains('dark-mode') ? 200 : 0);
      sketch.text('You', 40, 320);
      sketch.fill(document.body.classList.contains('dark-mode') ? 0 : 200);
      sketch.text('Other', 340, 320);
      console.log('Vertical Lines rendered with data:', JSON.stringify(data));
    };
  }, chartCanvas);
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
      // Initial render
      setTimeout(() => {
        renderBarChart(result);
        console.log('Initial Bar Chart render triggered');
      }, 0); // Ensure DOM is updated
      document.getElementById('bar-view').addEventListener('click', () => renderBarChart(result));
      document.getElementById('venn-view').addEventListener('click', () => renderVennDiagram(result));
      document.getElementById('lines-view').addEventListener('click', () => renderLinesView(result));
      document.getElementById('print-report').addEventListener('click', () => generateReport(code1, code2, result));
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
});

document.getElementById('dark-mode-toggle').addEventListener('click', (e) => {
  e.preventDefault();
  toggleDarkMode();
});

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('dark-mode-toggle').textContent = 'Toggle Light Mode';
}