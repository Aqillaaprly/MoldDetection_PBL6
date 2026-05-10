"use client"

import { Wind, Fan } from "lucide-react"

interface Props {
  name: string
  location: string
  isOn: boolean
  connectivity: "online" | "offline"
  toggle: () => void
  type: "purifier" | "exhaust"
}

export default function DeviceCard({
  name,
  location,
  isOn,
  connectivity,
  toggle,
  type
}: Props) {

  const Icon = type === "purifier" ? Wind : Fan

  const isOnline = connectivity === "online"

  // FIX: offline device always OFF
  const realStatus = isOnline ? isOn : false

  const statusStyle = realStatus
    ? "bg-green-400 text-green-900"
    : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400"

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between shadow-sm transition border border-gray-100 dark:border-gray-800 ${
        realStatus
          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          : "bg-white dark:bg-gray-900 text-slate-800 dark:text-gray-200"
      }`}
    >

      <div>

        <div className="flex justify-between mb-6">

          <div
            className={`p-1 rounded-xl ${
              realStatus
                ? "bg-white/20"
                : "bg-slate-50 dark:bg-gray-800"
            }`}
          >
            <Icon />
          </div>

          <span className={`text-xs px-3 py-2 rounded-md ${statusStyle}`}>
            STATUS: {realStatus ? "ON" : "OFF"}
          </span>

        </div>

        <h3 className="text-lg font-semibold">{name}</h3>

        <p
          className={`text-xs mt-1 ${
            isOnline ? "text-green-400" : "text-red-400"
          }`}
        >
          ● {isOnline ? "Device Online" : "Device Offline"}
        </p>

      </div>

      <button
        onClick={toggle}
        disabled={!isOnline}
        className={`w-full py-3 rounded-xl font-semibold mt-4 ${
          realStatus
            ? "bg-white text-indigo-600"
            : "bg-indigo-500 text-white hover:bg-indigo-600"
        } ${!isOnline && "opacity-50 cursor-not-allowed"}`}
      >
        {realStatus ? "Turn OFF" : "Turn ON"}
      </button>

    </div>
  )
}