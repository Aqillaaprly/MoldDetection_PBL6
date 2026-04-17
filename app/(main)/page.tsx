"use client"

import { useEffect } from "react"
import { useSensorStore } from "@/store/useSensorStore"

import SensorCard from "@/components/dashboard/SensorCard"
import DeviceToggle from "@/components/dashboard/DeviceToggle"
import ActivityTimeline from "@/components/dashboard/ActivityTimeline"
import AnalyticsChart from "@/components/dashboard/AnalyticsChart"

import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"

export default function Dashboard() {
  const setSensorData = useSensorStore((state) => state.setSensorData)

  useEffect(() => {
    const fetchFromFirebase = async () => {
      try {
        await fetch("/api/sensors")

        const q = query(
          collection(db, "sensors"),
          orderBy("time", "desc"),
          limit(1)
        )

        const snapshot = await getDocs(q)

        snapshot.forEach((doc) => {
          const data = doc.data()

          console.log("DATA FIREBASE:", data)

          setSensorData(data)
        })
      } catch (error) {
        console.error("ERROR FETCH FIREBASE:", error)
      }
    }

    fetchFromFirebase()

    const interval = setInterval(fetchFromFirebase, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
      </div>
      
      <SensorCard />

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <AnalyticsChart />

          <DeviceToggle />

        </div>

        <ActivityTimeline />

      </div>

    </div>
  )
}