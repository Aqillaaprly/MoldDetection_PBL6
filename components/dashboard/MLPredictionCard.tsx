"use client"

import { useEffect, useState } from "react"
import { Brain, CheckCircle, XCircle } from "lucide-react"
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

interface Summary {
  total: number
  correct: number
  accuracy: number
}

export default function MLPredictionCard() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("/api/ml-predictions")
        const data = await res.json()
        setPredictions(data.predictions ?? [])
        setSummary(data.summary ?? null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPredictions()
  }, [])

  const getBadgeColor = (label: string) => {
    if (label === "HIGH") return "bg-red-100 text-red-600"
    if (label === "MEDIUM") return "bg-orange-100 text-orange-600"
    return "bg-green-100 text-green-600"
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="animate-pulse h-32 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (!predictions.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={18} className="text-indigo-500" />
          <h3 className="font-semibold text-sm">ML Predictions</h3>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          Belum ada data prediksi ML. Jalankan Spark job terlebih dahulu.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-indigo-500" />
          <h3 className="font-semibold text-sm">ML Predictions</h3>
        </div>
        {summary && (
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-semibold">
            Accuracy: {summary.accuracy}%
          </span>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.total}</p>
            <p className="text-[10px] text-gray-400">Total Data</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-600">{summary.correct}</p>
            <p className="text-[10px] text-gray-400">Match MRI</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-indigo-600">{summary.accuracy}%</p>
            <p className="text-[10px] text-gray-400">Accuracy</p>
          </div>
        </div>
      )}

      {/* Tabel prediksi */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <th className="text-left pb-2">Room</th>
              <th className="text-left pb-2">Humi</th>
              <th className="text-left pb-2">Temp</th>
              <th className="text-left pb-2">MRI</th>
              <th className="text-left pb-2">ML</th>
              <th className="text-left pb-2">Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {predictions.slice(0, 10).map((p) => (
              <tr key={p.id}>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">
                  {p.rooms?.name ?? "-"}
                </td>
                <td className="py-2 text-gray-500">{p.humidity}%</td>
                <td className="py-2 text-gray-500">{p.temperature}°C</td>
                <td className="py-2">
                  <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-semibold", getBadgeColor(p.mri_label))}>
                    {p.mri_label}
                  </span>
                </td>
                <td className="py-2">
                  <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-semibold", getBadgeColor(p.ml_prediction))}>
                    {p.ml_prediction}
                  </span>
                </td>
                <td className="py-2">
                  {p.mri_label === p.ml_prediction
                    ? <CheckCircle size={14} className="text-green-500" />
                    : <XCircle size={14} className="text-red-400" />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}