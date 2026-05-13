import {
  ChevronRight,
  Wifi,
  WifiOff
} from "lucide-react"

import clsx from "clsx"

import { SensorHub } from "@/types/sensor"

import {
  getRiskConfig,
  getRiskLevel,
  getRoomIcon
} from "./roomHelpers"

type Props = {
  hub: SensorHub
  onClick: () => void
}

export default function RoomCard({
  hub,
  onClick
}: Props) {
  const risk = getRiskLevel(hub)
  const cfg = getRiskConfig(risk)

  const room = getRoomIcon(hub.location)
  const Icon = room.icon

  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-left bg-white dark:bg-gray-900 rounded-2xl border p-5 shadow-sm w-full",
        "hover:shadow-md transition-all duration-200",
        cfg.border
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              room.bg
            )}
          >
            <Icon
              size={18}
              className={room.color}
            />
          </div>

          <span className="font-semibold text-gray-800 dark:text-white text-sm">
            {hub.location}
          </span>
        </div>

        <span
          className={clsx(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
            cfg.badge
          )}
        >
          {risk}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-2xl font-bold">
            {hub.humidity}%
          </p>

          <p className="text-[11px] text-gray-400">
            Humidity
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold">
            {hub.temperature}°C
          </p>

          <p className="text-[11px] text-gray-400">
            Temperature
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold">
            {hub.light}
          </p>

          <p className="text-[11px] text-gray-400">
            Light
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          {hub.is_online ? (
            <Wifi
              size={12}
              className="text-green-500"
            />
          ) : (
            <WifiOff
              size={12}
              className="text-gray-400"
            />
          )}

          <span className="text-[11px] text-gray-400">
            {hub.is_online
              ? "Online"
              : "Offline"}
          </span>
        </div>

        <ChevronRight
          size={14}
          className="text-gray-400"
        />
      </div>
    </button>
  )
}