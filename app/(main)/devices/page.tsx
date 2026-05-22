"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import DeviceCard from "@/components/devices/DeviceCard"
import AutomationPanel from "@/components/devices/AutomationPanel"
import DeviceEvents from "@/components/devices/DeviceEvents"
import ZoneCalibration from "@/components/devices/ZoneCalibration"
import MobileDeviceTable from "@/components/devices/MobileDeviceTable"

import { useDeviceStore } from "@/store/useDeviceStore"

export default function DevicePage() {
  const {
    rooms,
    addRoom,
    deleteRoom,
    editRoom,
    toggleDevice
  } = useDeviceStore()

  const [mobilePage, setMobilePage] = useState(1)
  const [desktopPage, setDesktopPage] = useState(1)

  const ITEMS_PER_PAGE_DESKTOP = 6
  const ITEMS_PER_PAGE_MOBILE = 8

  const [showAdd, setShowAdd] = useState(false)
  const [newRoom, setNewRoom] = useState("")
  const [newDehumidifier, setNewDehumidifier] = useState(false)
  const [newExhaust, setNewExhaust] = useState(false)

  const [showEdit, setShowEdit] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editRoomName, setEditRoomName] = useState("")
  const [editDehumidifier, setEditDehumidifier] = useState(false)
  const [editExhaust, setEditExhaust] = useState(false)

  const mobileDevices = rooms.flatMap((room, index) => [
    ...(room.dehumidifier.enabled
      ? [{
          roomName: room.name,
          roomIndex: index,
          deviceName: "Dehumidifier",
          isOn: room.dehumidifier.isOn,
          connectivity: room.dehumidifier.connectivity,
          type: "purifier" as const,
          toggle: () => toggleDevice(room.name, "dehumidifier")
        }]
      : []),
    ...(room.exhaust.enabled
      ? [{
          roomName: room.name,
          roomIndex: index,
          deviceName: "Exhaust Fan",
          isOn: room.exhaust.isOn,
          connectivity: room.exhaust.connectivity,
          type: "exhaust" as const,
          toggle: () => toggleDevice(room.name, "exhaust")
        }]
      : [])
  ])

  const mobileTotalPages = Math.ceil(mobileDevices.length / ITEMS_PER_PAGE_MOBILE)
  const desktopTotalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE_DESKTOP)

  const paginatedMobileDevices = mobileDevices.slice(
    (mobilePage - 1) * ITEMS_PER_PAGE_MOBILE,
    mobilePage * ITEMS_PER_PAGE_MOBILE
  )

  const paginatedRooms = rooms.slice(
    (desktopPage - 1) * ITEMS_PER_PAGE_DESKTOP,
    desktopPage * ITEMS_PER_PAGE_DESKTOP
  )

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

  const openEdit = (index: number) => {
    const room = rooms[index]

    setEditIndex(index)
    setEditRoomName(room.name)
    setEditDehumidifier(room.dehumidifier.enabled)
    setEditExhaust(room.exhaust.enabled)
    setShowEdit(true)
  }

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

  const handleDeleteRoom = (index: number) => {
    const confirmDelete = confirm("Delete this device setup?")
    if (!confirmDelete) return

    deleteRoom(index)
  }

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-2xl font-bold text-slate-800 dark:text-white">
          Device Control
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition"
        >
          + Add Device
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          <MobileDeviceTable
            devices={paginatedMobileDevices}
            onEdit={openEdit}
            onDelete={handleDeleteRoom}
          />

          {mobileTotalPages > 1 && (
            <div className="sm:hidden flex justify-between items-center">
              <button
                disabled={mobilePage === 1}
                onClick={() => setMobilePage((p) => p - 1)}
                className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-xs text-gray-500">
                Page {mobilePage} of {mobileTotalPages}
              </span>

              <button
                disabled={mobilePage === mobileTotalPages}
                onClick={() => setMobilePage((p) => p + 1)}
                className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {paginatedRooms.map((room, i) => {
              const realIndex =
                (desktopPage - 1) * ITEMS_PER_PAGE_DESKTOP + i

              return (
                <div
                  key={realIndex}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4 sm:space-y-5"
                >
                  <div className="flex justify-between items-center gap-3">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white truncate">
                      {room.name}
                    </h3>

                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => openEdit(realIndex)}
                        className="text-gray-400 hover:text-indigo-500 transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(realIndex)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {room.dehumidifier.enabled && (
                      <DeviceCard
                        name="Dehumidifier"
                        location={room.name}
                        isOn={room.dehumidifier.isOn}
                        connectivity={room.dehumidifier.connectivity}
                        toggle={() => toggleDevice(room.name, "dehumidifier")}
                        type="purifier"
                      />
                    )}

                    {room.exhaust.enabled && (
                      <DeviceCard
                        name="Exhaust Fan"
                        location={room.name}
                        isOn={room.exhaust.isOn}
                        connectivity={room.exhaust.connectivity}
                        toggle={() => toggleDevice(room.name, "exhaust")}
                        type="exhaust"
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {desktopTotalPages > 1 && (
            <div className="hidden sm:flex justify-between items-center">
              <button
                disabled={desktopPage === 1}
                onClick={() => setDesktopPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-xs text-gray-500">
                Page {desktopPage} of {desktopTotalPages}
              </span>

              <button
                disabled={desktopPage === desktopTotalPages}
                onClick={() => setDesktopPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          <AutomationPanel />
          <DeviceEvents />
          <ZoneCalibration />
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Add Device
            </h2>

            <input
              type="text"
              placeholder="Room name"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
            />

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newDehumidifier}
                  onChange={(e) => setNewDehumidifier(e.target.checked)}
                />
                Dehumidifier
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newExhaust}
                  onChange={(e) => setNewExhaust(e.target.checked)}
                />
                Exhaust Fan
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
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

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Edit Device
            </h2>

            <input
              type="text"
              value={editRoomName}
              onChange={(e) => setEditRoomName(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm"
            />

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editDehumidifier}
                  onChange={(e) => setEditDehumidifier(e.target.checked)}
                />
                Dehumidifier
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editExhaust}
                  onChange={(e) => setEditExhaust(e.target.checked)}
                />
                Exhaust Fan
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEdit(false)}
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