"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { Room } from "@/types/device"

interface DeviceStore {

  rooms: Room[]

  mode: "AUTO" | "MANUAL"

  setMode: (mode: "AUTO" | "MANUAL") => void

  addRoom: (room: Room) => void

  deleteRoom: (index: number) => void

  editRoom: (index: number, room: Room) => void

  toggleDevice: (
    roomName: string,
    type: "dehumidifier" | "exhaust"
  ) => void
}

const defaultRooms: Room[] = [
  {
    name: "Living Room",
    dehumidifier: {
      enabled: true,
      isOn: false,
      connectivity: "online"
    },
    exhaust: {
      enabled: true,
      isOn: true,
      connectivity: "online"
    }
  },
  {
    name: "Bedroom 1",
    dehumidifier: {
      enabled: true,
      isOn: true,
      connectivity: "online"
    },
    exhaust: {
      enabled: false,
      isOn: false,
      connectivity: "offline"
    }
  },
  {
    name: "Bedroom 2",
    dehumidifier: {
      enabled: true,
      isOn: false,
      connectivity: "online"
    },
    exhaust: {
      enabled: true,
      isOn: false,
      connectivity: "online"
    }
  },
  {
    name: "Kitchen",
    dehumidifier: {
      enabled: false,
      isOn: false,
      connectivity: "offline"
    },
    exhaust: {
      enabled: true,
      isOn: true,
      connectivity: "online"
    }
  }
]

export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set, get) => ({

      rooms: defaultRooms,

      mode: "AUTO",

      setMode: (mode) => set({ mode }),

      addRoom: (room) =>
        set((state) => ({
          rooms: [...state.rooms, room]
        })),

      deleteRoom: (index) =>
        set((state) => ({
          rooms: state.rooms.filter((_, i) => i !== index)
        })),

      editRoom: (index, room) =>
        set((state) => {
          const updated = [...state.rooms]
          updated[index] = room
          return { rooms: updated }
        }),

/* FIX AUTO/MANUAL TOGGLE */
      toggleDevice: (roomName, type) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.name === roomName
              ? {
                  ...room,
                  [type]: {
                    ...room[type],
                    isOn: !room[type].isOn
                  }
                }
              : room
          )
        }))
    }),

/* 🔥 IMPORTANT FIX: SAFE STORAGE (NO SSR ERROR) */
    {
      name: "mold_app_devices",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      })
    }
  )
)