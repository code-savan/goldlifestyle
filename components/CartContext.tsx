"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string; // product id
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string | null;
  colorName?: string | null;
  size?: string | null;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, colorName?: string | null, size?: string | null) => void;
  updateQty: (id: string, quantity: number, colorName?: string | null, size?: string | null) => void;
  clear: () => void;
  totalCents: number;
};

const CartContext = createContext<CartState | undefined>(undefined);

const STORAGE_KEY = "gold_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem: CartState["addItem"] = useCallback((item) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id && p.colorName === item.colorName && p.size === item.size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + (item.quantity ?? 1) };
        return next;
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string, colorName?: string | null, size?: string | null) =>
    setItems((prev) => prev.filter((p) => !(p.id === id && p.colorName === colorName && p.size === size))),
  []);

  const updateQty = useCallback((id: string, quantity: number, colorName?: string | null, size?: string | null) =>
    setItems((prev) =>
      prev.map((p) =>
        p.id === id && p.colorName === colorName && p.size === size
          ? { ...p, quantity: Math.max(1, quantity) }
          : p
      )
    ),
  []);

  const clear = useCallback(() => setItems([]), []);

  const totalCents = useMemo(() => items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0), [items]);

  const value = useMemo<CartState>(() => ({ items, addItem, removeItem, updateQty, clear, totalCents }), [items, totalCents, addItem, removeItem, updateQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
