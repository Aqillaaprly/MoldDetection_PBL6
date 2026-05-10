"use client"

import { useEffect, useState } from "react"

import { useRoomStore } from "@/store/useRoomStore"

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

const roomMap: Record<string, number> = {
  "Living Room": 1,
  "Bedroom 1": 2,
  "Bedroom 2": 3,
  "Kitchen": 4
}

export default function AnalyticsChart() {

  const { selectedRoom } = useRoomStore()

  const roomId = roomMap[selectedRoom]

  const [data, setData] = useState<MetricData[]>([])

  useEffect(() => {

    const loadTrendData = async () => {

      try {

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

    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      <h3 className="font-semibold text-lg mb-6">
        Humidity Analytics
      </h3>

      <ResponsiveContainer width="100%" height={260}>

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#eee"
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
          />

          <Tooltip/>

          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}