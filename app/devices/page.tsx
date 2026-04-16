"use client";

import { useState } from "react";
import { Wind, Fan, Clock, Activity } from "lucide-react";

export default function DevicePage() {
  const [airPurifierOn, setAirPurifierOn] = useState(false);
  const [exhaustOn, setExhaustOn] = useState(true);
  const [automation, setAutomation] = useState(true);

  const statusStyle = (isOn: boolean) =>
    isOn
      ? "bg-green-400 text-green-900"
      : "bg-red-100 text-red-500";

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Device Management
          </h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            <div className="grid md:grid-cols-2 gap-6">

              {/* AIR PURIFIER */}
              <div
                className={`rounded-3xl p-7 h-[280px] flex flex-col justify-between shadow-sm transition ${
                  airPurifierOn
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "bg-white"
                }`}
              >
                <div>
                  <div className="flex justify-between mb-6">
                    <div
                      className={`p-3 rounded-xl ${
                        airPurifierOn ? "bg-white/20" : "bg-slate-50"
                      }`}
                    >
                      <Wind />
                    </div>

                    <span className={`text-xs px-3 py-1 rounded-md ${statusStyle(airPurifierOn)}`}>
                      {airPurifierOn ? "ON" : "OFF"}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold">
                    Main Air Purifier
                  </h3>

                  <p className={`text-sm ${airPurifierOn ? "text-white/70" : "text-slate-400"}`}>
                    Primary Living Suite
                  </p>
                </div>

                <button
                  onClick={() => setAirPurifierOn(!airPurifierOn)}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    airPurifierOn
                      ? "bg-white text-indigo-600"
                      : "bg-indigo-500 text-white"
                  }`}
                >
                  {airPurifierOn ? "Turn OFF" : "Turn ON"}
                </button>
              </div>

              {/* EXHAUST */}
              <div
                className={`rounded-3xl p-7 h-[280px] flex flex-col justify-between shadow-sm transition ${
                  exhaustOn
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "bg-white"
                }`}
              >
                <div>
                  <div className="flex justify-between mb-6">
                    <div
                      className={`p-3 rounded-xl ${
                        exhaustOn ? "bg-white/20" : "bg-slate-50"
                      }`}
                    >
                      <Fan />
                    </div>

                    {/* 🔥 FIX DI SINI */}
                    <span className={`text-xs px-3 py-1 rounded-md ${statusStyle(exhaustOn)}`}>
                      {exhaustOn ? "ON" : "OFF"}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold">
                    Basement Exhaust
                  </h3>

                  <p className={`text-sm ${exhaustOn ? "text-white/70" : "text-slate-400"}`}>
                    Utility Zone 02
                  </p>

                  <p className="mt-2">
                    RPM: {exhaustOn ? "1,240" : "0"}
                  </p>
                </div>

                <button
                  onClick={() => setExhaustOn(!exhaustOn)}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    exhaustOn
                      ? "bg-white text-indigo-600"
                      : "bg-indigo-500 text-white"
                  }`}
                >
                  {exhaustOn ? "Turn OFF" : "Turn ON"}
                </button>
              </div>
            </div>

            {/* ZONE */}
            <div className="bg-white rounded-3xl p-7 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">
                Zone Calibration
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Fine-tune the moisture extraction parameters for the{" "}
                <span className="text-indigo-600 font-semibold">
                  East Laboratory Wing.
                </span>{" "}
                This overrides global automation presets for 24 hours.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* AUTOMATION */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Automation Mode</span>

                <div
                  onClick={() => setAutomation(!automation)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer ${
                    automation ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white ${
                      automation ? "ml-auto" : ""
                    }`}
                  />
                </div>
              </div>

              <p className="text-sm mb-2">Humidity Threshold</p>

              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="w-[70%] h-full bg-indigo-500 rounded-full" />
              </div>

              <p className="text-right mt-1">70%</p>
            </div>

            {/* EVENTS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between mb-5">
                <h4 className="font-semibold">Recent Device Events</h4>
                <Clock size={16} />
              </div>

              <div className="space-y-5 text-sm">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-semibold">Exhaust Fan Started</p>
                    <p className="opacity-70">Today, 08:42 AM • Auto Mode</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                  <div>
                    <p className="font-semibold">Firmware Updated</p>
                    <p className="opacity-70">Yesterday • v4.2.0</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                  <div>
                    <p className="font-semibold">Sensor Offline</p>
                    <p className="opacity-70">2 days ago • Kitchen Hub</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}