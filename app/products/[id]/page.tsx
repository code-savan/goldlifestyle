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
  // With new schema, images are nested under each color
  const colors: Array<{ color_name: string; color_hex: string | null; product_images?: Array<{ url: string; color_name?: string | null }> }> = product.product_colors || [];
  const images: Array<{ url: string; color_name?: string | null }> = colors.flatMap((c: any) => c.product_images || []);
  const sizes: string[] = product.sizes || [];

  // Group images by color
  const imagesByColor = colors.reduce((acc: any, color: any) => {
    const colorName = color.color_name || 'default';
    if (!acc[colorName]) acc[colorName] = [];
    (color.product_images || []).forEach((img: any) => acc[colorName].push(img));
    return acc;
  }, {});

  return (
    <main style={{ padding: 24 }}>
      <div className="responsive-two">
        <div>
          {/* Primary Product Image */}
          {product.primary_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.primary_image_url} alt={product.name} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }} />
          ) : null}

          {/* Color-specific Images */}
          {colors.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#111" }}>Available Colors</h3>
              <div style={{ display: "grid", gap: "20px" }}>
                {colors.map((color: any, i: number) => {
                  const colorImages = imagesByColor[color.color_name] || [];
                  return (
                    <div key={i} style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "16px",
                      background: "#fafafa"
                    }}>
                      {/* Color Info */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <div style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: color.color_hex || "#999",
                          border: "2px solid #e5e7eb"
                        }} />
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "#111" }}>
                          {color.color_name}
                        </span>
                      </div>

                      {/* Color Images */}
                      {colorImages.length > 0 ? (
                        <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}>
                          {colorImages.map((img: any, imgIndex: number) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={imgIndex}
                              src={img.url}
                              alt={`${product.name} in ${color.color_name}`}
                              style={{
                                width: "100%",
                                aspectRatio: "1",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #e5e7eb"
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#6b7280",
                          fontSize: "12px",
                          border: "1px dashed #d1d5db",
                          borderRadius: "6px"
                        }}>
                          No images available for this color
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Product Images (not color-specific) */}
          {imagesByColor.default && imagesByColor.default.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#111" }}>Additional Images</h3>
              <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
                {imagesByColor.default.map((img: any, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.url}
                    alt={product.name}
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb"
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>{product.name}</h1>
            <p style={{ color: "#666", fontSize: "18px", fontWeight: "500" }}>${price}</p>
            <p style={{ marginTop: 12, color: "#374151", lineHeight: "1.6" }}>{product.description}</p>
          </div>

          <AddToCart
            product={{
              id,
              name: product.name,
              amountCents: product.amount_cents,
              imageUrl: product.primary_image_url
            }}
            colors={colors}
            sizes={sizes}
          />
        </div>
      </div>

      {/* Other products */}
      <section style={{ marginTop: 48 }}>
        <h3 className="minimal-heading" style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#111" }}>Other Products</h3>
        <div style={{
          padding: "32px",
          textAlign: "center",
          color: "#6b7280",
          border: "1px dashed #d1d5db",
          borderRadius: "8px"
        }}>
          Other products will be displayed here
        </div>
      </section>

      <CommentsClient productId={id} />
    </main>
  );
}
