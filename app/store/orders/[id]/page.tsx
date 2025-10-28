import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getRelativeTime } from "@/lib/date-utils";
import Link from "next/link";
import { ArrowLeft, User, Package, CreditCard } from "lucide-react";

interface OrderShipping {
  fullName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface OrderItem {
  name: string;
  size?: string;
  colorName?: string;
  quantity: number;
  priceCents: number;
}

interface Order {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  shipping?: OrderShipping;
  items?: OrderItem[];
  tx_ref?: string;
  flw_transaction_id?: string;
  flw_status?: string;
}

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("orders")
    .select("id, status, total_cents, created_at, shipping, items, tx_ref, flw_transaction_id, flw_status")
    .eq("id", id)
    .single();
  if (error) return <p className="text-red-600 text-[13px]">{error.message}</p>;
  if (!data) notFound();

  const order = data as Order;
  const customerName = order.shipping?.fullName ||
                      order.shipping?.name ||
                      (order.shipping?.firstName && order.shipping?.lastName ? `${order.shipping.firstName} ${order.shipping.lastName}` : null) ||
                      "Anonymous Customer";

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/store/orders"
          className="flex items-center gap-2 text-black/50 text-[11px] font-light tracking-wider uppercase hover:text-black transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Orders
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-light tracking-[-0.01em] mb-2">
            Order #{order.id.slice(0,8).toUpperCase()}
          </h1>
          <p className="text-black/50 text-[13px]">
            {getRelativeTime(order.created_at)} •
            <span className={`ml-3 inline-block px-3 py-1 text-[11px] tracking-wider uppercase border ${
              order.status === "completed"
                ? "bg-black text-white border-black"
                : order.status === "pending"
                ? "bg-transparent text-black/60 border-black/20"
                : "bg-transparent text-black/40 border-black/10"
            }`}>
              {order.status}
            </span>
          </p>
        </div>
        <div className="text-[20px] font-light">
          ${(order.total_cents / 100).toFixed(2)}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {/* Customer Information */}
        <div className="admin-table-section">
          <div className="flex items-center gap-3 mb-6">
            <User size={18} strokeWidth={1.5} color="rgba(0,0,0,0.6)" />
            <h2 className="text-[13px] font-light tracking-wider uppercase">Customer Information</h2>
          </div>
          {order.shipping ? (
            <div className="space-y-4">
              <div>
                <div className="text-[13px] font-light text-black mb-1">
                  {customerName}
                </div>
                <div className="text-[11px] text-black/50">
                  {order.shipping.email}
                </div>
                <div className="text-[11px] text-black/50">
                  {order.shipping.phone}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                  Shipping Address
                </div>
                <div className="text-[11px] text-black/50 leading-relaxed">
                  {order.shipping.address}<br />
                  {order.shipping.city}, {order.shipping.state}<br />
                  {order.shipping.country} {order.shipping.postalCode}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-black/50 text-[13px]">No customer information available</div>
          )}
        </div>

        {/* Payment Information */}
        <div className="admin-table-section">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={18} strokeWidth={1.5} color="rgba(0,0,0,0.6)" />
            <h2 className="text-[13px] font-light tracking-wider uppercase">Payment Details</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[11px] text-black/50">Transaction Reference:</span>
              <span className="text-[11px] font-light text-black/70">
                {order.tx_ref || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-black/50">Flutterwave ID:</span>
              <span className="text-[11px] font-light text-black/70">
                {order.flw_transaction_id || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-black/50">Payment Status:</span>
              <span className="text-[11px] font-light text-black/70">
                {order.flw_status || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="admin-table-section table-responsive mt-6">
        <div className="flex items-center gap-3 mb-6">
          <Package size={18} strokeWidth={1.5} color="rgba(0,0,0,0.6)" />
          <h2 className="text-[13px] font-light tracking-wider uppercase">Order Items</h2>
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
                {order.items.map((item, i: number) => (
                  <tr key={i}>
                    <td>
                      <div>
                        <div className="font-light text-black">{item.name}</div>
                        <div className="text-[11px] text-black/50">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.colorName && " • "}
                          {item.colorName && `Color: ${item.colorName}`}
                        </div>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td className="font-light">${(item.priceCents / 100).toFixed(2)}</td>
                    <td className="font-light">${((item.priceCents * item.quantity) / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-black/10">
              <span className="text-[13px] font-light tracking-wider uppercase">Total Amount</span>
              <span className="text-[20px] font-light">
                ${(order.total_cents / 100).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-black/50 text-[13px] text-center py-12">
            No items found for this order
          </div>
        )}
      </div>
    </div>
  );
}
