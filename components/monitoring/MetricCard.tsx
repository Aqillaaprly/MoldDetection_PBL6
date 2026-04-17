"use client"

import clsx from "clsx"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

interface MetricCardProps {
  title: string
  value: number
  unit?: string
  status: "OPTIMAL RANGE" | "STABLE" | "HIGH EXPOSURE"
  maxValue?: number
  icon?: React.ReactNode
  iconColor?: string
}

export default function MetricCard({
  title,
  value,
  unit = "%",
  status,
  maxValue = 100,
  icon,
  iconColor = "text-indigo-600 dark:text-indigo-400"
}: MetricCardProps) {

  const percentage = Math.min((value / maxValue) * 100, 100)

  const getStatusColor = () => {
    switch (status) {
      case "OPTIMAL RANGE":
        return {
          badge: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
        }
      case "STABLE":
        return {
          badge: "bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300"
        }
      case "HIGH EXPOSURE":
        return {
          badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
        }
      default:
        return {
          badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
        }
    }
  }

  const colors = getStatusColor()

  const circleData = [
    { value: percentage },
    { value: 100 - percentage }
  ]

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border p-8",
        "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "cursor-default select-none group",

        /* LIGHT MODE */
        "bg-white border-gray-200",

        /* DARK MODE */
        "dark:bg-gray-900 dark:border-gray-800",

        "hover:border-indigo-400 dark:hover:border-indigo-500/50"
      )}
    >

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">

        {/* Icon */}
        {icon && (
          <div
            className={clsx(
              "p-3 rounded-full transition-all duration-300",
              "group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20 group-hover:scale-110"
            )}
          >
            <div className={clsx("text-4xl", iconColor)}>
              {icon}
            </div>
          </div>
        )}

        {/* Circular chart */}
        <div className="relative w-48 h-48 flex items-center justify-center">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={circleData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={95}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationDuration={800}
                stroke="none"
              >

                {/* progress */}
                <Cell fill="#4f46e5" />

                {/* background circle */}
                <Cell className="fill-gray-200 dark:fill-gray-700" />

              </Pie>

            </PieChart>
          </ResponsiveContainer>

          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {Math.round(value)}
            </div>

            {unit && (
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {unit}
              </div>
            )}

          </div>

        </div>

        {/* Title */}
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </p>

        {/* Status */}
        <span
          className={clsx(
            "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider",
            colors.badge
          )}
        >
          {status}
        </span>

      </div>
    </div>
  )
}