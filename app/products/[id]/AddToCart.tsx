"use client";
import React, { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCart({ product, colors, sizes }: { product: { id: string; name: string; amountCents: number; imageUrl?: string | null }, colors: Array<{ color_name: string }>, sizes: string[] }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(colors[0]?.color_name || "");
  const [size, setSize] = useState(sizes[0] || "");
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {colors.length > 0 && (
        <label>
          <div>Color</div>
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {colors.map((c, i) => (
              <option key={i} value={c.color_name}>{c.color_name}</option>
            ))}
          </select>
        </label>
      )}
      {sizes.length > 0 && (
        <label>
          <div>Size</div>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      )}
      <label>
        <div>Quantity</div>
        <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} style={{ width: 100 }} />
      </label>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          className="btn-min"
          onClick={() => addItem({ id: product.id, name: product.name, priceCents: product.amountCents, quantity: qty, imageUrl: product.imageUrl || null, colorName: color || null, size: size || null })}
        >
          Add to cart
        </button>
        <a href="/cart">View cart</a>
      </div>
    </div>
  );
}
