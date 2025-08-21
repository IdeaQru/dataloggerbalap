// Charts management with ApexCharts
let charts = {};
const chartData = {
    labels: [],
    rpm: [],
    temperature: [],
    afr: [],
    tps: [],
    map_value: [],
    incline: [],
    stroke: []
};

const MAX_DATA_POINTS = 20;

function initializeCharts() {
    const container = document.getElementById('charts-container');
    container.innerHTML = `
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-header">
                    <h4 class="chart-title">🔧 RPM</h4>
                </div>
                <div id="rpm-chart" class="chart-container"></div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h4 class="chart-title">🌡️ Temperature</h4>
                </div>
                <div id="temperature-chart" class="chart-container"></div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h4 class="chart-title">⚡ AFR</h4>
                </div>
                <div id="afr-chart" class="chart-container"></div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h4 class="chart-title">🚗 TPS</h4>
                </div>
                <div id="tps-chart" class="chart-container"></div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h4 class="chart-title">📊 MAP Value</h4>
                </div>
                <div id="map-chart" class="chart-container"></div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h4 class="chart-title">📐 Incline</h4>
                </div>
                <div id="incline-chart" class="chart-container"></div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h4 class="chart-title">🔄 Stroke</h4>
                </div>
                <div id="stroke-chart" class="chart-container"></div>
            </div>
        </div>
    `;
    
    createApexCharts();
}

function createApexCharts() {
    const purpleColor = '#9c27b0';
    
    const baseOptions = {
        chart: {
            type: 'line',
            height: 280,
            background: 'transparent',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        colors: [purpleColor],
        stroke: {
            curve: 'smooth',
            width: 3,
            colors: [purpleColor]
        },
        fill: {
            type: 'gradient',
            colors: [purpleColor],
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 1,
                gradientToColors: [purpleColor],
                inverseColors: false,
                opacityFrom: 0.8,  // ← KURANGI TRANSPARANSI (dari 0.3 ke 0.8)
                opacityTo: 0.5,    // ← KURANGI TRANSPARANSI (dari 0.1 ke 0.5)
                stops: [0, 90]
            }
        },
        grid: {
            borderColor: 'rgba(156, 39, 176, 0.1)',
            strokeDashArray: 3
        },
        xaxis: {
            categories: chartData.labels,
            labels: {
                style: {
                    colors: '#333',
                    fontSize: '11px'
                },
                rotate: -45
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#333',
                    fontSize: '11px'
                }
            }
        },
        legend: {
            show: false
        },
        markers: {
            size: 5,              // ← TAMPILKAN DOT DENGAN SIZE 5
            strokeWidth: 2,       // ← BORDER DOT
            strokeColors: '#ffffff', // ← BORDER PUTIH
            fillColors: [purpleColor], // ← ISI DOT UNGU
            hover: {
                size: 8,          // ← SIZE SAAT HOVER
                strokeWidth: 3,
                strokeColors: '#ffffff'
            }
        },
        tooltip: {
            enabled: true,
            theme: 'light',
            marker: {
                show: true
            }
        }
    };

    // RPM Chart
    charts.rpm = new ApexCharts(document.querySelector("#rpm-chart"), {
        ...baseOptions,
        series: [{
            name: 'RPM',
            data: chartData.rpm
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'RPM', style: { color: '#333', fontSize: '12px', fontWeight: 600 } }
        }
    });

    // Temperature Chart
    charts.temperature = new ApexCharts(document.querySelector("#temperature-chart"), {
        ...baseOptions,
        series: [{
            name: 'Temperature',
            data: chartData.temperature
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'Temperature (°C)', style: { color: '#333', fontSize: '12px', fontWeight: 600 } }
        }
    });

    // AFR Chart
    charts.afr = new ApexCharts(document.querySelector("#afr-chart"), {
        ...baseOptions,
        series: [{
            name: 'AFR',
            data: chartData.afr
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'AFR', style: { color: '#333', fontSize: '12px', fontWeight: 600 } }
        }
    });

    // TPS Chart
    charts.tps = new ApexCharts(document.querySelector("#tps-chart"), {
        ...baseOptions,
        series: [{
            name: 'TPS',
            data: chartData.tps
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'TPS (%)', style: { color: '#333', fontSize: '12px', fontWeight: 600 } },
            min: 0,
            max: 100
        }
    });

    // MAP Chart
    charts.map = new ApexCharts(document.querySelector("#map-chart"), {
        ...baseOptions,
        series: [{
            name: 'MAP',
            data: chartData.map_value
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'MAP (kPa)', style: { color: '#333', fontSize: '12px', fontWeight: 600 } }
        }
    });

    // Incline Chart
    charts.incline = new ApexCharts(document.querySelector("#incline-chart"), {
        ...baseOptions,
        series: [{
            name: 'Incline',
            data: chartData.incline
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'Incline (°)', style: { color: '#333', fontSize: '12px', fontWeight: 600 } }
        }
    });

    // Stroke Chart
    charts.stroke = new ApexCharts(document.querySelector("#stroke-chart"), {
        ...baseOptions,
        series: [{
            name: 'Stroke',
            data: chartData.stroke
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'Stroke (mm)', style: { color: '#333', fontSize: '12px', fontWeight: 600 } }
        }
    });

    // Render all charts
    Object.values(charts).forEach(chart => {
        chart.render();
    });
}



function updateCharts(data) {
    const now = new Date().toLocaleTimeString();
    
    // Add new data point
    chartData.labels.push(now);
    chartData.rpm.push(data.sensors?.rpm || 0);
    chartData.temperature.push(data.sensors?.temperature || 0);
    chartData.afr.push(data.sensors?.afr || 0);
    chartData.tps.push(data.sensors?.tps || 0);
    chartData.map_value.push(data.sensors?.map_value || 0);
    chartData.incline.push(data.sensors?.incline || 0);
    chartData.stroke.push(data.sensors?.stroke || 0);
    
    // Remove old data points if exceeding maximum
    if (chartData.labels.length > MAX_DATA_POINTS) {
        chartData.labels.shift();
        chartData.rpm.shift();
        chartData.temperature.shift();
        chartData.afr.shift();
        chartData.tps.shift();
        chartData.map_value.shift();
        chartData.incline.shift();
        chartData.stroke.shift();
    }
    
    // Update all charts
    Object.keys(charts).forEach(chartName => {
        if (charts[chartName]) {
            let dataKey = chartName === 'map' ? 'map_value' : chartName;
            charts[chartName].updateSeries([{
                data: chartData[dataKey]
            }]);
            charts[chartName].updateOptions({
                xaxis: {
                    categories: chartData.labels
                }
            });
        }
    });
}

function loadChartsWithHistoricalData(data) {
    // Reset all chart data arrays
    Object.keys(chartData).forEach(key => {
        chartData[key] = [];
    });
    
    // Load historical data
    data.forEach(record => {
        const time = new Date(record.timestamp).toLocaleTimeString();
        chartData.labels.push(time);
        chartData.rpm.push(parseFloat(record.rpm) || 0);
        chartData.temperature.push(parseFloat(record.temperature) || 0);
        chartData.afr.push(parseFloat(record.afr) || 0);
        chartData.tps.push(parseFloat(record.tps) || 0);
        chartData.map_value.push(parseFloat(record.map_value) || 0);
        chartData.incline.push(parseFloat(record.incline) || 0);
        chartData.stroke.push(parseFloat(record.stroke) || 0);
    });
    
    // Update all charts with historical data
    Object.keys(charts).forEach(chartName => {
        if (charts[chartName]) {
            let dataKey = chartName === 'map' ? 'map_value' : chartName;
            charts[chartName].updateSeries([{
                data: chartData[dataKey]
            }]);
            charts[chartName].updateOptions({
                xaxis: {
                    categories: chartData.labels
                }
            });
        }
    });
    
    // Update footer with total records
    document.getElementById('total-records').textContent = data.length;
}
