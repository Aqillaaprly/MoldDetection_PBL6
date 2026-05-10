"use client"

import { useSensorStore } from "@/store/useSensorStore"
import { Droplet, Thermometer, Sun } from "lucide-react"
import clsx from "clsx"

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

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
}: any) {

  return (

    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      {/* Top */}
      <div className="flex items-center justify-between mb-4">

        {/* Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>

        {/* Status badge */}
        <span
          className={clsx(
            "text-xs px-3 py-1 rounded-full font-medium",

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
      <p className="text-xs tracking-wider text-gray-400 mb-1">
        {title}
      </p>

      {/* Value + change */}
      <div className="flex items-end gap-2">

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </h2>

        <span
          className={clsx(
            "text-sm font-medium",

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