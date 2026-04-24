import { AlertTriangle, ShieldAlert, Info } from "lucide-react"

type Props = {
  type: "critical" | "warning" | "info"
  title: string
  description: string
  room: string
  time: string
}

export default function AlertCard({
  type,
  title,
  description,
  room,
  time
}: Props) {

  const styles = {
    critical: {
      icon: <ShieldAlert />,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20"
    },
    warning: {
      icon: <AlertTriangle />,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    info: {
      icon: <Info />,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  }

  const style = styles[type]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-start gap-4">

        <div className={`p-2 rounded-lg ${style.bg} ${style.color}`}>
          {style.icon}
        </div>

        <div className="flex-1">

          <h3 className="font-semibold text-slate-800 dark:text-white">
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>

          <div className="flex justify-between items-center mt-4 text-xs text-gray-400">

            <span>{room}</span>
            <span>{time}</span>

          </div>

        </div>

      </div>

      <div className="flex gap-2 mt-4">

        <button className="text-xs px-3 py-1 rounded-md bg-indigo-500 text-white hover:bg-indigo-600">
          View
        </button>

        <button className="text-xs px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          Dismiss
        </button>

      </div>

    </div>
  )
}