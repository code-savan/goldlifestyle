import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function isValidUuid(value: string | undefined): value is string {
  if (!value) return false;
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const sb = supabaseServer();
    const { data, error } = await sb
      .from("products")
      .select(
        [
          "id",
          "name",
          "description",
          "amount_cents",
          "sizes",
          "primary_image_url",
          "product_images:product_images!product_id(url,color_name)",
          "product_colors:product_colors!product_id(id,color_name,color_hex)",
        ].join(", ")
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const sb = supabaseServer();
    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const amountDollars = formData.get("amountDollars");
    const sizes = formData.getAll("sizes[]").map(String);

    const update: Record<string, any> = {};
    if (typeof name === "string" && name) update.name = name;
    if (typeof description === "string" && description) update.description = description;
    if (typeof amountDollars === "string" && amountDollars.length) update.amount_cents = Math.round(Number(amountDollars) * 100);
    if (sizes.length) update.sizes = sizes;

    if (Object.keys(update).length) {
      const { error: updErr } = await sb.from("products").update(update).eq("id", id);
      if (updErr) throw updErr;
    }

    const mainImage = formData.get("mainImage") as unknown as File | null;
    if (mainImage) {
      const ext = mainImage.name.split(".").pop() || "jpg";
      const path = `${id}/primary-${Date.now()}.${ext}`;
      const { error: uploadErr } = await sb.storage.from("product-images").upload(path, mainImage, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: pub } = sb.storage.from("product-images").getPublicUrl(path);
      const primaryUrl = pub.publicUrl;
      const { error: setErr } = await sb.from("products").update({ primary_image_url: primaryUrl }).eq("id", id);
      if (setErr) throw setErr;
    }

    // Colors upsert and image uploads
    // Read existing colors for diffing and deletion later
    const { data: existingColorsFull } = await sb
      .from("product_colors")
      .select("id, color_name")
      .eq("product_id", id);

    const indices = new Set<number>();
    for (const [key] of (formData as any).entries()) {
      const m = String(key).match(/^colors\[(\d+)\]\[(id|colorName|colorHex|file)\]$/);
      if (m) indices.add(Number(m[1]));
    }
    const submittedIds = new Set<string>();
    const renamePairs: Array<{ from: string; to: string }> = [];
    for (const i of Array.from(indices).sort((a, b) => a - b)) {
      const colorId = formData.get(`colors[${i}][id]`);
      const colorName = String(formData.get(`colors[${i}][colorName]`) || "");
      const originalColorName = formData.get(`colors[${i}][originalColorName]`);
      const colorHex = formData.get(`colors[${i}][colorHex]`);
      const file = formData.get(`colors[${i}][file]`) as unknown as File | null;
      if (!colorName) continue;

      if (colorId) {
        submittedIds.add(String(colorId));
        await sb.from("product_colors").update({ color_name: colorName, color_hex: colorHex ? String(colorHex) : null }).eq("id", String(colorId));
        if (originalColorName && String(originalColorName) !== colorName) {
          renamePairs.push({ from: String(originalColorName), to: colorName });
        }
      } else {
        await sb.from("product_colors").insert({ product_id: id, color_name: colorName, color_hex: colorHex ? String(colorHex) : null });
      }

      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await sb.storage.from("product-images").upload(path, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: pub } = sb.storage.from("product-images").getPublicUrl(path);
        await sb.from("product_images").insert({ product_id: id, url: pub.publicUrl, color_name: colorName });
      }
    }

    // Rename images for colors that changed name
    for (const pair of renamePairs) {
      await sb
        .from("product_images")
        .update({ color_name: pair.to })
        .eq("product_id", id)
        .eq("color_name", pair.from);
    }

    // Remove colors not submitted anymore, and delete their images (rows + storage objects)
    const toDelete = (existingColorsFull || []).filter((c: any) => !submittedIds.has(c.id));
    if (toDelete.length) {
      const deleteNames = toDelete.map((c: any) => c.color_name);
      const { data: imagesToDelete } = await sb
        .from("product_images")
        .select("url")
        .eq("product_id", id)
        .in("color_name", deleteNames);
      const paths: string[] = [];
      for (const row of imagesToDelete || []) {
        const url: string = row.url;
        const marker = "/object/public/product-images/";
        const idx = url.indexOf(marker);
        if (idx !== -1) {
          const path = url.slice(idx + marker.length);
          if (path) paths.push(path);
        }
      }
      if (paths.length) {
        await sb.storage.from("product-images").remove(paths);
      }
      await sb.from("product_images").delete().eq("product_id", id).in("color_name", deleteNames);
      const ids = toDelete.map((c: any) => c.id);
      await sb.from("product_colors").delete().in("id", ids);
    }

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message ?? "Failed to update product" }, { status: 500 });
  }
}
