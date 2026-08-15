import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import useMeasure from "react-use-measure"
import {
  User,
  CreditCard,
  Folder,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  MoreHorizontal,
} from "lucide-react"
import type { SettingsSection } from "@/components/ui/settings-panel"

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }> | null
  section?: SettingsSection
}

const menuItems: MenuItem[] = [
  { id: "profile", label: "Mi perfil", icon: User, section: "profile" },
  { id: "upgrade", label: "Mejorar plan", icon: CreditCard, section: "upgrade" },
  { id: "projects", label: "Proyectos", icon: Folder, section: "projects" },
  { id: "documentation", label: "Documentación", icon: FileText, section: "documentation" },
  { id: "divider", label: "", icon: null },
  { id: "settings", label: "Configuración", icon: Settings, section: "settings" },
  { id: "help", label: "Obtener ayuda", icon: HelpCircle, section: "help" },
  { id: "logout", label: "Cerrar sesión", icon: LogOut },
]

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1]

interface SmoothDropdownProps {
  onLogout?: () => void
  onOpenSection?: (section: SettingsSection) => void
}

export function SmoothDropdown({ onLogout, onOpenSection }: SmoothDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("profile")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentRef, contentBounds] = useMeasure()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const openHeight = Math.max(40, Math.ceil(contentBounds.height))

  const handleItemClick = (item: MenuItem) => {
    if (item.id === "divider") return
    setActiveItem(item.id)
    if (item.id === "logout") {
      setIsOpen(false)
      onLogout?.()
      return
    }
    if (item.section) {
      setIsOpen(false)
      onOpenSection?.(item.section)
    }
  }

  return (
    <div ref={containerRef} className="relative h-10 w-10">
      <motion.div
        layout
        initial={false}
        animate={{
          width: isOpen ? 220 : 40,
          height: isOpen ? openHeight : 40,
          borderRadius: isOpen ? 14 : 12,
        }}
        transition={{ type: "spring", damping: 34, stiffness: 380, mass: 0.8 }}
        className="absolute top-0 right-0 bg-neutral-900 border border-neutral-700/80 shadow-2xl overflow-hidden cursor-pointer origin-top-right"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Collapsed icon */}
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.8 : 1 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: isOpen ? "none" : "auto" }}
        >
          <MoreHorizontal className="w-5 h-5 text-neutral-300" />
        </motion.div>

        {/* Menu content */}
        <div ref={contentRef}>
          <motion.div
            layout
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isOpen ? 0.08 : 0 }}
            className="p-2"
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
          >
            <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
              {menuItems.map((item, index) => {
                if (item.id === "divider") {
                  return (
                    <motion.hr
                      key="divider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      transition={{ delay: isOpen ? 0.12 + index * 0.015 : 0 }}
                      className="border-neutral-700 my-1"
                    />
                  )
                }

                const Icon = item.icon!
                const isLogout = item.id === "logout"
                const isActive = activeItem === item.id
                const showIndicator = hoveredItem ? hoveredItem === item.id : isActive

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 8 }}
                    transition={{
                      delay: isOpen ? 0.06 + index * 0.02 : 0,
                      duration: 0.15,
                      ease: easeOutQuint,
                    }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative flex items-center gap-3 rounded-lg text-sm cursor-pointer pl-3 py-2 transition-colors duration-150 ${
                      isLogout && showIndicator
                        ? "text-red-400"
                        : isLogout
                        ? "text-neutral-400 hover:text-red-400"
                        : isActive
                        ? "text-neutral-100"
                        : "text-neutral-400 hover:text-neutral-100"
                    }`}
                  >
                    {showIndicator && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute inset-0 rounded-lg ${
                          isLogout ? "bg-red-900/30" : "bg-neutral-700/60"
                        }`}
                        transition={{ type: "spring", damping: 30, stiffness: 520, mass: 0.8 }}
                      />
                    )}
                    {showIndicator && (
                      <motion.div
                        layoutId="leftBar"
                        className={`absolute left-0 top-0 bottom-0 my-auto w-[3px] h-5 rounded-full ${
                          isLogout ? "bg-red-500" : "bg-neutral-100"
                        }`}
                        transition={{ type: "spring", damping: 30, stiffness: 520, mass: 0.8 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10 shrink-0" />
                    <span className="font-medium relative z-10 text-xs">{item.label}</span>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
