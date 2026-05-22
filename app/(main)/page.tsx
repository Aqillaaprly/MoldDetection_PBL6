"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Home,
  AlertTriangle,
  LayoutGrid,
  List,
} from "lucide-react"

import clsx from "clsx"

import { useRoomStore } from "@/store/useRoomStore"
import { getSensorHubs } from "@/services/sensorService"
import { SensorHub } from "@/types/sensor"

import RoomCard from "@/components/dashboard/RoomCard"
import RoomRow from "@/components/dashboard/RoomRow"
import MobileRoomCard from "@/components/dashboard/MobileRoomCard"

import { getRiskLevel } from "@/components/dashboard/roomHelpers"

type FilterTab =
  | "All Rooms"
  | "High Risk"
  | "Medium Risk"
  | "Normal"
  | "Offline"

type ViewMode = "grid" | "list"

export default function DashboardOverview() {
  const router = useRouter()

  const { setSelectedRoom } = useRoomStore()

  const [hubs, setHubs] = useState<SensorHub[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filter, setFilter] = useState<FilterTab>("All Rooms")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSensorHubs()
        setHubs(data)
      } catch (err) {
        console.error("Failed to load sensor hubs:", err)
      } finally {
        setIsLoading(false)
      }
    }

    load()

    // Jangan terlalu sering GET agar server dev tidak berat saat ESP32 POST
    const interval = setInterval(load, 15000)

    return () => clearInterval(interval)
  }, [])

  const totalRooms = hubs.length

  const highRiskCount = hubs.filter(
    (hub) => getRiskLevel(hub) === "HIGH RISK"
  ).length

  const filtered = hubs
    .filter((hub) => {
      const risk = getRiskLevel(hub)

      if (filter === "High Risk") {
        return risk === "HIGH RISK"
      }

      if (filter === "Medium Risk") {
        return risk === "MEDIUM RISK"
      }

      if (filter === "Normal") {
        return risk === "NORMAL"
      }

      if (filter === "Offline") {
        return risk === "OFFLINE"
      }

      return true
    })
    .sort((a, b) =>
      a.location.localeCompare(b.location, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    )

  const handleRoomClick = (hub: SensorHub) => {
    setSelectedRoom(hub.location)
    router.push("/monitoring")
  }

  const tabs: FilterTab[] = [
    "All Rooms",
    "High Risk",
    "Medium Risk",
    "Normal",
    "Offline",
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-500" />

          <p className="mt-3 text-sm text-gray-400">
            Loading overview...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm px-6 py-4 min-w-[200px]">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
            <Home size={20} className="text-indigo-500" />
          </div>

          <div>
            <p className="text-xs text-gray-400 font-medium">
              Total Rooms
            </p>

            <p className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {totalRooms}
            </p>

            <p className="text-xs text-gray-400 mt-0.5">
              Monitored
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm px-6 py-4 min-w-[200px]">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>

          <div>
            <p className="text-xs text-gray-400 font-medium">
              High Risk Rooms
            </p>

            <p className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {highRiskCount}
            </p>

            <p className="text-xs text-gray-400 mt-0.5">
              {totalRooms > 0
                ? `${((highRiskCount / totalRooms) * 100).toFixed(0)}% of total`
                : "0% of total"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Room Monitoring
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={clsx(
                    "text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
                    filter === tab
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-400"
                )}
              >
                <LayoutGrid size={14} />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-400"
                )}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No rooms match this filter.
            </div>
          ) : (
            <>
              <div className="sm:hidden flex flex-col gap-3">
                {filtered.map((hub) => (
                  <MobileRoomCard
                    key={hub.id}
                    hub={hub}
                    onClick={() => handleRoomClick(hub)}
                  />
                ))}
              </div>

              <div className="hidden sm:block">
                {viewMode === "grid" ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((hub) => (
                      <RoomCard
                        key={hub.id}
                        hub={hub}
                        onClick={() => handleRoomClick(hub)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map((hub) => (
                      <RoomRow
                        key={hub.id}
                        hub={hub}
                        onClick={() => handleRoomClick(hub)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}