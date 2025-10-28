"use client";
import React, { useMemo, useState } from "react";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import { useCart } from "./CartContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function FloatingCartButton() {
  const pathname = usePathname();
  // Hide on /store routes
  if (pathname?.startsWith("/store")) return null;
  return <FloatingCartButtonInner />;
}

function FloatingCartButtonInner() {
  const { items, totalCents, updateQty, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const total = useMemo(() => (totalCents / 100).toFixed(2), [totalCents]);
  const { toast } = useToast();
  const itemCount = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        className="fixed right-6 bottom-6 w-14 h-14 bg-black text-white flex items-center justify-center z-45 hover:bg-black/80 transition-colors group"
      >
        <ShoppingBag size={20} strokeWidth={1.5} />
        {itemCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] font-light border border-white">
            {itemCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />

          {/* Cart Drawer */}
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="border-b border-black/10 px-6 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] tracking-[0.15em] uppercase font-light">Shopping Bag</h2>
                <p className="text-[11px] text-black/40 mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="hover:opacity-60 transition-opacity"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[13px] text-black/50">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.id}-${item.colorName || "_"}-${item.size || "_"}-${idx}`}
                      className="border-b border-black/10 pb-6"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-24 bg-[#f9f9f9] shrink-0">
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[13px] font-light mb-1 truncate">{item.name}</h3>
                          <div className="text-[11px] text-black/50 space-y-0.5">
                            {item.colorName && <p>Color: {item.colorName}</p>}
                            {item.size && <p>Size: {item.size}</p>}
                          </div>
                          <p className="text-[13px] font-light mt-2">${(item.priceCents / 100).toFixed(2)}</p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3 border border-black/10 px-2 py-1">
                              <button
                                onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1), item.colorName, item.size)}
                                className="hover:opacity-60 transition-opacity"
                              >
                                <Minus size={12} strokeWidth={1.5} />
                              </button>
                              <span className="text-[11px] font-light min-w-[16px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQty(item.id, item.quantity + 1, item.colorName, item.size)}
                                className="hover:opacity-60 transition-opacity"
                              >
                                <Plus size={12} strokeWidth={1.5} />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                removeItem(item.id, item.colorName, item.size);
                                toast({ title: "Removed from cart", description: item.name });
                              }}
                              className="text-[11px] text-black/40 hover:text-black transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-black/10 px-6 py-6 bg-white">
                <div className="flex justify-between mb-6">
                  <span className="text-[13px] font-light">Subtotal</span>
                  <span className="text-[15px] font-light">${total}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center border border-black bg-black text-white py-4 text-[13px] tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center mt-3 text-[11px] tracking-wider uppercase text-black/60 hover:text-black transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
