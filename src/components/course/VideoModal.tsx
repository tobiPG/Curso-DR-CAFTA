import { useEffect, useRef } from "react"
import { FileDown, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useProgress } from "@/hooks/useProgress"
import type { CourseModule } from "@/data/modules"

interface VideoModalProps {
  module: CourseModule | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VideoModal({ module, open, onOpenChange }: VideoModalProps) {
  const { getProgress, reportWatched } = useProgress()
  const lastReported = useRef(0)

  useEffect(() => {
    lastReported.current = module ? getProgress(module.id).pct : 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.id])

  if (!module) return null

  const { pct, completed } = getProgress(module.id)

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    if (!video.duration) return
    const currentPct = (video.currentTime / video.duration) * 100
    // Evita escribir en cada frame: solo reporta cada ~1% de avance nuevo.
    if (currentPct - lastReported.current >= 1) {
      lastReported.current = currentPct
      reportWatched(module.id, currentPct)
    }
  }

  const handleEnded = () => {
    reportWatched(module.id, 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-4xl w-full bg-neutral-950 p-0 overflow-hidden rounded-lg ring-neutral-800">
        <div className="aspect-video bg-black">
          <video
            key={module.video}
            src={module.video}
            controls
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full"
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>

        {pct > 0 && (
          <div className="h-1 w-full bg-neutral-800">
            <div
              className={completed ? "h-full bg-emerald-500" : "h-full bg-red-600"}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-1">
            <DialogTitle className="text-white text-2xl font-bold">
              Módulo {module.numero} · {module.titulo}
            </DialogTitle>
            {completed ? (
              <span className="flex items-center gap-1.5 shrink-0 bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                Ya lo viste
              </span>
            ) : pct > 0 ? (
              <span className="shrink-0 text-neutral-400 text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-800">
                {pct}% visto
              </span>
            ) : null}
          </div>
          <DialogDescription className="text-neutral-400 text-sm mb-4">
            {module.subtitulo}
          </DialogDescription>
          <p className="text-neutral-300 leading-relaxed mb-5">
            {module.descripcion}
          </p>

          {module.ppt && (
            <a
              href={module.ppt}
              download
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-md font-semibold text-sm transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Descargar presentación (PPT)
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
