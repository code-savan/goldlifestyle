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
  if (!res.ok) return <p className="text-red-600 text-[13px]">Failed to load product</p>;
  const { product: data } = await res.json();
  if (!data) return <p className="text-red-600 text-[13px]">Product not found</p>;
  const row = data as ProductDetailRow;
  const price = (row.amount_cents / 100).toFixed(2);
  const colors = (row.product_colors || []) as Array<{ id: string; color_name: string; color_hex: string | null; product_images?: Array<{ url: string }> }>;
  const images: Array<{ url: string }> = colors.flatMap((c) => c.product_images || []);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/store/products"
          className="flex items-center gap-2 text-black/50 text-[11px] font-light tracking-wider uppercase hover:text-black transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Products
        </Link>
      </div>

      <div className="admin-table-section">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-[24px] font-light tracking-[-0.01em] mb-2">{row.name}</h1>
            <p className="text-black/60 text-[15px] font-light">${price}</p>
          </div>
          <Link
            href={`/store/products/${id}/edit`}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors"
          >
            <Edit size={14} strokeWidth={1.5} />
            Edit Product
          </Link>
        </div>

        <div className="space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-3">Description</h3>
            <div
              className="text-[13px] text-black/70 font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.description) }}
            />
          </div>

          {/* Primary Image */}
          {row.primary_image_url && (
            <div>
              <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-3">Primary Image</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={row.primary_image_url}
                alt={row.name}
                className="w-52 h-40 object-cover border border-black/10"
              />
            </div>
          )}

          {/* Sizes */}
          {row.sizes.length > 0 && (
            <div>
              <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-3">Available Sizes</h3>
              <div className="flex gap-2 flex-wrap">
                {row.sizes.map((s) => (
                  <span
                    key={s}
                    className="border border-black/20 px-4 py-2 text-[11px] font-light tracking-wider uppercase"
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
              <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-3">Colors</h3>
              <div className="space-y-6">
                {colors.map((c, i) => (
                  <div key={c.id || i}>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="w-6 h-6 border border-black/20"
                        style={{ background: c.color_hex || "#999" }}
                      />
                      <span className="text-[13px] font-light text-black/70">{c.color_name}</span>
                    </div>
                    {(c.product_images || []).length > 0 ? (
                      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
                        {(c.product_images || []).map((img, j) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={j}
                            src={img.url}
                            alt={`${row.name} ${c.color_name}`}
                            className="w-full aspect-square object-cover border border-black/10"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-black/40">No images for this color</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Images */}
          {images.length > 0 && (
            <div>
              <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-3">Product Images</h3>
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.url}
                    alt={`${row.name} ${i + 1}`}
                    className="w-full aspect-square object-cover border border-black/10"
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
