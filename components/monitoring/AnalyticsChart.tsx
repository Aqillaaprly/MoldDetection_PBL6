"use client"

import {
  useEffect,
  useState
} from "react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import { useRoomStore } from "@/store/useRoomStore"
import { getTrendData } from "@/services/sensorService"
import { MetricData } from "@/types/sensor"

type MetricKey =
  | "humidity"
  | "temperature"
  | "light"

type TooltipPayloadItem = {
  name?: string
  value?: number | string
  color?: string
  dataKey?: string
}

type CustomTooltipProps = {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
}

function CustomTooltip({
  active,
  payload,
  label
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm px-4 py-3">
      <p className="text-xs font-medium text-gray-500 mb-2">
        {label}
      </p>

      <div className="space-y-1">
        {payload.map((
          item: TooltipPayloadItem,
          index: number
        ) => (
          <p
            key={`${item.dataKey ?? index}`}
            className="text-xs text-gray-700 dark:text-gray-200"
          >
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsChart() {
  const { selectedRoom } =
    useRoomStore()

  const [chartData, setChartData] =
    useState<MetricData[]>([])

  const [activeMetrics, setActiveMetrics] =
    useState<MetricKey[]>([
      "humidity",
      "temperature",
      "light"
    ])

  useEffect(() => {
    const load = async () => {
      const data =
        await getTrendData(selectedRoom)

      setChartData(data)
    }

    load()

    const interval =
      setInterval(load, 5000)

    return () =>
      clearInterval(interval)
  }, [selectedRoom])

  const toggleMetric = (metric: MetricKey) => {
    setActiveMetrics((current) => {
      if (current.includes(metric)) {
        return current.filter(
          (item) => item !== metric
        )
      }

      return [
        ...current,
        metric
      ]
    })
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          Analytics
        </h3>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={() => toggleMetric("humidity")}
            className={`px-4 py-2 rounded-full text-xs font-medium transition
              ${
                activeMetrics.includes("humidity")
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }
            `}
          >
            Humidity (%)
          </button>

          <button
            onClick={() => toggleMetric("temperature")}
            className={`px-4 py-2 rounded-full text-xs font-medium transition
              ${
                activeMetrics.includes("temperature")
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }
            `}
          >
            Temperature (°C)
          </button>

          <button
            onClick={() => toggleMetric("light")}
            className={`px-4 py-2 rounded-full text-xs font-medium transition
              ${
                activeMetrics.includes("light")
                  ? "bg-violet-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }
            `}
          >
            Light (lux)
          </button>

        </div>

      </div>

      <div className="h-[280px] min-h-[280px] w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              opacity={0.3}
            />

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 12
              }}
            />

            <YAxis
              yAxisId="left"
              tick={{
                fontSize: 12
              }}
              domain={[0, 100]}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{
                fontSize: 12
              }}
              domain={[0, 1000]}
            />

            <Tooltip content={<CustomTooltip />} />

            {activeMetrics.includes("humidity") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            )}

            {activeMetrics.includes("temperature") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
            )}

            {activeMetrics.includes("light") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="light"
                name="Light"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
            )}

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}