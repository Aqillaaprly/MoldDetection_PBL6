import { create } from "zustand"

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: "alert" | "warning" | "automation" | "info"
  createdAt: Date
  read: boolean
}

interface NotificationState {
  notifications: NotificationItem[]

  addNotification: (
    notification: Omit<NotificationItem, "id" | "createdAt" | "read">
  ) => void

  markAsRead: (id: string) => void

  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({

  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          read: false,
          ...notification
        },
        ...state.notifications
      ]
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id
          ? { ...notif, read: true }
          : notif
      )
    })),

  clearNotifications: () =>
    set({
      notifications: []
    })

}))