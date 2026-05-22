"use client"

import React from "react"

import {
  Wind,
  AirVent
} from "lucide-react"

import { useRoomStore } from "@/store/useRoomStore"
import { useDeviceStore } from "@/store/useDeviceStore"

interface ToggleProps {
  name: string
  state: boolean
  onClick: () => void
  disabled?: boolean
  icon: React.ReactNode
}

export default function DeviceToggle() {
  const { selectedRoom } =
    useRoomStore()

  const {
    rooms,
    mode,
    setMode,
    toggleDevice
  } = useDeviceStore()

  const currentRoom =
    rooms.find(
      (room) =>
        room.name === selectedRoom
    )

  if (!currentRoom) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl shadow-sm">
        <div className="flex justify-between mb-6">
          <h3 className="font-semibold text-lg">
            {selectedRoom} Device Control
          </h3>

          <button className="text-sm font-medium text-indigo-600">
            {mode}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          No device registered for this room.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl shadow-sm">

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

        {currentRoom.dehumidifier.enabled && (
          <Toggle
            name="Dehumidifier"
            state={
              currentRoom.dehumidifier.isOn
            }
            onClick={() =>
              toggleDevice(
                selectedRoom,
                "dehumidifier"
              )
            }
            disabled={mode === "AUTO"}
            icon={<AirVent size={18} />}
          />
        )}

        {currentRoom.exhaust.enabled && (
          <Toggle
            name="Exhaust Fan"
            state={
              currentRoom.exhaust.isOn
            }
            onClick={() =>
              toggleDevice(
                selectedRoom,
                "exhaust"
              )
            }
            disabled={mode === "AUTO"}
            icon={<Wind size={18} />}
          />
        )}

      </div>
    </div>
  )
}

function Toggle({
  name,
  state,
  onClick,
  disabled = false,
  icon
}: ToggleProps) {
  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-xl transition-all
      ${
        state
          ? "bg-indigo-500 text-white"
          : "bg-gray-100 dark:bg-gray-800"
      }
    `}
    >

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
        className={`w-12 h-6 rounded-full relative transition
          ${
            state
              ? "bg-green-400"
              : "bg-gray-300"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        `}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition
            ${
              state
                ? "translate-x-6"
                : ""
            }
          `}
        />
      </button>

    </div>
  )
}