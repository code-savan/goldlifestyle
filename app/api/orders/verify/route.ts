import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");
    const txRef = searchParams.get("tx_ref");
    const status = searchParams.get("status");
    const transactionId = searchParams.get("transaction_id");
    if (!orderId || !txRef) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const sb = supabaseServer();
    const { error } = await sb
      .from("orders")
      .update({ status: status || "completed", flw_transaction_id: transactionId, flw_status: status })
      .eq("id", orderId)
      .eq("tx_ref", txRef);
    if (error) throw error;

    // Fetch order to include details in email
    const { data: order } = await sb
      .from("orders")
      .select("id, total_cents, shipping, items, status, tx_ref")
      .eq("id", orderId)
      .single();

    // Send email via Resend (if key present)
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY as string | undefined;
    const ownerEmail = process.env.STORE_OWNER_EMAIL || "davidmichealst@gmail.com";
    const isSuccessful = (status || order?.status || "").toLowerCase().includes("success") || (order?.status || "").toLowerCase() === "completed";
    if (resendKey && order && isSuccessful) {
      const resend = new Resend(resendKey);
      const itemsHtml = Array.isArray(order.items)
        ? `<ul>${order.items
            .map((it: any) => `<li>${it.name}${it.size ? ` · ${it.size}` : ""}${it.colorName ? ` · ${it.colorName}` : ""} × ${it.quantity} — $${((it.priceCents * it.quantity) / 100).toFixed(2)}</li>`)
            .join("")}</ul>`
        : "";
      const shipping = order.shipping || {};
      const html = `
        <h2>New order: ${order.id}</h2>
        <p>Status: ${order.status}</p>
        <p>Total: $${((order.total_cents || 0) / 100).toFixed(2)}</p>
        <p>Tx Ref: ${order.tx_ref}</p>
        <h3>Customer</h3>
        <p>${shipping.fullName || ""} · ${shipping.email || ""} · ${shipping.phone || ""}</p>
        <p>${shipping.address || ""}, ${shipping.city || ""}, ${shipping.state || ""}, ${shipping.country || ""} ${shipping.postalCode || ""}</p>
        <h3>Items</h3>
        ${itemsHtml}
      `;
      try {
        await resend.emails.send({ from: "onboarding@resend.dev", to: ownerEmail, subject: `New order ${order.id}`, html });
        emailSent = true;
      } catch (err) {
        console.error("Resend email failed", err);
      }
    }

    return NextResponse.json({ ok: true, emailSent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Verify failed" }, { status: 500 });
  }
}
