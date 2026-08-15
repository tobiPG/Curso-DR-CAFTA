import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface ModuleProgress {
  pct: number
  completed: boolean
}

type ProgressMap = Record<number, ModuleProgress>

const STORAGE_KEY = "dr-cafta-progress"
const COMPLETE_THRESHOLD = 95

function loadProgress(): ProgressMap {
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

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const reportWatched = (id: number, pct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)))
    setProgress((prev) => {
      const current = prev[id]?.pct ?? 0
      if (clamped <= current) return prev
      return {
        ...prev,
        [id]: {
          pct: clamped,
          completed: clamped >= COMPLETE_THRESHOLD,
        },
      }
    })
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
