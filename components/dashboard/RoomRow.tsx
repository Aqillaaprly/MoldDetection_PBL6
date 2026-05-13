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

export default function RoomRow({
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
        "w-full text-left bg-white dark:bg-gray-900 rounded-2xl border px-5 py-4",
        "hover:shadow-md transition-all duration-200",
        "flex items-center gap-4",
        cfg.border
      )}
    >
      {/* Icon */}
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

      {/* Room info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 dark:text-white text-sm">
          {hub.location}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
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

      {/* Metrics */}
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-bold text-gray-900 dark:text-white">
            {hub.humidity}%
          </p>

          <p className="text-[10px] text-gray-400">
            Humidity
          </p>
        </div>

        <div className="text-center">
          <p className="font-bold text-gray-900 dark:text-white">
            {hub.temperature}°C
          </p>

          <p className="text-[10px] text-gray-400">
            Temp
          </p>
        </div>

        <div className="text-center">
          <p className="font-bold text-gray-900 dark:text-white">
            {hub.light}
          </p>

          <p className="text-[10px] text-gray-400">
            Lux
          </p>
        </div>
      </div>

      {/* Badge */}
      <span
        className={clsx(
          "ml-4 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0",
          cfg.badge
        )}
      >
        {risk}
      </span>

      {/* Arrow */}
      <ChevronRight
        size={14}
        className="text-gray-400 shrink-0"
      />
    </button>
  )
}