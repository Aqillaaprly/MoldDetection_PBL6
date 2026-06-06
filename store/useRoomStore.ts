import { create } from "zustand"

interface RoomState {
  selectedRoom: string
  selectedRoomId: number | null
  setSelectedRoom: (room: string, id?: number) => void
}

export const useRoomStore = create<RoomState>((set) => ({
  selectedRoom: "",
  selectedRoomId: null,
  setSelectedRoom: (room, id) =>
    set({ selectedRoom: room, selectedRoomId: id ?? null }),
}))