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
  addNotification: (notification: Omit<NotificationItem, "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

// Helper untuk generate ID tanpa crypto.randomUUID (tidak support HTTP)
function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: generateId(),
          createdAt: new Date(),
          read: false,
          ...notification,
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    })),

  clearNotifications: () =>
    set((state) => ({
      notifications: state.notifications.map((notif) => ({
        ...notif,
        read: true,
      })),
    })),
}))