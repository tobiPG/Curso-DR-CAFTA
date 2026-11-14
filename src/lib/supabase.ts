import { createClient } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  display_name: string
  avatar_url: string | null
}

export interface ModuleProgressRow {
  user_id: string
  module_id: number
  pct: number
  completed: boolean
  updated_at: string
}

// Valores de respaldo para que la app no se rompa si faltan las variables
// de entorno (el login está desactivado por ahora).
const url = (import.meta.env.VITE_SUPABASE_URL as string) || "https://placeholder.supabase.co"
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "placeholder-anon-key"

export const supabase = createClient(url, key)
