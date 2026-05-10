"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Info,
  Settings,
  HeartPulse
} from "lucide-react"
import { useSidebar } from "@/hooks/useSidebar"

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed } = useSidebar()

  return (
    // hidden di mobile, flex di md ke atas
    <aside
      className={clsx(
        "hidden md:flex flex-col h-full bg-white dark:bg-gray-900 shadow-lg shrink-0",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-20" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={clsx(
        "flex items-center gap-3 px-6 py-6",
        collapsed && "justify-center px-0"
      )}>
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white shrink-0">
          <HeartPulse size={20} />
        </div>
        <div className={clsx(
          "transition-all duration-200 overflow-hidden",
          collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
        )}>
          <p className="text-lg font-semibold text-indigo-600">MoldGuard</p>
          <p className="text-xs tracking-widest text-gray-400">MOLD DETECTION</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 px-3">
        <Menu href="/"           icon={<LayoutDashboard size={20}/>} label="Dashboard" active={pathname === "/"} />
        <Menu href="/monitoring" icon={<Activity size={20}/>}        label="Monitoring" active={pathname === "/monitoring"} />
        <Menu href="/devices"    icon={<Cpu size={20}/>}             label="Devices"    active={pathname === "/devices"} />
        <Menu href="/settings"   icon={<Settings size={20}/>}        label="Settings"   active={pathname === "/settings"} />
        <Menu href="/about"      icon={<Info size={20}/>}            label="About"      active={pathname === "/about"} />
      </nav>
    </aside>
  )
}

function Menu({ href, icon, label, active = false }: {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  const { collapsed } = useSidebar()

  return (
    <Link
      href={href}
      className={clsx(
        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        collapsed && "justify-center px-0",
        active
          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"
          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      {active && !collapsed && (
        <div className="absolute right-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-l-full" />
      )}
      <div className="flex items-center justify-center w-5 h-5">{icon}</div>
      <span className={clsx(
        "text-sm font-medium whitespace-nowrap transition-all duration-200 overflow-hidden",
        collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
      )}>
        {label}
      </span>
    </Link>
  )
}