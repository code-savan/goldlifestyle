import { getBaseUrl } from "@/lib/url";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCart from "./AddToCart";
import CommentsClient from "./CommentsClient";
import { sanitizeHtml } from "@/lib/sanitize";
import SizeGuideModal from "./SizeGuideModal";

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
    <main className="max-w-[1600px] mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-12">
        <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-black/40">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          <span>/</span>
          <span className="text-black/60">{product.name}</span>
        </div>
      </nav>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
        {/* Left: Product Image */}
        <div className="w-full">
          <div className="bg-[#f9f9f9] border border-black/10 aspect-square relative overflow-hidden">
            {mainImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/20 text-[13px] tracking-wider uppercase">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col">
          {/* Product Title & Price */}
          <div className="mb-8 pb-8 border-b border-black/10">
            <h1 className="text-[36px] md:text-[42px] font-light tracking-[-0.02em] mb-4 text-black leading-tight">
              {product.name}
            </h1>
            <p className="text-[24px] font-light text-black">
              ${price}
            </p>
          </div>

          {/* Description */}
          <div className="mb-8 pb-8 border-b border-black/10">
            <div
              className="text-[14px] leading-relaxed text-black/70 font-light product-description"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
            />
          </div>

          {/* Size Guide Link */}
          <div className="mb-8">
            <SizeGuideModal />
          </div>

          {/* Add to Cart Section */}
          <div className="flex-1">
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

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-black/10 space-y-4">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-[13px] tracking-wider uppercase text-black/60 hover:text-black transition-colors py-2">
                <span>Shipping & Returns</span>
                <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-[13px] leading-relaxed text-black/60 font-light">
                <p className="mb-2 uppercase font-medium">Free shipping.</p>
                <p>30-day returns. Items must be unworn and in original condition.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-[13px] tracking-wider uppercase text-black/60 hover:text-black transition-colors py-2">
                <span>Product Details</span>
                <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-[13px] leading-relaxed text-black/60 font-light">
                <p>Premium quality materials crafted with attention to detail.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-black/10 pt-16">
        <CommentsClient productId={id} />
      </div>
    </main>
  );
}
