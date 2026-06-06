"use client"

import {
  Wind,
  Fan,
  Pencil,
  Trash2
} from "lucide-react"

type DeviceTableItem = {
  roomName: string
  roomIndex: number
  deviceName: string
  isOn: boolean
  connectivity: "online" | "offline"
  type: "purifier" | "exhaust"
  toggle: () => void
}

type Props = {
  devices: DeviceTableItem[]
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export default function MobileDeviceTable({
  devices,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="sm:hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">

      <div className="grid grid-cols-[1fr_1.15fr_52px_44px] gap-2 px-3 py-3 text-[9px] font-semibold text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800">
        <span>Room</span>
        <span>Device</span>
        <span className="text-center">Status</span>
        <span className="text-center">Action</span>
      </div>

      {devices.map((device, index) => {
        const Icon =
          device.type === "purifier"
            ? Wind
            : Fan

        const isOnline =
          device.connectivity === "online"

        const realStatus =
          isOnline ? device.isOn : false

        const isFirstRoomRow =
          index === 0 ||
          devices[index - 1].roomName !== device.roomName

        return (
          <div
            key={`${device.roomName}-${device.deviceName}-${index}`}
            className="grid grid-cols-[1fr_1.15fr_52px_44px] gap-2 items-center px-3 py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800"
          >
            <p className="text-[11px] font-medium text-gray-700 dark:text-gray-200 truncate">
              {isFirstRoomRow ? device.roomName : ""}
            </p>

            <div className="flex items-center gap-1.5 min-w-0">
              <Icon
                size={13}
                className="text-indigo-500 shrink-0"
              />

              <p className="text-[11px] text-gray-600 dark:text-gray-300 truncate">
                {device.deviceName}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={device.toggle}
                disabled={!isOnline}
                className={`w-9 h-5 rounded-full relative transition ${
                  realStatus
                    ? "bg-indigo-500"
                    : "bg-gray-300 dark:bg-gray-700"
                } ${
                  !isOnline &&
                  "opacity-50 cursor-not-allowed"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                    realStatus ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              {isFirstRoomRow && (
                <>
                  <button
                    onClick={() => onEdit(device.roomIndex)}
                    className="text-gray-400 hover:text-indigo-500"
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    onClick={() => onDelete(device.roomIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}

    </div>
  )
}