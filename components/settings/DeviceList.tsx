import { Laptop, Smartphone } from "lucide-react"

export default function DeviceList({ devices }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">

      <h2 className="font-semibold text-lg">Devices</h2>

      {devices.map((device: any, i: number) => (
        <div key={i} className="flex items-center justify-between last:border-none pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              {device.type === "laptop" ? <Laptop size={16} /> : <Smartphone size={16} />}
            </div>
            <div>
              <p className="text-sm font-medium">{device.name}</p>
              <p className="text-xs text-gray-400">
                Last used {device.lastUsed}
              </p>
            </div>
          </div>

          <button className="text-sm text-red-500 hover:underline">
            Remove
          </button>
        </div>
      ))}

    </div>
  )
}