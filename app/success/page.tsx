import { getBaseUrl } from "@/lib/url";
import { supabaseServer } from "@/lib/supabase/server";
import ClearCart from "@/app/success/ClearCart";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order_id?: string; status?: string; transaction_id?: string; tx_ref?: string }> }) {
  const { order_id, status, transaction_id, tx_ref } = await searchParams;
  // If Flutterwave redirected without tx_ref, we still mark completed by order_id
  const qs = new URLSearchParams({ order_id: order_id || "", tx_ref: tx_ref || "", status: status || "successful", transaction_id: transaction_id || "" }).toString();
  await fetch(`${getBaseUrl()}/api/orders/verify?${qs}`, { cache: "no-store" });
  const sb = supabaseServer();
  let order: any = null;
  if (order_id) {
    const { data } = await sb
      .from("orders")
      .select("id, status, total_cents, shipping, items, tx_ref")
      .eq("id", order_id)
      .single();
    order = data;
  }
  const statusStr = (status || order?.status || "").toLowerCase();
  const succeeded = statusStr.includes("success") || (order?.status && order.status.toLowerCase() !== "pending");
  return (
    <main style={{ padding: 24 }}>
      <h1 className="minimal-heading" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Payment {status || order?.status || "completed"}</h1>
      {order?.tx_ref ? <p>Your reference: {order.tx_ref}</p> : null}
      {order ? (
        <section style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div><strong>Order ID:</strong> {order.id}</div>
          <div><strong>Total:</strong> ${((order.total_cents || 0) / 100).toFixed(2)}</div>
          {order.shipping ? (
            <div>
              <strong>Shipping</strong>
              <div style={{ color: "#555" }}>
                {order.shipping.fullName} · {order.shipping.email} · {order.shipping.phone}
              </div>
              <div style={{ color: "#555" }}>
                {order.shipping.address}, {order.shipping.city}, {order.shipping.state}, {order.shipping.country} {order.shipping.postalCode}
              </div>
            </div>
          ) : null}
          {Array.isArray(order.items) && order.items.length > 0 ? (
            <div>
              <strong>Items</strong>
              <ul style={{ marginTop: 8, display: "grid", gap: 6 }}>
                {order.items.map((it: any, i: number) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>
                      {it.name} {it.size ? `· ${it.size}` : ''} {it.colorName ? `· ${it.colorName}` : ''} × {it.quantity}
                    </span>
                    <span>${((it.priceCents * it.quantity) / 100).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p style={{ marginTop: 8 }}>A confirmation email will be sent to you shortly.</p>
        </section>
      ) : (
        <p>Order details will appear here when available.</p>
      )}
      {succeeded ? <ClearCart /> : null}
      <a className="btn-min" href="/">Back to home</a>
    </main>
  );
}
