import { Laptop, Smartphone } from "lucide-react"

export interface Device {
  id: string
  name: string
  type: "laptop" | "smartphone" | string
  last_used: string
}

export interface DeviceListProps {
  devices: Device[]
  onRemove: (id: string) => void
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (mins > 0) return `${mins} minute${mins > 1 ? "s" : ""} ago`
  return "Just now"
}

export default function DeviceList({ devices, onRemove }: DeviceListProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
      <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Devices</h2>

      {devices.length === 0 ? (
        <p className="text-sm text-gray-400">No devices found.</p>
      ) : (
        devices.map((device: Device) => (
          <div
            key={device.id}
            className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-none pb-3 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {device.type === "laptop"
                  ? <Laptop size={16} className="text-gray-500" />
                  : <Smartphone size={16} className="text-gray-500" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                  {device.name}
                </p>
                <p className="text-xs text-gray-400">
                  Last used {timeAgo(device.last_used)}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemove(device.id)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  )
}