"use client"

import { AlertTriangle, CheckCircle, User, FileText, ArrowLeft } from "lucide-react"
import { useActivityStore } from "@/store/useActivityStore"
import Link from "next/link"
import clsx from "clsx"

const getActivityIcon = (type: string) => {
  switch (type) {
    case "alert":   return { icon: <AlertTriangle size={15} />, color: "red" }
    case "success": return { icon: <CheckCircle size={15} />,   color: "green" }
    case "manual":  return { icon: <User size={15} />,          color: "blue" }
    default:        return { icon: <FileText size={15} />,      color: "gray" }
  }
}

export default function LogsPage() {
  const { activities } = useActivityStore()
  const displayed = activities.slice(0, 15)

  return (
    <div className="space-y-6 mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Activity Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {displayed.length} total event{displayed.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText size={32} className="mb-3 opacity-40" />
            <p className="text-sm">No activity recorded yet.</p>
          </div>
        ) : (
          displayed.map((activity, i) => {
            const { icon, color } = getActivityIcon(activity.type)
            return (
              <div
                key={activity.id}
                className={clsx(
                  "flex gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                  i !== displayed.length - 1 && "border-b border-gray-100 dark:border-gray-800"
                )}
              >
                {/* Icon */}
                <div className={clsx(
                  "w-8 h-8 flex items-center justify-center rounded-full shrink-0 mt-0.5",
                  color === "red"   && "bg-red-100 text-red-500 dark:bg-red-500/10 dark:text-red-400",
                  color === "green" && "bg-green-100 text-green-500 dark:bg-green-500/10 dark:text-green-400",
                  color === "blue"  && "bg-indigo-100 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400",
                  color === "gray"  && "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
                )}>
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-gray-200 leading-snug">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {new Date(activity.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.description}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}