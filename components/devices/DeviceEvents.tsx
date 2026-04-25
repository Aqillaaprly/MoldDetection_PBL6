import { Clock } from "lucide-react"

export default function DeviceEvents() {

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between mb-5">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
          Recent Device Events
        </h4>
        <Clock size={16} className="text-gray-500" />
      </div>

      <div className="space-y-5 text-sm">

        <div className="flex gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Exhaust Fan Started
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Today, 08:42 AM • Auto Mode
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Firmware Updated
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Yesterday • v4.2.0
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Sensor Offline
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              2 days ago • Kitchen Hub
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}