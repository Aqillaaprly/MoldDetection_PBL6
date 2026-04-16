"use client"

import { SensorHub } from "@/types/sensor"
import clsx from "clsx"
import { Battery, AlertCircle, CheckCircle2, Wifi } from "lucide-react"

interface SensorHubsTableProps {
  data: SensorHub[]
  onRefresh?: () => void
  isLoading?: boolean
}

export default function SensorHubsTable({
  data,
  onRefresh,
  isLoading = false
}: SensorHubsTableProps) {
  const getStatusBadge = (status: SensorHub["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-xs font-medium text-green-700">ACTIVE</span>
          </div>
        )
      case "ALERT":
        return (
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-xs font-medium text-red-700">ALERT</span>
          </div>
        )
      case "INACTIVE":
        return (
          <div className="flex items-center gap-2">
            <Wifi size={16} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600">INACTIVE</span>
          </div>
        )
    }
  }

  const getBatteryColor = (battery: number) => {
    if (battery >= 70) return "text-green-600"
    if (battery >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
        <h3 className="font-semibold text-white text-lg">
          Connected Sensor Hubs
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={clsx(
              "text-sm font-medium text-indigo-400 hover:text-indigo-300",
              "transition-colors duration-200",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? "Refreshing..." : "⟲ Force Refresh"}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800/50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Sensor ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Battery
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Last Sync
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((hub, index) => (
              <tr
                key={hub.id}
                className={clsx(
                  "border-b border-gray-700 transition-colors hover:bg-gray-700/50",
                  index === data.length - 1 && "border-b-0"
                )}
              >
                {/* Sensor ID */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white">
                      {hub.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {hub.location}
                    </p>
                  </div>
                </td>

                {/* Current Value */}
                <td className="px-6 py-4">
                  <p className="font-medium text-white">
                    {hub.currentValue}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {getStatusBadge(hub.status)}
                </td>

                {/* Battery */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-gray-700">
                      <div
                        className={clsx(
                          "h-full rounded-full",
                          getBatteryColor(hub.battery)
                        )}
                        style={{ width: `${hub.battery}%` }}
                      />
                    </div>
                    <span className={clsx(
                      "text-xs font-medium",
                      getBatteryColor(hub.battery)
                    )}>
                      {hub.battery}%
                    </span>
                  </div>
                </td>

                {/* Last Sync */}
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-400">
                    {hub.lastSync}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
