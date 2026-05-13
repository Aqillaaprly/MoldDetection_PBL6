import {
  Room,
  DeviceType,
  DeviceMode
} from "@/types/device"

export interface DeviceRepository {
  getRooms: () => Promise<Room[]>

  saveRooms: (rooms: Room[]) => Promise<void>

  addRoom: (
    rooms: Room[],
    room: Room
  ) => Promise<Room[]>

  deleteRoom: (
    rooms: Room[],
    index: number
  ) => Promise<Room[]>

  editRoom: (
    rooms: Room[],
    index: number,
    room: Room
  ) => Promise<Room[]>

  toggleDevice: (
    rooms: Room[],
    roomName: string,
    type: DeviceType
  ) => Promise<Room[]>

  syncAutoDevices: (
    rooms: Room[],
    mode: DeviceMode,
    roomName: string,
    humidity: number,
    temperature: number
  ) => Promise<Room[]>
}

export const deviceService: DeviceRepository = {
  async getRooms() {
    return []
  },

  async saveRooms() {
    return
  },

  async addRoom(
    rooms,
    room
  ) {
    const isDuplicate = rooms.some(
      (item) =>
        item.name.toLowerCase() ===
        room.name.toLowerCase()
    )

    if (isDuplicate) {
      return rooms
    }

    return [
      ...rooms,
      {
        ...room,
        dehumidifier: {
          ...room.dehumidifier,
          connectivity: "online"
        },
        exhaust: {
          ...room.exhaust,
          connectivity: "online"
        }
      }
    ]
  },

  async deleteRoom(
    rooms,
    index
  ) {
    return rooms.filter(
      (_, i) => i !== index
    )
  },

  async editRoom(
    rooms,
    index,
    room
  ) {
    const updated = [
      ...rooms
    ]

    if (!updated[index]) {
      return rooms
    }

    updated[index] = {
      ...room,
      dehumidifier: {
        ...room.dehumidifier,
        connectivity:
          room.dehumidifier.connectivity ??
          "online"
      },
      exhaust: {
        ...room.exhaust,
        connectivity:
          room.exhaust.connectivity ??
          "online"
      }
    }

    return updated
  },

  async toggleDevice(
    rooms,
    roomName,
    type
  ) {
    return rooms.map((room) => {
      if (room.name !== roomName) {
        return room
      }

      if (!room[type].enabled) {
        return room
      }

      if (
        room[type].connectivity === "offline"
      ) {
        return room
      }

      return {
        ...room,
        [type]: {
          ...room[type],
          isOn:
            !room[type].isOn
        }
      }
    })
  },

  async syncAutoDevices(
    rooms,
    mode,
    roomName,
    humidity,
    temperature
  ) {
    if (mode !== "AUTO") {
      return rooms
    }

    return rooms.map((room) => {
      if (room.name !== roomName) {
        return room
      }

      const nextDehumidifierOn =
        room.dehumidifier.enabled &&
        room.dehumidifier.connectivity ===
          "online"
          ? humidity > 80
          : false

      const nextExhaustOn =
        room.exhaust.enabled &&
        room.exhaust.connectivity ===
          "online"
          ? temperature > 30
          : false

      if (
        room.dehumidifier.isOn ===
          nextDehumidifierOn &&
        room.exhaust.isOn ===
          nextExhaustOn
      ) {
        return room
      }

      return {
        ...room,
        dehumidifier: {
          ...room.dehumidifier,
          isOn: nextDehumidifierOn
        },
        exhaust: {
          ...room.exhaust,
          isOn: nextExhaustOn
        }
      }
    })
  }
}