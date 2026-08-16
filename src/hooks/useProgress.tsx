import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { supabase } from "@/lib/supabase"

interface ModuleProgress {
  pct: number
  completed: boolean
}

type ProgressMap = Record<number, ModuleProgress>

const STORAGE_KEY = "dr-cafta-progress"
const COMPLETE_THRESHOLD = 95

function loadLocal(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

interface ProgressContextValue {
  progress: ProgressMap
  getProgress: (id: number) => ModuleProgress
  reportWatched: (id: number, pct: number) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

interface ProgressProviderProps {
  children: ReactNode
  userId: string | null
}

export function ProgressProvider({ children, userId }: ProgressProviderProps) {
  const [progress, setProgress] = useState<ProgressMap>(() => loadLocal())
  const progressRef = useRef(progress)
  progressRef.current = progress

  /* ── Load from Supabase when user logs in ── */
  useEffect(() => {
    if (!userId) return

    supabase
      .from("module_progress")
      .select("module_id, pct, completed")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const map: ProgressMap = {}
        data.forEach((row) => {
          map[row.module_id] = { pct: row.pct, completed: row.completed }
        })
        // Merge with local: take the higher pct for each module
        const local = loadLocal()
        const merged: ProgressMap = { ...local }
        Object.entries(map).forEach(([id, remote]) => {
          const key = Number(id)
          if (!merged[key] || remote.pct > merged[key].pct) {
            merged[key] = remote
          }
        })
        setProgress(merged)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      })
  }, [userId])

  /* ── Report watched ── */
  const reportWatched = (id: number, pct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)))
    const current = progressRef.current[id]?.pct ?? 0
    if (clamped <= current) return

    const entry: ModuleProgress = {
      pct: clamped,
      completed: clamped >= COMPLETE_THRESHOLD,
    }

    setProgress((prev) => {
      const next = { ...prev, [id]: entry }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })

    // Persist to Supabase (fire-and-forget)
    if (userId) {
      supabase
        .from("module_progress")
        .upsert(
          {
            user_id: userId,
            module_id: id,
            pct: clamped,
            completed: entry.completed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,module_id" }
        )
        .then(() => {})
    }
  }

  const getProgress = (id: number): ModuleProgress =>
    progress[id] ?? { pct: 0, completed: false }

  return (
    <ProgressContext.Provider value={{ progress, getProgress, reportWatched }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress debe usarse dentro de ProgressProvider")
  return ctx
}
