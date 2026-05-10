"use client"

import { AlertTriangle, Droplets, Wind } from "lucide-react"
import { useNotificationStore } from "@/store/useNotificationStore"

export default function NotificationsPage() {

  const {
    notifications,
    clearNotifications
  } = useNotificationStore()

  const today = notifications.filter(
  (n) => {

    const notifDate =
      new Date(n.createdAt)

    const now = new Date()

    return (
      notifDate.toDateString() ===
      now.toDateString()
    )

  }
)

  const earlier = notifications.filter(
    (n) => {

      const notifDate =
        new Date(n.createdAt)

      const now = new Date()

      return (
        notifDate.toDateString() !==
        now.toDateString()
      )

    }
)
  const getNotificationIcon = (type: string) => {

    switch (type) {

      case "alert":
        return <AlertTriangle size={18} className="text-red-500"/>

      case "warning":
        return <Droplets size={18} className="text-blue-500"/>

      case "automation":
        return <Wind size={18} className="text-indigo-500"/>

      default:
        return <Droplets size={18} className="text-gray-500"/>
    }
  }

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            System alerts and device activity
          </p>
        </div>

      </div>

      {/* TODAY */}
      <div>

        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
          Today
        </h2>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

          {today.map((n) => (
            <NotificationRow
              key={n.id}
              icon={getNotificationIcon(n.type)}
              title={n.title}
              desc={n.message}
              time={new Date(n.createdAt).toLocaleTimeString()}
              unread={!n.read}
            />
          ))}

        </div>

      </div>

      {/* EARLIER */}
      <div>

        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
          Earlier
        </h2>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

          {earlier.map((n) => (
            <NotificationRow
              key={n.id}
              icon={getNotificationIcon(n.type)}
              title={n.title}
              desc={n.message}
              time={new Date(n.createdAt).toLocaleTimeString()}
              unread={!n.read}
            />
          ))}

        </div>

      </div>

    </div>
  )
}

function NotificationRow({
  icon,
  title,
  desc,
  time,
  unread
}: {
  icon: React.ReactNode
  title: string
  desc: string
  time: string
  unread?: boolean
}) {

  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 last:border-none hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">

      {/* ICON */}
      <div className="mt-1">
        {icon}
      </div>

      {/* CONTENT */}
      <div className="flex-1">

        <div className="flex justify-between items-center">

          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {title}
          </p>

          <span className="text-xs text-gray-400">
            {time}
          </span>

        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {desc}
        </p>

      </div>

      {/* UNREAD DOT */}
      {unread && (
        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2"/>
      )}

    </div>
  )
}