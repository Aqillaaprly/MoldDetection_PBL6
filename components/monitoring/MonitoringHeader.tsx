"use client"

import { Wifi } from "lucide-react"
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
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
            Active Monitoring
          </p>
          <h1 className="text-3xl font-bold text-white">
            Realtime Environment Monitoring
          </h1>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 backdrop-blur px-4 py-3">
          <div
            className={clsx(
              "size-2.5 rounded-full animate-pulse",
              sensorStatus === "online" ? "bg-green-500" : "bg-red-500"
            )}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-400">
              {sensorStatus === "online" ? "ESP32 Status" : "Status"}: {sensorStatus === "online" ? "Online" : "Offline"}
            </p>
            <p className="text-xs text-gray-400">
              Last update {lastUpdate}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
