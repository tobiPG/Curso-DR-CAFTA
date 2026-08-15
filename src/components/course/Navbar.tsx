import { useEffect, useState } from "react"
import { Scale } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-6 md:px-12 py-4 transition-colors duration-300",
        scrolled ? "bg-neutral-950/95 shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <Scale className="w-6 h-6 text-red-600" />
      <span className="text-white text-xl font-bold tracking-tight">
        DR-CAFTA <span className="text-red-600">Curso</span>
      </span>
    </header>
  )
}
