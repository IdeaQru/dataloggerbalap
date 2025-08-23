const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 7187;
const CSV_FILE = path.join(__dirname, 'data', 'sensor_data.csv');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inisialisasi CSV jika belum ada
if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

if (!fs.existsSync(CSV_FILE)) {
    const csvWriter = createCsvWriter({
        path: CSV_FILE,
        header: [
            {id: 'timestamp', title: 'Timestamp'},
            {id: 'device_id', title: 'Device ID'},
            {id: 'system_status', title: 'System Status'},
            {id: 'lap_number', title: 'Lap Number'},
            {id: 'afr', title: 'AFR'},
            {id: 'rpm', title: 'RPM'},
            {id: 'temperature', title: 'Temperature'},
            {id: 'tps', title: 'TPS'},
            {id: 'map_value', title: 'MAP Value'},
            {id: 'incline', title: 'Incline'},
            {id: 'stroke', title: 'Stroke'},
            {id: 'latitude', title: 'Latitude'},
            {id: 'longitude', title: 'Longitude'},
            {id: 'speed', title: 'Speed'},
            {id: 'satellites', title: 'Satellites'},
            {id: 'ai_classification', title: 'AI Classification'},
            {id: 'classification_text', title: 'Classification Text'},
            {id: 'cooling_active', title: 'Cooling Active'},
            {id: 'fan_on', title: 'Fan On'},
            {id: 'current_temp', title: 'Current Temp'},
            {id: 'free_heap', title: 'Free Heap'},
            {id: 'uptime', title: 'Uptime'},
            {id: 'wifi_rssi', title: 'WiFi RSSI'}
        ]
    });
    csvWriter.writeRecords([]).then(() => {
        console.log('CSV file created successfully');
    });
}

// API endpoint untuk menerima data dari ESP32
app.post('/api/telemetry', (req, res) => {
    const data = req.body;
    console.log('Received telemetry data:', data);
    // Lakukan pengolahan data timestamp dengan waktu bawaan supaya nilai sensor saya mengikuti waktu bawaan diterimanya website
    data.timestamp = new Date().toISOString();
    // Simpan ke CSV
    saveToCsv(data);
    
    // Kirim data real-time ke semua client
    io.emit('telemetry-update', data);
    
    res.json({ status: 'success', message: 'Data received and stored' });
});

// API untuk mendapatkan historical data dari CSV
app.get('/api/history', (req, res) => {
    const results = [];
    const limit = req.query.limit || 100;
    
    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // Ambil data terbaru sesuai limit
            const recentData = results.slice(-limit);
            res.json(recentData);
        })
        .on('error', (err) => {
            console.error('Error reading CSV:', err);
            res.status(500).json({ error: 'Failed to read historical data' });
        });
});

// API untuk mendapatkan statistik
app.get('/api/stats', (req, res) => {
    const results = [];
    
    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const stats = calculateStats(results);
            res.json(stats);
        })
        .on('error', (err) => {
            console.error('Error reading CSV for stats:', err);
            res.status(500).json({ error: 'Failed to calculate stats' });
        });
});

// Fungsi untuk menyimpan data ke CSV
function saveToCsv(telemetryData) {
    const csvWriter = createCsvWriter({
        path: CSV_FILE,
        header: [
            {id: 'timestamp', title: 'Timestamp'},
            {id: 'device_id', title: 'Device ID'},
            {id: 'system_status', title: 'System Status'},
            {id: 'lap_number', title: 'Lap Number'},
            {id: 'afr', title: 'AFR'},
            {id: 'rpm', title: 'RPM'},
            {id: 'temperature', title: 'Temperature'},
            {id: 'tps', title: 'TPS'},
            {id: 'map_value', title: 'MAP Value'},
            {id: 'incline', title: 'Incline'},
            {id: 'stroke', title: 'Stroke'},
            {id: 'latitude', title: 'Latitude'},
            {id: 'longitude', title: 'Longitude'},
            {id: 'speed', title: 'Speed'},
            {id: 'satellites', title: 'Satellites'},
            {id: 'ai_classification', title: 'AI Classification'},
            {id: 'classification_text', title: 'Classification Text'},
            {id: 'cooling_active', title: 'Cooling Active'},
            {id: 'fan_on', title: 'Fan On'},
            {id: 'current_temp', title: 'Current Temp'},
            {id: 'free_heap', title: 'Free Heap'},
            {id: 'uptime', title: 'Uptime'},
            {id: 'wifi_rssi', title: 'WiFi RSSI'}
        ],
        append: true
    });

    const record = {
        timestamp: new Date().toISOString(),
        device_id: telemetryData.device_id || '',
        system_status: telemetryData.system_status || '',
        lap_number: telemetryData.lap_number || 0,
        afr: telemetryData.sensors?.afr || 0,
        rpm: telemetryData.sensors?.rpm || 0,
        temperature: telemetryData.sensors?.temperature || 0,
        tps: telemetryData.sensors?.tps || 0,
        map_value: telemetryData.sensors?.map_value || 0,
        incline: telemetryData.sensors?.incline || 0,
        stroke: telemetryData.sensors?.stroke || 0,
        latitude: telemetryData.gps?.latitude || 0,
        longitude: telemetryData.gps?.longitude || 0,
        speed: telemetryData.gps?.speed || 0,
        satellites: telemetryData.gps?.satellites || 0,
        ai_classification: telemetryData.ai_classification?.classification || 0,
        classification_text: telemetryData.ai_classification?.classification_text || '',
        cooling_active: telemetryData.cooling?.system_active || false,
        fan_on: telemetryData.cooling?.fan_on || false,
        current_temp: telemetryData.cooling?.current_temp || 0,
        free_heap: telemetryData.system_health?.free_heap || 0,
        uptime: telemetryData.system_health?.uptime || 0,
        wifi_rssi: telemetryData.system_health?.wifi_rssi || 0
    };

    csvWriter.writeRecords([record])
        .then(() => console.log('Data saved to CSV'))
        .catch(err => console.error('Error saving to CSV:', err));
}

// Fungsi untuk menghitung statistik
function calculateStats(data) {
    if (data.length === 0) return {};

    const numericFields = ['rpm', 'temperature', 'afr', 'tps', 'map_value'];
    const stats = {};

    numericFields.forEach(field => {
        const values = data.map(row => parseFloat(row[field]) || 0);
        stats[field] = {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            max: Math.max(...values),
            min: Math.min(...values),
            latest: values[values.length - 1] || 0
        };
    });

    stats.totalRecords = data.length;
    stats.lastUpdate = data[data.length - 1]?.timestamp || '';

    return stats;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    
    socket.on('request-history', (limit) => {
        // Kirim historical data ke client yang meminta
        const results = [];
        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const recentData = results.slice(-(limit || 50));
                socket.emit('history-data', recentData);
            });
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Racing Telemetry Dashboard running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log(`- Dashboard: http://localhost:${PORT}`);
    console.log(`- API Telemetry: POST http://localhost:${PORT}/api/telemetry`);
    console.log(`- API History: GET http://localhost:${PORT}/api/history`);
    console.log(`- API Stats: GET http://localhost:${PORT}/api/stats`);
});
