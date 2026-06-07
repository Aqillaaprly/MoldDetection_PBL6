"use client"

import React, {
  useEffect,
  useState
} from "react"

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
    toggleDevice,
    loadDevicesFromApi,
    selectDeviceByRoom,
    selectedDeviceId,
    isDeviceControlLoading
  } = useDeviceStore()

  const [errorMessage, setErrorMessage] =
    useState("")

  useEffect(() => {
    const load = async () => {
      await loadDevicesFromApi()
      selectDeviceByRoom(selectedRoom)
    }

    load()

    const interval =
      setInterval(load, 5000)

    return () =>
      clearInterval(interval)
  }, [
    selectedRoom,
    loadDevicesFromApi,
    selectDeviceByRoom
  ])

  const currentRoom =
    rooms.find(
      (room) =>
        room.name === selectedRoom
    )

  const handleModeClick = async () => {
    setErrorMessage("")

    const nextMode =
      mode === "AUTO"
        ? "MANUAL"
        : "AUTO"

    try {
      await setMode(nextMode)
      await loadDevicesFromApi()
      selectDeviceByRoom(selectedRoom)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update mode"
      )
    }
  }

  const handleDehumidifierToggle = async () => {
    setErrorMessage("")

    try {
      await toggleDevice(
        selectedRoom,
        "dehumidifier"
      )

      await loadDevicesFromApi()
      selectDeviceByRoom(selectedRoom)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update device"
      )
    }
  }

  const handleExhaustToggle = async () => {
    setErrorMessage("")

    try {
      await toggleDevice(
        selectedRoom,
        "exhaust"
      )

      await loadDevicesFromApi()
      selectDeviceByRoom(selectedRoom)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update device"
      )
    }
  }

  if (!currentRoom) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm">

        <div className="flex justify-between mb-6">

          <h3 className="font-semibold text-lg">
            {selectedRoom} Device Control
          </h3>

          <button
            onClick={handleModeClick}
            disabled={
              isDeviceControlLoading ||
              !selectedDeviceId
            }
            className="text-sm font-medium text-indigo-600 disabled:opacity-50"
          >
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
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm">

      <div className="flex justify-between mb-6">

        <h3 className="font-semibold text-lg">
          {selectedRoom} Device Control
        </h3>

        <button
          onClick={handleModeClick}
          disabled={
            isDeviceControlLoading ||
            !selectedDeviceId
          }
          className="text-sm font-medium text-indigo-600 disabled:opacity-50"
        >
          {mode}
        </button>

      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-500">
          {errorMessage}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {currentRoom.dehumidifier.enabled && (
          <Toggle
            name="Dehumidifier"
            state={currentRoom.dehumidifier.isOn}
            onClick={handleDehumidifierToggle}
            disabled={
              mode === "AUTO" ||
              isDeviceControlLoading ||
              !selectedDeviceId
            }
            icon={<AirVent size={18} />}
          />
        )}

        {currentRoom.exhaust.enabled && (
          <Toggle
            name="Exhaust Fan"
            state={currentRoom.exhaust.isOn}
            onClick={handleExhaustToggle}
            disabled={
              mode === "AUTO" ||
              isDeviceControlLoading ||
              !selectedDeviceId
            }
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
      className={`flex items-center justify-between p-4 rounded-xl transition-all
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