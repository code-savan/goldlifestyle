import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("orders")
    .select("id, status, total_cents, created_at, shipping->>fullName")
    .order("created_at", { ascending: false });
  if (error) {
    return <p style={{ color: "crimson" }}>{error.message}</p>;
  }
  const orders = data || [];
  return (
    <div>
      <h1 className="minimal-heading" style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul style={{ display: "grid", gap: 12 }}>
          {orders.map((o: any) => (
            <li key={o.id} className="card-min" style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>#{o.id.slice(0, 8)} · ${(o.total_cents / 100).toFixed(2)}</div>
                <div style={{ color: "#666", fontSize: 12 }}>{new Date(o.created_at).toLocaleString()} · {o.status}</div>
              </div>
              <Link className="btn-min" href={`/store/orders/${o.id}`}>Open</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
