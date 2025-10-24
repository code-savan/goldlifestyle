import Link from "next/link";

export default function StoreIndexPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 className="minimal-heading" style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Admin</h1>
      <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/store/overview">Overview</Link>
        <Link href="/store/products">Products</Link>
        <Link href="/store/orders">Orders</Link>
      </nav>
    </main>
  );
}
