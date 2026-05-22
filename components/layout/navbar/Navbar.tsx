"use client"

import { Menu, Moon, Sun, Bell, LogOut, Info } from "lucide-react"
import { useSidebar } from "@/hooks/useSidebar"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import NotificationPanel from "./NotificationPanel"
import { getProfile } from "@/services/profileService"
import { logout } from "@/lib/auth"
import { useProfileStore } from "@/store/useProfileStore"

export default function Navbar() {
  const { toggleSidebar } = useSidebar()
  const router = useRouter()

  const { avatar, name, initials, setProfile } = useProfileStore()

  const [dark, setDark] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Load profile saat navbar mount
  useEffect(() => {
    getProfile().then((profile) => {
      if (profile) {
        setProfile(profile.name ?? "", profile.avatar_url ?? null)
      }
    })
  }, [setProfile])

  const handleMenu = () => {
    toggleSidebar()
  }

  /* THEME INIT */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const shouldUseDark =
      savedTheme === "dark" || (!savedTheme && systemDark)

    if (shouldUseDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    setTimeout(() => {
      setDark(shouldUseDark)
    }, 0)
  }, [])

  /* CLICK OUTSIDE */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setOpenNotif(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setOpenProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setDark(!dark)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
    router.refresh()
  }

  const handleAbout = () => {
    setOpenProfile(false)
    router.push("/about") // sesuaikan dengan route about kamu
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 shadow-md relative z-10">

      {/* MENU BUTTON */}
      <button onClick={handleMenu} className="hidden md:flex items-center justify-center">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4 ml-auto">

        {/* NOTIFICATION */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setOpenNotif(!openNotif)} className="relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {openNotif && <NotificationPanel />}
        </div>

        {/* THEME TOGGLE */}
        <button onClick={toggleDark}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setOpenProfile(!openProfile)}>
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold select-none">
                {initials}
              </div>
            )}
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">

              {/* Info user */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  {name || "User"}
                </p>
              </div>

              <button
                onClick={handleAbout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-200"
              >
                <Info size={16} />
                About
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  )
}