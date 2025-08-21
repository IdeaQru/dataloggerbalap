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
            },
            zoom: {
                enabled: false
            }
        },
        colors: [purpleColor],
        dataLabels: {
            enabled: false  // Pastikan data labels tidak tampil
        },
        stroke: {
            curve: 'smooth',
            width: 3,
            lineCap: 'round'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: [purpleColor],
                inverseColors: false,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        grid: {
            borderColor: 'rgba(156, 39, 176, 0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        markers: {
            size: 0,
            strokeWidth: 0,
            strokeColors: 'transparent',
            fillColors: 'transparent',
            hover: {
                size: 4,
                strokeWidth: 2,
                strokeColors: purpleColor
            }
        },
        xaxis: {
            type: 'category',
            categories: chartData.labels,
            labels: {
                style: {
                    colors: '#666',
                    fontSize: '12px'
                },
                rotate: -45
            },
            axisBorder: {
                show: true,
                color: 'rgba(156, 39, 176, 0.2)'
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#666',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            enabled: true,
            theme: 'light',
            x: {
                show: true
            },
            y: {
                formatter: function(val) {
                    return val;
                }
            },
            marker: {
                show: false
            }
        },
        legend: {
            show: false
        }
    };

    // Render semua chart dengan baseOptions yang sama
    const chartConfigs = [
        { id: 'rpm-chart', key: 'rpm', name: 'RPM', title: 'RPM' },
        { id: 'temperature-chart', key: 'temperature', name: 'Temperature', title: 'Temperature (°C)' },
        { id: 'afr-chart', key: 'afr', name: 'AFR', title: 'AFR' },
        { id: 'tps-chart', key: 'tps', name: 'TPS', title: 'TPS (%)' },
        { id: 'map-chart', key: 'map_value', name: 'MAP', title: 'MAP (kPa)' },
        { id: 'incline-chart', key: 'incline', name: 'Incline', title: 'Incline (°)' },
        { id: 'stroke-chart', key: 'stroke', name: 'Stroke', title: 'Stroke (mm)' }
    ];

    chartConfigs.forEach(config => {
        const chartOptions = {
            ...baseOptions,
            series: [{
                name: config.name,
                data: chartData[config.key] || []
            }],
            yaxis: {
                ...baseOptions.yaxis,
                title: {
                    text: config.title,
                    style: { 
                        color: '#333',
                        fontSize: '12px',
                        fontWeight: 600
                    }
                }
            }
        };

        // Khusus untuk TPS, set min/max
        if (config.key === 'tps') {
            chartOptions.yaxis = {
                ...chartOptions.yaxis,
                min: 0,
                max: 100
            };
        }

        const chartKey = config.key === 'map_value' ? 'map' : config.key;
        charts[chartKey] = new ApexCharts(document.querySelector(`#${config.id}`), chartOptions);
        charts[chartKey].render();
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
