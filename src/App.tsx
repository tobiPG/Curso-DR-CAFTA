import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BookOpen, FileText, Users, Settings } from "lucide-react"
import { Navbar } from "@/components/course/Navbar"
import { Hero } from "@/components/course/Hero"
import { ModuleGrid } from "@/components/course/ModuleGrid"
import { ResourcesSection } from "@/components/course/ResourcesSection"
import { VideoModal } from "@/components/course/VideoModal"
import { ProgressProvider } from "@/hooks/useProgress"
import { modules, bonusModule, type CourseModule } from "@/data/modules"
import { SmokeyBackground, LoginForm } from "@/components/ui/login-form"
import ProfileSelect from "@/components/ui/3d-profile-selector"
import { ProfileEditModal, type Profile } from "@/components/ui/profile-edit-modal"
import { DockTabs } from "@/components/ui/dock-tabs"
import { SmoothDropdown } from "@/components/ui/smooth-dropdown"
import { SettingsPanel, type SettingsSection } from "@/components/ui/settings-panel"

type AuthStep = "landing" | "login" | "profile" | "ready"

const defaultProfiles: Profile[] = [
  {
    id: "alpha",
    name: "Alpha",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
  },
  {
    id: "nova",
    name: "Nova",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    id: "zen",
    name: "Zen",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80",
  },
]

function App() {
  // Auth flow
  const [authStep, setAuthStep] = useState<AuthStep>("landing")
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null)
  const [pendingModule, setPendingModule] = useState<CourseModule | null>(null)

  // Profiles
  const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  // Course video
  const [selected, setSelected] = useState<CourseModule | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Settings panel
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null)

  /* ── Computed ── */
  const currentProfile = profiles.find((p) => p.id === currentProfileId) ?? null

  /* ── Handlers ── */
  const handlePlay = (module: CourseModule) => {
    if (authStep === "ready") {
      setSelected(module)
      setModalOpen(true)
    } else {
      setPendingModule(module)
      setAuthStep("login")
    }
  }

  const handleLoginSuccess = () => setAuthStep("profile")

  const handleProfileSelect = (profileId: string) => {
    setCurrentProfileId(profileId)
    setAuthStep("ready")
    if (pendingModule) {
      setSelected(pendingModule)
      setModalOpen(true)
      setPendingModule(null)
    }
  }

  const handleProfileSave = (updated: Profile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  const handleLogout = () => {
    setAuthStep("landing")
    setCurrentProfileId(null)
    setSelected(null)
    setModalOpen(false)
    setSettingsSection(null)
  }

  const handleOpenSection = (section: SettingsSection) => {
    setSettingsSection(section)
  }

  const dockItems = [
    {
      id: "home",
      name: "Inicio",
      icon: <Home size={22} />,
      color: "bg-neutral-700",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "modules",
      name: "Módulos",
      icon: <BookOpen size={22} />,
      color: "bg-blue-600",
      onClick: () =>
        document.getElementById("modulos")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "resources",
      name: "Recursos",
      icon: <FileText size={22} />,
      color: "bg-amber-500",
      onClick: () =>
        document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "profiles",
      name: "Cambiar perfil",
      icon: <Users size={22} />,
      color: "bg-indigo-600",
      onClick: () => setAuthStep("profile"),
    },
    {
      id: "settings",
      name: "Configuración",
      icon: <Settings size={22} />,
      color: "bg-neutral-600",
      onClick: () => handleOpenSection("settings"),
    },
  ]

  return (
    <ProgressProvider>
      {/* ── Curso siempre visible ── */}
      <div className="min-h-screen bg-neutral-950">
        <Navbar />
        <Hero featured={bonusModule} onPlay={handlePlay} />
        <div className="relative bg-neutral-950 pt-12 pb-4" id="modulos">
          <ModuleGrid title="Módulos del curso" items={modules} onPlay={handlePlay} />
          <div id="recursos">
            <ResourcesSection />
          </div>
        </div>
        <footer className="px-6 md:px-12 py-8 text-neutral-500 text-xs border-t border-neutral-900">
          Curso DR-CAFTA · Comercio Exterior · República Dominicana
        </footer>
        <VideoModal module={selected} open={modalOpen} onOpenChange={setModalOpen} />
      </div>

      {/* ── Dock + Dropdown cuando autenticado ── */}
      <AnimatePresence>
        {authStep === "ready" && (
          <>
            <motion.div
              key="dropdown"
              className="fixed top-4 right-6 z-40"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <SmoothDropdown
                onLogout={handleLogout}
                onOpenSection={handleOpenSection}
              />
            </motion.div>

            <motion.div
              key="dock"
              className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pointer-events-auto">
                <DockTabs items={dockItems} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Overlays de autenticación ── */}
      <AnimatePresence>
        {authStep === "login" && (
          <motion.div
            key="login"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <main className="relative w-full h-full bg-gray-900">
              <SmokeyBackground className="absolute inset-0" />
              <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
                <LoginForm onSuccess={handleLoginSuccess} />
              </div>
            </main>
          </motion.div>
        )}

        {authStep === "profile" && (
          <motion.div
            key="profile-selector"
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProfileSelect
              profiles={profiles}
              onSelect={handleProfileSelect}
              onEdit={setEditingProfile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal de edición de perfil ── */}
      <AnimatePresence>
        {editingProfile && (
          <ProfileEditModal
            key="edit-modal"
            profile={editingProfile}
            onSave={handleProfileSave}
            onClose={() => setEditingProfile(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Panel de configuración ── */}
      <AnimatePresence>
        {settingsSection && (
          <SettingsPanel
            key="settings-panel"
            section={settingsSection}
            profiles={profiles}
            currentProfile={currentProfile}
            onClose={() => setSettingsSection(null)}
            onProfileSave={handleProfileSave}
            onSwitchProfile={() => {
              setSettingsSection(null)
              setAuthStep("profile")
            }}
          />
        )}
      </AnimatePresence>
    </ProgressProvider>
  )
}

export default App
