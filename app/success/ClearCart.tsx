"use client";
import { useEffect } from "react";
import { useCart } from "@/components/CartContext";

export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    // Clear once on mount; avoid loops by not depending on cart contents
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
