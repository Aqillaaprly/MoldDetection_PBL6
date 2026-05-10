"use client"

import { useEffect, useState } from "react"

import {
  Wind,
  AirVent
} from "lucide-react"

import { useRoomStore } from "@/store/useRoomStore"

import { useSensorStore } from "@/store/useSensorStore"

export default function DeviceToggle() {

  const { selectedRoom } = useRoomStore()

  const {
    humidity,
    temperature
  } = useSensorStore()

  const [mode, setMode] = useState<
    "AUTO" | "MANUAL"
  >("AUTO")

  const [devices, setDevices] = useState({

    exhaust: false,

    dehumidifier: false

  })

  // AUTO AUTOMATION
  useEffect(() => {

    if (mode === "AUTO") {

      setDevices({

        dehumidifier: humidity > 80,

        exhaust: temperature > 30

      })

    }

  }, [
    mode,
    humidity,
    temperature,
    selectedRoom
  ])

  const toggleDevice = (
    key: "exhaust" | "dehumidifier"
  ) => {

    if (mode === "MANUAL") {

      setDevices((prev) => ({

        ...prev,

        [key]: !prev[key]

      }))

    }
  }

  return (

    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm">

      {/* MODE SWITCH */}
      <div className="flex justify-between mb-6">

        <h3 className="font-semibold text-lg">
          {selectedRoom} Device Control
        </h3>

        <button
          onClick={() =>
            setMode(
              mode === "AUTO"
                ? "MANUAL"
                : "AUTO"
            )
          }
          className="text-sm font-medium text-indigo-600"
        >
          {mode}
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <Toggle
          name="Dehumidifier"
          state={devices.dehumidifier}
          onClick={() =>
            toggleDevice("dehumidifier")
          }
          disabled={mode === "AUTO"}
          icon={<AirVent size={18}/>}
        />

        <Toggle
          name="Exhaust Fan"
          state={devices.exhaust}
          onClick={() =>
            toggleDevice("exhaust")
          }
          disabled={mode === "AUTO"}
          icon={<Wind size={18}/>}
        />

      </div>

    </div>
  )
}

function Toggle({
  name,
  state,
  onClick,
  disabled,
  icon
}: any) {

  return (

    <div className={`
      flex items-center justify-between
      p-4 rounded-xl transition-all

      ${
        state
          ? "bg-indigo-500 text-white"
          : "bg-gray-100 dark:bg-gray-800"
      }
    `}>

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
          {icon}
        </div>

        <div>

          <p className="text-sm font-medium">
            {name}
          </p>

          <p className="text-xs opacity-70">
            {state ? "ON" : "OFF"}
          </p>

        </div>

      </div>

      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-12 h-6 rounded-full
          relative transition

          ${
            state
              ? "bg-green-400"
              : "bg-gray-300"
          }

          ${
            disabled &&
            "opacity-50 cursor-not-allowed"
          }
        `}
      >

        <span className={`
          absolute top-1 left-1
          w-4 h-4 bg-white rounded-full
          transition

          ${
            state &&
            "translate-x-6"
          }
        `}/>

      </button>

    </div>
  )
}