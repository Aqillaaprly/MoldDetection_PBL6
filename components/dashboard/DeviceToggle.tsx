"use client"

import { useState } from "react"

export default function DeviceToggle() {

  const [fan, setFan] = useState(true)
  const [purifier, setPurifier] = useState(false)

  return (
    <div className="grid md:grid-cols-2 gap-6">

      <Toggle
        name="Exhaust Fan"
        state={fan}
        setState={setFan}
      />

      <Toggle
        name="Air Purifier"
        state={purifier}
        setState={setPurifier}
      />

    </div>
  )
}

function Toggle({ name, state, setState }: any) {

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow flex justify-between">

      <span>{name}</span>

      <button
        onClick={() => setState(!state)}
        className={`
        w-12 h-6 rounded-full
        ${state ? "bg-green-500" : "bg-gray-300"}
        `}
      />

    </div>
  )
}