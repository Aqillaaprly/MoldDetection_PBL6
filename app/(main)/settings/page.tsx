"use client"

import { useState, useEffect } from "react"
import PersonalInfo from "@/components/settings/PersonalInfo"
import ChangePassword from "@/components/settings/ChangePassword"
import ConnectedAccounts from "@/components/settings/ConnectedAccounts"
import DeviceList from "@/components/settings/DeviceList"
import type { Device } from "@/components/settings/DeviceList"
import type { ConnectedAccount } from "@/components/settings/ConnectedAccounts"


import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  getDevices,
  getConnectedAccounts,
  removeDevice,
} from "@/services/profileService"
import { useProfileStore } from "@/store/useProfileStore"

export default function SettingsPage() {
  const { setProfile } = useProfileStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    // Load profile
    getProfile().then((profile) => {
      if (profile) {
        setName(profile.name ?? "")
        setEmail(profile.email ?? "")
        const av = profile.avatar_url ?? null
        setAvatar(av)
        setProfile(profile.name ?? "", av)
      }
    })

    // Load devices
    getDevices().then(setDevices)

    // Load connected accounts
    getConnectedAccounts().then(setConnectedAccounts)
  }, [])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatar(URL.createObjectURL(file))

    const res = await uploadAvatar(file)
    if (res.success && res.url) {
      setAvatar(res.url)
      setProfile(name, res.url)
      setMessage({ type: "success", text: "Avatar berhasil diupload!" })
    } else {
      setMessage({ type: "error", text: res.message ?? "Gagal upload avatar" })
      setAvatar(null)
    }
  }

  const handleRemoveDevice = async (id: string) => {
    const res = await removeDevice(id)
    if (res.success) {
      setDevices((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const profileRes = await updateProfile({ name })
    if (!profileRes.success) {
      setMessage({ type: "error", text: profileRes.message ?? "Gagal menyimpan profil" })
      setSaving(false)
      return
    }

    setProfile(name, avatar)

    const passwordFilled = oldPassword || newPassword || confirmPassword
    if (passwordFilled) {
      const passRes = await updatePassword(oldPassword, newPassword, confirmPassword)
      if (!passRes.success) {
        setMessage({ type: "error", text: passRes.message ?? "Gagal update password" })
        setSaving(false)
        return
      }
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }

    setMessage({ type: "success", text: "Settings berhasil disimpan!" })
    setSaving(false)
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "?"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-600"
        }`}>
          {message.text}
        </div>
      )}

      <PersonalInfo
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        avatar={avatar}
        initials={initials}
        handleAvatarChange={handleAvatarChange}
      />

      <ChangePassword
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <ConnectedAccounts connectedAccounts={connectedAccounts} />
        <DeviceList devices={devices} onRemove={handleRemoveDevice} />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}