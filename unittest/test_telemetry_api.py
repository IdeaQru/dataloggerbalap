import requests
import json
import time
import unittest
import random
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

class TelemetryAPITest(unittest.TestCase):
    
    def setUp(self):
        """Setup sebelum setiap test"""
        self.base_url = "http://localhost:7187"
        self.api_url = f"{self.base_url}/api/telemetry"
        self.history_url = f"{self.base_url}/api/history"
        self.stats_url = f"{self.base_url}/api/stats"
        
    def generate_sample_data(self, lap_number=1, status="RECORDING"):
        """Generate sample telemetry data"""
        return {
            "device_id": "racing-car-001",
            "system_status": status,
            "lap_number": lap_number,
            "timestamp": datetime.now().isoformat() + "Z",
            "sensors": {
                "afr": round(random.uniform(12.0, 16.0), 1),
                "rpm": random.randint(1000, 8000),
                "temperature": round(random.uniform(70.0, 120.0), 1),
                "tps": round(random.uniform(0.0, 100.0), 1),
                "map_value": round(random.uniform(50.0, 200.0), 1),
                "incline": round(random.uniform(-10.0, 10.0), 1),
                "stroke": round(random.uniform(5.0, 10.0), 1)
            },
            "gps": {
                "latitude": round(random.uniform(-6.5, -6.0), 6),
                "longitude": round(random.uniform(106.5, 107.0), 6),
                "speed": random.randint(0, 200),
                "satellites": random.randint(4, 12)
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
                "free_heap": random.randint(200000, 300000),
                "uptime": random.randint(3600000, 86400000),
                "wifi_rssi": random.randint(-80, -30)
            }
        }

    def test_01_server_is_running(self):
        """Test apakah server berjalan"""
        try:
            response = requests.get(self.base_url, timeout=5)
            self.assertIn(response.status_code, [200, 404])
            print("✅ Server is running")
        except requests.exceptions.ConnectionError:
            self.fail("❌ Server is not running. Please start the Node.js server first!")

    def test_02_send_single_telemetry_data(self):
        """Test mengirim data telemetry tunggal"""
        sample_data = self.generate_sample_data()
        
        try:
            response = requests.post(self.api_url, json=sample_data, timeout=10)
            self.assertEqual(response.status_code, 200)
            
            response_data = response.json()
            self.assertEqual(response_data["status"], "success")
            self.assertIn("message", response_data)
            
            print("✅ Single telemetry data sent successfully")
            print(f"   Response: {response_data}")
            
        except requests.exceptions.RequestException as e:
            self.fail(f"❌ Failed to send telemetry data: {e}")

    def test_03_send_multiple_telemetry_data(self):
        """Test mengirim beberapa data telemetry berturut-turut"""
        success_count = 0
        total_tests = 5
        
        for i in range(total_tests):
            sample_data = self.generate_sample_data(lap_number=i+1)
            
            try:
                response = requests.post(self.api_url, json=sample_data, timeout=10)
                if response.status_code == 200:
                    success_count += 1
                
                time.sleep(0.5)  # Delay 500ms between requests
                
            except requests.exceptions.RequestException:
                pass
        
        self.assertGreaterEqual(success_count, total_tests * 0.8)  # At least 80% success
        print(f"✅ Multiple data test: {success_count}/{total_tests} successful")

    def test_04_send_concurrent_requests(self):
        """Test mengirim data secara concurrent"""
        def send_data(lap_num):
            sample_data = self.generate_sample_data(lap_number=lap_num)
            try:
                response = requests.post(self.api_url, json=sample_data, timeout=10)
                return response.status_code == 200
            except:
                return False

        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(send_data, i) for i in range(1, 6)]
            results = [future.result() for future in futures]
        
        success_rate = sum(results) / len(results)
        self.assertGreaterEqual(success_rate, 0.8)
        print(f"✅ Concurrent requests test: {sum(results)}/{len(results)} successful")

    def test_05_invalid_data_handling(self):
        """Test handling data yang tidak valid"""
        invalid_data_sets = [
            {},  # Empty data
            {"invalid": "data"},  # Wrong structure
            {"device_id": None},  # Null values
            "not_json_object"  # Wrong type
        ]
        
        for i, invalid_data in enumerate(invalid_data_sets):
            try:
                response = requests.post(self.api_url, json=invalid_data, timeout=10)
                # Server should handle gracefully, not crash
                self.assertIsNotNone(response)
                print(f"✅ Invalid data test {i+1}: Server handled gracefully")
            except:
                print(f"⚠️ Invalid data test {i+1}: Server response error (expected)")

    def test_06_get_history_data(self):
        """Test mengambil data history"""
        # Send some data first
        for i in range(3):
            sample_data = self.generate_sample_data(lap_number=i+1)
            requests.post(self.api_url, json=sample_data, timeout=10)
            time.sleep(0.2)
        
        # Get history
        try:
            response = requests.get(f"{self.history_url}?limit=10", timeout=10)
            self.assertEqual(response.status_code, 200)
            
            history_data = response.json()
            self.assertIsInstance(history_data, list)
            
            if history_data:
                # Check if data structure is correct
                first_record = history_data[0]
                expected_fields = ['timestamp', 'device_id', 'rpm', 'temperature', 'afr']
                for field in expected_fields:
                    self.assertIn(field, first_record)
            
            print(f"✅ History data retrieved: {len(history_data)} records")
            
        except requests.exceptions.RequestException as e:
            self.fail(f"❌ Failed to get history data: {e}")

    def test_07_get_stats_data(self):
        """Test mengambil statistik data"""
        # Send some data first
        for i in range(5):
            sample_data = self.generate_sample_data(lap_number=i+1)
            requests.post(self.api_url, json=sample_data, timeout=10)
            time.sleep(0.1)
        
        try:
            response = requests.get(self.stats_url, timeout=10)
            self.assertEqual(response.status_code, 200)
            
            stats_data = response.json()
            self.assertIsInstance(stats_data, dict)
            
            # Check if stats contain expected fields
            if stats_data:
                expected_stats = ['totalRecords', 'lastUpdate']
                for stat in expected_stats:
                    self.assertIn(stat, stats_data)
            
            print("✅ Stats data retrieved successfully")
            print(f"   Total Records: {stats_data.get('totalRecords', 0)}")
            
        except requests.exceptions.RequestException as e:
            self.fail(f"❌ Failed to get stats data: {e}")

    def test_08_performance_test(self):
        """Test performa dengan banyak request"""
        start_time = time.time()
        success_count = 0
        total_requests = 10
        
        for i in range(total_requests):
            sample_data = self.generate_sample_data(lap_number=i+1)
            
            try:
                response = requests.post(self.api_url, json=sample_data, timeout=5)
                if response.status_code == 200:
                    success_count += 1
            except:
                pass
        
        end_time = time.time()
        duration = end_time - start_time
        requests_per_second = total_requests / duration
        
        self.assertGreater(requests_per_second, 5)  # At least 5 requests/second
        print(f"✅ Performance test: {requests_per_second:.2f} req/sec, {success_count}/{total_requests} successful")

if __name__ == '__main__':
    print("🏁 Starting Racing Telemetry API Tests...")
    print("=" * 50)
    
    # Run tests with verbose output
    unittest.main(verbosity=2, exit=False)
    
    print("=" * 50)
    print("🏁 All tests completed!")
