"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

export default function MoldRiskCard() {
  const [mri, setMri] = useState<{ mri: number; status: string } | null>(null)

  useEffect(() => {
    fetch("/api/mri")
      .then((res) => res.json())
      .then((data) => {
        console.log("MRI DATA:", data)
        setMri(data)
      })
      .catch((err) => console.error("MRI fetch error:", err))
  }, [])

  const risk = mri?.mri ?? 0

  const statusColor =
    mri?.status === "HIGH"
      ? "text-red-600"
      : mri?.status === "MEDIUM"
      ? "text-yellow-500"
      : "text-green-600"

  const barColor =
    mri?.status === "HIGH"
      ? "bg-red-600"
      : mri?.status === "MEDIUM"
      ? "bg-yellow-500"
      : "bg-green-600"

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">
            Mold Risk Level
          </h3>

          <p className="text-xs text-gray-400">
            Atmospheric calculation based on current humidity/temp
          </p>
        </div>

        <AlertTriangle className="text-red-500" size={20} />
      </div>

      {/* Risk label */}
      <div className="flex justify-between items-end mb-3">

        <h2 className={`text-3xl font-bold ${statusColor}`}>
          {mri?.status ?? "LOADING"}
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