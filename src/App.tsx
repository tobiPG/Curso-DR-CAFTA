import { useState } from "react"
import { Navbar } from "@/components/course/Navbar"
import { Hero } from "@/components/course/Hero"
import { ModuleGrid } from "@/components/course/ModuleGrid"
import { ResourcesSection } from "@/components/course/ResourcesSection"
import { VideoModal } from "@/components/course/VideoModal"
import { ProgressProvider } from "@/hooks/useProgress"
import { modules, bonusModule, type CourseModule } from "@/data/modules"

function App() {
  const [selected, setSelected] = useState<CourseModule | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handlePlay = (module: CourseModule) => {
    setSelected(module)
    setModalOpen(true)
  }

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-neutral-950">
        <Navbar />

        <Hero featured={bonusModule} onPlay={handlePlay} />

        <div className="relative bg-neutral-950 pt-12 pb-4" id="modulos">
          <ModuleGrid
            title="Módulos del curso"
            items={modules}
            onPlay={handlePlay}
          />
          <ResourcesSection />
        </div>

        <footer className="px-6 md:px-12 py-8 text-neutral-500 text-xs border-t border-neutral-900">
          Curso DR-CAFTA · Comercio Exterior · República Dominicana
        </footer>

        <VideoModal
          module={selected}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </ProgressProvider>
  )
}

export default App
