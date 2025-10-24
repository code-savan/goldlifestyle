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

export function ProductCard({ product }: { product: { id: string; name: string; amountCents: number; previewImageUrl?: string | null } }) {
  return (
    <div className="card-min" style={{ padding: 16 }}>
      <a href={`/products/${product.id}`}>
        {product.previewImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.previewImageUrl} alt={product.name} style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", aspectRatio: "3 / 4", background: "#fff" }} />
        )}
      </a>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div>
          <div className="minimal-heading" style={{ fontWeight: 600, fontSize: 16 }}>{product.name}</div>
          <div style={{ color: "#666", fontSize: 12 }}>${(product.amountCents / 100).toFixed(2)}</div>
        </div>
        <AddToCartIconButton id={product.id} name={product.name} amountCents={product.amountCents} imageUrl={product.previewImageUrl || null} />
      </div>
    </div>
  );
}

export function Navbar() {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottom: "1px solid rgba(28,28,28,.2)" }}>
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
      <a href="/" aria-label="Home" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Gold lifestyle" width={120} height={24} />
      </a>
      <nav style={{ display: "flex", gap: 16 }}>
        <a href="/products">Products</a>
        <a href="/cart">Cart</a>
      </nav>
        </div>
    </header>
  );
}
