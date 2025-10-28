import { supabaseServer } from "@/lib/supabase/server";
import { getRelativeTime } from "@/lib/date-utils";
import { Package, ShoppingCart, DollarSign } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const sb = supabaseServer();

  // Fetch comprehensive data
  const [
    { data: orders },
    { data: products },
    { data: recentOrders }
  ] = await Promise.all([
    sb.from("orders").select("id, total_cents, status, created_at, shipping, items"),
    sb.from("products").select("id, name, amount_cents"),
    sb.from("orders")
      .select("id, total_cents, status, created_at, shipping")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;

  // Calculate total revenue from all orders
  const totalRevenue = (orders || []).reduce((s, o: {total_cents?: number}) => s + (o.total_cents || 0), 0);

  return (
    <div>
      <h1 className="text-[24px] font-light tracking-[-0.01em] mb-12">Overview</h1>

      {/* Metrics Grid */}
      <div className="metric-grid">
        <div className="metric-card primary">
          <div className="metric-header">
            <span className="metric-title">Total Products</span>
            <Package size={20} strokeWidth={1.5} />
          </div>
          <div className="metric-value">{totalProducts.toLocaleString()}</div>
          <div className="metric-change">
            <span>Active listings</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Orders</span>
            <ShoppingCart size={20} strokeWidth={1.5} color="rgba(0,0,0,0.6)" />
          </div>
          <div className="metric-value">{totalOrders.toLocaleString()}</div>
          <div className="metric-change">
            <span>All time</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Revenue</span>
            <DollarSign size={20} strokeWidth={1.5} color="rgba(0,0,0,0.6)" />
          </div>
          <div className="metric-value">${(totalRevenue / 100).toLocaleString()}</div>
          <div className="metric-change">
            <span>Total sales</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-table-section table-responsive">
        <div className="table-header">
          <h2 className="table-title">Recent Orders</h2>
          <Link href="/store/orders" className="view-all-link">
            View All →
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Invoice</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(recentOrders || []).map((order: {id: string; shipping?: {fullName?: string; name?: string}; created_at: string; status: string; total_cents: number}) => (
              <tr key={order.id}>
                <td>
                  <span>{order.shipping?.name || order.shipping?.fullName || "Anonymous Customer"}</span>
                </td>
                <td className="font-light">#{order.id.slice(0, 6).toUpperCase()}</td>
                <td className="text-black/50">{getRelativeTime(order.created_at)}</td>
                <td>
                  <span className={`inline-block px-3 py-1 text-[11px] tracking-wider uppercase border ${
                    order.status === "completed"
                      ? "bg-black text-white border-black"
                      : order.status === "pending"
                      ? "bg-transparent text-black/60 border-black/20"
                      : "bg-transparent text-black/40 border-black/10"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="font-light">${(order.total_cents / 100).toFixed(2)}</td>
              </tr>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-black/40 text-[13px]">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
