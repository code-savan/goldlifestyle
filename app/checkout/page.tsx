"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { useToast } from "@/components/Toast";

const SHIPPING_KEY = "gold_shipping_v1";

export default function CheckoutPage() {
  const { items, totalCents } = useCart();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SHIPPING_KEY);
      if (raw) setShipping(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(SHIPPING_KEY, JSON.stringify(shipping)); } catch {}
  }, [shipping]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to init");
      if (json.paymentLink) {
        window.location.href = json.paymentLink;
      } else {
        window.location.href = json.redirectUrl;
      }
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message || "Please try again", variant: "error" });
      setPending(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-[32px] font-light tracking-[-0.01em] mb-4 text-black">Your Cart is Empty</h1>
          <p className="text-[15px] text-black/60 mb-8">
            Add items to your cart before proceeding to checkout.
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
        <div className="border-b border-black/10 pb-8 mb-12">
          <h1 className="text-[42px] font-light tracking-[-0.02em] mb-2 text-black">Checkout</h1>
          <p className="text-[13px] text-black/50">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <form onSubmit={onSubmit} className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-[15px] tracking-[0.15em] uppercase font-light mb-6 pb-4 border-b border-black/10">
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                    Full Name *
                  </label>
                  <input
                    value={shipping.fullName}
                    onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
                    required
                    className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                    required
                    className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                    required
                    className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-[15px] tracking-[0.15em] uppercase font-light mb-6 pb-4 border-b border-black/10">
                Shipping Address
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                    Address *
                  </label>
                  <input
                    value={shipping.address}
                    onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                    required
                    className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                      City *
                    </label>
                    <input
                      value={shipping.city}
                      onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                      required
                      className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                      State / Province *
                    </label>
                    <input
                      value={shipping.state}
                      onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                      required
                      className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                      Postal Code *
                    </label>
                    <input
                      value={shipping.postalCode}
                      onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                      required
                      className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">
                      Country *
          </label>
                    <input
                      value={shipping.country}
                      onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
                      required
                      className="w-full border border-black/10 px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full border border-black bg-black text-white px-8 py-4 text-[13px] tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Processing..." : "Continue to Payment"}
            </button>
      </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-black/10 p-8 sticky top-24">
              <h2 className="text-[15px] tracking-[0.15em] uppercase font-light mb-6 pb-6 border-b border-black/10">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.colorName ?? ""}-${item.size ?? ""}`}
                    className="flex justify-between text-[13px]"
                  >
                    <div className="flex-1">
                      <p className="font-light text-black">{item.name}</p>
                      <p className="text-black/50 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-light">${((item.priceCents * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-black/10">
                <div className="flex justify-between text-[13px]">
                  <span className="text-black/60">Subtotal</span>
                  <span className="font-light">${(totalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-black/60">Shipping</span>
                  <span className="font-light">Calculated at next step</span>
                </div>
              </div>

              <div className="flex justify-between text-[15px]">
                <span className="font-light">Total</span>
                <span className="font-light">${(totalCents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
