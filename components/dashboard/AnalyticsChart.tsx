"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
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
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">

      <h3 className="font-semibold mb-4">Humidity Analytics</h3>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <XAxis dataKey="time"/>
          <YAxis/>

          <Tooltip/>

          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#6366f1"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}