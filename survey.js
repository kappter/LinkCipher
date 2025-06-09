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
      <p class="mb-4">${question.text} <span class="text-sm text-gray-500">(Optional, enter 'external', 'internal', or skip)</span></p>
      <input type="text" id="followup-answer" class="border p-2 w-full mb-2" placeholder="external or internal">
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
      const followupInput = document.getElementById('followup-answer');
      const cause = followupInput ? followupInput.value.trim().toLowerCase() : null;
      responses.followUps[question.id] = {
        score: parseInt(answer.value),
        cause: cause === 'external' || cause === 'internal' ? cause : null
      };
    } else {
      responses.main[question.id] = parseInt(answer.value);
      if (question.followUp && answer.value >= question.followUp.condition) {
        questions.splice(currentQuestionIndex + 1, 0, { id: question.followUp.key, text: question.followUp.text, followUp: null });
      }
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