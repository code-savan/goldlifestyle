"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartContext";

export default function AddToCartIconButton({
  id,
  name,
  amountCents,
  imageUrl,
}: {
  id: string;
  name: string;
  amountCents: number;
  imageUrl?: string | null;
}) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      aria-label="Add to cart"
      className="btn-min"
      onClick={() => addItem({ id, name, priceCents: amountCents, imageUrl: imageUrl ?? null, quantity: 1 })}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: 6 }}
    >
      <ShoppingCart size={16} />
    </button>
  );
}
