import { ProductCard, Skeleton, EmptyState } from "@/components/ui";
import { getBaseUrl } from "@/lib/url";
import Hero from "@/components/Hero";

async function fetchProducts() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" });
    if (!res.ok) return { products: [], error: `Failed: ${res.status}` };
    const data = await res.json();
    return { products: data.products as any[] };
  } catch (e) {
    return { products: [], error: "Network error" };
  }
}

export default async function Home() {
  const { products } = await fetchProducts();
  return (
    <main style={{ padding: 24 }}>
      <Hero />
      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Please check back later." />
      ) : (
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
