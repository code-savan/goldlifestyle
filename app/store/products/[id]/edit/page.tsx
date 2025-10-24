import { getBaseUrl } from "@/lib/url";
import EditForm from "../EditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return <p style={{ color: "crimson" }}>Failed to load</p>;
  const { product } = await res.json();
  if (!product) return <p style={{ color: "crimson" }}>Not found</p>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link
          href={`/store/products/${id}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          <ArrowLeft size={16} />
          Back to Product
        </Link>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0, marginBottom: "4px" }}>
            Edit Product
          </h1>
          <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
            {product.name}
          </p>
        </div>
      </div>

      <div className="admin-table-section">
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
    </div>
  );
}
