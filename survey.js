function renderQuestion() {
  const question = questions[currentQuestionIndex];
  const container = document.getElementById('question-container');
  const isFollowUp = question.id.includes('_followup');
  container.innerHTML = `
    <p class="mb-4">${question.text}${isFollowUp ? ' <span class="text-sm text-gray-500">(Optional)</span>' : ''}</p>
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

document.getElementById('start-survey').addEventListener('click', () => {
  showScreen('survey-screen');
  renderQuestion();
});

document.getElementById('next-question').addEventListener('click', () => {
  const answer = document.getElementById('answer-slider');
  if (answer) {
    const question = questions[currentQuestionIndex];
    const isFollowUp = question.id.includes('_followup');
    if (isFollowUp) {
      responses.followUps[question.id] = parseInt(answer.value);
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
  }
});

document.getElementById('skip-question').addEventListener('click', () => {
  const question = questions[currentQuestionIndex];
  const isFollowUp = question.id.includes('_followup');
  if (isFollowUp) {
    responses.followUps[question.id] = null;
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
});