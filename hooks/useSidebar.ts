import { create } from "zustand"

interface SidebarState {
  collapsed: boolean
  open: boolean
  toggleSidebar: () => void
  toggleMobile: () => void
  closeMobile: () => void
}

export const useSidebar = create<SidebarState>((set) => ({
  collapsed: false,
  open: false,

  toggleSidebar: () =>
    set((state) => ({ collapsed: !state.collapsed })),

  toggleMobile: () =>
    set((state) => ({ open: !state.open })),

  closeMobile: () => set({ open: false })
}))