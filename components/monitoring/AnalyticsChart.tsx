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

const METRICS = [
  {
    key: "humidity",
    label: "Humidity (%)",
    mobileLabel: "Hum (%)",
    color: "#42a785",
    unit: "%",
    axis: "left"
  },
  {
    key: "temperature",
    label: "Temperature (°C)",
    mobileLabel: "Temp (°C)",
    color: "#f97316",
    unit: "°C",
    axis: "left"
  },
  {
    key: "light",
    label: "Light (lux)",
    mobileLabel: "Light (lux)",
    color: "#8b5cf6",
    unit: " lux",
    axis: "right"
  }
]

export default function AnalyticsChart() {
  const { selectedRoom } = useRoomStore()

  const [data, setData] = useState<MetricData[]>([])

  const [activeMetrics, setActiveMetrics] = useState<string[]>([
    "humidity",
    "temperature",
    "light"
  ])

  useEffect(() => {
    const loadTrendData = async () => {
      try {
        if (!selectedRoom) {
          setData([])
          return
        }

        const trend = await getTrendData(selectedRoom)
        setData(trend)
      } catch (error) {
        console.error("Error loading analytics chart:", error)
      }
    }

    loadTrendData()

    const interval = setInterval(loadTrendData, 5000)

    return () => clearInterval(interval)
  }, [selectedRoom])

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((m) => m !== key)
          : prev
        : [...prev, key]
    )
  }

  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (!active || !payload?.length) return null

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="text-gray-400 text-xs mb-2">
          {label}
        </p>
        {payload.map((entry: any) => {
          const metric = METRICS.find(
            (m) => m.key === entry.dataKey
          )
          return (
            <div
              key={entry.dataKey}
              className="flex items-center gap-2 py-0.5"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-500 dark:text-gray-400 min-w-[120px]">
                {metric?.label}
              </span>
              <span
                className="font-semibold"
                style={{ color: entry.color }}
              >
                {entry.value}
                {metric?.unit}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          Analytics
        </h3>

        {/* Metric toggles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {METRICS.map((metric) => {
            const isActive = activeMetrics.includes(metric.key)
            return (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`
                  flex items-center gap-1.5 text-xs font-medium
                  px-3 py-1.5 rounded-full border transition-all
                  whitespace-nowrap shrink-0
                  ${isActive
                    ? "border-transparent text-white"
                    : "border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
                  }
                `}
                style={
                  isActive
                    ? { backgroundColor: metric.color }
                    : {}
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isActive
                      ? "white"
                      : metric.color
                  }}
                />
                <>
                  <span className="sm:hidden">
                    {metric.mobileLabel}
                  </span>

                  <span className="hidden sm:inline">
                    {metric.label}
                  </span>
                </>
              </button>
            )
          })}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 5, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
          />

          {/* Kiri: % / °C */}
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            label={{
              value: "% / °C",
              angle: -90,
              position: "insideLeft",
              offset: 15,
              style: { fontSize: 10, fill: "#9ca3af" }
            }}
          />

          {/* Kanan: lux */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1000]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            label={{
              value: "lux",
              angle: 90,
              position: "insideRight",
              offset: 15,
              style: { fontSize: 10, fill: "#9ca3af" }
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {activeMetrics.includes("humidity") && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              stroke="#42a785"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}

          {activeMetrics.includes("temperature") && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}

          {activeMetrics.includes("light") && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="light"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}

        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}