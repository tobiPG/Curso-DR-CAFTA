import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, ImageIcon } from "lucide-react"

export interface Profile {
  id: string
  name: string
  image: string
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

interface ProfileEditModalProps {
  profile: Profile
  onSave: (updated: Profile) => void
  onClose: () => void
}

export function ProfileEditModal({ profile, onSave, onClose }: ProfileEditModalProps) {
  const [name, setName] = useState(profile.name)
  const [image, setImage] = useState(profile.image)
  const [customUrl, setCustomUrl] = useState("")
  const [imgError, setImgError] = useState(false)

  const handleSave = () => {
    onSave({ ...profile, name: name.trim() || profile.name, image })
    onClose()
  }

  const handleCustomUrl = (url: string) => {
    setCustomUrl(url)
    if (url.trim()) {
      setImage(url.trim())
      setImgError(false)
    }
  }

  const selectPreset = (url: string) => {
    setImage(url)
    setCustomUrl("")
    setImgError(false)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold">Editar perfil</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition p-1 rounded-lg hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-white/20 bg-neutral-800">
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-neutral-500" size={32} />
                </div>
              ) : (
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-neutral-900">
              <ImageIcon size={12} className="text-white" />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-neutral-400 text-xs font-medium mb-2 uppercase tracking-wider">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition placeholder:text-neutral-500"
            placeholder="Nombre del perfil"
            maxLength={20}
          />
        </div>

        {/* Photo presets */}
        <div className="mb-5">
          <label className="block text-neutral-400 text-xs font-medium mb-2 uppercase tracking-wider">
            Foto de perfil
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetPhotos.map((url) => {
              const isSelected = image === url
              return (
                <button
                  key={url}
                  onClick={() => selectPreset(url)}
                  className={`relative aspect-square rounded-xl overflow-hidden ring-2 transition-all duration-200 ${
                    isSelected
                      ? "ring-blue-500 scale-105"
                      : "ring-transparent hover:ring-white/30 hover:scale-105"
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-blue-500/40 flex items-center justify-center"
                      >
                        <Check size={14} className="text-white drop-shadow" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>

          {/* Custom URL */}
          <input
            type="url"
            value={customUrl}
            onChange={(e) => handleCustomUrl(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-blue-500 transition placeholder:text-neutral-500"
            placeholder="O pega una URL de imagen personalizada..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-neutral-600 text-neutral-400 hover:text-white hover:border-neutral-500 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition text-sm font-medium"
          >
            Guardar cambios
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
