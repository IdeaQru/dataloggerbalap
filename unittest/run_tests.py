import requests
import random
import time
import json
from datetime import datetime

# Konfigurasi
API_URL = "http://localhost:7187/api/telemetry"  # Ganti dengan URL server Anda
INTERVAL = 1  # Interval dalam detik

def generate_random_data():
    """Generate data telemetry random"""
    return {
        "device_id": "racing-car-001",
        "system_status": random.choice(["IDLE", "RECORDING", "TRANSMITTING"]),
        "lap_number": random.randint(1, 20),
        "timestamp": datetime.now().isoformat() + "Z",
        "sensors": {
            "afr": round(random.uniform(12.0, 16.0), 1),
            "rpm": random.randint(1000, 9000),
            "temperature": round(random.uniform(70.0, 120.0), 1),
            "tps": round(random.uniform(0, 100), 1),
            "map_value": round(random.uniform(60.0, 150.0), 1),
            "incline": round(random.uniform(-10.0, 10.0), 1),
            "stroke": round(random.uniform(5.0, 10.0), 1)
        },
        "gps": {
            "latitude": round(random.uniform(-6.5, -6.0), 6),
            "longitude": round(random.uniform(106.5, 107.0), 6),
            "speed": random.randint(0, 200),
            "satellites": random.randint(3, 12)
        },
        "ai_classification": {
            "classification": random.randint(0, 2),
            "classification_text": random.choice(["Normal", "Warning", "Critical"])
        },
        "cooling": {
            "system_active": random.choice([True, False]),
            "fan_on": random.choice([True, False]),
            "ewp_on": random.choice([True, False]),
            "current_temp": round(random.uniform(70.0, 110.0), 1),
            "cutoff_active": False
        },
        "system_health": {
            "free_heap": random.randint(150000, 300000),
            "uptime": random.randint(1000, 10000000),
            "wifi_rssi": random.randint(-90, -30)
        }
    }

def send_data():
    """Kirim data ke API"""
    data = generate_random_data()
    
    try:
        response = requests.post(API_URL, json=data, timeout=5)
        if response.status_code == 200:
            print(f"✅ Data sent successfully - RPM: {data['sensors']['rpm']}, Temp: {data['sensors']['temperature']}°C")
            return True
        else:
            print(f"❌ Failed to send data - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Program utama"""
    print("🏎️ Racing Telemetry Data Sender")
    print(f"📡 Sending to: {API_URL}")
    print(f"⏱️ Interval: {INTERVAL} second(s)")
    print("-" * 50)
    
    counter = 0
    
    try:
        while True:
            counter += 1
            print(f"[{counter}] {datetime.now().strftime('%H:%M:%S')} - ", end="")
            send_data()
            time.sleep(INTERVAL)
            
    except KeyboardInterrupt:
        print(f"\n🛑 Stopped after sending {counter} data points")

if __name__ == "__main__":
    main()
