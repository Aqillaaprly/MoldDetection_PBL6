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
  iconColor = "text-indigo-600"
}: MetricCardProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)

  const getStatusColor = () => {
    switch (status) {
      case "OPTIMAL RANGE":
        return {
          badge: "bg-green-100 text-green-700",
          icon: "text-green-500"
        }
      case "STABLE":
        return {
          badge: "bg-gray-100 text-gray-700",
          icon: "text-gray-500"
        }
      case "HIGH EXPOSURE":
        return {
          badge: "bg-orange-100 text-orange-700",
          icon: "text-orange-500"
        }
      default:
        return {
          badge: "bg-blue-100 text-blue-700",
          icon: "text-blue-500"
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
        "bg-gray-800/50 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:scale-105",
        "border-gray-700 group cursor-default select-none",
        "hover:border-indigo-500/50"
      )}
    >
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Icon at top - More Prominent */}
        {icon && (
          <div className={clsx(
            "p-3 rounded-full transition-all duration-300",
            "group-hover:bg-indigo-500/20 group-hover:scale-110"
          )}>
            <div className={clsx("text-4xl", iconColor)}>
              {icon}
            </div>
          </div>
        )}

        {/* Circular Chart with Enhanced Styling */}
        <div className="w-48 h-48 flex items-center justify-center drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={circleData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={95}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                <Cell fill="#4f46e5" stroke="none" />
                <Cell fill="#1f2937" stroke="none" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-6xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {Math.round(value)}
            </div>
            {unit && (
              <div className="text-sm font-semibold text-gray-400">
                {unit}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-400">
          {title}
        </p>

        {/* Status badge */}
        <span
          className={clsx(
            "inline-block rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider",
            "transition-all duration-300 group-hover:shadow-lg",
            colors.badge,
            "pointer-events-none"
          )}
        >
          {status}
        </span>
      </div>
    </div>
  )
}
