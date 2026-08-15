import { cn } from "@/lib/utils"
import React, { useState } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
  type MotionValue,
} from "framer-motion"
import { Plus, Pencil } from "lucide-react"
import type { Profile } from "@/components/ui/profile-edit-modal"

export type { Profile }

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
}

interface ProfileSelectProps {
  profiles: Profile[]
  onSelect: (profileId: string) => void
  onEdit: (profile: Profile) => void
}

export default function ProfileSelect({ profiles, onSelect, onEdit }: ProfileSelectProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) => {
    const rect = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - rect.left)
    mouseY.set(clientY - rect.top)
  }

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-neutral-950 text-neutral-50 selection:bg-white/20"
      )}
      onMouseMove={handleMouseMove}
    >
      <Spotlight mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-2 text-center text-5xl font-bold tracking-tighter sm:text-7xl"
          variants={titleVariants}
        >
          ¿Quién está viendo?
        </motion.h1>
        <motion.p
          className="mb-16 text-neutral-400 text-lg"
          variants={titleVariants}
        >
          Selecciona tu perfil · Haz clic en <Pencil className="inline w-3.5 h-3.5 mb-0.5" /> para editar
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          style={{ perspective: "1000px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.1 },
            },
          }}
        >
          {profiles.map((profile) => (
            <TiltCard
              key={profile.id}
              profile={profile}
              onSelect={onSelect}
              onEdit={onEdit}
            />
          ))}
          <AddProfileCard />
        </motion.div>

        <motion.button
          type="button"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.5 } }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className="mt-16 border border-neutral-800 bg-neutral-900/50 px-8 py-2.5 text-sm font-medium uppercase tracking-widest text-neutral-400 backdrop-blur transition-colors hover:border-neutral-700 hover:text-white"
        >
          Administrar perfiles
        </motion.button>
      </motion.div>
    </div>
  )
}

function Spotlight({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const background = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.07),
    transparent 80%
  )`
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100 transition-opacity duration-300"
      style={{ background }}
    />
  )
}

function TiltCard({
  profile,
  onSelect,
  onEdit,
}: {
  profile: Profile
  onSelect: (id: string) => void
  onEdit: (profile: Profile) => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [hovered, setHovered] = useState(false)

  const xSpring = useSpring(x, { stiffness: 200, damping: 30 })
  const ySpring = useSpring(y, { stiffness: 200, damping: 30 })
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative h-40 w-40 sm:h-52 sm:w-52"
    >
      {/* Image — click to select */}
      <div
        style={{ transform: "translateZ(50px)" }}
        onClick={() => onSelect(profile.id)}
        className="absolute inset-0 overflow-hidden rounded-[2.6rem] bg-neutral-900 shadow-2xl cursor-pointer transition-shadow duration-500 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.15)]"
      >
        <img
          src={profile.image}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-500 hover:scale-110 hover:opacity-100"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Ring */}
      <div
        style={{ transform: "translateZ(40px)" }}
        className="pointer-events-none absolute inset-0 rounded-[2.6rem] ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:ring-white/25"
      />

      {/* Name */}
      <div
        style={{ transform: "translateZ(80px)" }}
        className="pointer-events-none absolute bottom-4 left-0 right-0 text-center"
      >
        <span className="text-xl font-medium text-neutral-200 drop-shadow-lg">
          {profile.name}
        </span>
      </div>

      {/* Edit button */}
      <div
        style={{ transform: "translateZ(90px)" }}
        className="absolute top-3 right-3"
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(profile)
          }}
          className={cn(
            "w-8 h-8 bg-black/60 hover:bg-blue-600 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200",
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
          )}
          title="Editar perfil"
        >
          <Pencil size={13} />
        </button>
      </div>
    </motion.div>
  )
}

function AddProfileCard() {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex h-40 w-40 cursor-pointer flex-col items-center justify-center sm:h-52 sm:w-52"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2.6rem]">
        <div className="absolute inset-[-50%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
      </div>
      <div className="absolute inset-px flex flex-col items-center justify-center rounded-[2.6rem] bg-neutral-900/80 backdrop-blur-md transition-colors duration-300 group-hover:bg-neutral-800/80">
        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800"
          animate={{
            boxShadow: [
              "0px 0px 0px rgba(0,0,0,0)",
              "0px 0px 20px rgba(255,255,255,0.08)",
              "0px 0px 0px rgba(0,0,0,0)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="text-neutral-400 group-hover:text-white"
            whileHover={{ rotate: 90, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Plus size={32} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
        <span className="mt-4 text-lg font-medium text-neutral-400 transition-colors group-hover:text-white">
          Agregar perfil
        </span>
      </div>
    </motion.div>
  )
}
