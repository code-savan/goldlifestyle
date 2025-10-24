import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Gold lifestyle",
  description: "Manage products and orders",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid rgba(28,28,28,.2)", padding: 16 }}>
        <a href="/" aria-label="Home" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Gold lifestyle" width={120} height={24} />
        </a>
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
