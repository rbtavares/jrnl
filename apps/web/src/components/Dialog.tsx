interface DialogProps {
  onCancel: () => void;
  onDelete: () => void;
}

export default function Dialog({ onCancel, onDelete }: DialogProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="z-10 bg-card shadow-card rounded-xl border border-card-border p-4 space-y-5">
        {/* Dialog content */}
        <div className="space-y-1">
          <h1 className="text-2xl font-medium">Are you sure?</h1>
          <p className="text-foreground-secondary">This action cannot be undone.</p>
        </div>

        {/* Dialog actions */}
        <div className="flex justify-end gap-3">
          <button
            className="border border-outline text-outline px-4 py-1.5 rounded-md bg-background flex-1 hover:opacity-70 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-destructive text-foreground-destructive px-4 py-1.5 rounded-md flex-1 hover:opacity-85 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
