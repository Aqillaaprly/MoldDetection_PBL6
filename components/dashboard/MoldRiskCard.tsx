"use client"

import { AlertTriangle } from "lucide-react"

import { useSensorStore } from "@/store/useSensorStore"

export default function MoldRiskCard() {

  const {
    humidity,
    temperature,
    light
  } = useSensorStore()

  const lightPenalty =
    light < 300 ? 15 : 0

  const risk = Math.min(
    Math.round(
      humidity * 0.6 +
      temperature * 0.25 +
      lightPenalty
    ),
    100
  )

  let status = "LOW"

  let statusColor = "text-green-600"

  let barColor = "bg-green-600"

  if (risk >= 80) {

    status = "HIGH"

    statusColor = "text-red-600"

    barColor = "bg-red-600"

  } else if (risk >= 70) {

    status = "MEDIUM"

    statusColor = "text-yellow-500"

    barColor = "bg-yellow-500"

  }

  return (

    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">

        <div>

          <h3 className="font-semibold text-lg">
            Mold Risk Level
          </h3>

          <p className="text-xs text-gray-400">
            Atmospheric calculation based on humidity, temperature, and light
          </p>

        </div>

        <AlertTriangle
          className="text-red-500"
          size={20}
        />

      </div>

      {/* Risk label */}
      <div className="flex justify-between items-end mb-3">

        <h2
          className={`text-3xl font-bold ${statusColor}`}
        >
          {status}
        </h2>

        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {risk}%
        </span>

      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${risk}%` }}
        />

      </div>

    </div>
  )
}