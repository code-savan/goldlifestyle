import { getBaseUrl } from "@/lib/url";
import { notFound } from "next/navigation";
import AddToCart from "./AddToCart";
import CommentsClient from "./CommentsClient";
import { ProductCard } from "@/components/ui";

async function fetchProduct(id: string) {
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product as any;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) notFound();
  const price = (product.amount_cents / 100).toFixed(2);
  const colors: Array<{ color_name: string; color_hex: string | null }> = product.product_colors || [];
  const colorNames = new Set(colors.map((c: any) => c.color_name));
  const images: Array<{ url: string; color_name?: string | null }> = (product.product_images || []).filter((img: any) => !img.color_name || colorNames.has(img.color_name));
  const sizes: string[] = product.sizes || [];

  return (
    <main style={{ padding: 24 }}>
      <div className="responsive-two">
        <div>
          {product.primary_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.primary_image_url} alt={product.name} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }} />
          ) : null}
          <div style={{ marginTop: 12, display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
            {images.map((img: any, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img.url} alt={product.name} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }} />
            ))}
          </div>
        </div>
        <AddToCart product={{ id, name: product.name, amountCents: product.amount_cents, imageUrl: product.primary_image_url }} colors={colors} sizes={sizes} />
        <div style={{ marginTop: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{product.name}</h1>
          <p style={{ color: "#666" }}>${price}</p>
          <p style={{ marginTop: 8 }}>{product.description}</p>
        </div>
      </div>

      {/* Other products */}
      <section style={{ marginTop: 32 }}>
        <h3 className="minimal-heading" style={{ fontWeight: 600, marginBottom: 12 }}>Other products</h3>
        {colors.length === 0 && sizes.length === 0 ? null : null}
        {/* Reuse first page list fetch */}
        {/* eslint-disable-next-line react/jsx-no-undef */}
      </section>

      <CommentsClient productId={id} />
    </main>
  );
}
