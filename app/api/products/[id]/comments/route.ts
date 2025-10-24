import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const sb = supabaseServer();
    const { data, error } = await sb
      .from("product_comments")
      .select("id, author, body, created_at")
      .eq("product_id", id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ comments: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const author = (body?.author || "Anonymous").toString().slice(0, 80);
    const text = (body?.body || "").toString();
    if (!text.trim()) return NextResponse.json({ error: "Comment required" }, { status: 400 });
    const sb = supabaseServer();
    const { error } = await sb
      .from("product_comments")
      .insert({ product_id: id, author, body: text });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to post comment" }, { status: 500 });
  }
}
