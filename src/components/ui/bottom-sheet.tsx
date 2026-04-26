'use client'

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-top/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div
        className={cn(
          "relative z-10 w-full bg-bottom shadow-2xl",
          "rounded-t-3xl md:rounded-3xl md:max-w-md",
          "p-6 pb-8 md:pb-6",
          className
        )}
      >
        <div className="flex items-center justify-between mb-5">
          {title ? (
            <h3 className="text-base font-bold text-top">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-low transition-colors text-high"
          >
            <Icon icon="x" className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
