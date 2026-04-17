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
import { Droplet, Thermometer, Lightbulb } from "lucide-react"
import { MetricData } from "@/types/sensor"

interface TrendChartProps {
  title: string
  data: MetricData[]
  dataKey: "humidity" | "temperature" | "light"
}

interface CustomTooltipProps {
  active?: boolean
  payload?: readonly Record<string, unknown>[]
  chartDataKey?: string
}

const CustomTooltip = ({ active, payload, chartDataKey }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number
    const label = (payload[0].payload as Record<string, unknown>).time as string
    
    const getLabel = () => {
      switch (chartDataKey) {
        case "humidity":
          return `humidity : ${value}%`
        case "temperature":
          return `temperature : ${value}°C`
        case "light":
          return `light : ${value} lux`
        default:
          return `${value}`
      }
    }

    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-4 py-2 shadow-xl">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {getLabel()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
    )
  }
  return null
}

export default function TrendChart({
  title,
  data,
  dataKey
}: TrendChartProps) {

  const getColor = () => {
    switch (dataKey) {
      case "humidity":
        return "#00d4ff"
      case "temperature":
        return "#ff8c00"
      case "light":
        return "#9d5cff"
      default:
        return "#4f46e5"
    }
  }

  const getIcon = () => {
    switch (dataKey) {
      case "humidity":
        return <Droplet size={20} className="text-cyan-500 dark:text-cyan-400" />
      case "temperature":
        return <Thermometer size={20} className="text-orange-500 dark:text-orange-400" />
      case "light":
        return <Lightbulb size={20} className="text-purple-500 dark:text-purple-400" />
      default:
        return <Droplet size={20} className="text-indigo-500 dark:text-indigo-400" />
    }
  }

  return (
    <div className="
      rounded-2xl border p-6 transition-all duration-300 group

      bg-white border-gray-200
      dark:bg-gray-900 dark:border-gray-800

      hover:border-gray-300 dark:hover:border-gray-700
    ">

      {/* Header */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-lg">

          <div className="
            p-2 rounded-lg transition-all

            bg-gray-100
            dark:bg-gray-800

            group-hover:bg-gray-200
            dark:group-hover:bg-gray-700
          ">
            {getIcon()}
          </div>

          {title}

        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>

          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={getColor()} stopOpacity={0.3} />
              <stop offset="95%" stopColor={getColor()} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            className="dark:stroke-gray-700"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            className="text-gray-500 dark:text-gray-400"
            stroke="#9ca3af"
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11 }}
            className="text-gray-500 dark:text-gray-400"
            stroke="#9ca3af"
            axisLine={false}
            tickLine={false}
            width={40}
          />

          <Tooltip
            content={(props: unknown) => {
              const typedProps = props as CustomTooltipProps
              return <CustomTooltip {...typedProps} chartDataKey={dataKey} />
            }}
            cursor={{
              stroke: "#4f46e5",
              strokeWidth: 2,
              strokeDasharray: "5 5"
            }}
            contentStyle={{ background: "transparent", border: "none", padding: 0 }}
          />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={getColor()}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: getColor() }}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-in-out"
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}