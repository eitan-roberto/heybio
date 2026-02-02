'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-top/50">
      <div className="bg-bottom rounded-4xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-top mb-2">{title}</h3>
        <p className="text-high mb-6">{description}</p>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={cn(
              "flex-1 rounded-full",
              variant === 'danger' ? 'bg-orange text-top hover:bg-orange/80' : 'bg-green text-top hover:bg-green/80'
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
