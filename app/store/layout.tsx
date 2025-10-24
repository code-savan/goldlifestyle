import Link from "next/link";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: 16 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Gold lifestyle</h2>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link href="/store/overview">Overview</Link>
          <Link href="/store/products">Products</Link>
          <Link href="/store/orders">Orders</Link>
        </nav>
      </aside>
      <section style={{ padding: 24 }}>{children}</section>
    </div>
  );
}
