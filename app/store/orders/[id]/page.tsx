import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getRelativeTime } from "@/lib/date-utils";
import Link from "next/link";
import { ArrowLeft, User, Package, CreditCard } from "lucide-react";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("orders")
    .select("id, status, total_cents, created_at, shipping, items, tx_ref, flw_transaction_id, flw_status")
    .eq("id", id)
    .single();
  if (error) return <p style={{ color: "crimson" }}>{error.message}</p>;
  if (!data) notFound();

  const order = data as any;
  const customerName = order.shipping?.fullName ||
                      order.shipping?.name ||
                      order.shipping?.firstName + " " + order.shipping?.lastName ||
                      "Anonymous Customer";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link
          href="/store/orders"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0, marginBottom: "4px" }}>
            Order #{order.id.slice(0,8).toUpperCase()}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
            {getRelativeTime(order.created_at)} •
            <span style={{
              marginLeft: "8px",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "500",
              background: order.status === "completed" ? "#dcfce7" : order.status === "pending" ? "#fef3c7" : "#fee2e2",
              color: order.status === "completed" ? "#166534" : order.status === "pending" ? "#92400e" : "#991b1b"
            }}>
              {order.status}
            </span>
          </p>
        </div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#111" }}>
          ${(order.total_cents / 100).toFixed(2)}
        </div>
      </div>

      <div style={{
        display: "grid",
        gap: "24px",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
      }}>
        {/* Customer Information */}
        <div className="admin-table-section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <User size={16} color="#6b7280" />
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#111", margin: 0 }}>Customer Information</h2>
          </div>
          {order.shipping ? (
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#111", marginBottom: "2px" }}>
                  {customerName}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {order.shipping.email}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  {order.shipping.phone}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Shipping Address
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.4" }}>
                  {order.shipping.address}<br />
                  {order.shipping.city}, {order.shipping.state}<br />
                  {order.shipping.country} {order.shipping.postalCode}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "#6b7280", fontSize: "14px" }}>No customer information available</div>
          )}
        </div>

        {/* Payment Information */}
        <div className="admin-table-section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <CreditCard size={16} color="#6b7280" />
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#111", margin: 0 }}>Payment Details</h2>
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Transaction Reference:</span>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#374151" }}>
                {order.tx_ref || "—"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Flutterwave ID:</span>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#374151" }}>
                {order.flw_transaction_id || "—"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Payment Status:</span>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#374151" }}>
                {order.flw_status || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="admin-table-section table-responsive" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Package size={16} color="#6b7280" />
          <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#111", margin: 0 }}>Order Items</h2>
        </div>
        {Array.isArray(order.items) && order.items.length ? (
          <div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>
                      <div>
                        <div style={{ fontWeight: "500", color: "#111" }}>{item.name}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.colorName && " • "}
                          {item.colorName && `Color: ${item.colorName}`}
                        </div>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${(item.priceCents / 100).toFixed(2)}</td>
                    <td>${((item.priceCents * item.quantity) / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid #e5e7eb"
            }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>Total Amount</span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#111" }}>
                ${(order.total_cents / 100).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ color: "#6b7280", fontSize: "14px", textAlign: "center", padding: "32px" }}>
            No items found for this order
          </div>
        )}
      </div>
    </div>
  );
}
