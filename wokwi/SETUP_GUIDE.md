# Setup Guide - Wokwi Integration

Panduan lengkap untuk mengintegrasikan Wokwi ESP32 simulator dengan dashboard Mold Detection.

## 🎯 Langkah-langkah Setup

### 1️⃣ Setup Wokwi Project

1. Buka [Wokwi Project](https://wokwi.com/projects/462059607096891393)
2. Copy code dari file `sketch.ino` di folder `/wokwi`
3. Paste ke Wokwi editor (replace seluruh kode)
4. Klik **Run** untuk memulai simulasi

### 2️⃣ Konfigurasi IP Address

Setelah Wokwi running, Anda perlu update IP address Next.js server:

#### Option A: Jika pakai localhost (3000)
Ubah di `sketch.ino` (baris ~13):
```cpp
const char* serverUrl = "http://192.168.x.x:3000/api/sensors";
// Ganti 192.168.x.x dengan IP komputer Anda
```

**Cari IP komputer:**
- **Windows (PowerShell):** `ipconfig` → cari "IPv4 Address"
- **Mac/Linux:** `ifconfig` → cari inet address

#### Option B: Jika pakai Ngrok (akses dari device lain)
```bash
ngrok http 3000
# Dapatkan URL seperti: https://xxxx-xx-xxx-xxx.ngrok.io
```
Kemudian update di sketch.ino:
```cpp
const char* serverUrl = "https://xxxx-xx-xxx-xxx.ngrok.io/api/sensors";
```

### 3️⃣ Update Database Schema

Pastikan tabel `sensor_data` di Supabase memiliki kolom:
```sql
- id (UUID, primary key)
- temperature (FLOAT)
- humidity (FLOAT)
- light (FLOAT)
- device_id (TEXT) - optional
- source (TEXT) - untuk membedakan 'wokwi' vs 'simulated'
- created_at (TIMESTAMP)
```

Jika belum ada, jalankan migration:
```sql
CREATE TABLE IF NOT EXISTS sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  light FLOAT NOT NULL,
  device_id TEXT DEFAULT 'wokwi_esp32_01',
  source TEXT DEFAULT 'simulated',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sensor_created_at ON sensor_data(created_at DESC);
CREATE INDEX idx_sensor_device_id ON sensor_data(device_id);
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 5️⃣ Test Komunikasi

1. Buka serial monitor di Wokwi (klik 🔧 icon)
2. Anda akan melihat output seperti:
   ```
   Connecting to WiFi...
   WiFi connected!
   IP address: 192.168.4.1
   Sending: {"deviceId":"wokwi_esp32_01",...}
   Response: 201 - {"success":true,...}
   ```

3. Buka dashboard di `http://localhost:3000/monitoring`
4. Anda akan melihat data real-time dari Wokwi

## 📊 API Endpoint

### POST `/api/sensors`
Menerima data sensor dari Wokwi

**Request:**
```json
{
  "deviceId": "wokwi_esp32_01",
  "temperature": 25.5,
  "humidity": 65.0,
  "light": 450.0,
  "timestamp": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data received and saved",
  "data": {
    "id": "uuid...",
    "temperature": 25.5,
    "humidity": 65.0,
    "light": 450.0,
    "created_at": "2024-05-08T10:30:00Z"
  }
}
```

### GET `/api/sensors`
Mengambil 10 data sensor terbaru

## 🛠️ Troubleshooting

### ❌ Error: "Connection refused"
- Pastikan Next.js server running (`npm run dev`)
- Periksa IP address di sketch.ino sudah sesuai
- Pastikan firewall tidak blocking port 3000

### ❌ Error: "WiFi failed to connect"
- Di Wokwi, WiFi SSID default adalah `Wokwi-GUEST`
- Jika ingin ubah, edit di sketch.ino (baris ~14)

### ❌ Data tidak muncul di dashboard
- Cek Supabase connection di `.env.local`
- Lihat console log di Next.js server (terminal)
- Pastikan tabel `sensor_data` sudah ada di Supabase

### ❌ Serial Monitor menunjukkan "Invalid sensor readings"
- Periksa kabel DHT22 di circuit diagram Wokwi
- Restart simulasi (klik ⟺ button)

## 📱 Integrasi ke Dashboard

Component `WokwiDeviceStatus` sudah siap digunakan di halaman monitoring:

```tsx
import { WokwiDeviceStatus } from '@/components/monitoring/WokwiDeviceStatus'

export default function MonitoringPage() {
  return (
    <div>
      <WokwiDeviceStatus />
      {/* Component lain... */}
    </div>
  )
}
```

## 📝 Files yang Diupdate

- `/wokwi/sketch.ino` - Arduino code untuk ESP32
- `/app/api/sensors/route.ts` - API endpoint (support POST)
- `/services/wokwiService.ts` - Service untuk komunikasi Wokwi
- `/components/monitoring/WokwiDeviceStatus.tsx` - Component display status

## 🔄 Next Steps

1. ✅ Copy sketch.ino ke Wokwi
2. ✅ Update IP address
3. ✅ Start Next.js server
4. ✅ Test komunikasi
5. ✅ Lihat data di dashboard
6. ⏳ (Optional) Setup automation based on sensor threshold
7. ⏳ (Optional) Setup alert notifications

## 📚 Resources

- [Wokwi Documentation](https://docs.wokwi.com/)
- [ESP32 Arduino Reference](https://docs.espressif.com/projects/arduino-esp32/)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)
