"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import {
  LayoutDashboard,
  Activity,
  Cpu,
  LineChart,
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
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={clsx(
          "fixed md:relative z-40 h-full bg-white dark:bg-gray-900 border-r transition-all duration-300",

          collapsed ? "md:w-20" : "md:w-60",

          open ? "translate-x-0 w-64" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">

          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white">
            <HeartPulse size={20}/>
          </div>

          {!collapsed && (
            <div>
              <p className="text-lg font-semibold text-indigo-600">
                MoldGuard
              </p>
              <p className="text-xs tracking-widest text-gray-400">
                MOLD DETECTION
              </p>
            </div>
          )}

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
            href="/analytics"
            icon={<LineChart size={20}/>}
            label="Analytics"
            active={pathname === "/analytics"}
          />

          <Menu
            href="/devices"
            icon={<Cpu size={20}/>}
            label="Devices"
            active={pathname === "/devices"}
          />

          <Menu
            href="/alerts"
            icon={<Bell size={20}/>}
            label="Alerts"
            active={pathname === "/alerts"}
          />

          <Menu
            href="/settings"
            icon={<Settings size={20}/>}
            label="Settings"
            active={pathname === "/settings"}
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
        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all",

        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",

        collapsed && "justify-center"
      )}
    >

      {/* Active indicator */}
      {active && !collapsed && (
        <div className="absolute right-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-l-full"/>
      )}

      <div className="flex items-center justify-center">
        {icon}
      </div>

      <span
        className={clsx(
          "text-sm font-medium whitespace-nowrap",
          collapsed && "hidden"
        )}
      >
        {label}
      </span>

    </Link>
  )
}