"use client"

import { Menu, Moon, Sun, Bell, Settings, LogOut } from "lucide-react"
import { useSidebar } from "@/hooks/useSidebar"
import { useEffect, useState, useRef } from "react"
import NotificationPanel from "./NotificationPanel"

export default function Navbar() {

  const { toggleSidebar, toggleMobile } = useSidebar()

  const [dark, setDark] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleMenu = () => {
    if (window.innerWidth < 768) toggleMobile()
    else toggleSidebar()
  }

  /* THEME INIT */
  useEffect(() => {

    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
    else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark")
      setDark(false)
    }
    else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemDark) {
        document.documentElement.classList.add("dark")
        setDark(true)
      }
    }

  }, [])

  /* CLICK OUTSIDE */
  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setOpenNotif(false)
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false)
      }

    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [])

  const toggleDark = () => {

    if (dark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }

    setDark(!dark)
  }

  const handleLogout = async () => {

    await fetch("/api/logout", {
      method: "POST"
    })

    window.location.href = "/login"
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 shadow-md relative z-10">

      {/* MENU BUTTON */}
      <button onClick={handleMenu}>
        <Menu size={20}/>
      </button>

      <div className="flex items-center gap-4">

        {/* NOTIFICATION */}
        <div className="relative" ref={notifRef}>

          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="relative"
          >
            <Bell size={18} />

            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"/>
          </button>

          {openNotif && <NotificationPanel />}

        </div>

        {/* THEME TOGGLE */}
        <button onClick={toggleDark}>
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>

          <button onClick={() => setOpenProfile(!openProfile)}>
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full"
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">

              <button className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                <Settings size={16}/>
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <LogOut size={16}/>
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  )
}