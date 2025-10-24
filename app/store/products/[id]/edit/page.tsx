import { getBaseUrl } from "@/lib/url";
import EditForm from "../EditForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return <p style={{ color: "crimson" }}>Failed to load</p>;
  const { product } = await res.json();
  if (!product) return <p style={{ color: "crimson" }}>Not found</p>;
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Edit product</h1>
      <EditForm
        id={product.id}
        name={product.name}
        description={product.description}
        amountCents={product.amount_cents}
        sizes={product.sizes}
        primaryImageUrl={product.primary_image_url}
        colors={product.product_colors || []}
        images={product.product_images || []}
      />
    </div>
  );
}
