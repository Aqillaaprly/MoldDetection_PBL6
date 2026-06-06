import { supabase } from "@/lib/supabase"
import { SensorHub, MetricData } from "@/types/sensor"

interface SensorRow {
  id: number
  room_id: number

  temperature: number
  humidity: number
  light: number

  mold_risk: string | null
  status: string | null

  created_at: string
}

interface RoomRow {
  id: number
  name: string
}

async function getUserRooms(): Promise<RoomRow[]> {
  const res = await fetch("/api/rooms", {
    cache: "no-store",
  })

  if (!res.ok) return []

  return res.json()
}

// ================================
// Dashboard Cards
// ================================
export const getSensorHubs = async (): Promise<SensorHub[]> => {
  try {
    const rooms = await getUserRooms()

    if (!rooms || rooms.length === 0) {
      return []
    }

    const res = await fetch("/api/sensors", {
      cache: "no-store",
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()

    if (!Array.isArray(data)) {
      return []
    }

    return rooms.map((room) => {
      const roomData = (data as SensorRow[])
        .filter((item) => item.room_id === room.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
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

          moldRisk: "LOW",
          sensorStatus: "NO DATA",

          currentValue: "0°C / 0% RH",

          status: "ACTIVE",

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

        moldRisk: latest.mold_risk ?? "LOW",
        sensorStatus: latest.status ?? "AMAN",

        currentValue: `${latest.temperature}°C / ${latest.humidity}% RH`,

        status:
          latest.mold_risk === "HIGH"
            ? "ALERT"
            : "ACTIVE",

        battery: 90,

        lastSync: new Date(
          latest.created_at
        ).toLocaleTimeString([], {
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

// ================================
// Analytics Chart
// ================================
export const getTrendData = async (
  location: string
): Promise<MetricData[]> => {
  if (!location) return []

  const rooms = await getUserRooms()

  const room = rooms.find(
    (r) => r.name === location
  )

  if (!room) {
    return []
  }

  const { data, error } = await supabase
    .from("sensor_data")
    .select("*")
    .eq("room_id", room.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(100)

  if (
    error ||
    !data ||
    data.length === 0
  ) {
    return [
      {
        time: "00:00",
        humidity: 0,
        temperature: 0,
        light: 0,
      },
    ]
  }

  const ordered = [...data].reverse()

  return ordered.map((item) => ({
    time: new Date(
      item.created_at
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),

    humidity: item.humidity,
    temperature: item.temperature,
    light: item.light,
  }))
}

export const refreshSensorData =
  async (): Promise<SensorHub[]> => {
    return await getSensorHubs()
  }