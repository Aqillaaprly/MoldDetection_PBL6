import { supabase } from "@/lib/supabase"

import {
  SensorHub,
  MetricData
} from "@/types/sensor"

import { useDeviceStore } from "@/store/useDeviceStore"

interface SensorRow {
  room_id: number
  temperature: number
  humidity: number
  light: number
  created_at: string
}

// 🔹 Ambil latest sensor tiap room
export const getSensorHubs =
  async (): Promise<SensorHub[]> => {
    try {
      const res = await fetch("/api/sensors", {
        cache: "no-store"
      })

      if (!res.ok) {
        console.error(
          "GET /api/sensors gagal:",
          res.status,
          res.statusText
        )

        return []
      }

      const data = await res.json()

      console.log("API RESPONSE:", data)

      if (!Array.isArray(data)) {
        console.error("DATA BUKAN ARRAY:", data)
        return []
      }

      const rooms =
        useDeviceStore.getState().rooms

      if (!rooms || rooms.length === 0) {
        console.warn("Rooms belum tersedia di store")
        return []
      }

      const latestPerRoom: SensorHub[] =
        rooms.map((room, index) => {
          const roomId = index + 1

          const roomData =
            (data as SensorRow[])
              .filter((item) => item.room_id === roomId)
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )

          const latest = roomData[0]

          // JIKA BELUM ADA SENSOR
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
              currentValue: "0°C / 0% RH",
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
            status:
              latest.humidity > 70
                ? ("ALERT" as const)
                : ("ACTIVE" as const),
            battery: 90,
            lastSync: new Date(latest.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          }
        })

      return latestPerRoom
    } catch (error) {
      console.error("Fetch API error:", error)
      return []
    }
  }

// 🔹 Trend data chart
export const getTrendData = async (
  location: string
): Promise<MetricData[]> => {
  if (!location) {
    return []
  }

  const rooms = useDeviceStore.getState().rooms

  if (!rooms || rooms.length === 0) {
    return []
  }

  const roomIndex = rooms.findIndex(
    (room) => room.name === location
  )

  if (roomIndex < 0) {
    return []
  }

  const roomId = roomIndex + 1

  const { data, error } = await supabase
    .from("sensor_data")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(100)

  if (error) {
    console.error("Error fetching trend data:", error)
    return []
  }

  if (!data || data.length === 0) {
    return [
      {
        time: "00:00",
        humidity: 0,
        temperature: 0,
        light: 0,
      },
    ]
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

// 🔹 Refresh
export const refreshSensorData =
  async (): Promise<SensorHub[]> => {
    return await getSensorHubs()
  }