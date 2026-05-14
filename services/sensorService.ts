import { supabase } from '@/lib/supabase'
import { SensorHub, MetricData } from "@/types/sensor"
import { useDeviceStore } from "@/store/useDeviceStore"

interface SensorRow {
  room_id: number
  temperature: number
  humidity: number
  light: number
  created_at: string
}

// 🔹 Ambil latest sensor tiap room
export const getSensorHubs = async (): Promise<SensorHub[]> => {
  try {
    const res = await fetch("/api/sensors")
    const data = await res.json()

    console.log("API RESPONSE:", data)

    if (!Array.isArray(data)) {
      console.error("DATA BUKAN ARRAY:", data)
      return []
    }

    const rooms = useDeviceStore.getState().rooms

    const latestPerRoom = rooms.map((room, index) => {
      const roomId = index + 1

      const roomData = (data as SensorRow[]).filter(
        (item) => item.room_id === roomId
      )

      const latest = roomData[0]

      if (!latest) {
        return {
          id: `hub-${roomId}`,
          name: `HUB-${roomId}`,
          location: room.name,
          is_online: false,
          sensorType: "DHT22",
          temperature: 0,
          humidity: 0,
          light: 0,
          currentValue: `0°C / 0% RH`,
          status: "ACTIVE" as const,
          battery: 90,
          lastSync: "No Data"
        }
      }

      return {
        id: `hub-${roomId}`,
        name: `HUB-${roomId}`,
        location: room.name,
        is_online: true,
        sensorType: "DHT22",
        temperature: latest.temperature,
        humidity: latest.humidity,
        light: latest.light,
        currentValue: `${latest.temperature}°C / ${latest.humidity}% RH`,
        status: latest.humidity > 70 ? "ALERT" as const : "ACTIVE" as const,
        battery: 90,
        lastSync: "Just Now"
      }
    })

    return latestPerRoom

  } catch (error) {
    console.error("Fetch API error:", error)
    return []
  }
}

// 🔹 Trend data chart — per 1 menit
export const getTrendData = async (location: string): Promise<MetricData[]> => {
  if (!location) return []

  const rooms = useDeviceStore.getState().rooms
  const roomIndex = rooms.findIndex((r) => r.name === location)

  if (roomIndex < 0) return []

  const roomId = roomIndex + 1

  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Error fetching trend data:', error)
    return []
  }

  if (!data || data.length === 0) {
    return [
      {
        time: "00:00",
        humidity: 0,
        temperature: 0,
        light: 0
      }
    ]
  }

  // Group per 1 menit, ambil rata-rata
  const grouped = new Map<string, {
    humidity: number[]
    temperature: number[]
    light: number[]
  }>()

  data.forEach((item) => {
    const date = new Date(item.created_at)

    // Bulatkan ke 1 menit
    date.setSeconds(0, 0)

    const key = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    if (!grouped.has(key)) {
      grouped.set(key, {
        humidity: [],
        temperature: [],
        light: []
      })
    }

    grouped.get(key)!.humidity.push(item.humidity)
    grouped.get(key)!.temperature.push(item.temperature)
    grouped.get(key)!.light.push(item.light)
  })

  const avg = (arr: number[]) =>
    Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10

  return Array.from(grouped.entries()).map(([time, values]) => ({
    time,
    humidity: avg(values.humidity),
    temperature: avg(values.temperature),
    light: avg(values.light)
  }))
}

// 🔹 Refresh
export const refreshSensorData = async (): Promise<SensorHub[]> => {
  return await getSensorHubs()
}

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)