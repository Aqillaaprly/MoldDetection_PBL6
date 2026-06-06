import { useEffect, useRef } from "react"
import { SensorHub } from "@/types/sensor"
import { useNotificationStore } from "@/store/useNotificationStore"
import { getRiskLevel } from "@/components/dashboard/roomHelpers"

export function useRiskNotifier(hubs: SensorHub[]) {
  const addNotification = useNotificationStore((s) => s.addNotification)
  
  // Simpan room yang sudah dinotif supaya tidak spam
  const notifiedRooms = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!hubs || hubs.length === 0) return

    hubs.forEach((hub) => {
      const risk = getRiskLevel(hub)
      const key = `${hub.location}-${risk}`

      if (risk === "HIGH RISK" && !notifiedRooms.current.has(key)) {
        addNotification({
          title: `High Mold Risk: ${hub.location}`,
          message: `Humidity ${hub.humidity}% and temperature ${hub.temperature}°C detected. Check this room immediately.`,
          type: "alert",
        })
        notifiedRooms.current.add(key)
      }

      if (risk === "MEDIUM RISK" && !notifiedRooms.current.has(key)) {
        addNotification({
          title: `Warning: ${hub.location}`,
          message: `Room conditions are approaching mold risk levels. Monitor closely.`,
          type: "warning",
        })
        notifiedRooms.current.add(key)
      }

      // Reset notif kalau sudah balik NORMAL
      if (risk === "NORMAL" || risk === "OFFLINE") {
        // Hapus dari set supaya bisa notif lagi kalau naik HIGH nanti
        notifiedRooms.current.forEach((k) => {
          if (k.startsWith(hub.location)) {
            notifiedRooms.current.delete(k)
          }
        })
      }
    })
  }, [hubs, addNotification])
}