import { create } from "zustand"

type ProfileStore = {
  avatar: string | null
  name: string
  initials: string
  setProfile: (name: string, avatar: string | null) => void
}

function getInitials(name: string, email?: string) {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }
  return email?.[0]?.toUpperCase() ?? "?"
}

export const useProfileStore = create<ProfileStore>((set) => ({
  avatar: null,
  name: "",
  initials: "?",
  setProfile: (name, avatar) =>
    set({ avatar, name, initials: getInitials(name) }),
}))
