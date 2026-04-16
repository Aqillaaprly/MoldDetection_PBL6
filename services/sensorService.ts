import { SensorHub, SensorReading, MetricData } from "@/types/sensor"

// Mock data - dapat diganti dengan API calls
export const mockSensorHubs: SensorHub[] = [
  {
    id: "hub-entry-01",
    name: "HUB-ENTRY-01",
    location: "Main Door Sensor",
    sensorType: "DHT22",
    currentValue: "24.2°C / 42% RH",
    status: "ACTIVE",
    battery: 88,
    lastSync: "Just Now"
  },
  {
    id: "hub-kitch-04",
    name: "HUB-KITCH-04",
    location: "Kitchen Humidity Probe",
    sensorType: "SHT31",
    currentValue: "26.8°C / 61% RH",
    status: "ALERT",
    battery: 24,
    lastSync: "2m ago"
  },
  {
    id: "hub-mbed-02",
    name: "HUB-MBED-02",
    location: "Pressure Hose Outlet",
    sensorType: "BME680",
    currentValue: "21.0°C / 38% RH",
    status: "ACTIVE",
    battery: 100,
    lastSync: "16s ago"
  }
]

export const mockTrendData: MetricData[] = [
  { time: "12:00", humidity: 38, temperature: 22.0, light: 450 },
  { time: "13:00", humidity: 42, temperature: 22.5, light: 520 },
  { time: "14:00", humidity: 45, temperature: 23.2, light: 680 },
  { time: "15:00", humidity: 40, temperature: 22.8, light: 750 },
  { time: "16:00", humidity: 35, temperature: 22.4, light: 820 },
  { time: "17:00", humidity: 34, temperature: 22.1, light: 720 },
  { time: "18:00", humidity: 36, temperature: 21.9, light: 580 },
  { time: "19:00", humidity: 38, temperature: 22.0, light: 520 },
  { time: "20:00", humidity: 40, temperature: 22.3, light: 450 },
  { time: "21:00", humidity: 42, temperature: 22.6, light: 380 }
]

export const getSensorHubs = async (): Promise<SensorHub[]> => {
  // Simulasi API call dengan delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockSensorHubs
}

export const getTrendData = async (): Promise<MetricData[]> => {
  // Simulasi API call dengan delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockTrendData
}

export const refreshSensorData = async (): Promise<SensorHub[]> => {
  // Simulasi API call untuk refresh data dengan delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockSensorHubs.map(hub => ({
    ...hub,
    lastSync: "Just Now"
  }))
}
