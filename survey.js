let questions = []; // Global array to store questions

function loadQuestions(relationship) {
  const script = document.createElement('script');
  script.src = `${relationship}.js`;
  script.onload = () => {
    let attempts = 0;
    const maxAttempts = 5;
    const checkQuestions = setInterval(() => {
      if (window.questions && window.questions.length > 0) {
        questions = [...window.questions]; // Copy to global questions
        clearInterval(checkQuestions);
        renderQuestion();
      } else if (attempts >= maxAttempts) {
        console.error(`No questions loaded from ${relationship}.js after ${maxAttempts} attempts. Check file content.`);
        clearInterval(checkQuestions);
      } else {
        attempts++;
        console.log(`Attempt ${attempts} to load questions from ${relationship}.js`);
      }
    }, 100); // Check every 100ms
  };
  script.onerror = () => console.error(`Failed to load ${relationship}.js`);
  document.body.appendChild(script);
}

function renderQuestion() {
  if (!questions || questions.length === 0) {
    console.error('No questions available to render.');
    return;
  }
  const question = questions[currentQuestionIndex];
  const container = document.getElementById('question-container');
  const isFollowUp = question.id.includes('_followup');
  if (isFollowUp) {
    container.innerHTML = `
      <p class="mb-4">${question.text}</p>
      <div class="flex space-x-4 mb-2">
        <button id="external-btn" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">External</button>
        <button id="internal-btn" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">Internal</button>
        <button id="skip-followup" class="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700">Skip</button>
      </div>
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
    document.getElementById('external-btn').addEventListener('click', () => {
      responses.followUps[question.id] = { score: parseInt(document.getElementById('answer-slider').value), cause: 'external' };
      proceedNext();
    });
    document.getElementById('internal-btn').addEventListener('click', () => {
      responses.followUps[question.id] = { score: parseInt(document.getElementById('answer-slider').value), cause: 'internal' };
      proceedNext();
    });
    document.getElementById('skip-followup').addEventListener('click', () => {
      responses.followUps[question.id] = { score: null, cause: null };
      proceedNext();
    });
  } else {
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
}

function proceedNext() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    userCode = generateCode(responses);
    showScreen('code-entry-screen');
    document.getElementById('code1').value = userCode;
  }
}

document.getElementById('start-survey').addEventListener('click', () => {
  showScreen('survey-screen');
  currentQuestionIndex = 0;
  responses = { main: {}, followUps: {} };
  const relationship = document.getElementById('relationship-select').value;
  loadQuestions(relationship);
});

document.getElementById('next-question').addEventListener('click', () => {
  const answer = document.getElementById('answer-slider');
  if (answer && questions.length > 0) {
    const question = questions[currentQuestionIndex];
    const isFollowUp = question.id.includes('_followup');
    if (isFollowUp) {
      console.error('Follow-up should use buttons, not next button.');
      return;
    } else {
      const score = parseInt(answer.value);
      responses.main[question.id] = score;
      if (score >= 4 && question.followUp) {
        questions.splice(currentQuestionIndex + 1, 0, { id: question.followUp.key, text: question.followUp.text, followUp: null });
      }
      proceedNext();
    }
  } else {
    console.error('Answer slider or questions not available.');
  }
});

document.getElementById('skip-question').addEventListener('click', () => {
  if (questions.length > 0) {
    const question = questions[currentQuestionIndex];
    const isFollowUp = question.id.includes('_followup');
    if (isFollowUp) {
      responses.followUps[question.id] = { score: null, cause: null };
    } else {
      responses.main[question.id] = 3;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      renderQuestion();
    } else {
      userCode = generateCode(responses);
      showScreen('code-entry-screen');
      document.getElementById('code1').value = userCode;
    }
  } else {
    console.error('No questions available to skip.');
  }
});