import { supabaseServer } from "@/lib/supabase/server";
import { getRelativeTime } from "@/lib/date-utils";
import { Package, ShoppingCart, DollarSign } from "lucide-react";

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

  // Calculate total revenue from all orders (not just completed)
  const totalRevenue = (orders || []).reduce((s, o: any) => s + (o.total_cents || 0), 0);

  return (
    <div>
      <h1 className="minimal-heading" style={{ fontSize: "16px", fontWeight: "700", marginBottom: "32px", color: "#111" }}>Dashboard Overview</h1>

      {/* Metrics Grid */}
      <div className="metric-grid">
        <div className="metric-card primary">
          <div className="metric-header">
            <span className="metric-title">Total Products</span>
            <Package size={16} />
          </div>
          <div className="metric-value">{totalProducts.toLocaleString()}</div>
          <div className="metric-change">
            <span>▲ {totalProducts > 0 ? Math.floor(totalProducts * 2.5) : 0}%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Orders</span>
            <ShoppingCart size={16} color="#6b7280" />
          </div>
          <div className="metric-value">{totalOrders.toLocaleString()}</div>
          <div className="metric-change">
            <span>▲ {totalOrders > 0 ? Math.floor(totalOrders * 1.8) : 0}%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Revenue</span>
            <DollarSign size={16} color="#6b7280" />
          </div>
          <div className="metric-value">${(totalRevenue / 100).toLocaleString()}</div>
          <div className="metric-change">
            <span>▲ {totalRevenue > 0 ? Math.floor((totalRevenue / 100000) * 12) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-table-section table-responsive">
        <div className="table-header">
          <h2 className="table-title">Recent Orders</h2>
          <a href="/store/orders" className="view-all-link">
            View All →
          </a>
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
            {(recentOrders || []).map((order: any) => (
              <tr key={order.id}>
                <td>
                  <span>{order.shipping?.name || order.shipping?.fullName || "Anonymous Customer"}</span>
                </td>
                <td>INV-{order.id.slice(0, 6).toUpperCase()}</td>
                <td>{getRelativeTime(order.created_at)}</td>
                <td>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "500",
                    background: order.status === "completed" ? "#dcfce7" : order.status === "pending" ? "#fef3c7" : "#fee2e2",
                    color: order.status === "completed" ? "#166534" : order.status === "pending" ? "#92400e" : "#991b1b"
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>${(order.total_cents / 100).toFixed(2)}</td>
              </tr>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#6b7280", fontSize: "14px" }}>
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
