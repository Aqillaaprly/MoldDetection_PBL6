"use client"

import { Menu, Moon, Sun } from "lucide-react"
import { useSidebar } from "@/hooks/useSidebar"
import { useState } from "react"

export default function Navbar() {

  const { toggleSidebar, toggleMobile } = useSidebar()
  const [dark, setDark] = useState(false)

  const handleMenu = () => {
    if (window.innerWidth < 768) toggleMobile()
    else toggleSidebar()
  }

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark")
    setDark(!dark)
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b">

      <button onClick={handleMenu}>
        <Menu size={20}/>
      </button>

      <div className="flex items-center gap-4">

        <button onClick={toggleDark}>
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>

        <img src="https://i.pravatar.cc/40" className="w-8 h-8 rounded-full"/>

      </div>

    </header>
  )
}