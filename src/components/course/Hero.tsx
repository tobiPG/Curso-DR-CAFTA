import { Play, Info, CheckCircle2 } from "lucide-react"
import { useProgress } from "@/hooks/useProgress"
import type { CourseModule } from "@/data/modules"

interface HeroProps {
  featured: CourseModule
  onPlay: (module: CourseModule) => void
}

export function Hero({ featured, onPlay }: HeroProps) {
  const to = featured.gradiente[1]
  const { getProgress } = useProgress()
  const { pct, completed } = getProgress(featured.id)

  return (
    <div className="relative h-[85vh] min-h-[520px] overflow-hidden">
      <img
        src={featured.imagen}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(0,0,0,0.55) 0%, ${to}55 65%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10 h-full flex items-center">
        <div className="px-6 md:px-12 max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-amber-400 text-sm font-bold tracking-[0.2em] uppercase">
              Curso modular · 11 módulos
            </span>
            {completed && (
              <span className="flex items-center gap-1 bg-black/50 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Visto
              </span>
            )}
          </div>

          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.05]">
            DR-CAFTA
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-6">
            Cómo leer, estudiar y aplicar el tratado
          </p>

          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
            {featured.descripcion}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onPlay(featured)}
              className="bg-white hover:bg-neutral-200 text-black px-6 md:px-8 py-3 rounded-md font-bold text-base md:text-lg flex items-center gap-3 transition-transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-black" />
              {pct > 0 && !completed ? "Continuar viendo" : "Ver resumen del curso"}
            </button>
            <a
              href="#modulos"
              className="bg-neutral-700/70 hover:bg-neutral-700 text-white px-6 md:px-8 py-3 rounded-md font-bold text-base md:text-lg flex items-center gap-3 transition-transform hover:scale-105 backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              Ver módulos
            </a>
          </div>

          {pct > 0 && !completed && (
            <div className="mt-4 h-1 w-full max-w-xs bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-red-600" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}
