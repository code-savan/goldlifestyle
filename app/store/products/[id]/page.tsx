import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/url";

function isValidUuid(value: string | undefined): value is string {
  if (!value) return false;
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

type ProductDetailRow = {
  id: string;
  name: string;
  description: string;
  amount_cents: number;
  sizes: string[];
  primary_image_url: string | null;
  product_images?: Array<{ url: string }>;
  product_colors?: Array<{ color_name: string; color_hex: string | null }>;
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    notFound();
  }
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return <p style={{ color: "crimson" }}>Failed to load product</p>;
  const { product: data } = await res.json();
  if (!data) return <p style={{ color: "crimson" }}>Product not found</p>;
  const row = data as ProductDetailRow;
  const price = (row.amount_cents / 100).toFixed(2);
  const colors: Array<{ color_name: string; color_hex: string | null }> = row.product_colors || [];
  const colorNames = new Set(colors.map(c => c.color_name));
  const images: Array<{ url: string }> = (row.product_images || []).filter((img: any) => !img.color_name || colorNames.has(img.color_name));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>{row.name}</h1>
        <Link href={`/store/products/${id}/edit`}>Edit</Link>
      </div>
      <p style={{ color: "#666" }}>${price}</p>
      <p style={{ marginTop: 8 }}>{row.description}</p>
      <div style={{ marginTop: 12 }}>
        {row.primary_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.primary_image_url} alt={row.name} width={360} height={270} style={{ objectFit: "cover", borderRadius: 8 }} />
        ) : null}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {row.sizes.map((s) => (
          <span key={s} style={{ border: "1px solid #ddd", padding: "2px 8px", borderRadius: 999 }}>{s}</span>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {colors.map((c, i) => (
          <span key={i} title={c.color_name} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 999, background: c.color_hex || "#999", border: "1px solid #ddd" }} />
            {c.color_name}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={img.url} alt={row.name} width={320} height={240} style={{ objectFit: "cover", width: "100%", aspectRatio: "4 / 3", borderRadius: 8 }} />
        ))}
      </div>
    </div>
  );
}
