import { FileText, FileDown } from "lucide-react"
import { DOC_URL } from "@/data/modules"

export function ResourcesSection() {
  return (
    <div className="px-6 md:px-12 mb-16">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
        Recursos y documentación
      </h2>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center gap-5 max-w-3xl">
        <div className="w-14 h-14 rounded-md bg-blue-900/40 flex items-center justify-center shrink-0">
          <FileText className="w-7 h-7 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">
            Documentación completa del curso
          </h3>
          <p className="text-neutral-400 text-sm">
            Los 11 módulos desarrollados a fondo en un solo documento: objetivos,
            conceptos clave, casos prácticos y entregables de cada uno.
          </p>
        </div>
        <a
          href={DOC_URL}
          download
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-4 py-2.5 rounded-md font-semibold text-sm transition-colors shrink-0"
        >
          <FileDown className="w-4 h-4" />
          Descargar Word
        </a>
      </div>
    </div>
  )
}
