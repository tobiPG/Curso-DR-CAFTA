import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase, type UserProfile } from "@/lib/supabase"

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  isNewUser: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string, name: string) => Promise<string | null>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Pick<UserProfile, "display_name" | "avatar_url">>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  /* ── Load profile from Supabase ── */
  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("user_profiles")
      .select("id, display_name, avatar_url")
      .eq("id", userId)
      .single()
    if (data) setProfile(data as UserProfile)
  }

  /* ── Session listener ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) loadProfile(session.user.id)
        else setProfile(null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  /* ── Sign in ── */
  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return error.message
    setIsNewUser(false)
    return null
  }

  /* ── Sign up ── */
  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) return error.message

    // Insert profile manually in case the DB trigger is not yet set up
    if (data.user) {
      await supabase.from("user_profiles").upsert({
        id: data.user.id,
        display_name: name,
        avatar_url: null,
      })
    }
    setIsNewUser(true)
    return null
  }

  /* ── Sign out ── */
  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setIsNewUser(false)
  }

  /* ── Update profile ── */
  const updateProfile = async (
    data: Partial<Pick<UserProfile, "display_name" | "avatar_url">>
  ) => {
    if (!user) return
    const updates = { ...data, updated_at: new Date().toISOString() }
    await supabase.from("user_profiles").update(updates).eq("id", user.id)
    setProfile((prev) => (prev ? { ...prev, ...data } : prev))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isNewUser,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
