"use client"

import { useSidebar } from "@/hooks/useSidebar"

export default function MobileDrawer() {
  const { open } = useSidebar()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 md:hidden">

      <div className="w-64 h-full bg-white p-6">
        <p className="font-bold text-lg">MoldGuard</p>
      </div>

    </div>
  )
}