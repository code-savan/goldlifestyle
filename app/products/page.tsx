import ClientProducts from "./ClientProducts";
import { getBaseUrl } from "@/lib/url";

async function fetchProducts() {
  const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" });
  if (!res.ok) return { products: [] as any[] };
  const data = await res.json();
  return { products: data.products as any[] };
}

export default async function StorefrontProductsPage() {
  const { products } = await fetchProducts();
  return (
    <main style={{ padding: 24 }}>
      <h1 className="minimal-heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>All products</h1>
      <ClientProducts products={products as any[]} />
    </main>
  );
}
