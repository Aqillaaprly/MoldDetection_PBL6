"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import { LayoutDashboard, Activity, Cpu, Settings, Info } from "lucide-react"
import { BarChart3 } from "lucide-react"

const navItems = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Dashboard" },
  { href: "/monitoring", icon: Activity,         label: "Monitor"   },
  { href: "/devices",    icon: Cpu,              label: "Devices"   },
  { href: "/settings",   icon: Settings,         label: "Settings"  },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    // md ke atas hidden, mobile flex
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0"
            >
              <div className={clsx(
                "flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-200",
                active
                  ? "bg-indigo-50 dark:bg-indigo-500/20"
                  : "bg-transparent"
              )}>
                <Icon
                  size={20}
                  className={clsx(
                    "transition-colors duration-200",
                    active
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                />
              </div>
              <span className={clsx(
                "text-[10px] font-medium tracking-wide truncate transition-colors duration-200",
                active
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 dark:text-gray-500"
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}