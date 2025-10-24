import Link from "next/link";

export default function StoreIndexPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Gold lifestyle Admin</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>Wear Style, Wear Confidence, Wear luxury</p>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link href="/store/overview">Overview</Link>
        <Link href="/store/products">Products</Link>
        <Link href="/store/orders">Orders</Link>
      </nav>
    </main>
  );
}
