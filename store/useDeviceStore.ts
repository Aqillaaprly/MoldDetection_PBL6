"use client"

import { create } from "zustand"
import { Room, DeviceMode, DeviceType } from "@/types/device"
import { deviceService } from "@/services/deviceService"

interface DeviceStore {
  rooms: Room[]
  mode: DeviceMode
  isLoaded: boolean

  loadRooms: () => Promise<void>
  setMode: (mode: DeviceMode) => void
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

  setMode: (mode) => set({ mode }),

  addRoom: (room) => {
    deviceService.addRoom(get().rooms, room).then((rooms) => set({ rooms }))
  },

  deleteRoom: (index) => {
    deviceService.deleteRoom(get().rooms, index).then((rooms) => set({ rooms }))
  },

  editRoom: (index, room) => {
    deviceService.editRoom(get().rooms, index, room).then((rooms) => set({ rooms }))
  },

  toggleDevice: (roomName, type) => {
    deviceService.toggleDevice(get().rooms, roomName, type).then((rooms) => set({ rooms }))
  },

  syncAutoDevices: (roomName, humidity, temperature) => {
    deviceService
      .syncAutoDevices(get().rooms, get().mode, roomName, humidity, temperature)
      .then((rooms) => set({ rooms }))
  },
}))