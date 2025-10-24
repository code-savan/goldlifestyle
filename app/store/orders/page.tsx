import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getRelativeTime } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("orders")
    .select("id, status, total_cents, created_at, shipping")
    .order("created_at", { ascending: false });
  if (error) {
    return <p style={{ color: "crimson" }}>{error.message}</p>;
  }
  const orders = data || [];
  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <h1 className="minimal-heading" style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Orders</h1>
      </div>

      <div className="admin-table-section table-responsive" style={{ overflowX: "auto", width: "100%" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 32px", color: "#6b7280", fontSize: "14px" }}>
            <p>No orders yet.</p>
          </div>
        ) : (
          <table className="admin-table" style={{ width: 1000, maxWidth: "none" }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Order ID</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => {
                // Extract customer name from shipping object
                const customerName = order.shipping?.fullName ||
                                   order.shipping?.name ||
                                   order.shipping?.firstName + " " + order.shipping?.lastName ||
                                   "Anonymous Customer";

                return (
                  <tr key={order.id}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar"></div>
                        <span>{customerName}</span>
                      </div>
                    </td>
                    <td>#{order.id.slice(0, 8).toUpperCase()}</td>
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
                    <td style={{ fontSize: "14px", color: "#6b7280" }}>
                      {getRelativeTime(order.created_at)}
                    </td>
                    <td>${(order.total_cents / 100).toFixed(2)}</td>
                    <td>
                      <Link
                        href={`/store/orders/${order.id}`}
                        style={{
                          color: "#6b7280",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "color 150ms ease"
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
