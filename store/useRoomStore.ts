import { create } from "zustand"

interface RoomState {

  selectedRoom: string

  setSelectedRoom: (
    room: string
  ) => void
}

export const useRoomStore =
  create<RoomState>((set) => ({

    selectedRoom: "Living Room",

    setSelectedRoom: (room) =>
      set({
        selectedRoom: room
      })
  }))