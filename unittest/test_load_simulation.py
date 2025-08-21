import requests
import json
import time
import threading
from datetime import datetime
import random

class TelemetryLoadTest:
    
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api/telemetry"
        self.success_count = 0
        self.error_count = 0
        self.lock = threading.Lock()
        
    def generate_realistic_data(self, lap_number=1):
        """Generate realistic racing telemetry data"""
        # Simulate racing conditions
        rpm_base = random.choice([2000, 4000, 6000, 8000])  # Different gear positions
        temp_variation = random.uniform(-5, 15)  # Temperature can vary
        
        return {
            "device_id": "racing-car-001",
            "system_status": "RECORDING",
            "lap_number": lap_number,
            "timestamp": datetime.now().isoformat() + "Z",
            "sensors": {
                "afr": round(random.uniform(13.5, 15.2), 1),  # Realistic AFR range
                "rpm": rpm_base + random.randint(-500, 500),
                "temperature": round(85.0 + temp_variation, 1),
                "tps": round(random.uniform(10.0, 95.0), 1),
                "map_value": round(random.uniform(80.0, 150.0), 1),
                "incline": round(random.uniform(-5.0, 5.0), 1),
                "stroke": round(random.uniform(6.0, 8.5), 1)
            },
            "gps": {
                "latitude": -6.200000 + random.uniform(-0.01, 0.01),
                "longitude": 106.816666 + random.uniform(-0.01, 0.01),
                "speed": random.randint(50, 180),  # Racing speed
                "satellites": random.randint(6, 10)  # Good GPS signal
            },
            "ai_classification": {
                "classification": random.choices([0, 1, 2], weights=[70, 25, 5])[0],  # Mostly normal
                "classification_text": random.choices(
                    ["Normal", "Warning", "Critical"], 
                    weights=[70, 25, 5]
                )[0]
            },
            "cooling": {
                "system_active": True,  # Always on during racing
                "fan_on": random.choice([True, False]),
                "ewp_on": True,
                "current_temp": round(85.0 + temp_variation, 1),
                "cutoff_active": False
            },
            "system_health": {
                "free_heap": random.randint(220000, 280000),
                "uptime": random.randint(3600000, 7200000),  # 1-2 hours
                "wifi_rssi": random.randint(-70, -40)  # Good signal
            }
        }
    
    def send_data_worker(self, duration_seconds=60, interval=1.0):
        """Worker thread untuk mengirim data"""
        start_time = time.time()
        lap = 1
        
        while time.time() - start_time < duration_seconds:
            try:
                data = self.generate_realistic_data(lap_number=lap)
                response = requests.post(self.api_url, json=data, timeout=5)
                
                with self.lock:
                    if response.status_code == 200:
                        self.success_count += 1
                    else:
                        self.error_count += 1
                
                lap += 1
                time.sleep(interval)
                
            except Exception as e:
                with self.lock:
                    self.error_count += 1
                print(f"Error in worker: {e}")
    
    def run_load_test(self, num_clients=3, duration=60, interval=1.0):
        """Run load test dengan multiple clients"""
        print(f"🚀 Starting Load Test:")
        print(f"   - Clients: {num_clients}")
        print(f"   - Duration: {duration} seconds")
        print(f"   - Interval: {interval} seconds")
        print(f"   - Expected requests: {num_clients * duration / interval}")
        print("-" * 40)
        
        # Reset counters
        self.success_count = 0
        self.error_count = 0
        
        # Start worker threads
        threads = []
        start_time = time.time()
        
        for i in range(num_clients):
            thread = threading.Thread(
                target=self.send_data_worker,
                args=(duration, interval)
            )
            thread.start()
            threads.append(thread)
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        total_time = end_time - start_time
        total_requests = self.success_count + self.error_count
        
        # Print results
        print("-" * 40)
        print("📊 Load Test Results:")
        print(f"   - Total Time: {total_time:.2f} seconds")
        print(f"   - Total Requests: {total_requests}")
        print(f"   - Successful: {self.success_count}")
        print(f"   - Errors: {self.error_count}")
        print(f"   - Success Rate: {(self.success_count/total_requests)*100:.1f}%")
        print(f"   - Requests/Second: {total_requests/total_time:.2f}")
        print(f"   - Successful Req/Sec: {self.success_count/total_time:.2f}")

if __name__ == "__main__":
    # Test different scenarios
    tester = TelemetryLoadTest()
    
    print("=" * 50)
    print("🏎️ Racing Telemetry Load Testing")
    print("=" * 50)
    
    # Test 1: Normal load (3 clients, 1 request/second each)
    print("\n1. Normal Load Test (3 clients, 1 req/sec, 30 sec)")
    tester.run_load_test(num_clients=3, duration=30, interval=1.0)
    
    time.sleep(5)  # Rest between tests
    
    # Test 2: High frequency (2 clients, 2 requests/second each)
    print("\n2. High Frequency Test (2 clients, 2 req/sec, 20 sec)")
    tester.run_load_test(num_clients=2, duration=20, interval=0.5)
    
    time.sleep(5)  # Rest between tests
    
    # Test 3: Stress test (5 clients, 1 request/second each)
    print("\n3. Stress Test (5 clients, 1 req/sec, 30 sec)")
    tester.run_load_test(num_clients=5, duration=30, interval=1.0)
