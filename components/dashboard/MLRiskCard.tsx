"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, TrendingUp, ChevronRight } from "lucide-react"
import clsx from "clsx"

interface RoomSummary {
  name: string
  total: number
  highPct: number
  mediumPct: number
  lowPct: number
  dominantRisk: string
}

interface Summary {
  total: number
  correct: number
  accuracy: number
}

export default function MLRiskCard() {
  const router = useRouter()
  const [roomSummary, setRoomSummary] = useState<RoomSummary[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/ml-predictions")
        const data = await res.json()
        setRoomSummary(data.roomSummary ?? [])
        setSummary(data.summary ?? null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  const getRiskColor = (risk: string) => {
    if (risk === "HIGH") return { text: "text-red-600", bg: "bg-red-100", bar: "bg-red-500" }
    if (risk === "MEDIUM") return { text: "text-orange-500", bg: "bg-orange-100", bar: "bg-orange-400" }
    return { text: "text-green-600", bg: "bg-green-100", bar: "bg-green-500" }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-16 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!roomSummary.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={18} className="text-indigo-500" />
          <h3 className="font-semibold text-sm">ML Risk Analysis</h3>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          Belum ada data prediksi ML. Jalankan Spark job terlebih dahulu.
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={() => router.push("/analytics")}
      className="w-full text-left bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">ML Risk Analysis</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {summary && (
            <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-semibold">
              {summary.accuracy}% acc
            </span>
          )}
          <ChevronRight size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>

      {/* Room list */}
      <div className="space-y-3">
        {roomSummary.map((room, i) => {
          const colors = getRiskColor(room.dominantRisk)
          const riskPct = room.dominantRisk === "HIGH" ? room.highPct
            : room.dominantRisk === "MEDIUM" ? room.mediumPct
            : room.lowPct

          return (
            <div key={room.name} className="flex items-center gap-3">
              {/* Rank */}
              <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4">
                #{i + 1}
              </span>

              {/* Room name */}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-24 truncate">
                {room.name}
              </span>

              {/* Progress bar */}
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={clsx("h-full rounded-full transition-all duration-500", colors.bar)}
                  style={{ width: `${riskPct}%` }}
                />
              </div>

              {/* Pct + badge */}
              <div className="flex items-center gap-1.5 w-20 justify-end">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {riskPct}%
                </span>
                <span className={clsx(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                  colors.bg, colors.text
                )}>
                  {room.dominantRisk}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <TrendingUp size={10} />
          <span>{summary?.total ?? 0} data points analyzed</span>
        </div>
        <span className="text-[10px] text-indigo-500 font-medium group-hover:underline">
          View full analytics →
        </span>
      </div>
    </button>
  )
}