"use client"

import { useEffect, useState } from "react"
import { Brain, CheckCircle, XCircle, TrendingUp, BarChart3, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import clsx from "clsx"

interface Prediction {
  id: number
  room_id: number
  humidity: number
  temperature: number
  light: number
  mri_label: string
  ml_prediction: string
  created_at: string
  rooms: { name: string }
}

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

export default function AnalyticsPage() {
  const router = useRouter()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [roomSummary, setRoomSummary] = useState<RoomSummary[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<string>("All")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/ml-predictions?view=detail")
        const data = await res.json()
        setPredictions(data.predictions ?? [])
        setRoomSummary(data.roomSummary ?? [])
        setSummary(data.summary ?? null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getBadgeColor = (label: string) => {
    if (label === "HIGH") return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    if (label === "MEDIUM") return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
    return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
  }

  const getRiskBarColor = (risk: string) => {
    if (risk === "HIGH") return { high: "bg-red-500", medium: "bg-orange-400", low: "bg-green-500" }
    return { high: "bg-red-500", medium: "bg-orange-400", low: "bg-green-500" }
  }

  const filteredPredictions = selectedRoom === "All"
    ? predictions
    : predictions.filter((p) => p.rooms?.name === selectedRoom)

  const rooms = ["All", ...Array.from(new Set(predictions.map((p) => p.rooms?.name).filter(Boolean)))]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-500" />
          <p className="mt-3 text-sm text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ML Analytics</h1>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={14} className="text-indigo-500" />
              <p className="text-xs text-gray-400">Total Data</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-500" />
              <p className="text-xs text-gray-400">Match MRI</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{summary.correct}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-indigo-500" />
              <p className="text-xs text-gray-400">Accuracy</p>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{summary.accuracy}%</p>
          </div>
        </div>
      )}

      {/* Room risk breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-indigo-500" />
          <h2 className="font-semibold text-sm text-gray-900 dark:text-white">Risk Distribution per Room</h2>
        </div>

        <div className="space-y-4">
          {roomSummary.map((room, i) => (
            <div key={room.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-300 dark:text-gray-600">#{i + 1}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{room.name}</span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                {room.highPct > 0 && (
                  <div
                    className="bg-red-500 rounded-l-full"
                    style={{ width: `${room.highPct}%` }}
                    title={`HIGH: ${room.highPct}%`}
                  />
                )}
                {room.mediumPct > 0 && (
                  <div
                    className="bg-orange-400"
                    style={{ width: `${room.mediumPct}%` }}
                    title={`MEDIUM: ${room.mediumPct}%`}
                  />
                )}
                {room.lowPct > 0 && (
                  <div
                    className="bg-green-500 rounded-r-full"
                    style={{ width: `${room.lowPct}%` }}
                    title={`LOW: ${room.lowPct}%`}
                  />
                )}
              </div>

              {/* Mobile Legend */}
                <div className="flex md:hidden gap-3 mt-1 flex-wrap">
                <span className="text-[10px] text-red-500 font-medium">
                    HIGH {room.highPct}%
                </span>

                <span className="text-[10px] text-orange-500 font-medium">
                    MEDIUM {room.mediumPct}%
                </span>

                <span className="text-[10px] text-green-500 font-medium">
                    LOW {room.lowPct}%
                </span>
                </div>

                {/* Desktop Legend */}
                <div className="hidden md:block relative h-5 mt-2 text-[10px] font-medium">
                {room.highPct > 0 && (
                    <span
                    className="absolute text-red-500"
                    style={{
                        left: `${room.highPct / 2}%`,
                        transform: "translateX(-50%)",
                    }}
                    >
                    HIGH {room.highPct}%
                    </span>
                )}

                {room.mediumPct > 0 && (
                    <span
                    className="absolute text-orange-500"
                    style={{
                        left: `${room.highPct + room.mediumPct / 2}%`,
                        transform: "translateX(-50%)",
                    }}
                    >
                    MEDIUM {room.mediumPct}%
                    </span>
                )}

                {room.lowPct > 0 && (
                    <span
                    className="absolute text-green-500"
                    style={{
                        left: `${room.highPct + room.mediumPct + room.lowPct / 2}%`,
                        transform: "translateX(-50%)",
                    }}
                    >
                    LOW {room.lowPct}%
                    </span>
                )}
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-sm text-gray-900 dark:text-white">Prediction Detail</h2>

          {/* Room filter */}
          <div className="flex overflow-x-auto gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-full md:w-auto">
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={clsx(
                  "whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
                  selectedRoom === room
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-3">
        {filteredPredictions.slice(0, 5).map((p) => (
            <div
            key={p.id}
            className="border border-gray-100 dark:border-gray-800 rounded-xl p-3"
            >
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                {p.rooms?.name ?? "-"}
                </h3>

                <div className="flex items-center gap-1.5">
                {p.mri_label === p.ml_prediction ? (
                    <>
                    <span className="text-[11px] font-medium text-green-600">
                        Match
                    </span>
                    <CheckCircle
                        size={16}
                        className="text-green-500"
                    />
                    </>
                ) : (
                    <>
                    <span className="text-[11px] font-medium text-red-500">
                        Mismatch
                    </span>
                    <XCircle
                        size={16}
                        className="text-red-500"
                    />
                    </>
                )}
                </div>
            </div>

            <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                    <span className="text-gray-400">Humidity</span>
                    <span>{p.humidity}%</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Temperature</span>
                    <span>{p.temperature}°C</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Light</span>
                    <span>{p.light}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">MRI Label</span>
                    <span
                    className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        getBadgeColor(p.mri_label)
                    )}
                    >
                    {p.mri_label}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">ML Prediction</span>
                    <span
                    className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        getBadgeColor(p.ml_prediction)
                    )}
                    >
                    {p.ml_prediction}
                    </span>
                </div>

                </div>
                </div>
                ))}
                {filteredPredictions.length > 5 && (
                <p className="md:hidden text-center text-xs text-gray-400 mt-4">
                    Showing 5 of {filteredPredictions.length} results
                </p>
                )}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
            <thead>
            <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="text-left pb-3 font-medium">Room</th>
                <th className="text-left pb-3 font-medium">Humidity</th>
                <th className="text-left pb-3 font-medium">Temp</th>
                <th className="text-left pb-3 font-medium">Light</th>
                <th className="text-left pb-3 font-medium">MRI Label</th>
                <th className="text-left pb-3 font-medium">ML Prediction</th>
                <th className="text-left pb-3 font-medium">Match</th>
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filteredPredictions.slice(0, 50).map((p) => (
                <tr
                key={p.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                <td className="py-2.5 font-medium">
                    {p.rooms?.name ?? "-"}
                </td>

                <td className="py-2.5">
                    {p.humidity}%
                </td>

                <td className="py-2.5">
                    {p.temperature}°C
                </td>

                <td className="py-2.5">
                    {p.light}
                </td>

                <td className="py-2.5">
                    <span
                    className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        getBadgeColor(p.mri_label)
                    )}
                    >
                    {p.mri_label}
                    </span>
                </td>

                <td className="py-2.5">
                    <span
                    className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        getBadgeColor(p.ml_prediction)
                    )}
                    >
                    {p.ml_prediction}
                    </span>
                </td>

                <td className="py-2.5">
                    {p.mri_label === p.ml_prediction ? (
                    <CheckCircle
                        size={14}
                        className="text-green-500"
                    />
                    ) : (
                    <XCircle
                        size={14}
                        className="text-red-400"
                    />
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        {filteredPredictions.length > 50 && (
        <p className="text-center text-xs text-gray-400 mt-4">
            Showing 50 of {filteredPredictions.length} results
        </p>
        )}
        </div>
      </div>
    </div>
  )
}