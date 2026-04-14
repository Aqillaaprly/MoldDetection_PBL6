import { create } from "zustand"

interface SensorState {
  humidity: number
  temperature: number
  light: number
  updateSensors: () => void
}

export const useSensorStore = create<SensorState>((set) => ({
  humidity: 78,
  temperature: 29,
  light: 65,

  updateSensors: () =>
    set(() => ({
      humidity: Math.floor(Math.random() * 20) + 60,
      temperature: Math.floor(Math.random() * 5) + 26,
      light: Math.floor(Math.random() * 40) + 40
    }))
}))