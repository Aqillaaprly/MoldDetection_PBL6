import { supabase } from '@/lib/supabase'
import { SensorHub, MetricData } from "@/types/sensor"

interface SensorRow {
  room_id: number
  temperature: number
  humidity: number
  light: number
  created_at: string
}

const rooms = [

  {
    id: 1,
    name: "Living Room"
  },

  {
    id: 2,
    name: "Bedroom 1"
  },

  {
    id: 3,
    name: "Bedroom 2"
  },

  {
    id: 4,
    name: "Kitchen"
  }

]

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

    const latestPerRoom = rooms.map((room) => {

      const roomData = (data as SensorRow[]).filter(
        (item) => item.room_id === room.id
      )

      const latest = roomData[0]

      if (!latest) return null

      return {

        id: `hub-${room.id}`,

        name: `HUB-${room.id}`,

        location: room.name,

        sensorType: "DHT22",

        temperature: latest.temperature,

        humidity: latest.humidity,

        light: latest.light,

        currentValue:
          `${latest.temperature}°C / ${latest.humidity}% RH`,

        status:
          latest.humidity > 70
            ? "ALERT" as const
            : "ACTIVE" as const,

        battery: 90,

        lastSync: "Just Now"

      }

    }).filter(Boolean) as SensorHub[]

    return latestPerRoom

  } catch (error) {

    console.error("Fetch API error:", error)

    return []

  }
}

// 🔹 Trend data untuk chart berdasarkan room
export const getTrendData = async (
  roomId: number
): Promise<MetricData[]> => {

  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(10)

  if (error) {

    console.error('Error fetching trend data:', error)

    return []

  }

  return data.map((item) => ({

    time: new Date(item.created_at).toLocaleTimeString([], {

      hour: '2-digit',

      minute: '2-digit',

      second: '2-digit'

    }),

    humidity: item.humidity,

    temperature: item.temperature,

    light: item.light

  }))
}

// 🔹 Refresh data
export const refreshSensorData = async (): Promise<SensorHub[]> => {

  return await getSensorHubs()

}

console.log(
  "URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
)