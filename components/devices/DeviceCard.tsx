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
    : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400"

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between shadow-sm transition border border-gray-100 dark:border-gray-800 ${
        isOn
          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          : "bg-white dark:bg-gray-900 text-slate-800 dark:text-gray-200"
      }`}
    >

      <div>

        <div className="flex justify-between mb-6">

          <div
            className={`p-1 rounded-xl ${
              isOn
                ? "bg-white/20"
                : "bg-slate-50 dark:bg-gray-800"
            }`}
          >
            <Icon />
          </div>
         
          <span className={`text-xs px-3 py-2 rounded-md ${statusStyle}`}>
            STATUS: {isOn ? "ON" : "OFF"}
          </span>

        </div>

        <h3 className="text-lg font-semibold">{name}</h3>

        <p className={`text-sm ${
          isOn
            ? "text-white/70"
            : "text-slate-400 dark:text-gray-400"
        }`}>
        </p>

      </div>

      <button
        onClick={toggle}
        className={`w-full py-3 rounded-xl font-semibold mt-4 ${
          isOn
            ? "bg-white text-indigo-600"
            : "bg-indigo-500 text-white hover:bg-indigo-600"
        }`}
      >
        {isOn ? "Turn OFF" : "Turn ON"}
      </button>

    </div>
  )
}