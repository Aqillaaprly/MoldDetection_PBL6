"use client"

import { useState } from "react"

export default function AutomationPanel() {

  const [automation, setAutomation] = useState(true)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-4">

        <span className="font-semibold">Automation Mode</span>

        <div
          onClick={() => setAutomation(!automation)}
          className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer ${
            automation ? "bg-indigo-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white ${
              automation ? "ml-auto" : ""
            }`}
          />
        </div>

      </div>

      <p className="text-sm mb-2">Humidity Threshold</p>

      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="w-[70%] h-full bg-indigo-500 rounded-full" />
      </div>

      <p className="text-right mt-1">70%</p>

    </div>
  )
}