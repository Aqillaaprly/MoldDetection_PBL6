"use client"

import { useState } from "react"

export default function AutomationPanel() {

  const [automation, setAutomation] = useState(true)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">

      <div className="flex justify-between items-center mb-4">

        <span className="font-semibold text-slate-800 dark:text-gray-200">
          Automation Mode
        </span>

        <div
          onClick={() => setAutomation(!automation)}
          className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition ${
            automation
              ? "bg-indigo-500"
              : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white ${
              automation ? "ml-auto" : ""
            }`}
          />
        </div>

      </div>

      <p className="text-sm mb-2 text-slate-600 dark:text-gray-400">
        Humidity Threshold
      </p>

      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div className="w-[70%] h-full bg-indigo-500 rounded-full" />
      </div>

      <p className="text-right mt-1 text-slate-700 dark:text-gray-300">
        70%
      </p>

    </div>
  )
}