"use client"

import { create } from "zustand"
import { Room, DeviceMode, DeviceType } from "@/types/device"
import { deviceService } from "@/services/deviceService"

interface DeviceStore {
  rooms: Room[]
  mode: DeviceMode
  isLoaded: boolean
  selectedDeviceId: string | null
  deviceIdByRoom: Record<string, string>

  loadRooms: () => Promise<void>
  loadDevicesFromApi: () => Promise<void>
  selectDeviceByRoom: (roomName: string) => void
  setMode: (mode: DeviceMode) => Promise<void>
  addRoom: (room: Room) => void
  deleteRoom: (index: number) => void
  editRoom: (index: number, room: Room) => void
  toggleDevice: (roomName: string, type: DeviceType) => void
  syncAutoDevices: (roomName: string, humidity: number, temperature: number) => void
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  rooms: [],
  mode: "AUTO",
  isLoaded: false,
  selectedDeviceId: null,
  deviceIdByRoom: {},

  // Load rooms dari API (rooms milik user yang login)
  loadRooms: async () => {
    try {
      const res = await fetch("/api/rooms", { cache: "no-store" })
      if (!res.ok) return

      const dbRooms = await res.json()

      const rooms: Room[] = dbRooms.map((r: { id: number; name: string }) => ({
        id: r.id,
        name: r.name,
        dehumidifier: { enabled: true, isOn: false, connectivity: "online" },
        exhaust: { enabled: true, isOn: false, connectivity: "online" },
      }))

      set({ rooms, isLoaded: true })
    } catch (err) {
      console.error("loadRooms error:", err)
      set({ isLoaded: true })
    }
  },

  loadDevicesFromApi: async () => {
    try {
      const res = await fetch("/api/devices", { cache: "no-store" })
      if (!res.ok) return

      const json = await res.json()
      const devices: any[] = json?.data ?? []

      const deviceIdByRoom = devices.reduce<Record<string, string>>(
        (acc, device) => {
          const roomName = device?.rooms?.name ?? ""
          const deviceId = device?.device_id

          if (roomName && typeof deviceId === "string") {
            acc[roomName] = deviceId
          }

          return acc
        },
        {}
      )

      set({ deviceIdByRoom })
    } catch (err) {
      console.error("loadDevicesFromApi error:", err)
    }
  },

  selectDeviceByRoom: (roomName) => {
    const deviceId = get().deviceIdByRoom[roomName] ?? null
    set({ selectedDeviceId: deviceId })
  },

  setMode: async (mode) => {
    const selectedDeviceId = get().selectedDeviceId

    if (!selectedDeviceId) {
      set({ mode })
      return
    }

    try {
      const res = await fetch(
        `/api/devices/${selectedDeviceId}/control`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ controlMode: mode }),
        }
      )

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? "Failed to update device mode")
      }

      set({ mode })
    } catch (error) {
      console.error("setMode error:", error)
      throw error instanceof Error
        ? error
        : new Error("Failed to update mode")
    }
  },

  addRoom: (room) => {
    deviceService.addRoom(get().rooms, room).then((rooms) => set({ rooms }))
  },

  deleteRoom: (index) => {
    deviceService.deleteRoom(get().rooms, index).then((rooms) => set({ rooms }))
  },

  editRoom: (index, room) => {
    deviceService.editRoom(get().rooms, index, room).then((rooms) => set({ rooms }))
  },

  toggleDevice: async (roomName, type) => {
    const selectedDeviceId = get().selectedDeviceId

    if (!selectedDeviceId) return

    try {
      const currentRooms = get().rooms
      const room = currentRooms.find((r) => r.name === roomName)
      
      if (!room || !room[type].enabled) return

      const currentState = room[type].isOn
      const newState = !currentState

      // Send to backend
      const res = await fetch(
        `/api/devices/${selectedDeviceId}/control`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actuatorStatus: newState ? "ON" : "OFF",
          }),
        }
      )

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? "Failed to update device")
      }

      // Update local state
      deviceService
        .toggleDevice(get().rooms, roomName, type)
        .then((rooms) => set({ rooms }))
    } catch (error) {
      console.error("toggleDevice error:", error)
      throw error instanceof Error
        ? error
        : new Error("Failed to update device")
    }
  },

  syncAutoDevices: (roomName, humidity, temperature) => {
    deviceService
      .syncAutoDevices(get().rooms, get().mode, roomName, humidity, temperature)
      .then((rooms) => set({ rooms }))
  },
}))
