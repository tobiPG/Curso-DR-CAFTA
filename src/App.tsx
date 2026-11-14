import { useState } from "react"
import { Home, BookOpen, FileText } from "lucide-react"
import { Navbar } from "@/components/course/Navbar"
import { Hero } from "@/components/course/Hero"
import { ModuleGrid } from "@/components/course/ModuleGrid"
import { ResourcesSection } from "@/components/course/ResourcesSection"
import { VideoModal } from "@/components/course/VideoModal"
import { ProgressProvider } from "@/hooks/useProgress"
import { modules, bonusModule, type CourseModule } from "@/data/modules"
import { DockTabs } from "@/components/ui/dock-tabs"

// NOTA: el inicio de sesión está desactivado temporalmente.
// El código de auth (useAuth, LoginForm, ProfileSelect, Supabase) se conserva
// para volver a activarlo más adelante.

function CourseApp() {
  const [selected, setSelected] = useState<CourseModule | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  /* ── Play a module (acceso libre, sin login) ── */
  const handlePlay = (module: CourseModule) => {
    setSelected(module)
    setModalOpen(true)
  }

  const dockItems = [
    { id: "home", name: "Inicio", icon: <Home size={22} />, color: "bg-neutral-700",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { id: "modules", name: "Módulos", icon: <BookOpen size={22} />, color: "bg-blue-600",
      onClick: () => document.getElementById("modulos")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "resources", name: "Recursos", icon: <FileText size={22} />, color: "bg-amber-500",
      onClick: () => document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" }) },
  ]

  return (
    <ProgressProvider userId={null}>
      {/* ── Course (always rendered) ── */}
      <div className="min-h-screen bg-neutral-950">
        <Navbar />
        <Hero featured={bonusModule} onPlay={handlePlay} />
        <div className="relative bg-neutral-950 pt-12 pb-4" id="modulos">
          <ModuleGrid title="Módulos del curso" items={modules} onPlay={handlePlay} />
          <div id="recursos"><ResourcesSection /></div>
        </div>
        <footer className="px-6 md:px-12 py-8 text-neutral-500 text-xs border-t border-neutral-900">
          Curso DR-CAFTA · Comercio Exterior · República Dominicana
        </footer>
        <VideoModal module={selected} open={modalOpen} onOpenChange={setModalOpen} />
      </div>

      {/* ── Dock de navegación ── */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <DockTabs items={dockItems} />
        </div>
      </div>
    </ProgressProvider>
  )
}

export default CourseApp
