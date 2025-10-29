import { getBaseUrl } from "@/lib/url";
import Link from "next/link";

type ProductListItem = { id: string; name: string; amountCents: number; previewImageUrl?: string | null; sizes?: string[]; product_colors?: Array<{ color_name: string }> };

async function fetchProducts(): Promise<{ products: ProductListItem[] }> {
  const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" });
  if (!res.ok) return { products: [] };
  const data = await res.json();
  return { products: data.products as ProductListItem[] };
}

export default async function StorefrontProductsPage() {
  const { products } = await fetchProducts();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="border-b border-black/10 animate-fade-in-down">
        <div className="max-w-[1600px] mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-[42px] md:text-[56px] font-light tracking-[-0.02em] leading-[1.1] mb-4 text-black">
              Complete Collection
            </h1>
            <p className="text-[15px] text-black/60 leading-relaxed">
              Explore our entire range of meticulously crafted pieces. Each item represents our commitment to timeless design and exceptional quality.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-[1600px] mx-auto px-6">
          {products.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-[15px] text-black/50">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-stagger">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative aspect-3/4 bg-[#f9f9f9] mb-4 overflow-hidden flex items-center justify-center">
                    {product.previewImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.previewImageUrl}
                        alt={product.name}
                        className="w-[90%] h-[90%] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/20 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-light tracking-wide text-black group-hover:text-black/60 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] text-black/50">${(product.amountCents / 100).toFixed(2)}</p>
                      {product.sizes && product.sizes.length > 0 && (
                        <p className="text-[11px] text-black/40 uppercase tracking-wider">
                          {product.sizes.length} {product.sizes.length === 1 ? 'size' : 'sizes'}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
