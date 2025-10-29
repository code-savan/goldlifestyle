"use client";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, totalCents, removeItem, updateQty } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-6 animate-fade-in-up">
          <h1 className="text-[32px] font-light tracking-[-0.01em] mb-4 text-black">Your Cart is Empty</h1>
          <p className="text-[15px] text-black/60 mb-8">
            Discover our curated collection and find pieces that speak to you.
          </p>
          <Link
            href="/products"
            className="inline-block border border-black px-8 py-3 text-[13px] tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="border-b border-black/10 pb-8 mb-8 animate-fade-in-down">
          <h1 className="text-[42px] font-light tracking-[-0.02em] mb-2 text-black">Shopping Cart</h1>
          <p className="text-[13px] text-black/50">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.colorName ?? ""}-${item.size ?? ""}`}
                  className="border border-black/10 p-6 group hover:border-black/20 transition-colors"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-32 h-40 bg-[#f9f9f9] shrink-0">
                      {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[15px] font-light mb-2 text-black">{item.name}</h3>
                        <div className="text-[13px] text-black/50 space-y-1">
                          {item.colorName && <p>Color: {item.colorName}</p>}
                          {item.size && <p>Size: {item.size}</p>}
                          <p className="text-black font-light">${(item.priceCents / 100).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-3 border border-black/10 px-3 py-2">
                          <button
                            onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1), item.colorName ?? null, item.size ?? null)}
                            className="hover:opacity-60 transition-opacity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-[13px] font-light min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1, item.colorName ?? null, item.size ?? null)}
                            className="hover:opacity-60 transition-opacity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id, item.colorName ?? null, item.size ?? null)}
                          className="text-[13px] text-black/40 hover:text-black transition-colors flex items-center gap-1"
                        >
                          <X size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-black/10 p-8 sticky top-24">
              <h2 className="text-[15px] tracking-[0.15em] uppercase font-light mb-6 pb-6 border-b border-black/10">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[13px]">
                  <span className="text-black/60">Subtotal</span>
                  <span className="font-light">${(totalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-black/60">Shipping</span>
                  <span className="font-light">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-6 border-t border-black/10 mb-8">
                <div className="flex justify-between text-[15px]">
                  <span className="font-light">Total</span>
                  <span className="font-light">${(totalCents / 100).toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center border border-black bg-black text-white px-8 py-4 text-[13px] tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full text-center text-[13px] tracking-wider uppercase text-black/60 hover:text-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
