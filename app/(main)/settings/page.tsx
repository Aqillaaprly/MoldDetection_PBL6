"use client"

import { useState } from "react"
import PersonalInfo from "@/components/settings/PersonalInfo"
import ChangePassword from "@/components/settings/ChangePassword"
import Preferences from "@/components/settings/Preferences"
import ConnectedAccounts from "@/components/settings/ConnectedAccounts"
import DeviceList from "@/components/settings/DeviceList"

export default function SettingsPage() {

  const [name, setName] = useState("Admin")
  const [email, setEmail] = useState("admin@gmail.com")
  const [avatar, setAvatar] = useState("/profile.jpg")

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [theme, setTheme] = useState("Light")
  const [language, setLanguage] = useState("English")
  const [temperatureUnit, setTemperatureUnit] = useState("C")

  const [connectedAccounts] = useState([
    { name: "Google", email: "admin@gmail.com", connected: true }
  ])

  const [devices] = useState([
    { name: "iPhone 14 Pro", lastUsed: "2 days ago" },
    { name: "Samsung Galaxy S26", lastUsed: "1 week ago" }
  ])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(URL.createObjectURL(file))
  }

  const handleSave = () => {
    alert("Settings saved!")
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <PersonalInfo
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        avatar={avatar}
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

      <Preferences
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        temperatureUnit={temperatureUnit}
        setTemperatureUnit={setTemperatureUnit}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <ConnectedAccounts connectedAccounts={connectedAccounts} />
        <DeviceList devices={devices} />
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500"
        >
          Save Changes
        </button>
      </div>

    </div>
  )
}