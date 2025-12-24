"use client";

import { useEffect } from "react";

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export default function ErrorToast({ message, onDismiss, duration = 5000 }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive animate-fade-in">
      {message}
    </div>
  );
}
