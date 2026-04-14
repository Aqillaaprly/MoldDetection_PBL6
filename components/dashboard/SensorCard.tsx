"use client"

import { useSensorStore } from "@/store/useSensorStore"

export default function SensorCard() {

  const { humidity, temperature, light } = useSensorStore()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <Card title="Humidity" value={`${humidity}%`} />
      <Card title="Temperature" value={`${temperature}°C`} />
      <Card title="Light" value={`${light} lux`} />

    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">

      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  )
}