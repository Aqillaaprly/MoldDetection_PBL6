import { supabase } from '@/lib/supabase'
import { SensorHub, MetricData } from "@/types/sensor"

// 🔹 Ambil data terbaru dari database
export const getSensorHubs = async () => {
  try {
    const res = await fetch("/api/sensors")
    const data = await res.json()

    console.log("API RESPONSE:", data)

    if (!Array.isArray(data)) {
      console.error("DATA BUKAN ARRAY:", data)
      return []
    }

    return data.map((item: any, index: number) => ({
      id: `hub-${index}`,
      name: `HUB-${index}`,
      location: "Room Sensor",
      sensorType: "DHT22",
      temperature: item.temperature,
      humidity: item.humidity,
      light: item.light,

      currentValue: `${item.temperature}°C / ${item.humidity}% RH`,
      status: item.humidity > 70 ? "ALERT" : "ACTIVE",
      battery: 90,
      lastSync: "Just Now"
    }))
  } catch (error) {
    console.error("Fetch API error:", error)
    return []
  }
}

// 🔹 Trend data untuk chart
export const getTrendData = async (): Promise<MetricData[]> => {
  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(10)

  if (error) {
    console.error('Error fetching trend data:', error)
    return []
  }

  return data.map((item) => ({
    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    humidity: item.humidity,
    temperature: item.temperature,
    light: item.light
  }))
}

// 🔹 Refresh (ambil ulang data)
export const refreshSensorData = async (): Promise<SensorHub[]> => {
  return await getSensorHubs()
}

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)