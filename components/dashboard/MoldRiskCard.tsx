"use client"

import { AlertTriangle } from "lucide-react"

export default function MoldRiskCard() {

  const risk = 80

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

        <AlertTriangle className="text-red-500" size={20}/>
      </div>

      {/* Risk label */}
      <div className="flex justify-between items-end mb-3">

        <h2 className="text-3xl font-bold text-red-600">
          HIGH RISK
        </h2>

        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {risk}%
        </span>

      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 rounded-full"
          style={{ width: `${risk}%` }}
        />
      </div>

    </div>
  )
}