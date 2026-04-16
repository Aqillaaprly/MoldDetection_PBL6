import { Clock } from "lucide-react"

export default function DeviceEvents() {

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between mb-5">
        <h4 className="font-semibold">Recent Device Events</h4>
        <Clock size={16} />
      </div>

      <div className="space-y-5 text-sm">

        <div className="flex gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
          <div>
            <p className="font-semibold">Exhaust Fan Started</p>
            <p className="opacity-70">Today, 08:42 AM • Auto Mode</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
          <div>
            <p className="font-semibold">Firmware Updated</p>
            <p className="opacity-70">Yesterday • v4.2.0</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
          <div>
            <p className="font-semibold">Sensor Offline</p>
            <p className="opacity-70">2 days ago • Kitchen Hub</p>
          </div>
        </div>

      </div>

    </div>
  )
}