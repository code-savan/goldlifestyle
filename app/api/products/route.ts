import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = supabaseServer();
    const { data, error } = await sb
      .from("products")
      .select("id, name, amount_cents, sizes, primary_image_url, product_colors(color_name), product_images(url)");
    if (error) throw error;

    const products = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      amountCents: row.amount_cents,
      previewImageUrl: row.primary_image_url || row.product_images?.[0]?.url || null,
      colorsCount: Array.isArray(row.product_colors) ? row.product_colors.length : 0,
      sizesCount: Array.isArray(row.sizes) ? row.sizes.length : 0,
    }));

    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sb = supabaseServer();
    const formData = await request.formData();

    const name = String(formData.get("name") || "");
    const description = String(formData.get("description") || "");
    const amountDollars = Number(formData.get("amountDollars") || 0);
    const amountCents = Math.round(amountDollars * 100);
    const sizes = formData.getAll("sizes[]").map(String);

    if (!name || !description || !Number.isFinite(amountCents)) {
      return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 });
    }

    const { data: productRow, error: createErr } = await sb
      .from("products")
      .insert({ name, description, amount_cents: amountCents, sizes })
      .select("id")
      .single();
    if (createErr) throw createErr;

    const productId = productRow.id as string;

    // Upload main image if provided
    const mainImage = formData.get("mainImage") as unknown as File | null;
    if (mainImage) {
      const ext = mainImage.name.split(".").pop() || "jpg";
      const path = `${productId}/primary-${Date.now()}.${ext}`;
      const { error: uploadErr } = await sb.storage.from("product-images").upload(path, mainImage, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: pub } = sb.storage.from("product-images").getPublicUrl(path);
      const primaryUrl = pub.publicUrl;
      const { error: updErr } = await sb
        .from("products")
        .update({ primary_image_url: primaryUrl })
        .eq("id", productId);
      if (updErr) throw updErr;
    }

    // Handle colors with images
    const colorIndices = new Set<number>();
    for (const [key] of (formData as any).entries()) {
      const m = String(key).match(/^colors\[(\d+)\]\[(colorName|colorHex|file)\]$/);
      if (m) colorIndices.add(Number(m[1]));
    }
    for (const idx of Array.from(colorIndices).sort((a, b) => a - b)) {
      const colorName = String(formData.get(`colors[${idx}][colorName]`) || "");
      const colorHex = formData.get(`colors[${idx}][colorHex]`);
      const file = formData.get(`colors[${idx}][file]`) as unknown as File | null;
      if (!colorName) continue;

      let publicUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await sb.storage.from("product-images").upload(path, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: pub } = sb.storage.from("product-images").getPublicUrl(path);
        publicUrl = pub.publicUrl;
        await sb.from("product_images").insert({ product_id: productId, url: publicUrl, color_name: colorName });
      }

      await sb.from("product_colors").insert({ product_id: productId, color_name: colorName, color_hex: colorHex ? String(colorHex) : null });
    }

    return NextResponse.json({ ok: true, id: productId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message ?? "Failed to create product" }, { status: 500 });
  }
}


