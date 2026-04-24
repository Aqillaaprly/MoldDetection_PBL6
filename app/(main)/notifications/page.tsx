"use client"

import { AlertTriangle, Droplets, Wind } from "lucide-react"

export default function NotificationsPage() {

  const today = [
    {
      icon: <AlertTriangle size={18} className="text-red-500"/>,
      title: "High Mold Risk",
      desc: "Bedroom humidity reached 88%",
      time: "2 min ago",
      unread: true
    },
    {
      icon: <Droplets size={18} className="text-blue-500"/>,
      title: "High Humidity",
      desc: "Kitchen humidity reached 82%",
      time: "10 min ago",
      unread: true
    }
  ]

  const earlier = [
    {
      icon: <Wind size={18} className="text-indigo-500"/>,
      title: "Automation Triggered",
      desc: "Air purifier turned ON automatically",
      time: "25 min ago",
      unread: false
    },
    {
      icon: <Droplets size={18} className="text-blue-500"/>,
      title: "Humidity Normal",
      desc: "Living room humidity returned to safe level",
      time: "1 hour ago",
      unread: false
    }
  ]

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

        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Mark all as read
        </button>

      </div>


      {/* TODAY */}
      <div>

        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
          Today
        </h2>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

          {today.map((n, i) => (
            <NotificationRow key={i} {...n}/>
          ))}

        </div>

      </div>


      {/* EARLIER */}
      <div>

        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
          Earlier
        </h2>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

          {earlier.map((n, i) => (
            <NotificationRow key={i} {...n}/>
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