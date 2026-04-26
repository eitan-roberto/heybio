'use client'

import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"

interface ConfirmSheetProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export function ConfirmSheet({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: ConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      {description && (
        <p className="text-sm text-high mb-6 leading-relaxed">{description}</p>
      )}
      <div className="flex flex-col gap-2">
        <Button
          variant="danger"
          size="md"
          className="w-full"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="w-full"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
      </div>
    </BottomSheet>
  )
}
