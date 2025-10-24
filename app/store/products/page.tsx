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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Products</h1>
        <Link href="/store/products/new">Add product</Link>
      </div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {products.map((p) => (
          <li key={p.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {p.previewImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.previewImageUrl} alt={p.name} width={56} height={56} style={{ objectFit: "cover", borderRadius: 6 }} />
              ) : (
                <div style={{ width: 56, height: 56, background: "#f3f3f3", borderRadius: 6 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: "#666", fontSize: 12 }}>${(p.amountCents / 100).toFixed(2)} · {p.colorsCount} colors · {p.sizesCount} sizes</div>
              </div>
              <Link href={`/store/products/${p.id}`}>Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
