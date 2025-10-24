import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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
  return (
    <main style={{ padding: 12 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>Order #{order.id.slice(0,8)}</h1>
      <div style={{ color: "#666", marginBottom: 12 }}>{new Date(order.created_at).toLocaleString()} · {order.status}</div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <section>
          <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Customer</h2>
          {order.shipping ? (
            <div>
              <div>{order.shipping.fullName} · {order.shipping.email} · {order.shipping.phone}</div>
              <div>{order.shipping.address}, {order.shipping.city}, {order.shipping.state}, {order.shipping.country} {order.shipping.postalCode}</div>
            </div>
          ) : <div>—</div>}
          <h2 style={{ fontWeight: 600, margin: "12px 0 8px" }}>Payment</h2>
          <div>Tx Ref: {order.tx_ref || "—"}</div>
          <div>FLW Tx: {order.flw_transaction_id || "—"}</div>
          <div>FLW Status: {order.flw_status || "—"}</div>
        </section>
        <section>
          <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Items</h2>
          {Array.isArray(order.items) && order.items.length ? (
            <ul style={{ display: "grid", gap: 8 }}>
              {order.items.map((it: any, i: number) => (
                <li key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{it.name} {it.size ? `· ${it.size}` : ''} {it.colorName ? `· ${it.colorName}` : ''} × {it.quantity}</span>
                  <span>${((it.priceCents * it.quantity) / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div>—</div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 700 }}>
            <span>Total</span>
            <span>${(order.total_cents / 100).toFixed(2)}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
