"use client";
import React, { useState } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

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
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(colors[0]?.color_name || "");
  const [size, setSize] = useState(sizes[0] || "");

  // Use a handler to allow you to work with color_hex as needed
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      priceCents: product.amountCents,
      quantity: qty,
      imageUrl: product.imageUrl || null,
      colorName: color || null,
      size: size || null,
      // colorHex is not passed to addItem (app state) since CartItem doesn't allow it,
      // but you can use selectedColor?.color_hex here for any local logic
    });
  };

  return (
    <div className="">
      <div className=" flex items-start gap-4 py-3">
        <div className="flex flex-col gap-4 flex-1">
        {colors.length > 0 && (
          <fieldset className="flex flex-col items-start">
            <legend className="mb-2 text-[14px] font-medium">Color</legend>
            <div className="flex flex-wrap gap-4" aria-label="Product color">
              {colors.map((c, idx) => {
                const id = `color-${idx}`;
                const isSelected = color === c.color_name;
                return (
                  <div key={c.color_name} className="flex flex-col items-center">
                    <input
                      id={id}
                      type="radio"
                      name="color"
                      value={c.color_name}
                      checked={isSelected}
                      onChange={() => setColor(c.color_name)}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                    <label htmlFor={id} className="flex flex-col items-center cursor-pointer select-none">
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9999,
                          border: `2px solid ${ '#d1d5db'}`,
                          background: c.color_hex && /^#/.test(c.color_hex) ? c.color_hex : '#e4e4e4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'box-shadow .2s ease, border-color .2s ease',
                          boxShadow: isSelected ? '0 0 0 4px #1e1e1e' : 'none'
                        }}
                      />
                      <span style={{ marginTop: 4, fontSize: 12, fontWeight: isSelected ? 700 : 400, color: isSelected ? '#1e1e1e' : '#4b5563' }}>{c.color_name}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        {sizes.length > 0 && (
          <fieldset className="flex flex-col items-start">
            <legend className="mb-2 text-[14px] font-medium">Size</legend>
            <div className="flex flex-wrap gap-2" aria-label="Product size">
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
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                    <label htmlFor={id} className="cursor-pointer select-none"
                      style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        border: `1px solid ${isSelected ? '#000' : '#d1d5db'}`,
                        background: isSelected ? '#000' : '#fff',
                        color: isSelected ? '#fff' : '#374151',
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : 400,
                      }}
                    >{s}</label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}
        </div>



        <label className="flex flex-col gap-1 justify-start flex-1">
          <div className="mb-2 text-[14px] font-medium">Quantity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
            //   type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={{
                width: 35,
                height: 35,
                borderRadius: 9999,
                background: "#fff",
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                lineHeight: 1,
                // border: "none",
                cursor: "pointer",
                border: "1px solid #e5e7eb",
              }}
            >
              −
            </div>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                setQty(Number.isNaN(val) || val < 1 ? 1 : val);
              }}
              aria-label="Quantity"
              style={{
                width: 65,
                height: 35,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 16,
                background: "#fff",
                color: "#111",
                textAlign: "center",
              }}
            />
            <div
            //   type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              style={{
                width: 35,
                height: 35,
                borderRadius: 9999,
                background: "#fff",
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                lineHeight: 1,
                // border: "none",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
              }}
            >
              +
            </div>
          </div>
        </label>
      </div>

      <div className=" space-y-2.5 mt-8">
        <button type="button"
        className="border border-[#1e1e1e] text-[#ffffff] px-4 py-2 font-semibold w-full cursor-pointer bg-[#1e1e1e]  transition-all duration-300 text-[14px] flex-1 flex items-center justify-center gap-2" onClick={handleAddToCart}>
            <ShoppingCart size={16} />
            <span>
          Add to cart
            </span>
        </button>
        {/* <Link href="/cart" className="border border-[#1e1e1e] bg-[#1e1e1e] text-white px-4 py-2 font-medium hover:bg-white hover:text-[#1e1e1e] duration-300 text-center w-full flex items-center justify-center">

        View cart</Link> */}
      </div>
    </div>
  );
}
