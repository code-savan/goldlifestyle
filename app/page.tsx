import { getBaseUrl } from "@/lib/url";
import Image from "next/image";
import Link from "next/link";

type ProductListItem = { id: string; name: string; amountCents: number; previewImageUrl?: string | null };

async function fetchProducts(): Promise<{ products: ProductListItem[] }> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" });
    if (!res.ok) return { products: [] };
    const data = await res.json();
    return { products: data.products as ProductListItem[] };
  } catch {
    return { products: [] };
  }
}

export default async function Home() {
  const { products } = await fetchProducts();
  const featured = products.slice(0, 6);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2c2c2b9d] z-5" />
        <Image src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070" alt="Mockup"  className="w-full h-full object-cover absolute inset-0" width={1920} height={1080} />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-3 text-xs tracking-[0.2em] uppercase text-white/60">New Collection</div>
          <h1 className="text-[48px] md:text-[72px] font-light tracking-[-0.02em] leading-[1.1] mb-6 text-white">
            Timeless Elegance
          </h1>
          <p className="text-[15px] text-white/70 mb-10 max-w-lg mx-auto leading-relaxed">
            Discover curated pieces that transcend trends. Crafted with precision, designed for longevity.
          </p>
          <Link href="/products" className="inline-block border border-white px-8 py-3 text-[13px] tracking-widest uppercase hover:bg-white hover:text-black text-white transition-all duration-300">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-[13px] tracking-[0.2em] uppercase text-black/60 mb-3">Featured</h2>
              <p className="text-[32px] font-light tracking-[-0.01em] text-black">Seasonal Highlights</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-stagger">
              {featured.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative aspect-3/4 bg-[#f9f9f9] mb-4 overflow-hidden flex items-center justify-center">
                    {product.previewImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.previewImageUrl}
                        alt={product.name}
                        className="w-[90%] h-[90%] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-light tracking-wide text-black group-hover:text-black/60 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[13px] text-black/50">${(product.amountCents / 100).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link href="/products" className="inline-block border-b border-black text-[13px] tracking-widest uppercase hover:border-black/40 transition-colors pb-1">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Arrivals */}
      {products.length > 0 && (
        <section className="py-20 px-6 border-t border-black/10">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-[13px] tracking-[0.2em] uppercase text-black/60 mb-3">New In</h2>
              <p className="text-[32px] font-light tracking-[-0.01em] text-black">Latest Arrivals</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 animate-stagger">
              {products.slice(-4).reverse().map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="relative aspect-square bg-[#f9f9f9] border border-black/10 mb-4 overflow-hidden flex items-center justify-center">
                    {product.previewImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.previewImageUrl}
                        alt={product.name}
                        className="w-[90%] h-[90%] object-cover group-hover:opacity-80 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/20 text-[11px] tracking-wider uppercase">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-light tracking-wide text-black group-hover:text-black/60 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[13px] text-black/50">${(product.amountCents / 100).toFixed(2)}</p>
                  </div>
                </Link>
          ))}
        </div>
          </div>
        </section>
      )}

      {/* Editorial Section */}
      <section className="py-20 bg-[#f5f5f0]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fade-in-up">
            <div className="order-2 md:order-1">
              <h2 className="text-[36px] font-light tracking-[-0.01em] leading-[1.2] mb-6 text-black">
                Crafted for the Modern Individual
              </h2>
              <p className="text-[15px] text-black/70 leading-relaxed mb-8">
                Every piece in our collection is thoughtfully designed to merge functionality with refined aesthetics.
                We believe in quality over quantity, creating garments that stand the test of time.
              </p>
              <Link href="/products" className="inline-block border-b border-black text-[13px] tracking-widest uppercase hover:border-black/40 transition-colors pb-1">
                Discover More
              </Link>
            </div>
            <div className="order-1 md:order-2 aspect-4/3 bg-white" >
            <Image src="/hero-mockup.png" alt="Mockup" className="w-full h-full object-contain" width={500} height={500} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
