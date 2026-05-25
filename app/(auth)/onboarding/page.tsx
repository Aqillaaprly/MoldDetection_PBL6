"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Plus,
  Trash2,
  Home,
  CookingPot,
  Bed,
  Bath,
  Tv,
  BriefcaseBusiness,
  ChevronRight,
  CheckCircle2
} from "lucide-react"
import clsx from "clsx"

const ROOM_PRESETS = [
  { name: "Living Room", icon: Tv, bg: "bg-indigo-100", color: "text-indigo-600" },
  { name: "Bedroom 1", icon: Bed, bg: "bg-purple-100", color: "text-purple-600" },
  { name: "Bedroom 2", icon: Bed, bg: "bg-purple-100", color: "text-purple-600" },
  { name: "Kitchen", icon: CookingPot, bg: "bg-orange-100", color: "text-orange-600" },
  { name: "Bathroom", icon: Bath, bg: "bg-cyan-100", color: "text-cyan-600" },
  { name: "Office", icon: BriefcaseBusiness, bg: "bg-blue-100", color: "text-blue-600" },
]

function getRoomMeta(name: string) {
  const l = name.toLowerCase()
  if (l.includes("living")) return { icon: Tv, bg: "bg-indigo-100", color: "text-indigo-600" }
  if (l.includes("bed")) return { icon: Bed, bg: "bg-purple-100", color: "text-purple-600" }
  if (l.includes("kitchen")) return { icon: CookingPot, bg: "bg-orange-100", color: "text-orange-600" }
  if (l.includes("bath")) return { icon: Bath, bg: "bg-cyan-100", color: "text-cyan-600" }
  if (l.includes("office")) return { icon: BriefcaseBusiness, bg: "bg-blue-100", color: "text-blue-600" }
  return { icon: Home, bg: "bg-gray-100", color: "text-gray-600" }
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [customName, setCustomName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const togglePreset = (name: string) => {
    setSelectedRooms((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    )
  }

  const addCustomRoom = () => {
    const trimmed = customName.trim()
    if (!trimmed) return
    if (selectedRooms.includes(trimmed)) {
      setError("Room sudah ada")
      return
    }
    setSelectedRooms((prev) => [...prev, trimmed])
    setCustomName("")
    setError("")
  }

  const removeRoom = (name: string) => {
    setSelectedRooms((prev) => prev.filter((r) => r !== name))
  }

  const handleFinish = async () => {
    if (selectedRooms.length === 0) {
      setError("Tambahkan minimal 1 room")
      return
    }

    setLoading(true)
    setError("")

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    // Insert semua rooms sekaligus
    const { error: insertError } = await supabase
      .from("rooms")
      .insert(selectedRooms.map((name) => ({ name, user_id: user.id })))

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4">
      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/90 rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.25)] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl -top-8 -right-8" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className={clsx(
                "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                step === 1 ? "bg-white/20" : "bg-white/10 text-white/60"
              )}>
                Step 1
              </span>
              <ChevronRight size={12} className="text-white/40" />
              <span className={clsx(
                "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                step === 2 ? "bg-white/20" : "bg-white/10 text-white/60"
              )}>
                Step 2
              </span>
            </div>

            <h1 className="text-2xl font-bold mt-2">
              {step === 1 ? "Setup Rooms Kamu 🏠" : "Konfirmasi Rooms"}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {step === 1
                ? "Pilih preset atau tambahkan room custom"
                : "Pastikan semua room sudah benar sebelum mulai"}
            </p>
          </div>
        </div>

        <div className="p-8">

          {step === 1 && (
            <div className="space-y-6">

              {/* Preset rooms */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Pilih dari preset:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROOM_PRESETS.map((preset) => {
                    const Icon = preset.icon
                    const selected = selectedRooms.includes(preset.name)

                    return (
                      <button
                        key={preset.name}
                        onClick={() => togglePreset(preset.name)}
                        className={clsx(
                          "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                          selected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 bg-white"
                        )}
                      >
                        <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", preset.bg)}>
                          <Icon size={16} className={preset.color} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {preset.name}
                        </span>
                        {selected && (
                          <CheckCircle2 size={16} className="text-indigo-500 ml-auto shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom room */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Atau tambah custom:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama room (contoh: Garage)"
                    value={customName}
                    onChange={(e) => {
                      setCustomName(e.target.value)
                      setError("")
                    }}
                    onKeyDown={(e) => e.key === "Enter" && addCustomRoom()}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={addCustomRoom}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-1.5 text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-2">{error}</p>
                )}
              </div>

              {/* Selected preview */}
              {selectedRooms.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Dipilih ({selectedRooms.length} rooms):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRooms.map((name) => {
                      const meta = getRoomMeta(name)
                      const Icon = meta.icon
                      return (
                        <span
                          key={name}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-sm text-indigo-700"
                        >
                          <Icon size={12} />
                          {name}
                          <button
                            onClick={() => removeRoom(name)}
                            className="ml-1 text-indigo-400 hover:text-red-500 transition"
                          >
                            ×
                          </button>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (selectedRooms.length === 0) {
                    setError("Pilih minimal 1 room dulu")
                    return
                  }
                  setError("")
                  setStep(2)
                }}
                disabled={selectedRooms.length === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:scale-[1.01] hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Lanjut →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                {selectedRooms.map((name, i) => {
                  const meta = getRoomMeta(name)
                  const Icon = meta.icon
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", meta.bg)}>
                        <Icon size={18} className={meta.color} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{name}</p>
                        <p className="text-xs text-gray-400">Room #{i + 1}</p>
                      </div>
                      <button
                        onClick={() => removeRoom(name)}
                        className="text-gray-300 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>

              {error && (
                <div className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium text-sm"
                >
                  ← Kembali
                </button>

                <button
                  onClick={handleFinish}
                  disabled={loading || selectedRooms.length === 0}
                  className="flex-2 flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:scale-[1.01] hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? "Menyimpan..." : "Mulai Monitoring 🚀"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}