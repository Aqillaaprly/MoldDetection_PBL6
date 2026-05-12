"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import DeviceCard from "@/components/devices/DeviceCard"
import AutomationPanel from "@/components/devices/AutomationPanel"
import DeviceEvents from "@/components/devices/DeviceEvents"
import ZoneCalibration from "@/components/devices/ZoneCalibration"

import { useDeviceStore } from "@/store/useDeviceStore"

export default function DevicePage() {

  const {
    rooms,
    addRoom,
    deleteRoom,
    editRoom,
    toggleDevice
  } = useDeviceStore()

  const [showAdd, setShowAdd] = useState(false)

  const [newRoom, setNewRoom] = useState("")
  const [newDehumidifier, setNewDehumidifier] = useState(false)
  const [newExhaust, setNewExhaust] = useState(false)

  const [showEdit, setShowEdit] = useState(false)

  const [editIndex, setEditIndex] =
    useState<number | null>(null)

  const [editRoomName, setEditRoomName] =
    useState("")

  const [editDehumidifier, setEditDehumidifier] =
    useState(false)

  const [editExhaust, setEditExhaust] =
    useState(false)

  // ADD ROOM
  const handleAddRoom = () => {

    if (!newRoom.trim()) return

    addRoom({

      name: newRoom,

      dehumidifier: {
        enabled: newDehumidifier,
        isOn: false,
        connectivity: "offline"
      },

      exhaust: {
        enabled: newExhaust,
        isOn: false,
        connectivity: "offline"
      }
    })

    setNewRoom("")
    setNewDehumidifier(false)
    setNewExhaust(false)
    setShowAdd(false)
  }

  // OPEN EDIT
  const openEdit = (index: number) => {

    const room = rooms[index]

    setEditIndex(index)

    setEditRoomName(room.name)

    setEditDehumidifier(
      room.dehumidifier.enabled
    )

    setEditExhaust(
      room.exhaust.enabled
    )

    setShowEdit(true)
  }

  // SAVE EDIT
  const saveEdit = () => {

    if (editIndex === null) return

    editRoom(editIndex, {

      name: editRoomName,

      dehumidifier: {
        ...rooms[editIndex].dehumidifier,
        enabled: editDehumidifier
      },

      exhaust: {
        ...rooms[editIndex].exhaust,
        enabled: editExhaust
      }
    })

    setShowEdit(false)
  }

  // DELETE ROOM
  const handleDeleteRoom = (
    index: number
  ) => {

    const confirmDelete = confirm(
      "Delete this device setup?"
    )

    if (!confirmDelete) return

    deleteRoom(index)
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Device Management
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition"
        >
          + Add Device
        </button>

      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            {rooms.map((room, i) => (

              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6"
              >

                {/* ROOM HEADER */}
                <div className="flex justify-between items-center">

                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {room.name}
                  </h3>

                  <div className="flex gap-3">

                    <button
                      onClick={() => openEdit(i)}
                      className="text-gray-400 hover:text-indigo-500 transition"
                    >
                      <Pencil size={16}/>
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteRoom(i)
                      }
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={16}/>
                    </button>

                  </div>

                </div>

                {/* DEVICES */}
                <div className="grid grid-cols-2 gap-4">

                  {room.dehumidifier.enabled && (

                    <DeviceCard
                      name="Dehumidifier"
                      location={room.name}
                      isOn={room.dehumidifier.isOn}
                      connectivity={room.dehumidifier.connectivity}
                      toggle={() =>
                        toggleDevice(
                          room.name,
                          "dehumidifier"
                        )
                      }
                      type="purifier"
                    />

                  )}

                  {room.exhaust.enabled && (

                    <DeviceCard
                      name="Exhaust Fan"
                      location={room.name}
                      isOn={room.exhaust.isOn}
                      connectivity={room.exhaust.connectivity}
                      toggle={() =>
                        toggleDevice(
                          room.name,
                          "exhaust"
                        )
                      }
                      type="exhaust"
                    />

                  )}

                </div>

              </div>

            ))}

          </div>

          <ZoneCalibration />

        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          <AutomationPanel />

          <DeviceEvents />

        </div>

      </div>

      {/* ADD MODAL */}
      {showAdd && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">

            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Add Device
            </h2>

            <input
              type="text"
              placeholder="Room name"
              value={newRoom}
              onChange={(e) =>
                setNewRoom(e.target.value)
              }
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
            />

            <div className="mt-4 space-y-2 text-sm">

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={newDehumidifier}
                  onChange={(e) =>
                    setNewDehumidifier(
                      e.target.checked
                    )
                  }
                />

                Dehumidifier

              </label>

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={newExhaust}
                  onChange={(e) =>
                    setNewExhaust(
                      e.target.checked
                    )
                  }
                />

                Exhaust Fan

              </label>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setShowAdd(false)
                }
                className="px-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleAddRoom}
                className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white"
              >
                Add
              </button>

            </div>

          </div>

        </div>

      )}

      {/* EDIT MODAL */}
      {showEdit && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">

            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Edit Device
            </h2>

            <input
              type="text"
              value={editRoomName}
              onChange={(e) =>
                setEditRoomName(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
            />

            <div className="mt-4 space-y-2 text-sm">

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={editDehumidifier}
                  onChange={(e) =>
                    setEditDehumidifier(
                      e.target.checked
                    )
                  }
                />

                Dehumidifier

              </label>

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={editExhaust}
                  onChange={(e) =>
                    setEditExhaust(
                      e.target.checked
                    )
                  }
                />

                Exhaust Fan

              </label>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setShowEdit(false)
                }
                className="px-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}