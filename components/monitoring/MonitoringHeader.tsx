"use client"

import clsx from "clsx"

interface MonitoringHeaderProps {
  sensorStatus?: "online" | "offline"
  lastUpdate?: string
}

export default function MonitoringHeader({
  sensorStatus = "online",
  lastUpdate = "2 seconds ago"
}: MonitoringHeaderProps) {
  return (
    <div className="space-y-4">

      {/* Title + Status */}
      <div className="flex items-center justify-between gap-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
            Active Monitoring
          </p>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Realtime Environment Monitoring
          </h1>
        </div>

        {/* Status indicator */}
        <div className="
          flex items-center gap-3 rounded-lg border px-4 py-3 backdrop-blur

          border-gray-200 bg-white
          dark:border-gray-800 dark:bg-gray-900
        ">

          {/* Dot */}
          <div
            className={clsx(
              "size-2.5 rounded-full animate-pulse",

              sensorStatus === "online"
                ? "bg-green-500"
                : "bg-red-500"
            )}
          />

          <div>

            <p className={clsx(
              "text-xs font-semibold uppercase tracking-wide",

              sensorStatus === "online"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}>
              {sensorStatus === "online" ? "ESP32 Status" : "Status"}:{" "}
              {sensorStatus === "online" ? "Online" : "Offline"}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last update {lastUpdate}
            </p>

          </div>

        </div>

      </div>
    </div>
  )
}