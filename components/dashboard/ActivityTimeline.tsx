import { AlertTriangle, CheckCircle, User, FileText } from "lucide-react"

export default function ActivityTimeline() {

  const logs = [
    {
      icon: <AlertTriangle size={16} />,
      title: "High humidity detected",
      desc: "Sensor Zone A-14 tripped threshold",
      time: "12:05 PM",
      color: "red"
    },
    {
      icon: <CheckCircle size={16} />,
      title: "Exhaust fan activated",
      desc: "Automated protocol: MOISTURE_CLEAR",
      time: "12:06 PM",
      color: "green"
    },
    {
      icon: <User size={16} />,
      title: "Manual Override: HVAC",
      desc: "Dr. Thorne adjusted temp target to 29°C",
      time: "11:42 AM",
      color: "blue"
    },
    {
      icon: <FileText size={16} />,
      title: "Daily Report Compiled",
      desc: "View summary in Analytics tab",
      time: "08:00 AM",
      color: "gray"
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      <h3 className="font-semibold text-lg mb-6">
        System Activity
      </h3>

      <div className="space-y-6">

        {logs.slice(0,4).map((log, i) => (
          <div key={i} className="flex gap-4 items-start">

            <div className={`
              w-8 h-8 flex items-center justify-center rounded-full
              ${log.color === "red" && "bg-red-100 text-red-600"}
              ${log.color === "green" && "bg-green-100 text-green-600"}
              ${log.color === "blue" && "bg-indigo-100 text-indigo-600"}
              ${log.color === "gray" && "bg-gray-200 text-gray-500"}
            `}>
              {log.icon}
            </div>

            <div className="flex-1">

              <div className="flex justify-between">

                <p className="font-medium text-sm">
                  {log.title}
                </p>

                <span className="text-xs text-gray-400">
                  {log.time}
                </span>

              </div>

              <p className="text-xs text-gray-400 mt-1">
                {log.desc}
              </p>

            </div>

          </div>
        ))}

      </div>

      {logs.length > logs.slice(0,4).length && (
        <button className="mt-6 w-full border rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50">
          View Complete Logs
        </button>
      )}

    </div>
  )
}