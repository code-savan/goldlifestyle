import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/url";
import { ArrowLeft, Edit } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

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
  product_colors?: Array<{
    id: string;
    color_name: string;
    color_hex: string | null;
    product_images?: Array<{ url: string; color_name?: string | null }>;
  }>;
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
  const colors = (row.product_colors || []) as Array<{ id: string; color_name: string; color_hex: string | null; product_images?: Array<{ url: string }> }>;
  // flatten all color-linked images for the generic gallery
  const images: Array<{ url: string }> = colors.flatMap((c) => c.product_images || []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link
          href="/store/products"
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
          Back to Products
        </Link>
      </div>

      <div className="admin-table-section">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0, marginBottom: "4px" }}>{row.name}</h1>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>${price}</p>
          </div>
          <Link
            href={`/store/products/${id}/edit`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#111",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "500",
              transition: "all 150ms ease",
              whiteSpace: "nowrap"
            }}
          >
            <Edit size={14} />
            Edit Product
          </Link>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          {/* Description */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>Description</h3>
            <div
              style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.description) }}
            />
          </div>

          {/* Primary Image */}
          {row.primary_image_url && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>Primary Image</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={row.primary_image_url}
                alt={row.name}
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}
              />
            </div>
          )}

          {/* Sizes */}
          {row.sizes.length > 0 && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>Available Sizes</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {row.sizes.map((s) => (
                  <span
                    key={s}
                    style={{
                      border: "1px solid #e5e7eb",
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: "#f9fafb"
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors with images */}
          {colors.length > 0 && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>Colors</h3>
              <div style={{ display: "grid", gap: 16 }}>
                {colors.map((c, i) => (
                  <div key={c.id || i}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: c.color_hex || "#999",
                          border: "2px solid #e5e7eb",
                          display: "inline-block"
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{c.color_name}</span>
                    </div>
                    {(c.product_images || []).length > 0 ? (
                      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
                        {(c.product_images || []).map((img, j) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={j} src={img.url} alt={`${row.name} ${c.color_name}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: "#6b7280" }}>No images for this color</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Images (flattened gallery) */}
          {images.length > 0 && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>Product Images</h3>
              <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.url}
                    alt={`${row.name} ${i + 1}`}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb"
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
