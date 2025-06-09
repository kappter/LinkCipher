function generateReport(code1, code2, result) {
  const now = new Date();
  const formattedDateTime = now.toLocaleString('en-US', { timeZone: 'America/Denver' });
  const relationship = document.getElementById('relationship-select').value || selectedRelationship;
  
  const financialImpact = result.traumaDiff > 10 ? 'Potential misalignment in financial priorities due to differing life experiences.' : 'Likely alignment in financial priorities.';
  const healthImpact = result.valueDiff > 10 ? 'Differences in values may affect health-related decisions or stress levels.' : 'Shared values support aligned health decisions.';
  
  const traumaKeys = ['violence', 'divorce', 'neglect', 'illness', 'money', 'estrangement', 'addiction', 'death'];
  const valueKeys = ['trust', 'communication', 'conflict', 'religion', 'politics', 'resilience', 'extroversion', 'risk', 'empathy', 'tradition'];

  let traumaComparison = '';
  traumaComparison = (typeof questions !== 'undefined' && questions.length > 0 ? traumaKeys.map(key => {
    const score1 = result.person1Responses.main[key] || 3;
    const score2 = result.person2Responses.main[key] || 3;
    const question = questions.find(q => q.id === key)?.text || key;
    return `<tr><td>${question}</td><td>${score1}</td><td>${score2}</td></tr>`;
  }).join('') : traumaKeys.map(key => `<tr><td>${key}</td><td>${result.person1Responses.main[key] || 3}</td><td>${result.person2Responses.main[key] || 3}</td></tr>`).join(''));
  traumaComparison += `<tr class="font-bold"><td>Total Trauma Score</td><td>${result.t1}</td><td>${result.t2}</td></tr>`;

  let valuesComparison = '';
  valuesComparison = (typeof questions !== 'undefined' && questions.length > 0 ? valueKeys.map(key => {
    const score1 = result.person1Responses.main[key] || 3;
    const score2 = result.person2Responses.main[key] || 3;
    const question = questions.find(q => q.id === key)?.text || key;
    return `<tr><td>${question}</td><td>${score1}</td><td>${score2}</td></tr>`;
  }).join('') : valueKeys.map(key => `<tr><td>${key}</td><td>${result.person1Responses.main[key] || 3}</td><td>${result.person2Responses.main[key] || 3}</td></tr>`).join(''));
  valuesComparison += `<tr class="font-bold"><td>Total Values Score</td><td>${result.v1}</td><td>${result.v2}</td></tr>`;

  // Follow-up comparison
  let followUpComparisonTable = '';
  let externalCount1 = 0, internalCount1 = 0, externalCount2 = 0, internalCount2 = 0;
  if (Object.keys(result.followUpComparison).length > 0) {
    followUpComparisonTable = `
      <h3 class="text-lg font-medium mt-4">Follow-Up Responses (Optional)</h3>
      <table>
        <thead>
          <tr>
            <th>Follow-Up Question</th>
            <th>Person 1 Score / Cause</th>
            <th>Person 2 Score / Cause</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(result.followUpComparison).map(key => {
            const { score1, cause1, score2, cause2 } = result.followUpComparison[key];
            const parentKey = key.replace('_followup', '');
            const questionText = (typeof questions !== 'undefined' && questions.length > 0 ? questions.find(q => q.id === parentKey)?.followUp?.text || key : key);
            if (cause1 === 'external') externalCount1++; else if (cause1 === 'internal') internalCount1++;
            if (cause2 === 'external') externalCount2++; else if (cause2 === 'internal') internalCount2++;
            return `<tr><td>${questionText}</td><td>${score1 !== null ? `${score1} / ${cause1 || 'N/A'}` : 'N/A'}</td><td>${score2 !== null ? `${score2} / ${cause2 || 'N/A'}` : 'N/A'}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
    const totalFollowUps1 = externalCount1 + internalCount1;
    const totalFollowUps2 = externalCount2 + internalCount2;
    followUpComparisonTable += `
      <h3 class="text-lg font-medium mt-4">Cause Analysis</h3>
      <p>Person 1: ${externalCount1} external, ${internalCount1} internal (${totalFollowUps1 > 0 ? ((externalCount1 / totalFollowUps1) * 100).toFixed(1) : 0}% external)</p>
      <p>Person 2: ${externalCount2} external, ${internalCount2} internal (${totalFollowUps2 > 0 ? ((externalCount2 / totalFollowUps2) * 100).toFixed(1) : 0}% external)</p>
    `;
  }

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
          min-height: 80px;
          box-sizing: border-box;
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
          padding: 10px;
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
          ${followUpComparisonTable}
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
            <li>Discuss areas of difference to understand potential challenges, especially where causes (external vs. internal) differ.</li>
            <li>Consider communication strategies to address identified caveats, particularly if external traumas require empathy.</li>
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

function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [46, 109, 180]; // Default to #2E6DB4 if invalid
}