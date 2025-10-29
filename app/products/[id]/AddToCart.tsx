"use client";
import React, { useState } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/Toast";
import { Minus, Plus } from "lucide-react";

type ColorType = { color_name: string; color_hex?: string | null };

export default function AddToCart({
  product,
  colors,
  sizes,
}: {
  product: { id: string; name: string; amountCents: number; imageUrl?: string | null };
  colors: Array<ColorType>;
  sizes: string[];
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(colors[0]?.color_name || "");
  const [size, setSize] = useState(sizes[0] || "");

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      priceCents: product.amountCents,
      quantity: qty,
      imageUrl: product.imageUrl || null,
      colorName: color || null,
      size: size || null,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} (${qty})`
    });
  };

  return (
    <div className="space-y-8">
      {/* Color Selection */}
      {colors.length > 0 && (
        <fieldset>
          <legend className="text-[11px] tracking-widest uppercase text-black/50 mb-4">
            Color
          </legend>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Product color">
            {colors.map((c, idx) => {
              const id = `color-${idx}`;
              const isSelected = color === c.color_name;
              return (
                <div key={c.color_name}>
                  <input
                    id={id}
                    type="radio"
                    name="color"
                    value={c.color_name}
                    checked={isSelected}
                    onChange={() => setColor(c.color_name)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={id}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <span
                      className="w-12 h-12 border-2 transition-all duration-200"
                      style={{
                        borderColor: isSelected ? '#000' : 'rgba(0,0,0,0.15)',
                        backgroundColor: c.color_hex && /^#/.test(c.color_hex) ? c.color_hex : '#e4e4e4',
                        boxShadow: isSelected ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none',
                      }}
                    />
                    <span
                      className="text-[11px] tracking-wider transition-colors"
                      style={{
                        fontWeight: isSelected ? 400 : 300,
                        color: isSelected ? '#000' : 'rgba(0,0,0,0.5)'
                      }}
                    >
                      {c.color_name}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <fieldset>
          <legend className="text-[11px] tracking-widest uppercase text-black/50 mb-4">
            Size
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Product size">
            {sizes.map((s, idx) => {
              const id = `size-${idx}`;
              const isSelected = size === s;
              return (
                <div key={s}>
                  <input
                    id={id}
                    type="radio"
                    name="size"
                    value={s}
                    checked={isSelected}
                    onChange={() => setSize(s)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={id}
                    className="block px-6 py-3 border cursor-pointer transition-all duration-200 text-[13px] tracking-wider"
                    style={{
                      borderColor: isSelected ? '#000' : 'rgba(0,0,0,0.2)',
                      backgroundColor: isSelected ? '#000' : '#fff',
                      color: isSelected ? '#fff' : '#000',
                      fontWeight: isSelected ? 400 : 300,
                    }}
                  >
                    {s}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Quantity Selection */}
      <div>
        <label className="text-[11px] tracking-widest uppercase text-black/50 mb-4 block">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
          >
            <Minus size={16} strokeWidth={1.5} />
          </button>

          <input
            type="number"
            min={1}
            value={qty}
            onChange={e => {
              const val = parseInt(e.target.value, 10);
              setQty(Number.isNaN(val) || val < 1 ? 1 : val);
            }}
            aria-label="Quantity"
            className="w-16 h-10 border border-black/20 text-center text-[13px] font-light outline-none focus:border-black transition-colors"
          />

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
          >
            <Plus size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full border border-black bg-black text-white py-4 text-[13px] tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
      >
        <span>Add to Cart</span>
      </button>
    </div>
  );
}
