# Wokwi Integration Debug Guide

## ✅ What's Fixed

1. **API GET endpoint** - Now returns clean array of sensor data
2. **Monitoring page** - Auto-refresh every 5 seconds
3. **sensorService** - Better error handling & data parsing

---

## 🔍 How to Test & Debug

### **Step 1: Check Supabase Connection**

1. Open Supabase dashboard
2. Go to **SQL Editor**
3. Run this query:
```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'sensor_data';

-- Check table schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sensor_data';

-- Check existing data
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 5;
```

If table doesn't exist, create it:
```sql
CREATE TABLE sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  light FLOAT NOT NULL,
  device_id TEXT DEFAULT 'wokwi_esp32_01',
  source TEXT DEFAULT 'wokwi',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sensor_data_created_at ON sensor_data(created_at DESC);
CREATE INDEX idx_sensor_data_device_id ON sensor_data(device_id);
```

---

### **Step 2: Verify Environment Variables**

Check `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://igjdsrkzwhopgjntsdnd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

---

### **Step 3: Test API Manually**

**Terminal 1: Start Next.js server**
```bash
npm run dev -- --hostname 0.0.0.0
```

**Terminal 2: Test POST endpoint**
```bash
curl -X POST http://localhost:3000/api/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "test_esp32",
    "temperature": 25.5,
    "humidity": 65.0,
    "light": 450.0
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Data received and saved",
  "data": {...}
}
```

**Terminal 2: Test GET endpoint**
```bash
curl http://localhost:3000/api/sensors
```

Expected response: Array of sensor readings

---

### **Step 4: Wokwi Sketch Verification**

Check sketch issues:

#### **Issue 1: LDR_PIN Configuration**
- Sketch uses `LDR_PIN 34` (ADC pin)
- Wokwi circuit diagram must have photoresistor on pin 34
- Pin 34 ADC range: 0-4095

#### **Issue 2: WiFi Connection**
- Wokwi default WiFi: `Wokwi-GUEST` (no password)
- Server URL: `http://192.168.111.100:3000/api/sensors`
  - Replace `192.168.111.100` with your actual computer IP

**Find your IP:**
```bash
# Windows
ipconfig | findstr "IPv4"

# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1
```

#### **Issue 3: Sketch Serial Output**
In Wokwi Serial Monitor, you should see:
```
=== CONNECT WIFI ===
.....
✅ WiFi Connected
IP: 192.168.4.1

📤 Sending:
{"deviceId":"mold_esp32_01","temperature":25.50,"humidity":65.00,"light":450}
✅ Response: 201
```

---

### **Step 5: Monitoring Page Test**

1. Start server: `npm run dev`
2. Open: `http://localhost:3000/monitoring`
3. Open DevTools (F12)
4. Go to **Console** tab
5. You should see:
```
📊 API RESPONSE: [
  {
    id: "uuid...",
    temperature: 25.5,
    humidity: 65,
    light: 450,
    device_id: "wokwi_esp32_01",
    source: "wokwi",
    created_at: "2024-05-10T10:30:00Z"
  }
]
```

6. Watch refresh every 5 seconds

---

## 🛠️ Troubleshooting Checklist

| Issue | Debug Step | Solution |
|-------|-----------|----------|
| "Connection refused" | Check if server running | `npm run dev` in terminal |
| "Supabase error" | Check `.env.local` | Add correct credentials |
| "WiFi connection failed" | Check Wokwi circuit | Ensure WiFi module active |
| "Data not posting" | Check POST response | Look at serial monitor response code |
| "Data not showing" | Check DB table | Run SQL create query |
| "Dashboard not updating" | Check console logs | Look for API RESPONSE messages |

---

## 📱 Full Data Flow

```
[Wokwi ESP32]
    ↓ (reads DHT22 + LDR every 2s)
[Serial Output: "Temp: X C | Humidity: Y% | LDR: Z"]
    ↓ (POST JSON every 10s)
[http://192.168.111.100:3000/api/sensors]
    ↓ (validate & insert)
[Supabase: sensor_data table]
    ↓ (fetch latest 10 records)
[GET /api/sensors]
    ↓ (return array)
[sensorService.getSensorHubs()]
    ↓ (parse & format)
[Monitoring Page]
    ↓ (display + refresh every 5s)
[Real-time Dashboard 📊]
```

---

## 🎯 Next Actions

1. **Verify Supabase table exists** ← DO THIS FIRST
2. **Update sketch with your IP** ← Replace 192.168.111.100
3. **Test API with curl** ← Confirm endpoint works
4. **Run Wokwi** ← Watch serial monitor
5. **Check dashboard** ← See data update

---

Good luck! Report any errors with exact error messages.
