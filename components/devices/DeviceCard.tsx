"use client"

import { Wind, Fan } from "lucide-react"

interface Props {
  name: string
  location: string
  isOn: boolean
  toggle: () => void
  type: "purifier" | "exhaust"
}

export default function DeviceCard({
  name,
  location,
  isOn,
  toggle,
  type
}: Props) {

  const Icon = type === "purifier" ? Wind : Fan

  const statusStyle = isOn
    ? "bg-green-400 text-green-900"
    : "bg-red-100 text-red-500"

  return (
    <div
      className={`rounded-3xl p-7 h-[280px] flex flex-col justify-between shadow-sm transition ${
        isOn
          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          : "bg-white"
      }`}
    >

      <div>

        <div className="flex justify-between mb-6">

          <div
            className={`p-1 rounded-xl ${
              isOn ? "bg-white/20" : "bg-slate-50"
            }`}
          >
            <Icon />
          </div>
          
          <span className={`text-xs px-3 py-2 rounded-md ${statusStyle}`}>
            STATUS: {isOn ? "ON" : "OFF"}
          </span>

        </div>

        <h3 className="text-lg font-semibold">{name}</h3>

        <p className={`text-sm ${isOn ? "text-white/70" : "text-slate-400"}`}>
          {location}
        </p>

      </div>

      <button
        onClick={toggle}
        className={`w-full py-3 rounded-xl font-semibold ${
          isOn
            ? "bg-white text-indigo-600"
            : "bg-indigo-500 text-white"
        }`}
      >
        {isOn ? "Turn OFF" : "Turn ON"}
      </button>

    </div>
  )
}