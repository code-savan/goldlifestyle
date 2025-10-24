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
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
      <aside className="card-min" style={{ padding: 16, alignSelf: "start" }}>
        <div className="minimal-heading" style={{ fontWeight: 600, marginBottom: 12 }}>Filter</div>
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Search</div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Product name" />
          </label>
          <label>
            <div>Size</div>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">All</option>
              {allSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            <div>Color</div>
            <select value={color} onChange={(e) => setColor(e.target.value)}>
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
          <div style={{ color: "#666" }}>No products match your filters.</div>
        ) : (
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
