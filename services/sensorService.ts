import { supabase } from "@/lib/supabase"
import { SensorHub, MetricData } from "@/types/sensor"

interface SensorRow {
  id: number
  room_id: number
  temperature: number
  humidity: number
  light: number
  created_at: string
}

interface RoomRow {
  id: number
  name: string
}

// Helper: ambil rooms milik user yang login
async function getUserRooms(): Promise<RoomRow[]> {
  const res = await fetch("/api/rooms", { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

// Ambil latest sensor tiap room milik user
export const getSensorHubs = async (): Promise<SensorHub[]> => {
  try {
    const rooms = await getUserRooms()
    if (!rooms || rooms.length === 0) return []

    const res = await fetch("/api/sensors", { cache: "no-store" })
    if (!res.ok) return []

    const data = await res.json()
    if (!Array.isArray(data)) return []

    return rooms.map((room) => {
      const roomData = (data as SensorRow[])
        .filter((item) => item.room_id === room.id)
        .sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

      const latest = roomData[0]

      if (!latest) {
        return {
          id: `hub-${room.id}`,
          name: `HUB-${room.id}`,
          location: room.name,
          is_online: false,
          sensorType: "DHT22",
          temperature: 0,
          humidity: 0,
          light: 0,
          currentValue: "0°C / 0% RH",
          status: "ACTIVE" as const,
          battery: 90,
          lastSync: "No Data",
        }
      }

      return {
        id: `hub-${room.id}`,
        name: `HUB-${room.id}`,
        location: room.name,
        is_online: true,
        sensorType: "DHT22",
        temperature: latest.temperature,
        humidity: latest.humidity,
        light: latest.light,
        currentValue: `${latest.temperature}°C / ${latest.humidity}% RH`,
        status: latest.humidity > 70 ? ("ALERT" as const) : ("ACTIVE" as const),
        battery: 90,
        lastSync: new Date(latest.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }
    })
  } catch (error) {
    console.error("getSensorHubs error:", error)
    return []
  }
}

// Trend data chart — pakai room.id langsung dari DB
export const getTrendData = async (location: string): Promise<MetricData[]> => {
  if (!location) return []

  const rooms = await getUserRooms()
  const room = rooms.find((r) => r.name === location)
  if (!room) return []

  const { data, error } = await supabase
    .from("sensor_data")
    .select("*")
    .eq("room_id", room.id)
    .order("created_at", { ascending: true })
    .limit(100)

  if (error || !data || data.length === 0) {
    return [{ time: "00:00", humidity: 0, temperature: 0, light: 0 }]
  }

  return data.map((item) => ({
    time: new Date(item.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    humidity: item.humidity,
    temperature: item.temperature,
    light: item.light,
  }))
}

export const refreshSensorData = async (): Promise<SensorHub[]> => {
  return await getSensorHubs()
}