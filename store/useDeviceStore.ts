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

type DeviceStatus = "ON" | "OFF"

type ApiRoomRelation =
  | {
      id: number
      name: string
    }
  | {
      id: number
      name: string
    }[]
  | null

type ApiDevice = {
  id: number
  device_id: string
  device_name: string
  room_id: number | null
  device_type: string
  actuator_type: string
  control_mode: DeviceMode
  actuator_status: DeviceStatus
  is_active: boolean
  rooms?: ApiRoomRelation
}

interface DeviceStore {
  rooms: Room[]
  devices: ApiDevice[]

  mode: DeviceMode

  selectedDeviceId: string | null
  selectedActuatorStatus: DeviceStatus
  isDeviceControlLoading: boolean

  loadDevicesFromApi: () => Promise<void>
  selectDeviceByRoom: (roomName: string) => void

  setMode: (mode: DeviceMode) => Promise<void>

  addRoom: (room: Room) => void
  deleteRoom: (index: number) => void
  editRoom: (index: number, room: Room) => void

  toggleDevice: (
    roomName: string,
    type: DeviceType
  ) => Promise<void>

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
      isOn: false,
      connectivity: "online"
    }
  },
  {
    name: "Bedroom 1",
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
      isOn: false,
      connectivity: "online"
    }
  }
]

function normalizeDeviceMode(value: unknown): DeviceMode {
  return value === "MANUAL" ? "MANUAL" : "AUTO"
}

function normalizeDeviceStatus(value: unknown): DeviceStatus {
  return value === "ON" ? "ON" : "OFF"
}

function normalizeApiDevice(device: ApiDevice): ApiDevice {
  return {
    ...device,
    control_mode: normalizeDeviceMode(device.control_mode),
    actuator_status: normalizeDeviceStatus(device.actuator_status)
  }
}

function getRoomNameFromDevice(device: ApiDevice) {
  const rooms = device.rooms

  if (!rooms) return null

  if (Array.isArray(rooms)) {
    return rooms[0]?.name ?? null
  }

  return rooms.name ?? null
}

function findDeviceByRoom(
  devices: ApiDevice[],
  roomName: string
) {
  return devices.find((device) => {
    const deviceRoomName = getRoomNameFromDevice(device)

    return deviceRoomName === roomName
  })
}

async function patchDeviceControl(
  deviceId: string,
  payload: {
    controlMode?: DeviceMode
    actuatorStatus?: DeviceStatus
  }
) {
  const res = await fetch(
    `/api/devices/${deviceId}/control`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  )

  const text = await res.text()

  let json: {
    success?: boolean
    message?: string
    device?: unknown
    error?: string
  }

  try {
    json = JSON.parse(text)
  } catch {
    console.error("API returned non-JSON response:", text)

    throw new Error(
      "API response bukan JSON. Cek endpoint control atau pastikan server jalan di port 3000."
    )
  }

  if (!res.ok) {
    throw new Error(
      json.message ?? "Failed to update device control"
    )
  }

  return json
}

export const useDeviceStore =
  create<DeviceStore>()(
    persist(
      (set, get) => ({
        rooms: defaultRooms,
        devices: [],

        mode: "AUTO",

        selectedDeviceId: null,
        selectedActuatorStatus: "OFF",
        isDeviceControlLoading: false,

        loadDevicesFromApi: async () => {
          const res = await fetch("/api/devices", {
            cache: "no-store"
          })

          const json = await res.json()

          if (!res.ok || !json.success) {
            console.error("Failed to load devices:", json)
            return
          }

          const devices =
            (json.data as ApiDevice[]).map(
              normalizeApiDevice
            )

          set((state) => {
            const updatedRooms =
              state.rooms.map((room) => {
                const device =
                  findDeviceByRoom(
                    devices,
                    room.name
                  )

                const isOn =
                  device?.actuator_status === "ON"

                return {
                  ...room,

                  dehumidifier: {
                    ...room.dehumidifier,
                    isOn: false
                  },

                  exhaust: {
                    ...room.exhaust,
                    isOn
                  }
                }
              })

            return {
              devices,
              rooms: updatedRooms
            }
          })
        },

        selectDeviceByRoom: (roomName) => {
          const device =
            findDeviceByRoom(
              get().devices,
              roomName
            )

          if (!device) {
            set({
              selectedDeviceId: null,
              selectedActuatorStatus: "OFF",
              mode: "AUTO"
            })

            return
          }

          set({
            selectedDeviceId: device.device_id,
            selectedActuatorStatus: device.actuator_status,
            mode: device.control_mode
          })
        },

        setMode: async (mode) => {
          const deviceId = get().selectedDeviceId

          if (!deviceId) {
            throw new Error("No selected device for this room")
          }

          set({
            isDeviceControlLoading: true
          })

          try {
            await patchDeviceControl(
              deviceId,
              {
                controlMode: mode
              }
            )

            set({
              mode
            })

            await get().loadDevicesFromApi()
          } finally {
            set({
              isDeviceControlLoading: false
            })
          }
        },

        addRoom: (room) => {
          deviceService
            .addRoom(get().rooms, room)
            .then((rooms) =>
              set({
                rooms
              })
            )
        },

        deleteRoom: (index) => {
          deviceService
            .deleteRoom(get().rooms, index)
            .then((rooms) =>
              set({
                rooms
              })
            )
        },

        editRoom: (index, room) => {
          deviceService
            .editRoom(get().rooms, index, room)
            .then((rooms) =>
              set({
                rooms
              })
            )
        },

        toggleDevice: async (
          roomName,
          type
        ) => {
          if (type !== "exhaust") {
            return
          }

          const device =
            findDeviceByRoom(
              get().devices,
              roomName
            )

          if (!device) {
            throw new Error("No device registered for this room")
          }

          const nextStatus: DeviceStatus =
            device.actuator_status === "ON"
              ? "OFF"
              : "ON"

          set({
            isDeviceControlLoading: true
          })

          try {
            await patchDeviceControl(
              device.device_id,
              {
                controlMode: "MANUAL",
                actuatorStatus: nextStatus
              }
            )

            set((state) => {
              const updatedRooms =
                state.rooms.map((room) => {
                  if (room.name !== roomName) {
                    return room
                  }

                  return {
                    ...room,

                    dehumidifier: {
                      ...room.dehumidifier,
                      isOn: false
                    },

                    exhaust: {
                      ...room.exhaust,
                      isOn: nextStatus === "ON"
                    }
                  }
                })

              const updatedDevices =
                state.devices.map((item) => {
                  if (item.device_id !== device.device_id) {
                    return item
                  }

                  return {
                    ...item,
                    control_mode: "MANUAL" as DeviceMode,
                    actuator_status: nextStatus
                  }
                })

              return {
                rooms: updatedRooms,
                devices: updatedDevices,
                mode: "MANUAL" as DeviceMode,
                selectedDeviceId: device.device_id,
                selectedActuatorStatus: nextStatus
              }
            })

            await get().loadDevicesFromApi()
            get().selectDeviceByRoom(roomName)
          } finally {
            set({
              isDeviceControlLoading: false
            })
          }
        },

        syncAutoDevices: (
  roomName,
  humidity,
  temperature
) => {
  void roomName
  void humidity
  void temperature

  return
}
      }),
      {
        name: "mold_app_devices",
        storage: createJSONStorage(() => {
          if (typeof window !== "undefined") {
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