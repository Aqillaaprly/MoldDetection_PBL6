"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Info,
  Bell,
  Settings,
  HeartPulse
} from "lucide-react"
import { useSidebar } from "@/hooks/useSidebar"

export default function Sidebar() {

  const pathname = usePathname()
  const { collapsed, open, closeMobile } = useSidebar()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden transition-opacity duration-300 z-40"
          onClick={closeMobile}
        />
      )}

      <aside
        className={clsx(
          "fixed md:relative z-40 h-full bg-white dark:bg-gray-900 shadow-lg flex flex-col",
          "transition-[width,transform] duration-300 ease-in-out",

          collapsed ? "md:w-20" : "md:w-60",

          open ? "translate-x-0 w-64" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >

        {/* Logo */}
        <div
          className={clsx(
            "flex items-center gap-3 px-6 py-6 transition-all",
            collapsed && "md:justify-center md:px-0"
          )}
        >

          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white shrink-0">
            <HeartPulse size={20}/>
          </div>

          <div
            className={clsx(
              "transition-all duration-200 overflow-hidden",
              collapsed ? "md:opacity-0 md:w-0" : "opacity-100 w-auto"
            )}
          >
            <p className="text-lg font-semibold text-indigo-600">
              MoldGuard
            </p>
            <p className="text-xs tracking-widest text-gray-400">
              MOLD DETECTION
            </p>
          </div>

        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 px-3">

          <Menu
            href="/"
            icon={<LayoutDashboard size={20}/>}
            label="Dashboard"
            active={pathname === "/"}
          />

          <Menu
            href="/monitoring"
            icon={<Activity size={20}/>}
            label="Monitoring"
            active={pathname === "/monitoring"}
          />

          <Menu
            href="/devices"
            icon={<Cpu size={20}/>}
            label="Devices"
            active={pathname === "/devices"}
          />

          <Menu
            href="/settings"
            icon={<Settings size={20}/>}
            label="Settings"
            active={pathname === "/settings"}
          />

          <Menu
            href="/about"
            icon={<Info size={20}/>}
            label="About"
            active={pathname === "/about"}
          />

        </nav>

      </aside>
    </>
  )
}

function Menu({
  href,
  icon,
  label,
  active = false
}:{
  href:string
  icon:React.ReactNode
  label:string
  active?:boolean
}){

  const { collapsed, closeMobile } = useSidebar()

  return(
    <Link
      href={href}
      onClick={closeMobile}
      className={clsx(
        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out",
        collapsed && "md:justify-center md:px-0",

        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >

      {active && !collapsed && (
        <div className="absolute right-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-l-full"/>
      )}

      <div className="flex items-center justify-center w-5 h-5">
        {icon}
      </div>

      <span
        className={clsx(
          "text-sm font-medium whitespace-nowrap transition-all duration-200 overflow-hidden",
          collapsed ? "md:opacity-0 md:w-0" : "opacity-100 w-auto"
        )}
      >
        {label}
      </span>

    </Link>
  )
}