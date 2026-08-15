import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  User,
  CreditCard,
  Folder,
  FileText,
  Settings,
  HelpCircle,
  Check,
  ChevronDown,
  Users,
  Bell,
  Globe,
  Zap,
  Download,
  RefreshCw,
  Mail,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react"
import type { Profile } from "@/components/ui/profile-edit-modal"
import { modules, DOC_URL } from "@/data/modules"
import { useProgress } from "@/hooks/useProgress"
import { cn } from "@/lib/utils"

export type SettingsSection =
  | "profile"
  | "upgrade"
  | "projects"
  | "documentation"
  | "settings"
  | "help"

const sectionMeta: Record<
  SettingsSection,
  { title: string; icon: React.ComponentType<{ className?: string }> }
> = {
  profile: { title: "Mi perfil", icon: User },
  upgrade: { title: "Mejorar plan", icon: CreditCard },
  projects: { title: "Proyectos", icon: Folder },
  documentation: { title: "Documentación", icon: FileText },
  settings: { title: "Configuración", icon: Settings },
  help: { title: "Obtener ayuda", icon: HelpCircle },
}

const presetPhotos = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
]

/* ─── Profile section ─── */
function ProfileSection({
  currentProfile,
  onProfileSave,
  onSwitchProfile,
  onClose,
}: {
  currentProfile: Profile | null
  onProfileSave: (p: Profile) => void
  onSwitchProfile: () => void
  onClose: () => void
}) {
  const [name, setName] = useState(currentProfile?.name ?? "")
  const [image, setImage] = useState(
    currentProfile?.image ?? presetPhotos[0]
  )
  const [customUrl, setCustomUrl] = useState("")
  const [saved, setSaved] = useState(false)

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-neutral-500 gap-3">
        <User size={36} />
        <p className="text-sm">No hay perfil activo.</p>
        <button
          onClick={() => { onSwitchProfile(); onClose() }}
          className="text-blue-400 text-sm hover:text-blue-300 underline"
        >
          Seleccionar perfil
        </button>
      </div>
    )
  }

  const handleSave = () => {
    onProfileSave({ ...currentProfile, name: name.trim() || currentProfile.name, image })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-neutral-700 bg-neutral-800 shrink-0">
          <img
            src={image}
            alt="avatar"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = presetPhotos[0] }}
          />
        </div>
        <div className="flex-1">
          <p className="text-neutral-400 text-xs uppercase tracking-wider mb-1.5">Nombre</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition"
            placeholder="Nombre del perfil"
            maxLength={20}
          />
        </div>
      </div>

      {/* Photo presets */}
      <div>
        <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Foto de perfil</p>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {presetPhotos.map((url) => (
            <button
              key={url}
              onClick={() => { setImage(url); setCustomUrl("") }}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-200",
                image === url
                  ? "ring-blue-500 scale-105"
                  : "ring-transparent hover:ring-white/30"
              )}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              {image === url && (
                <div className="absolute inset-0 bg-blue-500/40 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <input
          type="url"
          value={customUrl}
          onChange={(e) => {
            setCustomUrl(e.target.value)
            if (e.target.value.trim()) setImage(e.target.value.trim())
          }}
          className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 transition placeholder:text-neutral-500"
          placeholder="O pega una URL de imagen personalizada…"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={cn(
          "w-full py-2.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2",
          saved
            ? "bg-emerald-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        )}
      >
        {saved ? <><Check size={16} /> Guardado</> : "Guardar cambios"}
      </button>

      <div className="border-t border-neutral-800 pt-4">
        <button
          onClick={() => { onSwitchProfile(); onClose() }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition text-sm"
        >
          <Users size={16} />
          Cambiar perfil
        </button>
      </div>
    </div>
  )
}

/* ─── Upgrade section ─── */
const plans = [
  {
    id: "basic",
    name: "Básico",
    price: "Gratis",
    color: "border-neutral-700",
    badge: null,
    features: [
      "Acceso a 3 módulos",
      "Progreso guardado",
      "Material PDF básico",
    ],
    disabled: ["Todos los módulos", "Certificado", "Soporte prioritario"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/mes",
    color: "border-blue-500",
    badge: "Recomendado",
    features: [
      "Todos los módulos",
      "Progreso completo",
      "Material PPT descargable",
      "Certificado de finalización",
      "Soporte prioritario",
    ],
    disabled: ["Sesiones en vivo"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$79/mes",
    color: "border-amber-500",
    badge: "Todo incluido",
    features: [
      "Todo lo de Pro",
      "4 sesiones en vivo / mes",
      "Consultoría personalizada",
      "Acceso anticipado a nuevo contenido",
      "Comunidad exclusiva",
    ],
    disabled: [],
  },
]

function UpgradeSection() {
  return (
    <div className="space-y-4">
      <p className="text-neutral-400 text-sm">
        Desbloquea todo el contenido del curso DR-CAFTA.
      </p>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "rounded-2xl border p-4 bg-neutral-800/50",
            plan.color
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-white font-bold text-base">{plan.name}</span>
              {plan.badge && (
                <span className={cn(
                  "ml-2 text-xs px-2 py-0.5 rounded-full font-medium",
                  plan.id === "pro" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"
                )}>
                  {plan.badge}
                </span>
              )}
            </div>
            <span className="text-white font-bold">{plan.price}</span>
          </div>
          <ul className="space-y-1.5 mb-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-neutral-300">
                <Check size={12} className="text-emerald-400 shrink-0" /> {f}
              </li>
            ))}
            {plan.disabled.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-neutral-600 line-through">
                <X size={12} className="shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button
            className={cn(
              "w-full py-2 rounded-xl text-sm font-semibold transition",
              plan.id === "basic"
                ? "bg-neutral-700 text-neutral-400 cursor-default"
                : plan.id === "pro"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-black"
            )}
          >
            {plan.id === "basic" ? "Plan actual" : `Obtener ${plan.name}`}
          </button>
        </div>
      ))}
    </div>
  )
}

/* ─── Projects section ─── */
function ProjectsSection() {
  const { getProgress } = useProgress()

  return (
    <div className="space-y-2">
      <p className="text-neutral-400 text-sm mb-4">
        Tu progreso en el curso DR-CAFTA.
      </p>
      {modules.map((mod) => {
        const { pct, completed } = getProgress(mod.id)
        const Icon = mod.icono
        return (
          <div
            key={mod.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 transition"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: mod.gradiente[0] }}
            >
              <Icon size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{mod.titulo}</p>
              <div className="mt-1.5 h-1 w-full bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    completed ? "bg-emerald-500" : pct > 0 ? "bg-blue-500" : "bg-neutral-600"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="shrink-0">
              {completed ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : pct > 0 ? (
                <span className="text-blue-400 text-xs font-medium">{pct}%</span>
              ) : (
                <Circle size={16} className="text-neutral-600" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Documentation section ─── */
function DocumentationSection() {
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">DR-CAFTA Completo</p>
            <p className="text-neutral-400 text-xs">Documentación del curso · .docx</p>
          </div>
        </div>
        <a
          href={DOC_URL}
          download
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium transition"
        >
          <Download size={15} />
          Descargar documentación
        </a>
      </div>

      <div>
        <p className="text-neutral-400 text-xs uppercase tracking-wider mb-3">
          Módulos del curso
        </p>
        <div className="space-y-2">
          {modules.map((mod) => {
            const Icon = mod.icono
            return (
              <div key={mod.id} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-800/40">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: mod.gradiente[0] }}
                >
                  <Icon size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{mod.titulo}</p>
                  <p className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{mod.subtitulo}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── App settings section ─── */
interface AppPrefs {
  autoplay: boolean
  notifications: boolean
  language: string
}

function SettingsConfigSection() {
  const [prefs, setPrefs] = useState<AppPrefs>({
    autoplay: true,
    notifications: false,
    language: "es",
  })
  const [resetConfirm, setResetConfirm] = useState(false)
  const { progress } = useProgress()
  const watched = Object.values(progress).filter((p) => p.pct > 0).length

  const toggle = (key: keyof AppPrefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const handleReset = () => {
    if (resetConfirm) {
      localStorage.removeItem("dr-cafta-progress")
      window.location.reload()
    } else {
      setResetConfirm(true)
      setTimeout(() => setResetConfirm(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toggles */}
      <div className="space-y-1">
        <p className="text-neutral-400 text-xs uppercase tracking-wider mb-3">Reproducción</p>
        {[
          { key: "autoplay" as const, label: "Reproducción automática", icon: PlayCircle },
          { key: "notifications" as const, label: "Notificaciones", icon: Bell },
        ].map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/60"
          >
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-neutral-400" />
              <span className="text-white text-sm">{label}</span>
            </div>
            <button
              onClick={() => toggle(key)}
              className={cn(
                "relative w-10 h-5.5 rounded-full transition-colors duration-200",
                prefs[key] ? "bg-blue-600" : "bg-neutral-700"
              )}
              style={{ height: "22px" }}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
                  prefs[key] ? "translate-x-[18px]" : "translate-x-0"
                )}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Language */}
      <div>
        <p className="text-neutral-400 text-xs uppercase tracking-wider mb-3">Idioma</p>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/60">
          <Globe size={16} className="text-neutral-400" />
          <select
            value={prefs.language}
            onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
            className="flex-1 bg-transparent text-white text-sm focus:outline-none"
          >
            <option value="es" className="bg-neutral-900">Español</option>
            <option value="en" className="bg-neutral-900">English</option>
          </select>
        </div>
      </div>

      {/* Progress stats */}
      <div>
        <p className="text-neutral-400 text-xs uppercase tracking-wider mb-3">Progreso</p>
        <div className="p-3 rounded-xl bg-neutral-800/60 mb-3">
          <p className="text-neutral-400 text-xs mb-1">Módulos vistos</p>
          <p className="text-white text-2xl font-bold">
            {watched} <span className="text-neutral-500 text-sm font-normal">/ {modules.length}</span>
          </p>
        </div>
        <button
          onClick={handleReset}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition",
            resetConfirm
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "border border-neutral-700 text-neutral-400 hover:border-red-700/60 hover:text-red-400"
          )}
        >
          <RefreshCw size={14} />
          {resetConfirm ? "¿Confirmar? Haz clic de nuevo" : "Restablecer progreso"}
        </button>
      </div>
    </div>
  )
}

/* ─── Help section ─── */
const faqs = [
  {
    q: "¿Cómo accedo a los videos del curso?",
    a: 'Desde la página principal, haz clic en el botón "Ver" de cualquier módulo. Si no has iniciado sesión, el sistema te pedirá que lo hagas y selecciones un perfil.',
  },
  {
    q: "¿Puedo descargar los materiales del curso?",
    a: 'Sí. En la sección Documentación puedes descargar el documento completo del curso. Cada módulo también incluye una presentación PPT que se puede descargar desde el reproductor.',
  },
  {
    q: "¿Qué es el DR-CAFTA?",
    a: "El DR-CAFTA (Dominican Republic–Central America Free Trade Agreement) es el tratado de libre comercio entre la República Dominicana, los países de Centroamérica y los Estados Unidos, en vigor desde 2007.",
  },
  {
    q: "¿Cuánto dura el curso completo?",
    a: "El curso está compuesto por 11 módulos más un resumen general. La duración total aproximada es de 6-8 horas de contenido en video.",
  },
  {
    q: "¿Hay un certificado al completar el curso?",
    a: "El certificado de finalización está disponible en el plan Pro y Premium. Al completar todos los módulos (más del 95% del contenido) puedes solicitar tu certificado.",
  },
  {
    q: "¿Cómo puedo contactar al instructor?",
    a: "Puedes enviar tus preguntas a través del formulario de contacto de abajo o escribir directamente al correo del curso.",
  },
]

function HelpSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl bg-neutral-800/60 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-3.5 text-left"
            >
              <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
              <motion.div
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown size={16} className="text-neutral-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-3.5 pb-3.5 text-neutral-400 text-sm leading-relaxed border-t border-neutral-700 pt-3">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-700 p-4 space-y-3">
        <p className="text-white font-semibold text-sm">¿Necesitas más ayuda?</p>
        <div className="flex items-center gap-3 text-neutral-400 text-sm">
          <Mail size={15} className="shrink-0" />
          <span>info@drcafta.do</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400 text-sm">
          <Zap size={15} className="shrink-0 text-amber-400" />
          <span>Respuesta en menos de 24 horas</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Main panel ─── */
interface SettingsPanelProps {
  section: SettingsSection
  profiles: Profile[]
  currentProfile: Profile | null
  onClose: () => void
  onProfileSave: (p: Profile) => void
  onSwitchProfile: () => void
}

export function SettingsPanel({
  section,
  currentProfile,
  onClose,
  onProfileSave,
  onSwitchProfile,
}: SettingsPanelProps) {
  const { title, icon: Icon } = sectionMeta[section]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[54]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-neutral-950 border-l border-neutral-800 z-[55] flex flex-col shadow-2xl overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center">
            <Icon className="w-4 h-4 text-neutral-300" />
          </div>
          <h2 className="text-white font-semibold flex-1">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {section === "profile" && (
            <ProfileSection
              currentProfile={currentProfile}
              onProfileSave={onProfileSave}
              onSwitchProfile={onSwitchProfile}
              onClose={onClose}
            />
          )}
          {section === "upgrade" && <UpgradeSection />}
          {section === "projects" && <ProjectsSection />}
          {section === "documentation" && <DocumentationSection />}
          {section === "settings" && <SettingsConfigSection />}
          {section === "help" && <HelpSection />}
        </div>
      </motion.div>
    </>
  )
}
