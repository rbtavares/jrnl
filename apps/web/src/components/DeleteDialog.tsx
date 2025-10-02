import { motion } from 'motion/react';

interface DialogProps {
  onCancel: () => void;
  onDelete: () => void;
}

export default function Dialog({ onCancel, onDelete }: DialogProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay: 0.15 }}
        className="z-10 bg-card shadow-card rounded-lg border border-card-border p-4 space-y-7"
      >
        {/* Dialog content */}
        <div className="space-y-1">
          <h1 className="text-2xl font-medium">Are you sure?</h1>
          <p className="text-foreground-secondary">This action cannot be undone.</p>
        </div>

        {/* Dialog actions */}
        <div className="flex justify-end gap-3">
          <button
            className="border border-outline/75 text-outline text-sm py-1.5 rounded-md bg-background flex-1 hover:opacity-70 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
            onClick={onCancel}
          >
            No, cancel
          </button>
          <button
            className="bg-destructive text-foreground-destructive text-sm py-1.5 rounded-md flex-1 hover:opacity-85 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
            onClick={onDelete}
          >
            Yes, delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
