"use client";
import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";

type Toast = { id: string; title?: string; description?: string; variant?: "default" | "success" | "error" };
type ToastContextValue = { toast: (t: Omit<Toast, "id">) => void };

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    // auto dismiss after 3s
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed left-1/2 -translate-x-1/2 md:bottom-20 top-12 grid gap-2.5 z-100 min-w-[220px]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
               px-3 py-2.5 min-w-[220px] h-fit shadow-lg border
              ${t.variant === "error"
                ? "bg-red-100 text-black border-red-200"
                : t.variant === "success"
                  ? "bg-emerald-50 text-black border-emerald-200"
                  : "bg-black text-white border-black"}
            `}
          >
            {t.title ? (
              <div
                className={`font-bold text-[13px] ${t.description ? "mb-1" : ""}`}
              >
                {t.title}
              </div>
            ) : null}
            {t.description ? (
              <div className="text-[12px] opacity-90">
                {t.description}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
