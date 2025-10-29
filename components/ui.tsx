export function Skeleton({ height = 16, width = "100%", style = {} as React.CSSProperties }) {
  return <div style={{ background: "#f3f3f3", borderRadius: 8, height, width, ...style }} />;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      {description ? <p style={{ marginBottom: 12 }}>{description}</p> : null}
      {action}
    </div>
  );
}

import AddToCartIconButton from "@/components/AddToCartIconButton";
import { Hamburger, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product }: { product: { id: string; name: string; amountCents: number; previewImageUrl?: string | null } }) {
  return (
    <div className="card-min hover-dim" style={{ padding: 16 }}>
      <a href={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {product.previewImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.previewImageUrl} alt={product.name} style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", aspectRatio: "3 / 4", background: "#f9fafb" }} />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <div>
            <div className="minimal-heading" style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>${(product.amountCents / 100).toFixed(2)}</div>
          </div>
          <AddToCartIconButton id={product.id} name={product.name} amountCents={product.amountCents} imageUrl={product.previewImageUrl || null} />
        </div>
      </a>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="border-b border-black/10 bg-white sticky top-0 z-40">
        {/* <div className="bg-black text-white flex items-center justify-center mx-auto text-[12px]">
            front
        </div> */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="md:text-[15px] text-[13px] tracking-[0.15em] uppercase md:font-light font-medium hover:text-black/60 transition-colors">
          Gold Lifestyle
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/products" className="text-[13px] tracking-wider uppercase hover:text-black/60 transition-colors">
            Collection
          </Link>
          <Link href="/cart" className="text-[13px] tracking-wider uppercase hover:text-black/60 transition-colors">
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white mt-20">
      <div className="max-w-[1600px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-[15px] tracking-[0.15em] uppercase font-light mb-4">Gold Lifestyle</h3>
            <p className="text-[13px] text-black/60 leading-relaxed max-w-md">
              Timeless pieces crafted for the modern individual. Quality, design, and sustainability at the heart of everything we create.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] tracking-widest uppercase text-black/40 mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-[13px] hover:text-black/60 transition-colors">All Products</Link></li>
              <li><Link href="/products" className="text-[13px] hover:text-black/60 transition-colors">New Arrivals</Link></li>
              <li><Link href="/products" className="text-[13px] hover:text-black/60 transition-colors">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-widest uppercase text-black/40 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[13px] hover:text-black/60 transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-[13px] hover:text-black/60 transition-colors">Shipping</Link></li>
              <li><Link href="#" className="text-[13px] hover:text-black/60 transition-colors">Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-black/40">© 2025 Gold Lifestyle. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-[11px] text-black/40 hover:text-black/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-[11px] text-black/40 hover:text-black/60 transition-colors">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
