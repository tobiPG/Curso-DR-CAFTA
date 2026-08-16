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

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)
