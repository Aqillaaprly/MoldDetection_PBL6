"use client"

import { useSensorStore } from "@/store/useSensorStore"
import { Droplet, Thermometer, Sun } from "lucide-react"
import clsx from "clsx"

interface CardProps {
  title: string
  value: string
  icon: React.ReactNode
  status: string
  color: "red" | "green" | "gray"
  change: string
}

export default function SensorCard() {

  const {

    humidity,
    temperature,
    light,

    previousHumidity,
    previousTemperature,
    previousLight

  } = useSensorStore()

  const humidityChange = humidity - previousHumidity
  const temperatureChange = temperature - previousTemperature
  const lightChange = light - previousLight

  return (

    <div className="grid grid-cols-3 gap-2 sm:gap-4">

      <Card
        title="HUMIDITY"
        value={`${humidity}%`}
        icon={<Droplet size={18} />}
        status={humidity > 80 ? "HIGH" : "NORMAL"}
        color={humidity > 80 ? "red" : "green"}
        change={`${humidityChange > 0 ? "+" : ""}${humidityChange}%`}
      />

      <Card
        title="TEMPERATURE"
        value={`${temperature}°C`}
        icon={<Thermometer size={18} />}
        status={temperature > 30 ? "HOT" : "NORMAL"}
        color={temperature > 30 ? "red" : "green"}
        change={`${temperatureChange > 0 ? "+" : ""}${temperatureChange.toFixed(1)}`}
      />

      <Card
        title="LIGHT INTENSITY"
        value={`${light} lux`}
        icon={<Sun size={18} />}
        status={light > 700 ? "HIGH" : "NORMAL"}
        color={light > 700 ? "red" : "gray"}
        change={`${lightChange > 0 ? "+" : ""}${lightChange}`}
      />

    </div>
  )
}

function Card({
  title,
  value,
  icon,
  status,
  color,
  change
}: CardProps) {

  return (

    <div className="bg-white dark:bg-gray-900 p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      {/* Top */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">

        {/* Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>

        {/* Status badge */}
        <span
          className={clsx(
            "text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium",

            color === "red" &&
              "bg-red-100 text-red-600",

            color === "green" &&
              "bg-green-100 text-green-600",

            color === "gray" &&
              "bg-gray-200 text-gray-600"
          )}
        >
          {status}
        </span>

      </div>

      {/* Title */}
      <p className="text-[10px] sm:text-xs tracking-wider text-gray-400 mb-1 truncate">
        {title}
      </p>

      {/* Value + change */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2">

        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          {value}
        </h2>

        <span
          className={clsx(
            "text-[10px] sm:text-sm font-medium",

            color === "red" &&
              "text-red-500",

            color === "green" &&
              "text-green-500",

            color === "gray" &&
              "text-gray-400"
          )}
        >
          {change}
        </span>

      </div>

    </div>
  )
}