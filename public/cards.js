// Cards management
function initializeCards() {
    const container = document.getElementById('cards-container');
    container.innerHTML = `
        <div class="cards-grid">
            <!-- System Status Card -->
            <div class="telemetry-card">
                <div class="card-header">
                    <h3 class="card-title">🚗 System Status</h3>
                    <div class="card-indicator" id="system-indicator"></div>
                </div>
                <div class="card-body">
                    <div class="status-row">
                        <span class="status-label">Status:</span>
                        <span id="system-status" class="status-value">-</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Lap:</span>
                        <span id="lap-number" class="status-value">-</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">AI Classification:</span>
                        <span id="ai-classification" class="status-value">-</span>
                    </div>
                </div>
            </div>

            <!-- Engine Metrics Card -->
            <div class="telemetry-card">
                <div class="card-header">
                    <h3 class="card-title">🔧 Engine Metrics</h3>
                    <div class="card-indicator" id="engine-indicator"></div>
                </div>
                <div class="card-body">
                    <div class="metric-grid">
                        <div class="metric-item">
                            <span class="metric-label">RPM</span>
                            <span id="rpm" class="metric-value">- rpm</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Temp</span>
                            <span id="temperature" class="metric-value">- °C</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">AFR</span>
                            <span id="afr" class="metric-value">-</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">TPS</span>
                            <span id="tps" class="metric-value">- %</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Sensors Card -->
            <div class="telemetry-card">
                <div class="card-header">
                    <h3 class="card-title">📊 Additional Sensors</h3>
                    <div class="card-indicator" id="sensors-indicator"></div>
                </div>
                <div class="card-body">
                    <div class="metric-grid">
                        <div class="metric-item">
                            <span class="metric-label">MAP</span>
                            <span id="map-value" class="metric-value">- kPa</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Incline</span>
                            <span id="incline" class="metric-value">- °</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Stroke</span>
                            <span id="stroke" class="metric-value">- mm</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Speed</span>
                            <span id="speed" class="metric-value">- km/h</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GPS Data Card -->
            <div class="telemetry-card">
                <div class="card-header">
                    <h3 class="card-title">🌍 GPS Data</h3>
                    <div class="card-indicator" id="gps-indicator"></div>
                </div>
                <div class="card-body">
                    <div class="gps-data">
                        <div class="gps-row">
                            <span class="gps-label">Coordinates:</span>
                            <span id="coordinates" class="gps-value">-</span>
                        </div>
                        <div class="gps-row">
                            <span class="gps-label">Satellites:</span>
                            <span id="satellites" class="gps-value">-</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cooling System Card -->
            <div class="telemetry-card">
                <div class="card-header">
                    <h3 class="card-title">❄️ Cooling System</h3>
                    <div class="card-indicator" id="cooling-indicator"></div>
                </div>
                <div class="card-body">
                    <div class="cooling-grid">
                        <div class="cooling-item">
                            <span class="cooling-label">System:</span>
                            <span id="cooling-active" class="cooling-status">-</span>
                        </div>
                        <div class="cooling-item">
                            <span class="cooling-label">Fan:</span>
                            <span id="fan-status" class="cooling-status">-</span>
                        </div>
                        <div class="cooling-item">
                            <span class="cooling-label">Temperature:</span>
                            <span id="current-temp" class="cooling-value">- °C</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Health Card -->
            <div class="telemetry-card">
                <div class="card-header">
                    <h3 class="card-title">💾 System Health</h3>
                    <div class="card-indicator" id="health-indicator"></div>
                </div>
                <div class="card-body">
                    <div class="health-grid">
                        <div class="health-item">
                            <span class="health-label">Free Heap:</span>
                            <span id="free-heap" class="health-value">- bytes</span>
                        </div>
                        <div class="health-item">
                            <span class="health-label">WiFi RSSI:</span>
                            <span id="wifi-rssi" class="health-value">- dBm</span>
                        </div>
                        <div class="health-item">
                            <span class="health-label">Uptime:</span>
                            <span id="uptime" class="health-value">- sec</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateCards(data) {
    // Update indicators
    updateCardIndicators(data);
    
    // System Status
    document.getElementById('system-status').textContent = data.system_status || '-';
    document.getElementById('lap-number').textContent = data.lap_number || '-';
    document.getElementById('ai-classification').textContent = data.ai_classification?.classification_text || '-';
    
    // Engine Metrics
    if (data.sensors) {
        document.getElementById('rpm').textContent = (data.sensors.rpm || 0) + ' rpm';
        document.getElementById('temperature').textContent = (data.sensors.temperature || 0) + ' °C';
        document.getElementById('afr').textContent = data.sensors.afr || '-';
        document.getElementById('tps').textContent = (data.sensors.tps || 0) + ' %';
        document.getElementById('map-value').textContent = (data.sensors.map_value || 0) + ' kPa';
        document.getElementById('incline').textContent = (data.sensors.incline || 0) + ' °';
        document.getElementById('stroke').textContent = (data.sensors.stroke || 0) + ' mm';
    }
    
    // GPS Data
    if (data.gps) {
        document.getElementById('speed').textContent = (data.gps.speed || 0) + ' km/h';
        const lat = data.gps.latitude || 0;
        const lng = data.gps.longitude || 0;
        document.getElementById('coordinates').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        document.getElementById('satellites').textContent = data.gps.satellites || '-';
    }
    
    // Cooling System
    if (data.cooling) {
        document.getElementById('cooling-active').textContent = data.cooling.system_active ? 'ON' : 'OFF';
        document.getElementById('fan-status').textContent = data.cooling.fan_on ? 'ON' : 'OFF';
        document.getElementById('current-temp').textContent = (data.cooling.current_temp || 0) + ' °C';
    }
    
    // System Health
    if (data.system_health) {
        document.getElementById('free-heap').textContent = formatBytes(data.system_health.free_heap || 0);
        document.getElementById('wifi-rssi').textContent = (data.system_health.wifi_rssi || 0) + ' dBm';
        document.getElementById('uptime').textContent = formatUptime(data.system_health.uptime || 0);
    }
}

function updateCardIndicators(data) {
    // System indicator
    const systemIndicator = document.getElementById('system-indicator');
    if (data.system_status === 'RECORDING') {
        systemIndicator.className = 'card-indicator recording';
    } else if (data.system_status === 'ERROR' || data.system_status === 'EMERGENCY') {
        systemIndicator.className = 'card-indicator error';
    } else {
        systemIndicator.className = 'card-indicator normal';
    }
    
    // Engine indicator (based on temperature)
    const engineIndicator = document.getElementById('engine-indicator');
    const temp = data.sensors?.temperature || 0;
    if (temp > 100) {
        engineIndicator.className = 'card-indicator error';
    } else if (temp > 90) {
        engineIndicator.className = 'card-indicator warning';
    } else {
        engineIndicator.className = 'card-indicator normal';
    }
    
    // Other indicators
    document.getElementById('sensors-indicator').className = 'card-indicator normal';
    document.getElementById('gps-indicator').className = data.gps?.satellites > 4 ? 'card-indicator normal' : 'card-indicator warning';
    document.getElementById('cooling-indicator').className = data.cooling?.system_active ? 'card-indicator normal' : 'card-indicator warning';
    document.getElementById('health-indicator').className = 'card-indicator normal';
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}
