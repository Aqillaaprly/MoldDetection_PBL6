"use client"

import { useState } from "react"
import { Wind, AirVent } from "lucide-react"

export default function DeviceToggle() {

  const [fan, setFan] = useState(true)
  const [purifier, setPurifier] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      <div className="flex justify-between mb-6">
        <h3 className="font-semibold text-lg">
          Device Control
        </h3>

        <button className="text-indigo-600 text-sm font-medium">
          SETTINGS
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <Toggle
          name="Air Purifier"
          state={purifier}
          setState={setPurifier}
          icon={<AirVent size={18}/>}
          activeColor
        />

        <Toggle
          name="Exhaust Fan"
          state={fan}
          setState={setFan}
          icon={<Wind size={18}/>}
          activeColor
        />

      </div>

    </div>
  )
}

function Toggle({ name, state, setState, icon, activeColor }: any) {

  return (
    <div className={`
      flex items-center justify-between p-4 rounded-xl
      ${activeColor && state
        ? "bg-indigo-500 to-purple-600 text-white"
        : "bg-gray-50 dark:bg-gray-800"}
    `}>

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium">
            {name}
          </p>
          <p className="text-xs opacity-70">
            {state ? "ON" : "OFF"}
          </p>
        </div>

      </div>

      <button
        onClick={() => setState(!state)}
        className={`
          w-12 h-6 rounded-full relative transition
          ${state ? "bg-green-400" : "bg-gray-300"}
        `}
      >
        <span className={`
          absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition
          ${state && "translate-x-6"}
        `}/>
      </button>

    </div>
  )
}