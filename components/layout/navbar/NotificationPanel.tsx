import NotificationItem from "./NotificationItem"
import { AlertTriangle, Droplets, Wind } from "lucide-react"
import Link from "next/link"

import { useNotificationStore } from "@/store/useNotificationStore"

export default function NotificationPanel() {

  const {
    notifications,
    clearNotifications
  } = useNotificationStore()

  const getNotificationIcon = (type: string) => {

    switch (type) {

      case "alert":
        return <AlertTriangle size={16} className="text-red-500"/>

      case "warning":
        return <Droplets size={16} className="text-blue-500"/>

      case "automation":
        return <Wind size={16} className="text-indigo-500"/>

      default:
        return <Droplets size={16} className="text-gray-500"/>
    }
  }

  return (
    <div
      className="
        fixed top-12 right-2 z-50

        w-[90vw]
        sm:w-96

        max-w-md

        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-2xl shadow-xl
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">

        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Notifications
        </h3>

        <button
          onClick={clearNotifications}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Clear all
        </button>

      </div>

      {/* LIST */}
      <div className="max-h-80 overflow-y-auto">

        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            icon={getNotificationIcon(n.type)}
            title={n.title}
            desc={n.message}
            time={new Date(n.createdAt).toLocaleTimeString()}
            unread={!n.read}
          />
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