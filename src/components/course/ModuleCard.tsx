import { Play, FileDown, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgress } from "@/hooks/useProgress"
import type { CourseModule } from "@/data/modules"

interface ModuleCardProps {
  module: CourseModule
  onPlay: (module: CourseModule) => void
}

export function ModuleCard({ module, onPlay }: ModuleCardProps) {
  const Icon = module.icono
  const [, to] = module.gradiente
  const { getProgress } = useProgress()
  const { pct, completed } = getProgress(module.id)

  return (
    <div
      className="group cursor-pointer rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 transition-transform duration-200 hover:-translate-y-1 hover:border-neutral-700"
      onClick={() => onPlay(module)}
    >
      <div className="relative aspect-video">
        <img
          src={module.imagen}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 55%, ${to}dd 100%)`,
          }}
        />

        <div className="relative h-full flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-xs font-semibold tracking-widest uppercase drop-shadow">
              Módulo {module.numero}
            </span>
            <Icon className="w-5 h-5 text-white/90 drop-shadow" />
          </div>
          <h3 className="text-white font-bold text-base leading-tight drop-shadow">
            {module.titulo}
          </h3>
        </div>

        {completed && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-emerald-400 text-[10px] font-semibold px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Visto
          </div>
        )}

        {pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className={cn("h-full", completed ? "bg-emerald-500" : "bg-red-600")}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-neutral-500 text-xs">{module.subtitulo}</p>
          {pct > 0 && !completed && (
            <span className="text-[10px] font-semibold text-neutral-500">
              {pct}% visto
            </span>
          )}
        </div>
        <p className="text-neutral-400 text-sm leading-snug line-clamp-2 mb-3">
          {module.descripcion}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlay(module)
            }}
            className="flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            {pct > 0 && !completed ? "Continuar" : "Ver video"}
          </button>
          {module.ppt && (
            <a
              href={module.ppt}
              download
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              PPT
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
