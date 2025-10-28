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
      <div style={{ position: "fixed", right: 12, bottom: 80, display: "grid", gap: 8, zIndex: 100 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: t.variant === "error" ? "#FEE2E2" : t.variant === "success" ? "#ECFDF5" : "#111",
              color: t.variant ? "#111" : "#fff",
              border: t.variant === "error" ? "1px solid #F8B4B4" : t.variant === "success" ? "1px solid #A7F3D0" : "1px solid #111",
              borderRadius: 8,
              padding: "10px 12px",
              minWidth: 220,
              boxShadow: "0 8px 16px rgba(0,0,0,.15)",
            }}
          >
            {t.title ? <div style={{ fontWeight: 700, fontSize: 13, marginBottom: t.description ? 4 : 0 }}>{t.title}</div> : null}
            {t.description ? <div style={{ fontSize: 12, opacity: 0.9 }}>{t.description}</div> : null}
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
