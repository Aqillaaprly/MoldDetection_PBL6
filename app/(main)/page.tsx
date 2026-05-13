"use client"

import {
  useEffect,
  useRef
} from "react"

import { useSensorStore } from "@/store/useSensorStore"
import { useNotificationStore } from "@/store/useNotificationStore"
import { useActivityStore } from "@/store/useActivityStore"
import { useRoomStore } from "@/store/useRoomStore"
import { useDeviceStore } from "@/store/useDeviceStore"

import SensorCard from "@/components/dashboard/SensorCard"
import DeviceToggle from "@/components/dashboard/DeviceToggle"
import ActivityTimeline from "@/components/dashboard/ActivityTimeline"
import AnalyticsChart from "@/components/dashboard/AnalyticsChart"
import MoldRiskCard from "@/components/dashboard/MoldRiskCard"

import { getSensorHubs } from "@/services/sensorService"

export default function Dashboard() {
  const addNotification =
    useNotificationStore(
      (state) =>
        state.addNotification
    )

  const addActivity =
    useActivityStore(
      (state) =>
        state.addActivity
    )

  const setSensorData =
    useSensorStore(
      (state) =>
        state.setSensorData
    )

  const {
    selectedRoom,
    setSelectedRoom
  } = useRoomStore()

  const rooms =
    useDeviceStore(
      (state) =>
        state.rooms
    )

  const syncAutoDevices =
    useDeviceStore(
      (state) =>
        state.syncAutoDevices
    )

  const previousHumidityRef =
    useRef(false)

  const previousTempRef =
    useRef(false)

  const previousLightRef =
    useRef(false)

  useEffect(() => {
    const fetchFromSupabase =
      async () => {
        try {
          await fetch("/api/sensors")

          const data =
            await getSensorHubs()

          console.log(
            "DATA SUPABASE:",
            data
          )

          if (data.length > 0) {
            const currentRoomData =
              data.find(
                (item) =>
                  item.location ===
                  selectedRoom
              )

            if (!currentRoomData) return

            setSensorData(
              currentRoomData
            )

            syncAutoDevices(
              selectedRoom,
              currentRoomData.humidity,
              currentRoomData.temperature
            )

            const humidity =
              currentRoomData.humidity

            const temperature =
              currentRoomData.temperature

            const light =
              currentRoomData.light

            if (
              humidity > 80 &&
              !previousHumidityRef.current
            ) {
              addActivity({
                title: `[${selectedRoom}] High humidity detected`,
                description: `Humidity reached ${humidity}%`,
                type: "alert"
              })

              addNotification({
                title: `[${selectedRoom}] High Mold Risk`,
                message: `Humidity reached ${humidity}%`,
                type: "alert"
              })

              previousHumidityRef.current =
                true
            }

            if (humidity <= 80) {
              previousHumidityRef.current =
                false
            }

            if (
              temperature > 30 &&
              !previousTempRef.current
            ) {
              addActivity({
                title: `[${selectedRoom}] High temperature detected`,
                description: `Temperature reached ${temperature}°C`,
                type: "alert"
              })

              addNotification({
                title: `[${selectedRoom}] High Temperature`,
                message: `Temperature reached ${temperature}°C`,
                type: "warning"
              })

              previousTempRef.current =
                true
            }

            if (temperature <= 30) {
              previousTempRef.current =
                false
            }

            if (
              light > 700 &&
              !previousLightRef.current
            ) {
              addActivity({
                title: `[${selectedRoom}] High light exposure`,
                description: `Lux intensity reached ${light}`,
                type: "alert"
              })

              addNotification({
                title: `[${selectedRoom}] High Light Exposure`,
                message: `Lux intensity reached ${light}`,
                type: "warning"
              })

              previousLightRef.current =
                true
            }

            if (light <= 700) {
              previousLightRef.current =
                false
            }
          }
        } catch (error) {
          console.error(
            "ERROR FETCH SUPABASE:",
            error
          )
        }
      }

    fetchFromSupabase()

    const interval =
      setInterval(
        fetchFromSupabase,
        5000
      )

    return () =>
      clearInterval(interval)
  }, [
    selectedRoom,
    addActivity,
    addNotification,
    setSensorData,
    syncAutoDevices
  ])

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </h1>

        <select
          value={selectedRoom}
          onChange={(e) =>
            setSelectedRoom(
              e.target.value
            )
          }
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
          {rooms.map((room, i) => (
            <option
              key={i}
              value={room.name}
              className="bg-white dark:bg-gray-800"
            >
              {room.name}
            </option>
          ))}
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