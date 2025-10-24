"use client";
import { useEffect } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, totalCents, removeItem, updateQty } = useCart();

  useEffect(() => {
    const url = new URL(window.location.href);
    const add = url.searchParams.get("add");
    const color = url.searchParams.get("color");
    const size = url.searchParams.get("size");
    const name = url.searchParams.get("name");
    const price = url.searchParams.get("price");
    const img = url.searchParams.get("img");
    if (add && name && price) {
      // minimal add flow via query (from product page form)
      // price expected in cents
      // this block is optional; in production we would derive from API
    }
  }, []);

  if (items.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Your cart</h1>
        <p>No items in cart. <Link href="/products">Browse products</Link></p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 className="minimal-heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Your cart</h1>
      <ul style={{ display: "grid", gap: 12 }}>
        {items.map((it) => (
          <li key={`${it.id}-${it.colorName ?? ""}-${it.size ?? ""}`} className="card-min" style={{ display: "flex", gap: 12, alignItems: "center", padding: 12 }}>
            {it.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt={it.name} width={64} height={64} style={{ objectFit: "cover", borderRadius: 6 }} />
            ) : <div style={{ width: 64, height: 64, background: "#f3f3f3", borderRadius: 6 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{it.name}</div>
              <div style={{ color: "#666", fontSize: 12 }}>
                {it.colorName ? `Color: ${it.colorName} · ` : ""}
                {it.size ? `Size: ${it.size} · ` : ""}
                ${ (it.priceCents / 100).toFixed(2) }
              </div>
            </div>
            <input type="number" min={1} value={it.quantity} onChange={(e) => updateQty(it.id, Number(e.target.value), it.colorName ?? null, it.size ?? null)} style={{ width: 64 }} />
            <button className="btn-min" onClick={() => removeItem(it.id, it.colorName ?? null, it.size ?? null)}>Remove</button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <div style={{ fontWeight: 600 }}>Total: ${ (totalCents / 100).toFixed(2) }</div>
        <Link className="btn-min" href="/checkout">Checkout</Link>
      </div>
    </main>
  );
}
