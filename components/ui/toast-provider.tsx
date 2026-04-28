"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Toast = { id: number; title: string; tone: "success" | "error" };

const ToastContext = createContext<{ push: (title: string, tone: Toast["tone"]) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((title: string, tone: Toast["tone"]) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, title, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur",
              toast.tone === "success" ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100" : "border-red-500/40 bg-red-500/15 text-red-100",
            )}
          >
            {toast.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
