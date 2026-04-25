"use client"

import { useState } from "react"
import DeviceCard from "@/components/devices/DeviceCard"
import AutomationPanel from "@/components/devices/AutomationPanel"
import DeviceEvents from "@/components/devices/DeviceEvents"
import ZoneCalibration from "@/components/devices/ZoneCalibration"

export default function DevicePage() {

  const [rooms, setRooms] = useState([
    {
      name: "Living Room",
      purifier: false,
      exhaust: true
    },
    {
      name: "Bedroom 1",
      purifier: true,
      exhaust: false
    },
    {
      name: "Bedroom 2",
      purifier: false,
      exhaust: false
    },
    {
      name: "Kitchen",
      purifier: true,
      exhaust: true
    }
  ])

  const toggleDevice = (index: number, type: "purifier" | "exhaust") => {
    const updated = [...rooms]
    updated[index][type] = !updated[index][type]
    setRooms(updated)
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Device Management
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Rooms */}
          <div className="grid md:grid-cols-2 gap-6">

            {rooms.map((room, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6"
              >

                <h3 className="font-semibold text-lg">
                  {room.name}
                </h3>

                <div className="grid grid-cols-2 gap-4">

                  <DeviceCard
                    name="Air Purifier"
                    location={room.name}
                    isOn={room.purifier}
                    toggle={() => toggleDevice(i, "purifier")}
                    type="purifier"
                  />

                  <DeviceCard
                    name="Exhaust Fan"
                    location={room.name}
                    isOn={room.exhaust}
                    toggle={() => toggleDevice(i, "exhaust")}
                    type="exhaust"
                  />

                </div>

              </div>
            ))}

          </div>

          <ZoneCalibration />

        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">

          <AutomationPanel />

          <DeviceEvents />

        </div>

      </div>
    </div>
  )
}