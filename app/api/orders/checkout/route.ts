import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shipping } = body as { items: Array<{ id: string; name: string; priceCents: number; quantity: number }>; shipping: any };
    if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

    const totalCents = items.reduce((s, it) => s + it.priceCents * it.quantity, 0);
    const txRef = `gold_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const sb = supabaseServer();
    const { data: order, error } = await sb
      .from("orders")
      .insert({ total_cents: totalCents, status: "pending", items: items as any, shipping: shipping as any, tx_ref: txRef })
      .select("id, tx_ref")
      .single();
    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/success?order_id=${order.id}`;

    // Initialize Flutterwave payment link
    const flwSecret = process.env.FLW_SECRET_KEY as string | undefined;
    let paymentLink: string | undefined;
    if (flwSecret) {
      const amount = Math.max(0.5, Math.round(totalCents) / 100); // min amount guard
      const currency = "USD"; // adjust if needed
      const payload = {
        tx_ref: txRef,
        amount,
        currency,
        redirect_url: redirectUrl,
        customer: {
          email: shipping?.email || "guest@example.com",
          phonenumber: shipping?.phone || undefined,
          name: shipping?.fullName || "Guest",
        },
        meta: { order_id: order.id },
        customizations: { title: "Gold lifestyle", description: "Order payment" },
      } as any;
      const resp = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${flwSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        return NextResponse.json({ ok: false, error: `Flutterwave init failed: ${resp.status} ${txt}` }, { status: 500 });
      }
      const flwJson = await resp.json();
      paymentLink = flwJson?.data?.link as string | undefined;
    }

    return NextResponse.json({ ok: true, orderId: order.id, tx_ref: txRef, redirectUrl, totalCents, paymentLink });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to init checkout" }, { status: 500 });
  }
}
