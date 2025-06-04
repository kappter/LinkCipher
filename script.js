let currentQuestionIndex = 0;
let responses = {};
let userCode = null;
let selectedRelationship = 'romantic';
let themeColor = '#2E6DB4';

function showScreen(screenId) {
  document.querySelectorAll('#main-content > div').forEach(div => div.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');
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
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const rawHash = btoa(`${traumaSum}-${valueSum}-${timestamp}`);
  const hash = rawHash.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase();
  return `${hash.slice(0, 4)}-${hash.slice(4)}`;
}

function isValidCode(code) {
  return /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
}

function compareCodes(code1, code2) {
  if (!isValidCode(code1) || !isValidCode(code2)) {
    throw new Error('Invalid code format');
  }
  try {
    const decodeSegment = (segment) => {
      const padded = segment + '='.repeat((4 - (segment.length % 4)) % 4);
      return atob(padded).split('-').map(Number);
    };
    const [t1, v1] = code1.split('-').map(decodeSegment);
    const [t2, v2] = code2.split('-').map(decodeSegment);
    const traumaDiff = Math.abs(t1[0] - t2[0]);
    const valueDiff = Math.abs(v1[0] - v2[0]);
    const links = traumaDiff < 10 && valueDiff < 10 ? 'You share similar values and experiences.' : 'You have some alignment but may differ in key areas.';
    const disconnects = traumaDiff > 15 ? 'Significant differences in life experiences may require discussion.' : 'Minor differences in experiences exist.';
    const caveats = traumaDiff > 10 || valueDiff > 10 ? 'Open communication is key to bridge gaps.' : 'Few caveats; alignment is strong.';
    return { links, disconnects, caveats, traumaDiff, valueDiff };
  } catch (e) {
    throw new Error('Invalid code format');
  }
}

function renderBarChart(data) {
  const canvas = document.getElementById('visualization');
  canvas.innerHTML = '<canvas id="chart"></canvas>';
  new p5(sketch => {
    sketch.setup = () => {
      sketch.createCanvas(400, 300).parent('chart');
      sketch.background(document.body.classList.contains('dark-mode') ? 50 : 255);
      sketch.fill(themeColor);
      sketch.rect(50, 200 - data.traumaDiff * 5, 80, data.traumaDiff * 5);
      sketch.rect(150, 200 - data.valueDiff * 5, 80, data.valueDiff * 5);
      sketch.fill(document.body.classList.contains('dark-mode') ? 200 : 0);
      sketch.text('Trauma', 50, 220);
      sketch.text('Values', 150, 220);
    };
  });
}

function renderVennDiagram(data) {
  const canvas = document.getElementById('visualization');
  canvas.innerHTML = '<canvas id="chart"></canvas>';
  new p5(sketch => {
    sketch.setup = () => {
      sketch.createCanvas(400, 300).parent('chart');
      sketch.background(document.body.classList.contains('dark-mode') ? 50 : 255);
      sketch.noFill();
      sketch.stroke(themeColor);
      sketch.ellipse(150, 150, 100);
      sketch.ellipse(250, 150, 100);
      sketch.fill(themeColor, 100);
      sketch.ellipse(200, 150, 80 - data.traumaDiff);
      sketch.fill(document.body.classList.contains('dark-mode') ? 200 : 0);
      sketch.text('Overlap', 180, 150);
    };
  });
}

function renderLinesView(data) {
  const canvas = document.getElementById('visualization');
  canvas.innerHTML = '<canvas id="chart"></canvas>';
  new p5(sketch => {
    sketch.setup = () => {
      sketch.createCanvas(400, 300).parent('chart');
      sketch.background(document.body.classList.contains('dark-mode') ? 50 : 255);
      sketch.stroke(themeColor);
      sketch.line(50, 300 - data.traumaDiff * 10, 50, 300);
      sketch.line(350, 300 - data.valueDiff * 10, 350, 300);
      sketch.fill(document.body.classList.contains('dark-mode') ? 200 : 0);
      sketch.text('You', 40, 320);
      sketch.text('Other', 340, 320);
    };
  });
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
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
      renderBarChart(result);
      document.getElementById('bar-view').onclick = () => renderBarChart(result);
      document.getElementById('venn-view').onclick = () => renderVennDiagram(result);
      document.getElementById('lines-view').onclick = () => renderLinesView(result);
    } catch (e) {
      errorDiv.classList.remove('hidden');
      errorDiv.textContent = 'Invalid code format. Please enter codes like XXXX-YYYY.';
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