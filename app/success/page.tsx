import { getBaseUrl } from "@/lib/url";
import { supabaseServer } from "@/lib/supabase/server";
import ClearCart from "@/app/success/ClearCart";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface OrderShipping {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface OrderItem {
  name: string;
  priceCents: number;
  quantity: number;
  colorName?: string;
  size?: string;
}

interface Order {
  id: string;
  status: string;
  total_cents: number;
  tx_ref?: string;
  shipping?: OrderShipping;
  items?: OrderItem[];
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order_id?: string; status?: string; transaction_id?: string; tx_ref?: string }> }) {
  const { order_id, status, transaction_id, tx_ref } = await searchParams;
  const qs = new URLSearchParams({ order_id: order_id || "", tx_ref: tx_ref || "", status: status || "successful", transaction_id: transaction_id || "" }).toString();
  await fetch(`${getBaseUrl()}/api/orders/verify?${qs}`, { cache: "no-store" });
  const sb = supabaseServer();
  let order: Order | null = null;
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
    <main className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 border-2 border-black flex items-center justify-center">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-[42px] font-light tracking-[-0.02em] mb-4 text-black">
          {succeeded ? "Order Confirmed" : "Order Processing"}
        </h1>
        <p className="text-[15px] text-black/60 mb-12 max-w-md mx-auto">
          {succeeded
            ? "Thank you for your purchase. Your order has been successfully placed and is being prepared."
            : "Your payment is being processed. Please check back shortly."
          }
        </p>

        {/* Order Details */}
        {order && (
          <div className="border border-black/10 p-8 text-left mb-8">
            <div className="space-y-6">
              {/* Order ID & Reference */}
              <div>
                <h2 className="text-[11px] tracking-widest uppercase text-black/40 mb-2">Order Details</h2>
                <div className="space-y-1 text-[13px]">
                  <p><span className="text-black/60">Order ID:</span> <span className="font-light">{order.id}</span></p>
                  {order.tx_ref && <p><span className="text-black/60">Reference:</span> <span className="font-light">{order.tx_ref}</span></p>}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping && (
                <div className="pt-6 border-t border-black/10">
                  <h2 className="text-[11px] tracking-widest uppercase text-black/40 mb-2">Shipping Address</h2>
                  <div className="text-[13px] text-black/70 space-y-1">
                    <p className="font-light">{order.shipping.fullName}</p>
                    <p>{order.shipping.address}</p>
                    <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}</p>
                    <p>{order.shipping.country}</p>
                    <p className="mt-2">{order.shipping.email}</p>
                    <p>{order.shipping.phone}</p>
                  </div>
                </div>
              )}

              {/* Items */}
              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className="pt-6 border-t border-black/10">
                  <h2 className="text-[11px] tracking-widest uppercase text-black/40 mb-3">Order Items</h2>
                  <div className="space-y-3">
                    {order.items.map((item, i: number) => (
                      <div key={i} className="flex justify-between text-[13px]">
                        <div className="flex-1">
                          <p className="font-light">{item.name}</p>
                          <p className="text-[11px] text-black/50">
                            {item.colorName && `Color: ${item.colorName}`}
                            {item.colorName && item.size && ' · '}
                            {item.size && `Size: ${item.size}`}
                            {' · '}Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-light">${((item.priceCents * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="pt-6 border-t border-black/10 flex justify-between text-[15px]">
                <span className="font-light">Total</span>
                <span className="font-light">${((order.total_cents || 0) / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Email Confirmation Message */}
        <p className="text-[13px] text-black/50 mb-8">
          A confirmation email has been sent to your email address with your order details and tracking information.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-block border border-black px-8 py-3 text-[13px] tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-block border border-black/20 px-8 py-3 text-[13px] tracking-widest uppercase text-black/60 hover:text-black hover:border-black transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
      {succeeded ? <ClearCart /> : null}
    </main>
  );
}
