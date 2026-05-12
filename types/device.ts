export interface DeviceState {
  enabled: boolean
  isOn: boolean
  connectivity: "online" | "offline"
}

export interface Room {
  name: string
  dehumidifier: DeviceState
  exhaust: DeviceState
}