"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui";

type Product = { id: string; name: string; amountCents: number; previewImageUrl?: string | null; sizes?: string[]; product_colors?: Array<{ color_name: string }> };

export default function ClientProducts({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes || []))), [products]);
  const allColors = useMemo(() => Array.from(new Set(products.flatMap((p) => (p.product_colors || []).map((c) => c.color_name)))), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (size && !(p.sizes || []).includes(size)) return false;
      if (color && !(p.product_colors || []).some((c) => c.color_name === color)) return false;
      return true;
    });
  }, [products, query, size, color]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid" style={{ gridTemplateColumns: "220px 1fr", gap: 16 }}>
        <aside className="card-min" style={{ padding: 16, alignSelf: "start" }}>
          <div className="minimal-heading" style={{ fontWeight: 600, marginBottom: 10 }}>Filter</div>
          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="text-xs text-gray-600">Search</span>
              <input className="hover-dim" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Product name" />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="text-xs text-gray-600">Size</span>
              <select className="hover-dim" value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">All</option>
                {allSizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="text-xs text-gray-600">Color</span>
              <select className="hover-dim" value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="">All</option>
                {allColors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        </aside>
        <section>
          {filtered.length === 0 ? (
            <div style={{ color: "#6b7280" }}>No products match your filters.</div>
          ) : (
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
