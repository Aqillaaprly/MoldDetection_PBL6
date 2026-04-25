"use client"

import { useEffect } from "react"
import { useSensorStore } from "@/store/useSensorStore"

import SensorCard from "@/components/dashboard/SensorCard"
import DeviceToggle from "@/components/dashboard/DeviceToggle"
import ActivityTimeline from "@/components/dashboard/ActivityTimeline"
import AnalyticsChart from "@/components/dashboard/AnalyticsChart"
import MoldRiskCard from "@/components/dashboard/MoldRiskCard"

import { getSensorHubs } from "@/services/sensorService"

export default function Dashboard() {
  const setSensorData = useSensorStore((state) => state.setSensorData)

  useEffect(() => {
  const fetchFromSupabase = async () => {
    try {
      // generate + insert data
      await fetch("/api/sensors")

      // ambil data terbaru
      const data = await getSensorHubs()

      console.log("DATA SUPABASE:", data)

      if (data.length > 0) {
        setSensorData(data[0])
      }
    } catch (error) {
      console.error("ERROR FETCH SUPABASE:", error)
    }
  }

  fetchFromSupabase()

  const interval = setInterval(fetchFromSupabase, 5000)

  return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </h1>

        <select
          className="
            bg-white dark:bg-gray-800
            text-gray-700 dark:text-gray-200
            border border-gray-200 dark:border-gray-700
            rounded-xl
            px-4 py-2
            text-sm
            font-medium
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        >
          <option className="bg-white dark:bg-gray-800">Living Room</option>
          <option className="bg-white dark:bg-gray-800">Bedroom 1</option>
          <option className="bg-white dark:bg-gray-800">Bedroom 2</option>
          <option className="bg-white dark:bg-gray-800">Kitchen</option>
        </select>

      </div>
      
      <SensorCard />

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <AnalyticsChart />

          <DeviceToggle />

        </div>

        <div className="space-y-6">

          <MoldRiskCard />

          <ActivityTimeline />

        </div>

      </div>

    </div>
  )
}