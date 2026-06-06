export type DeviceMode = "AUTO" | "MANUAL"

export type DeviceConnectivity = "online" | "offline"

export type DeviceType = "dehumidifier" | "exhaust"

export interface DeviceState {
  enabled: boolean
  isOn: boolean
  connectivity: DeviceConnectivity
}

export interface Room {
  name: string
  dehumidifier: DeviceState
  exhaust: DeviceState
}