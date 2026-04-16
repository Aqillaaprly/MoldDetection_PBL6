"use client"

import { useState } from "react"
import DeviceCard from "@/components/devices/DeviceCard"
import AutomationPanel from "@/components/devices/AutomationPanel"
import DeviceEvents from "@/components/devices/DeviceEvents"
import ZoneCalibration from "@/components/devices/ZoneCalibration"

export default function DevicePage() {

  const [airPurifierOn, setAirPurifierOn] = useState(false)
  const [exhaustOn, setExhaustOn] = useState(true)

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Device Management
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-12 lg:col-span-8 space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            <DeviceCard
              name="Main Air Purifier"
              location="Primary Living Suite"
              isOn={airPurifierOn}
              toggle={() => setAirPurifierOn(!airPurifierOn)}
              type="purifier"
            />

            <DeviceCard
              name="Basement Exhaust"
              location="Utility Zone 02"
              isOn={exhaustOn}
              toggle={() => setExhaustOn(!exhaustOn)}
              type="exhaust"
            />

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