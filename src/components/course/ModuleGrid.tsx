import type { CourseModule } from "@/data/modules"
import { ModuleCard } from "./ModuleCard"

interface ModuleGridProps {
  title: string
  items: CourseModule[]
  onPlay: (module: CourseModule) => void
}

export function ModuleGrid({ title, items, onPlay }: ModuleGridProps) {
  return (
    <div className="mb-10 px-6 md:px-12">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((module) => (
          <ModuleCard key={module.id} module={module} onPlay={onPlay} />
        ))}
      </div>
    </div>
  )
}
