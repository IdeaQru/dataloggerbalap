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
        theme: {
            mode: 'light',
            palette: 'palette1'
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        grid: {
            borderColor: 'rgba(0, 0, 0, 0.1)',
            strokeDashArray: 3
        },
        xaxis: {
            categories: chartData.labels,
            labels: {
                style: {
                    colors: '#333'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#333'
                }
            }
        },
        legend: {
            show: false
        },
        markers: {
            size: 4,
            strokeWidth: 2,
            hover: {
                size: 6
            }
        }
    };

    // RPM Chart - UBAH KE UNGU
    charts.rpm = new ApexCharts(document.querySelector("#rpm-chart"), {
        ...baseOptions,
        series: [{
            name: 'RPM',
            data: chartData.rpm,
            color: '#9c27b0' // ← UNGU
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'RPM', style: { color: '#333' } }
        }
    });

    // Temperature Chart - UBAH KE UNGU
    charts.temperature = new ApexCharts(document.querySelector("#temperature-chart"), {
        ...baseOptions,
        series: [{
            name: 'Temperature',
            data: chartData.temperature,
            color: '#9c27b0' // ← UNGU
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'Temperature (°C)', style: { color: '#333' } }
        }
    });

    // AFR Chart - UBAH KE UNGU
    charts.afr = new ApexCharts(document.querySelector("#afr-chart"), {
        ...baseOptions,
        series: [{
            name: 'AFR',
            data: chartData.afr,
            color: '#9c27b0' // ← UNGU
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'AFR', style: { color: '#333' } }
        }
    });

    // TPS Chart - UBAH KE UNGU
    charts.tps = new ApexCharts(document.querySelector("#tps-chart"), {
        ...baseOptions,
        series: [{
            name: 'TPS',
            data: chartData.tps,
            color: '#9c27b0' // ← UNGU
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'TPS (%)', style: { color: '#333' } },
            min: 0,
            max: 100
        }
    });

    // MAP Chart - UBAH KE UNGU
    charts.map = new ApexCharts(document.querySelector("#map-chart"), {
        ...baseOptions,
        series: [{
            name: 'MAP',
            data: chartData.map_value,
            color: '#9c27b0' // ← UNGU
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'MAP (kPa)', style: { color: '#333' } }
        }
    });

    // Incline Chart - UBAH KE UNGU
    charts.incline = new ApexCharts(document.querySelector("#incline-chart"), {
        ...baseOptions,
        series: [{
            name: 'Incline',
            data: chartData.incline,
            color: '#9c27b0' // ← UNGU
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'Incline (°)', style: { color: '#333' } }
        }
    });

    // Stroke Chart - UBAH KE UNGU
    charts.stroke = new ApexCharts(document.querySelector("#stroke-chart"), {
        ...baseOptions,
        series: [{
            name: 'Stroke',
            data: chartData.stroke,
            color: '#9c27b0' // ← UNGU
        }],
        yaxis: {
            ...baseOptions.yaxis,
            title: { text: 'Stroke (mm)', style: { color: '#333' } }
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
