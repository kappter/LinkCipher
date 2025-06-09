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