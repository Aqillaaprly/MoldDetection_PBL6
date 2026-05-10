import { supabase } from "@/lib/supabase"

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    // Jika profile belum ada, buat dulu
    if (error.code === "PGRST116") {
      await supabase.from("profiles").insert({ id: user.id, name: "" })
      return { id: user.id, name: "", avatar_url: null, email: user.email }
    }
    console.error("Error fetching profile:", error)
    return null
  }

  return { ...data, email: user.email }
}

export async function updateProfile(payload: { name?: string; avatar_url?: string }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Not authenticated" }

  const { error } = await supabase
    .from("profiles")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) {
    console.error("updateProfile error:", error)
    return { success: false, message: error.message }
  }

  return { success: true }
}

export async function updatePassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  // Hanya jalankan jika ada isian
  if (!oldPassword && !newPassword && !confirmPassword) {
    return { success: true, skipped: true }
  }

  if (!oldPassword) return { success: false, message: "Masukkan password lama" }
  if (!newPassword) return { success: false, message: "Masukkan password baru" }
  if (newPassword.length < 6) return { success: false, message: "Password minimal 6 karakter" }
  if (newPassword !== confirmPassword) return { success: false, message: "Konfirmasi password tidak cocok" }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { success: false, message: "User tidak ditemukan" }

  // Verify password lama
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  })
  if (verifyError) return { success: false, message: "Password lama salah" }

  // Update password baru
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { success: false, message: error.message }

  return { success: true }
}

export async function uploadAvatar(file: File) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Not authenticated", url: null }

  const ext = file.name.split(".").pop()
  // Tambahkan timestamp supaya tidak kena cache
  const filePath = `avatars/${user.id}.${ext}?t=${Date.now()}`
  const storagePath = `avatars/${user.id}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(storagePath, file, { upsert: true, cacheControl: "0" })

  if (uploadError) return { success: false, message: uploadError.message, url: null }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(storagePath)

  // Simpan URL ke profile
  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`
  await updateProfile({ avatar_url: avatarUrl })

  return { success: true, url: avatarUrl }
}

// ─── DEVICES ───────────────────────────────────────────

export async function getDevices() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("user_devices")
    .select("*")
    .eq("user_id", user.id)
    .order("last_used", { ascending: false })

  if (error) return []
  return data
}

export async function removeDevice(id: string) {
  const { error } = await supabase
    .from("user_devices")
    .delete()
    .eq("id", id)

  return { success: !error, message: error?.message }
}

// ─── CONNECTED ACCOUNTS ────────────────────────────────

export async function getConnectedAccounts() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Ambil dari identities Supabase Auth (OAuth providers)
  const identities = user.identities ?? []

  return identities.map((identity) => ({
    id: identity.id,
    provider: identity.provider,
    email: identity.identity_data?.email ?? user.email ?? "",
    connected: true,
  }))
}