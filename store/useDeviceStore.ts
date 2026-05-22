"use client"

import { create } from "zustand"
import {
  persist,
  createJSONStorage
} from "zustand/middleware"

import {
  Room,
  DeviceMode,
  DeviceType
} from "@/types/device"

import {
  deviceService
} from "@/services/deviceService"

interface DeviceStore {
  rooms: Room[]

  mode: DeviceMode

  setMode: (mode: DeviceMode) => void

  addRoom: (room: Room) => void

  deleteRoom: (index: number) => void

  editRoom: (
    index: number,
    room: Room
  ) => void

  toggleDevice: (
    roomName: string,
    type: DeviceType
  ) => void

  syncAutoDevices: (
    roomName: string,
    humidity: number,
    temperature: number
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
      connectivity: "online"
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
      connectivity: "online"
    },
    exhaust: {
      enabled: true,
      isOn: true,
      connectivity: "online"
    }
  }
]

export const useDeviceStore =
  create<DeviceStore>()(
    persist(
      (set, get) => ({
        rooms: defaultRooms,

        mode: "AUTO",

        setMode: (mode) =>
          set({
            mode
          }),

        addRoom: (room) => {
          deviceService
            .addRoom(
              get().rooms,
              room
            )
            .then((rooms) =>
              set({
                rooms
              })
            )
        },

        deleteRoom: (index) => {
          deviceService
            .deleteRoom(
              get().rooms,
              index
            )
            .then((rooms) =>
              set({
                rooms
              })
            )
        },

        editRoom: (
          index,
          room
        ) => {
          deviceService
            .editRoom(
              get().rooms,
              index,
              room
            )
            .then((rooms) =>
              set({
                rooms
              })
            )
        },

        toggleDevice: (
          roomName,
          type
        ) => {
          deviceService
            .toggleDevice(
              get().rooms,
              roomName,
              type
            )
            .then((rooms) =>
              set({
                rooms
              })
            )
        },

        syncAutoDevices: (
          roomName,
          humidity,
          temperature
        ) => {
          deviceService
            .syncAutoDevices(
              get().rooms,
              get().mode,
              roomName,
              humidity,
              temperature
            )
            .then((rooms) =>
              set({
                rooms
              })
            )
        }
      }),
      {
        name: "mold_app_devices",
        storage: createJSONStorage(() => {
          if (
            typeof window !== "undefined"
          ) {
            return window.localStorage
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