import { supabase } from '@/lib/supabase'

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

      const res = await fetch(
        "/api/sensors"
      )

      const data = await res.json()

      console.log(
        "API RESPONSE:",
        data
      )

      if (!Array.isArray(data)) {

        console.error(
          "DATA BUKAN ARRAY:",
          data
        )

        return []

      }

      // ROOM DARI STORE
      const rooms =
        useDeviceStore.getState().rooms

      const latestPerRoom =
        rooms.map((room, index) => {

          const roomId = index + 1

          const roomData =
            (data as SensorRow[]).filter(
              (item) =>
                item.room_id === roomId
            )

      const latest = roomData[0]

          // JIKA BELUM ADA SENSOR
          if (!latest) {

            return {

              id: `hub-${roomId}`,

              name: `HUB-${roomId}`,

              location: room.name,

              sensorType: "DHT22",

              temperature: 0,

              humidity: 0,

              light: 0,

              currentValue:
                `0°C / 0% RH`,

              status: "ACTIVE" as const,

              battery: 90,

              lastSync: "No Data"

            }
          }

          return {

            id: `hub-${roomId}`,

            name: `HUB-${roomId}`,

            location: room.name,

            sensorType: "DHT22",

            temperature:
              latest.temperature,

            humidity:
              latest.humidity,

            light:
              latest.light,

            currentValue:
              `${latest.temperature}°C / ${latest.humidity}% RH`,

            status:
              latest.humidity > 70
                ? "ALERT" as const
                : "ACTIVE" as const,

            battery: 90,

            lastSync: "Just Now"

          }

        })

      return latestPerRoom

    } catch (error) {

      console.error(
        "Fetch API error:",
        error
      )

      return []

    }
  }

// 🔹 Trend data chart
export const getTrendData =
  async (
    roomId: number
  ): Promise<MetricData[]> => {

    // CEGAH ERROR undefined
    if (!roomId) {
      return []
    }

    const {
      data,
      error
    } = await supabase

      .from('sensor_data')

      .select('*')

      .eq('room_id', roomId)

      .order(
        'created_at',
        { ascending: true }
      )

      .limit(10)

    if (error) {

      console.error(
        'Error fetching trend data:',
        error
      )

      return []

    }

    // JIKA DATA KOSONG
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

    return data.map((item) => ({

      time: new Date(
        item.created_at
      ).toLocaleTimeString([], {

        hour: '2-digit',

        minute: '2-digit',

        second: '2-digit'

      }),

      humidity: item.humidity,

      temperature: item.temperature,

      light: item.light

    }))
  }

// 🔹 Refresh
export const refreshSensorData =
  async (): Promise<SensorHub[]> => {

    return await getSensorHubs()

  }

console.log(
  "URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
)