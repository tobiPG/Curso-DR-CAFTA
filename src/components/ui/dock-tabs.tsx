import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export interface DockItem {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  onClick?: () => void
}

interface DockIconProps {
  item: DockItem
  mouseX: ReturnType<typeof useMotionValue<number>>
}

function DockIcon({ item, mouseX }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const sizeSync = useTransform(distance, [-150, 0, 150], [46, 70, 46])
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 })

  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onClick={item.onClick}
      className="aspect-square cursor-pointer flex items-center justify-center relative group"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-full h-full rounded-2xl shadow-lg flex items-center justify-center text-white relative overflow-hidden ${item.color}`}
        animate={{ y: isClicked ? 2 : isHovered ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {item.icon}
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
          animate={{ opacity: isHovered ? 0.3 : 0.1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? -20 : 10,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute -top-11 left-1/2 -translate-x-1/2 bg-neutral-800/95 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none backdrop-blur-sm border border-white/10"
      >
        {item.name}
      </motion.div>

      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/70 rounded-full"
        animate={{ scale: isClicked ? 1.5 : 1, opacity: isClicked ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.div>
  )
}

interface DockTabsProps {
  items: DockItem[]
}

export function DockTabs({ items }: DockTabsProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex h-[72px] items-end gap-3 rounded-3xl bg-neutral-900/70 backdrop-blur-xl px-4 pb-3 border border-white/10 shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
    >
      {items.map((item) => (
        <DockIcon key={item.id} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  )
}
