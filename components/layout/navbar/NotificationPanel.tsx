import NotificationItem from "./NotificationItem"
import { AlertTriangle, Droplets, Wind } from "lucide-react"
import Link from "next/link"

export default function NotificationPanel() {

  const notifications = [
    {
      icon: <AlertTriangle size={16} className="text-red-500"/>,
      title: "High Mold Risk",
      desc: "Bedroom humidity reached 88%",
      time: "2m ago",
      unread: true
    },
    {
      icon: <Droplets size={16} className="text-blue-500"/>,
      title: "High Humidity",
      desc: "Kitchen humidity reached 82%",
      time: "10m ago",
      unread: true
    },
    {
      icon: <Wind size={16} className="text-indigo-500"/>,
      title: "Automation Triggered",
      desc: "Air purifier turned ON",
      time: "25m ago",
      unread: false
    }
  ]

  return (
    <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">

        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Notifications
        </h3>

        <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
          Clear all
        </button>

      </div>

      {/* LIST */}
      <div className="max-h-80 overflow-y-auto">

        {notifications.map((n, i) => (
          <NotificationItem key={i} {...n}/>
        ))}

      </div>

      {/* FOOTER */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-center">

        <Link
          href="/notifications"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all notifications
        </Link>

      </div>

    </div>
  )
}