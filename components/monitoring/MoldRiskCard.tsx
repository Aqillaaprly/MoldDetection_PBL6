"use client"

import {
  useEffect,
  useState
} from "react"

import { AlertTriangle } from "lucide-react"
import { useRoomStore } from "@/store/useRoomStore"
import { useDeviceStore } from "@/store/useDeviceStore"

export default function MoldRiskCard() {
  const { selectedRoom } = useRoomStore()
  const rooms = useDeviceStore((state) => state.rooms)

  const [risk, setRisk] = useState(0)
  const [status, setStatus] = useState("LOW")

  useEffect(() => {
    const fetchMRI = async () => {
      try {
        const roomIndex = rooms.findIndex(
          (room) => room.name === selectedRoom
        )

        if (roomIndex < 0) {
          setRisk(0)
          setStatus("LOW")
          return
        }

        const roomId = roomIndex + 1

        const res = await fetch(
          `/api/mri?roomId=${roomId}`
        )

        const data = await res.json()

        setRisk(data.mri ?? 0)
        setStatus(data.status ?? "LOW")
      } catch (error) {
        console.error(
          "Failed to fetch MRI:",
          error
        )
      }
    }

    fetchMRI()

    const interval =
      setInterval(fetchMRI, 5000)

    return () =>
      clearInterval(interval)
  }, [selectedRoom, rooms])

  let statusColor = "text-green-600"
  let barColor = "bg-green-600"

  if (status === "HIGH") {
    statusColor = "text-red-600"
    barColor = "bg-red-600"
  } else if (status === "MEDIUM") {
    statusColor = "text-yellow-500"
    barColor = "bg-yellow-500"
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-base sm:text-lg">
            Mold Risk Level
          </h3>

          <p className="text-xs text-gray-400">
            MRI calculated for {selectedRoom}
          </p>
        </div>

        <AlertTriangle
          className="text-red-500"
          size={20}
        />
      </div>

      <div className="flex justify-between items-end mb-3">
        <h2 className={`text-2xl sm:text-3xl font-bold ${statusColor}`}>
          {status}
        </h2>

        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {risk}%
        </span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{
            width: `${risk}%`
          }}
        />
      </div>

    </div>
  )
}