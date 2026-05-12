"use client"

import { useEffect, useState } from "react"

import { useRoomStore } from "@/store/useRoomStore"
import { useDeviceStore } from "@/store/useDeviceStore"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

import { getTrendData } from "@/services/sensorService"
import { MetricData } from "@/types/sensor"

export default function AnalyticsChart() {

  const { selectedRoom } = useRoomStore()

  const { rooms } = useDeviceStore()

  const [data, setData] = useState<MetricData[]>([])

  // AUTO GENERATE ROOM ID BERDASARKAN INDEX ROOM
  const roomIndex = rooms.findIndex(
    (room) => room.name === selectedRoom
  )

  const roomId =
    roomIndex >= 0
      ? roomIndex + 1
      : null

  useEffect(() => {

    const loadTrendData = async () => {

      try {

        // CEGAH ERROR room undefined
        if (!roomId) {

          setData([])

          return
        }

        const trend = await getTrendData(roomId)

        setData(trend)

      } catch (error) {

        console.error(
          "Error loading analytics chart:",
          error
        )

      }
    }

    loadTrendData()

    const interval = setInterval(
      loadTrendData,
      5000
    )

    return () => clearInterval(interval)

  }, [roomId])

  return (

<div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full h-[300px]">

  <h3 className="font-semibold text-lg mb-6">
    Humidity Analytics
  </h3>

  <ResponsiveContainer width="100%" height="100%">

    <LineChart data={data}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="time" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="humidity"
        stroke="#4f46e5"
        strokeWidth={3}
      />

    </LineChart>

  </ResponsiveContainer>

</div>
  )
}