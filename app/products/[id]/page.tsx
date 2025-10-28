import { getBaseUrl } from "@/lib/url";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCart from "./AddToCart";
import CommentsClient from "./CommentsClient";
import { sanitizeHtml } from "@/lib/sanitize";
// ProductCard not needed on detail page

type ProductApiImage = { url: string; color_name?: string | null };
type ProductApiColor = { color_name: string; color_hex: string | null; product_images?: ProductApiImage[] };
type ProductApi = {
  id: string;
  name: string;
  description: string;
  amount_cents: number;
  sizes: string[];
  product_colors: ProductApiColor[];
  primary_image_url?: string | null;
};

async function fetchProduct(id: string): Promise<ProductApi | null> {
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product as ProductApi;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) notFound();
  const price = (product.amount_cents / 100).toFixed(2);
  // With new schema, images are nested under each color
  const colors: ProductApiColor[] = product.product_colors || [];
  const sizes: string[] = product.sizes || [];

  // Group images by color
  const imagesByColor: Record<string, ProductApiImage[]> = colors.reduce(
    (acc: Record<string, ProductApiImage[]>, color: ProductApiColor) => {
    const colorName = color.color_name || 'default';
    if (!acc[colorName]) acc[colorName] = [];
      (color.product_images || []).forEach((img) => acc[colorName].push(img));
    return acc;
    },
    {}
  );
  const mainImageUrl: string | null =
    product.primary_image_url ||
    (imagesByColor.default && imagesByColor.default[0]?.url) ||
    (colors[0]?.product_images && colors[0]?.product_images[0]?.url) ||
    null;

  return (
    <main style={{ padding: 24 }}>
      {/* Top breadcrumb/anchor for subtle navigation (matches small chip on mock) */}
      <div style={{ marginBottom: 16 }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: "#6b7280", textDecoration: "none" }}>Products</Link>
          <span>/</span>
          <span style={{ color: "#374151", fontWeight: 500 }}>{product.name}</span>
        </nav>
      </div>

      <div className="responsive-two" style={{ alignItems: "start", gap: 32 }}>
        {/* Left: Single large product image */}
        <div>
          <div style={{ background: "#fafafa", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            {mainImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImageUrl} alt={product.name} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", aspectRatio: "1 / 1", background: "#eee" }} />
            )}
          </div>
        </div>

        {/* Right: Product content */}
        <div>
          <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
            <h1 className="font-semibold minimal-root text-[22px] uppercase">{product.name}</h1>
            <div className="text-black/85 font-semibold text-[20px] minimal-heading">${price}</div>
            <hr className="border-black/5" />
            <div
              className="text-black/70 text-[13px] leading-relaxed minimal-heading font-medium"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
            />
            {/* <hr className="border-black/5" /> */}
          </div>
          {/* <div style={{ height: 1, background: "#e5e7eb", margin: "12px 0 20px" }} /> */}

          <AddToCart
            product={{
              id,
              name: product.name,
              amountCents: product.amount_cents,
              imageUrl: mainImageUrl
            }}
            colors={colors}
            sizes={sizes}
          />
        </div>
      </div>

      {/* Other products */}
      {/* <section style={{ marginTop: 48 }}>
        <h3 className="minimal-heading" style={{ fontSize: "18px", fontWeight: "600" }}>Other Products</h3>
        <div style={{
          padding: "32px",
          textAlign: "center",
          color: "#6b7280",
          border: "1px dashed #d1d5db",
          borderRadius: "8px"
        }}>
          Other products will be displayed here
        </div>
      </section> */}

      <CommentsClient productId={id} />
    </main>
  );
}
