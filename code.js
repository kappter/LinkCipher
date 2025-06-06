function generateCode(responsesObj) {
  const traumaKeys = ['violence', 'divorce', 'neglect', 'illness', 'money', 'estrangement', 'addiction', 'death'];
  const valueKeys = ['trust', 'communication', 'conflict', 'religion', 'politics', 'resilience', 'extroversion', 'risk', 'empathy', 'tradition'];
  const traumaSum = traumaKeys.reduce((sum, key) => sum + (responsesObj.main[key] || 3), 0);
  const valueSum = valueKeys.reduce((sum, key) => sum + (responsesObj.main[key] || 3), 0);
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
    const person1Responses = Object.keys(responses.main).length ? responses : { ...randomResponses2 };
    const person2Responses = Object.keys(randomResponses2.main).length ? randomResponses2 : { ...responses };
    const followUpComparison = {};
    const allFollowUpKeys = [...new Set([...Object.keys(person1Responses.followUps), ...Object.keys(person2Responses.followUps)])];
    allFollowUpKeys.forEach(key => {
      const score1 = person1Responses.followUps[key] || null;
      const score2 = person2Responses.followUps[key] || null;
      if (score1 !== null || score2 !== null) {
        followUpComparison[key] = { score1, score2 };
      }
    });
    return { links, disconnects, caveats, traumaDiff, valueDiff, t1, t2, v1, v2, person1Responses, person2Responses, followUpComparison };
  } catch (e) {
    throw new Error('Invalid code format or decoding failed: ' + e.message);
  }
}

document.getElementById('random-code').addEventListener('click', () => {
  const traumaKeys = ['violence', 'divorce', 'neglect', 'illness', 'money', 'estrangement', 'addiction', 'death'];
  const valueKeys = ['trust', 'communication', 'conflict', 'religion', 'politics', 'resilience', 'extroversion', 'risk', 'empathy', 'tradition'];
  const targetInput = document.activeElement === document.getElementById('code1') ? 'code1' : 'code2';
  if (targetInput === 'code1') {
    responses = { main: {}, followUps: {} };
    traumaKeys.forEach(key => {
      const score = Math.floor(Math.random() * 5) + 1;
      responses.main[key] = score;
      if (score >= 4) {
        const followUpKey = `${key}_followup`;
        responses.followUps[followUpKey] = Math.floor(Math.random() * 5) + 1;
      }
    });
    valueKeys.forEach(key => {
      const score = Math.floor(Math.random() * 5) + 1;
      responses.main[key] = score;
      if (score >= 4) {
        const followUpKey = `${key}_followup`;
        responses.followUps[followUpKey] = Math.floor(Math.random() * 5) + 1;
      }
    });
    userCode = generateCode(responses);
    document.getElementById('code1').value = userCode;
  } else {
    randomResponses2 = { main: {}, followUps: {} };
    traumaKeys.forEach(key => {
      const score = Math.floor(Math.random() * 5) + 1;
      randomResponses2.main[key] = score;
      if (score >= 4) {
        const followUpKey = `${key}_followup`;
        randomResponses2.followUps[followUp