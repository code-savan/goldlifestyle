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
    return <p className="text-red-600 text-[13px]">{error.message}</p>;
  }
  const orders = data || [];
  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-[24px] font-light tracking-[-0.01em]">Orders</h1>
      </div>

      <div className="admin-table-section table-responsive">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-black/50 text-[13px]">
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
              {orders.map((order: {id: string; status: string; total_cents: number; created_at: string; shipping?: {fullName?: string; name?: string; firstName?: string; lastName?: string}}) => {
                const customerName = order.shipping?.fullName ||
                                   order.shipping?.name ||
                                   (order.shipping?.firstName && order.shipping?.lastName ? `${order.shipping.firstName} ${order.shipping.lastName}` : null) ||
                                   "Anonymous Customer";

                return (
                  <tr key={order.id}>
                    <td>
                      <div className="font-light">{customerName}</div>
                    </td>
                    <td className="font-light">#{order.id.slice(0, 8).toUpperCase()}</td>
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
                    <td className="text-black/60">
                      {getRelativeTime(order.created_at)}
                    </td>
                    <td className="font-light">${(order.total_cents / 100).toFixed(2)}</td>
                    <td>
                      <Link
                        href={`/store/orders/${order.id}`}
                        className="text-black/50 text-[11px] font-light tracking-wider uppercase hover:text-black transition-colors"
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
