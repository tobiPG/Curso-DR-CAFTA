import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BookOpen, FileText, Users, Settings } from "lucide-react"
import { Navbar } from "@/components/course/Navbar"
import { Hero } from "@/components/course/Hero"
import { ModuleGrid } from "@/components/course/ModuleGrid"
import { ResourcesSection } from "@/components/course/ResourcesSection"
import { VideoModal } from "@/components/course/VideoModal"
import { ProgressProvider } from "@/hooks/useProgress"
import { useAuth } from "@/hooks/useAuth"
import { modules, bonusModule, type CourseModule } from "@/data/modules"
import { SmokeyBackground, LoginForm } from "@/components/ui/login-form"
import ProfileSelect, { type Profile } from "@/components/ui/3d-profile-selector"
import { ProfileEditModal } from "@/components/ui/profile-edit-modal"
import { DockTabs } from "@/components/ui/dock-tabs"
import { SmoothDropdown } from "@/components/ui/smooth-dropdown"
import { SettingsPanel, type SettingsSection } from "@/components/ui/settings-panel"

// Preset avatars for new-user profile setup
const PRESET_PROFILES: Profile[] = [
  { id: "alpha", name: "Alpha", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" },
  { id: "nova", name: "Nova", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: "zen", name: "Zen", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80" },
]

type Screen = "loading" | "landing" | "login" | "setup" | "ready"

function CourseApp() {
  const { user, profile, loading, isNewUser, signOut, updateProfile } = useAuth()

  const [screen, setScreen] = useState<Screen>("loading")
  const [pendingModule, setPendingModule] = useState<CourseModule | null>(null)
  const [selected, setSelected] = useState<CourseModule | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null)

  /* ── Derive screen from auth state ── */
  useEffect(() => {
    if (loading) { setScreen("loading"); return }
    if (!user) { setScreen("landing"); return }
    // Logged-in user: skip to ready unless it's their first time
    setScreen("ready")
  }, [loading, user])

  /* ── After login/register ── */
  const handleLoginSuccess = (newUser: boolean) => {
    if (newUser) {
      // New users pick their avatar first
      setScreen("setup")
    } else {
      setScreen("ready")
      if (pendingModule) {
        setSelected(pendingModule)
        setModalOpen(true)
        setPendingModule(null)
      }
    }
  }

  /* ── Profile setup for new users ── */
  const handleProfileSetup = async (profileId: string) => {
    const chosen = PRESET_PROFILES.find((p) => p.id === profileId)
    if (chosen) {
      await updateProfile({ display_name: chosen.name, avatar_url: chosen.image })
    }
    setScreen("ready")
    if (pendingModule) {
      setSelected(pendingModule)
      setModalOpen(true)
      setPendingModule(null)
    }
  }

  /* ── Play a module (gate behind auth) ── */
  const handlePlay = (module: CourseModule) => {
    if (screen === "ready") {
      setSelected(module)
      setModalOpen(true)
    } else {
      setPendingModule(module)
      setScreen("login")
    }
  }

  /* ── Profile edit save (syncs to Supabase) ── */
  const handleProfileSave = async (updated: Profile) => {
    await updateProfile({ display_name: updated.name, avatar_url: updated.image })
    setEditingProfile(null)
  }

  /* ── Logout ── */
  const handleLogout = async () => {
    await signOut()
    setScreen("landing")
    setSelected(null)
    setModalOpen(false)
    setSettingsSection(null)
  }

  /* ── Current profile as local Profile type ── */
  const currentProfile: Profile | null = profile
    ? { id: profile.id, name: profile.display_name, image: profile.avatar_url ?? PRESET_PROFILES[0].image }
    : null

  const dockItems = [
    { id: "home", name: "Inicio", icon: <Home size={22} />, color: "bg-neutral-700",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { id: "modules", name: "Módulos", icon: <BookOpen size={22} />, color: "bg-blue-600",
      onClick: () => document.getElementById("modulos")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "resources", name: "Recursos", icon: <FileText size={22} />, color: "bg-amber-500",
      onClick: () => document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "profile", name: "Mi perfil", icon: <Users size={22} />, color: "bg-indigo-600",
      onClick: () => setSettingsSection("profile") },
    { id: "settings", name: "Configuración", icon: <Settings size={22} />, color: "bg-neutral-600",
      onClick: () => setSettingsSection("settings") },
  ]

  if (screen === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <ProgressProvider userId={user?.id ?? null}>
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

      {/* ── Dock + Dropdown (authenticated only) ── */}
      <AnimatePresence>
        {screen === "ready" && (
          <>
            <motion.div key="dropdown" className="fixed top-4 right-6 z-40"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <SmoothDropdown onLogout={handleLogout} onOpenSection={setSettingsSection} />
            </motion.div>

            <motion.div key="dock"
              className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
              <div className="pointer-events-auto">
                <DockTabs items={dockItems} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Auth overlays ── */}
      <AnimatePresence>
        {screen === "login" && (
          <motion.div key="login" className="fixed inset-0 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>
            <main className="relative w-full h-full bg-gray-900">
              <SmokeyBackground className="absolute inset-0" />
              <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
                <LoginForm onSuccess={handleLoginSuccess} />
              </div>
            </main>
          </motion.div>
        )}

        {screen === "setup" && (
          <motion.div key="setup" className="fixed inset-0 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>
            <ProfileSelect
              profiles={PRESET_PROFILES}
              onSelect={handleProfileSetup}
              onEdit={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile edit modal ── */}
      <AnimatePresence>
        {editingProfile && (
          <ProfileEditModal key="edit"
            profile={editingProfile}
            onSave={handleProfileSave}
            onClose={() => setEditingProfile(null)} />
        )}
      </AnimatePresence>

      {/* ── Settings panel ── */}
      <AnimatePresence>
        {settingsSection && (
          <SettingsPanel key="settings"
            section={settingsSection}
            profiles={currentProfile ? [currentProfile] : PRESET_PROFILES}
            currentProfile={currentProfile}
            onClose={() => setSettingsSection(null)}
            onProfileSave={handleProfileSave}
            onSwitchProfile={() => setSettingsSection(null)} />
        )}
      </AnimatePresence>
    </ProgressProvider>
  )
}

// Root wraps with AuthProvider — imported in main.tsx
export default CourseApp
