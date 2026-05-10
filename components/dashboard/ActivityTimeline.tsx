import {
  AlertTriangle,
  CheckCircle,
  User,
  FileText
} from "lucide-react"

import Link from "next/link"
import { useActivityStore } from "@/store/useActivityStore"

export default function ActivityTimeline() {

  const { activities } = useActivityStore()

  const getActivityIcon = (type: string) => {

    switch (type) {

      case "alert":
        return {
          icon: <AlertTriangle size={16} />,
          color: "red"
        }

      case "success":
        return {
          icon: <CheckCircle size={16} />,
          color: "green"
        }

      case "manual":
        return {
          icon: <User size={16} />,
          color: "blue"
        }

      case "report":
        return {
          icon: <FileText size={16} />,
          color: "gray"
        }

      default:
        return {
          icon: <FileText size={16} />,
          color: "gray"
        }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      <h3 className="font-semibold text-lg mb-6">
        System Activity
      </h3>

      <div className="space-y-6">

        {activities.slice(0, 4).map((activity) => {

          const activityData = getActivityIcon(activity.type)

          return (
            <div
              key={activity.id}
              className="flex gap-4 items-start"
            >

              <div className={`
                w-8 h-8 flex items-center justify-center rounded-full

                ${activityData.color === "red" && "bg-red-100 text-red-600"}
                ${activityData.color === "green" && "bg-green-100 text-green-600"}
                ${activityData.color === "blue" && "bg-indigo-100 text-indigo-600"}
                ${activityData.color === "gray" && "bg-gray-200 text-gray-500"}
              `}>
                {activityData.icon}
              </div>

              <div className="flex-1">

                <div className="flex justify-between">

                  <p className="font-medium text-sm">
                    {activity.title}
                  </p>

                  <span className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </span>

                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {activity.description}
                </p>

              </div>

            </div>
          )
        })}

      </div>

      {activities.length > 4 && (
        <Link
          href="/logs"
          className="block text-center mt-6 text-sm text-indigo-600 hover:text-indigo-500 font-medium">
          View Complete Logs
        </Link>
      )}

    </div>
  )
}