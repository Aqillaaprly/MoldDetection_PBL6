"use client"

import { Menu, Moon, Sun, Bell } from "lucide-react"
import { useSidebar } from "@/hooks/useSidebar"
import { useEffect, useState, useRef } from "react"
import NotificationPanel from "./NotificationPanel"

export default function Navbar() {

  const { toggleSidebar, toggleMobile } = useSidebar()

  const [dark, setDark] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)

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

  /* CLICK OUTSIDE NOTIFICATION */
  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setOpenNotif(false)
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

            {/* notification badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"/>
          </button>

          {/* Notification Dropdown */}
          {openNotif && <NotificationPanel />}

        </div>

        {/* THEME TOGGLE */}
        <button onClick={toggleDark}>
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>

        {/* AVATAR */}
        <img
          src="https://i.pravatar.cc/40"
          className="w-8 h-8 rounded-full"
        />

      </div>

    </header>
  )
}