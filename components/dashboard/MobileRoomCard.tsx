import {
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

export default function MobileRoomCard({
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
        "w-full rounded-2xl border bg-white dark:bg-gray-900 p-4 text-left",
        "transition-all duration-200 active:scale-[0.99]",
        cfg.border
      )}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3">

        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">

          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              room.bg
            )}
          >
            <Icon
              size={18}
              className={room.color}
            />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {hub.location}
            </p>

            <div className="flex items-center gap-1 mt-1">
              {hub.is_online ? (
                <Wifi
                  size={11}
                  className="text-green-500"
                />
              ) : (
                <WifiOff
                  size={11}
                  className="text-gray-400"
                />
              )}

              <span className="text-[11px] text-gray-400">
                {hub.is_online
                  ? "Online"
                  : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Badge */}
        <span
          className={clsx(
            "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shrink-0",
            cfg.badge
          )}
        >
          {risk}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4">

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {hub.humidity}%
          </p>

          <p className="text-[10px] text-gray-400 mt-0.5">
            Humidity
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {hub.temperature}°C
          </p>

          <p className="text-[10px] text-gray-400 mt-0.5">
            Temp
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {hub.light}
          </p>

          <p className="text-[10px] text-gray-400 mt-0.5">
            Lux
          </p>
        </div>

      </div>
    </button>
  )
}