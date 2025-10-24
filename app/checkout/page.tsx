"use client";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";

const SHIPPING_KEY = "gold_shipping_v1";

export default function CheckoutPage() {
  const { items, totalCents, clear } = useCart();
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
    try {
      const res = await fetch("/api/orders/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items, shipping }) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to init");
      if (json.paymentLink) {
        window.location.href = json.paymentLink; // go to Flutterwave hosted link
      } else {
        // fallback: direct success (useful in dev without keys)
        window.location.href = json.redirectUrl;
      }
      // Do NOT clear cart here; we will clear only on success page if needed
    } catch (err) {}
  };

  if (items.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1 className="minimal-heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Checkout</h1>
        <p>Your cart is empty. <Link href="/products">Add items</Link></p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <div className="responsive-two">
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <h1 className="minimal-heading" style={{ fontSize: 22, fontWeight: 700 }}>Shipping</h1>
        {Object.entries(shipping).map(([k, v]) => (
          <label key={k}>
            <div style={{ textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1").trim()}</div>
            <input value={v as string} onChange={(e) => setShipping((s) => ({ ...s, [k]: e.target.value }))} required />
          </label>
        ))}
        <button className="btn-min" type="submit">Pay with Flutterwave</button>
      </form>
      <aside>
        <h2 className="minimal-heading" style={{ fontWeight: 700, marginBottom: 8 }}>Order summary</h2>
        <ul style={{ display: "grid", gap: 8 }}>
          {items.map((it) => (
            <li key={`${it.id}-${it.colorName ?? ""}-${it.size ?? ""}`} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{it.name} × {it.quantity}</span>
              <span>${((it.priceCents * it.quantity) / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 600 }}>
          <span>Total</span>
          <span>${(totalCents / 100).toFixed(2)}</span>
        </div>
      </aside>
      </div>
    </main>
  );
}
