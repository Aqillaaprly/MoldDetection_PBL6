"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Home,
  AlertTriangle,
  Droplet,
  Cpu,
  LayoutGrid,
  List
} from "lucide-react"

import clsx from "clsx"

import { useRoomStore } from "@/store/useRoomStore"
import { getSensorHubs } from "@/services/sensorService"

import { SensorHub } from "@/types/sensor"

import StatCard from "@/components/dashboard/StatCard"
import RoomCard from "@/components/dashboard/RoomCard"
import RoomRow from "@/components/dashboard/RoomRow"
import MobileRoomCard from "@/components/dashboard/MobileRoomCard"

import {
  getRiskLevel
} from "@/components/dashboard/roomHelpers"

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

  const [filter, setFilter] =
    useState<FilterTab>("All Rooms")

  const [viewMode, setViewMode] =
    useState<ViewMode>("grid")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSensorHubs()
        setHubs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    load()

    const interval = setInterval(load, 5000)

    return () => clearInterval(interval)
  }, [])

  // ─── Stats ─────────────────────────────────────────────

  const totalRooms = hubs.length

  const highRiskCount = hubs.filter(
    (h) => getRiskLevel(h) === "HIGH RISK"
  ).length

  const avgHumidity =
    totalRooms > 0
      ? Math.round(
          hubs.reduce(
            (sum, hub) => sum + hub.humidity,
            0
          ) / totalRooms
        )
      : 0

  const devicesOnline = hubs.filter(
    (h) => h.is_online
  ).length

  // ─── Filtered Data ────────────────────────────────────

  const filtered = hubs
    .filter((h) => {
      const risk = getRiskLevel(h)

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
      a.location.localeCompare(
        b.location,
        undefined,
        {
          numeric: true,
          sensitivity: "base"
        }
      )
    )

  const handleRoomClick = (
    hub: SensorHub
  ) => {
    setSelectedRoom(hub.location)

    router.push("/monitoring")
  }

  const TABS: FilterTab[] = [
    "All Rooms",
    "High Risk",
    "Medium Risk",
    "Normal",
    "Offline"
  ]

  // ─── Loading ──────────────────────────────────────────

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

      {/* ─── HEADER ───────────────────────────── */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      {/* ─── STAT CARD ────────────────────────── */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          icon={
            <Home
              size={18}
              className="text-indigo-500"
            />
          }
          iconBg="bg-indigo-50 dark:bg-indigo-900/30"
          label="Total Rooms"
          value={totalRooms}
          sub="Monitored"
        />

        <StatCard
          icon={
            <AlertTriangle
              size={18}
              className="text-red-500"
            />
          }
          iconBg="bg-red-50 dark:bg-red-900/30"
          label="High Risk Rooms"
          value={highRiskCount}
          sub={`${totalRooms > 0
            ? (
                (highRiskCount / totalRooms) *
                100
              ).toFixed(0)
            : 0}% of total`}
        />

        <StatCard
          icon={
            <Droplet
              size={18}
              className="text-cyan-500"
            />
          }
          iconBg="bg-cyan-50 dark:bg-cyan-900/30"
          label="Average Humidity"
          value={`${avgHumidity}%`}
          sub="from yesterday"
          highlight="+4%"
        />

        <StatCard
          icon={
            <Cpu
              size={18}
              className="text-green-500"
            />
          }
          iconBg="bg-green-50 dark:bg-green-900/30"
          label="Devices Online"
          value={devicesOnline}
          sub={`of ${totalRooms} devices`}
        />

      </div>

      {/* ─── ROOM MONITORING ─────────────────── */}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">

          <h2 className="font-semibold text-gray-900 dark:text-white">
            Room Monitoring
          </h2>

          <div className="flex items-center gap-3">

            {/* Filter Tabs */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5">

              {TABS.map((tab) => (
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

            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5">

              <button
                onClick={() =>
                  setViewMode("grid")
                }
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
                onClick={() =>
                  setViewMode("list")
                }
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

        {/* Content */}
        <div className="p-4 sm:p-5">

          {filtered.length === 0 ? (

            <div className="text-center py-16 text-gray-400 text-sm">
              No rooms match this filter.
            </div>

          ) : (
            <>
              {/* MOBILE */}
              <div className="sm:hidden flex flex-col gap-3">
                {filtered.map((hub) => (
                  <MobileRoomCard
                    key={hub.id}
                    hub={hub}
                    onClick={() =>
                      handleRoomClick(hub)
                    }
                  />
                ))}
              </div>

              {/* DESKTOP */}
              <div className="hidden sm:block">

                {viewMode === "grid" ? (

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {filtered.map((hub) => (
                      <RoomCard
                        key={hub.id}
                        hub={hub}
                        onClick={() =>
                          handleRoomClick(hub)
                        }
                      />
                    ))}

                  </div>

                ) : (

                  <div className="flex flex-col gap-3">

                    {filtered.map((hub) => (
                      <RoomRow
                        key={hub.id}
                        hub={hub}
                        onClick={() =>
                          handleRoomClick(hub)
                        }
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