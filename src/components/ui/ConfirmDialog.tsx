"use client";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-crust mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
