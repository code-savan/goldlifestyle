import Link from "next/link";
import { getBaseUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

async function fetchProducts() {
  const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" });
  if (!res.ok) {
    return { products: [], error: `Failed: ${res.status}` };
  }
  const json = await res.json();
  return { products: json.products as Array<{ id: string; name: string; amountCents: number; previewImageUrl: string | null; colorsCount: number; sizesCount: number }>, error: undefined as string | undefined };
}

export default async function ProductsPage() {
  const { products, error } = await fetchProducts();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h1 className="minimal-heading" style={{ fontSize: 20, fontWeight: 600 }}>Products</h1>
        <Link className="btn-min" href="/store/products/new">Add product</Link>
      </div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {products.map((p) => (
          <li key={p.id} className="card-min" style={{ padding: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {p.previewImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.previewImageUrl} alt={p.name} width={56} height={56} style={{ objectFit: "cover" }} />
              ) : (
                <div style={{ width: 56, height: 56, background: "#f3f3f3" }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: "#666", fontSize: 12 }}>${(p.amountCents / 100).toFixed(2)} · {p.colorsCount} colors · {p.sizesCount} sizes</div>
              </div>
              <Link className="btn-min" href={`/store/products/${p.id}`}>Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
