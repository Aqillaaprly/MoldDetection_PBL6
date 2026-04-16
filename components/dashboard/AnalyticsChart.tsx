"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

const data = [
  { time: "08:00", humidity: 70 },
  { time: "10:00", humidity: 75 },
  { time: "12:00", humidity: 78 },
  { time: "14:00", humidity: 80 },
  { time: "16:00", humidity: 76 }
]

export default function AnalyticsChart() {

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      <h3 className="font-semibold text-lg mb-6">
        Humidity Analytics
      </h3>

      <ResponsiveContainer width="100%" height={260}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#eee"/>

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