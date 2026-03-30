const data = window.africaDashboardData;

const metricContainer = document.getElementById("metrics");
const regionSelect = document.getElementById("regionSelect");

let countryBreakdownChart;

function mean(values) {
  return values.reduce((sum, current) => sum + current, 0) / values.length;
}

function renderMetrics() {
  const regionalRates = data.regionalAverages.map((item) => item.rate);
  const southernRates = data.southernYouthVsAdult.map((item) => item.youth);
  const northWomenRate = 42;

  const metrics = [
    {
      title: "Regions Covered",
      value: String(data.regionalAverages.length),
    },
    {
      title: "Average Regional Rate",
      value: `${mean(regionalRates).toFixed(1)}%`,
    },
    {
      title: "Peak Country Rate",
      value: `${Math.max(...southernRates).toFixed(1)}%`,
    },
    {
      title: "North Africa Women Rate",
      value: `${northWomenRate.toFixed(1)}%`,
    },
  ];

  metricContainer.innerHTML = metrics
    .map(
      (metric) => `
      <article class="metric-card">
        <p class="metric-title">${metric.title}</p>
        <p class="metric-value">${metric.value}</p>
      </article>
    `,
    )
    .join("");
}

function initRegionFilter() {
  Object.keys(data.countryBreakdown).forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });

  regionSelect.value = "West Africa";
}

function buildRegionalAverageChart() {
  const ctx = document.getElementById("regionalAverageChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.regionalAverages.map((item) => item.region),
      datasets: [
        {
          label: "Youth unemployment (%)",
          data: data.regionalAverages.map((item) => item.rate),
          borderRadius: 8,
          backgroundColor: ["#0d6e6e", "#f2a65a", "#7a9e7e", "#3f7f93", "#c95f5f"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
    },
  });
}

function updateCountryBreakdownChart(region) {
  const points = data.countryBreakdown[region] || [];
  const config = {
    type: "bar",
    data: {
      labels: points.map((item) => item.country),
      datasets: [
        {
          label: `${region} youth unemployment (%)`,
          data: points.map((item) => item.youthRate),
          borderRadius: 7,
          backgroundColor: "#0d6e6ecc",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
    },
  };

  if (countryBreakdownChart) {
    countryBreakdownChart.destroy();
  }

  countryBreakdownChart = new Chart(document.getElementById("countryBreakdownChart"), config);
}

function buildSouthernComparisonChart() {
  const ctx = document.getElementById("southernComparisonChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.southernYouthVsAdult.map((item) => item.country),
      datasets: [
        {
          label: "Youth (%)",
          data: data.southernYouthVsAdult.map((item) => item.youth),
          backgroundColor: "#f2a65a",
          borderRadius: 7,
        },
        {
          label: "Adults (%)",
          data: data.southernYouthVsAdult.map((item) => item.adult),
          backgroundColor: "#0d6e6e",
          borderRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
    },
  });
}

function startDashboard() {
  renderMetrics();
  initRegionFilter();
  buildRegionalAverageChart();
  buildSouthernComparisonChart();
  updateCountryBreakdownChart(regionSelect.value);

  regionSelect.addEventListener("change", (event) => {
    updateCountryBreakdownChart(event.target.value);
  });
}

startDashboard();
