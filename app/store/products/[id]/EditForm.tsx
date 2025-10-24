"use client";
import { useMemo, useState } from "react";

type Props = {
  id: string;
  name: string;
  description: string;
  amountCents: number;
  sizes: string[];
  primaryImageUrl?: string | null;
  colors: Array<{ id?: string; color_name: string; color_hex: string | null }>;
  images: Array<{ url: string; color_name?: string | null }>;
};

type ColorInput = {
  id?: string;
  colorName: string;
  colorHex: string; // always a string to avoid uncontrolled->controlled
  file?: File;
  originalColorName?: string; // used to rename images when color name changes
  prevImageUrl?: string | null; // previous image for preview when no new file
};

export default function EditForm({ id, name: initialName, description: initialDesc, amountCents, sizes: initialSizes, primaryImageUrl, colors: initialColors, images }: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDesc);
  const [amount, setAmount] = useState(() => Number((amountCents / 100).toFixed(2)));
  const [sizes, setSizes] = useState<string[]>(initialSizes);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [colors, setColors] = useState<ColorInput[]>(() =>
    initialColors.map(c => ({
      id: c.id,
      colorName: c.color_name,
      originalColorName: c.color_name,
      colorHex: c.color_hex || "#000000",
      prevImageUrl: images.find(img => (img.color_name || "") === c.color_name)?.url || null,
    }))
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mainPreview = useMemo(() => (mainFile ? URL.createObjectURL(mainFile) : primaryImageUrl || null), [mainFile, primaryImageUrl]);

  const isValidHex = (hex?: string) => typeof hex === "string" && /^#[0-9a-fA-F]{6}$/.test(hex.trim());
  const normalizeHex = (value: string) => {
    let v = value.trim();
    if (!v.startsWith("#")) v = `#${v}`;
    if (/^#[0-9a-fA-F]{3}$/.test(v)) {
      v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
    }
    return v;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("description", description);
      fd.set("amountDollars", String(amount));
      sizes.forEach((s) => fd.append("sizes[]", s));
      if (mainFile) fd.set("mainImage", mainFile);
      colors.forEach((c, i) => {
        if (c.id) fd.append(`colors[${i}][id]`, c.id);
        fd.append(`colors[${i}][colorName]`, c.colorName);
        if (c.originalColorName) fd.append(`colors[${i}][originalColorName]`, c.originalColorName);
        if (c.colorHex) fd.append(`colors[${i}][colorHex]`, c.colorHex);
        if (c.file) fd.append(`colors[${i}][file]`, c.file);
      });
      const res = await fetch(`/api/products/${id}`, { method: "PUT", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || `Failed with ${res.status}`);
      setSuccess("Saved");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
      <label>
        <div>Name</div>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        <div>Description</div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
      </label>
      <label>
        <div>Amount ($)</div>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} step="0.01" required />
      </label>
      <div>
        <div>Primary product image</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          {mainPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainPreview} alt="Preview" width={96} height={96} style={{ objectFit: "cover", borderRadius: 8 }} />
          ) : (
            <div style={{ width: 96, height: 96, background: "#f3f3f3", borderRadius: 8 }} />
          )}
          <input type="file" accept="image/*" onChange={(e) => setMainFile(e.target.files?.[0] || null)} />
        </div>
      </div>
      <div>
        <div>Colors</div>
        <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
          {colors.map((c, i) => (
            <div key={i} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, display: "grid", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {c.file ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={URL.createObjectURL(c.file)} alt="Color preview" width={48} height={48} style={{ objectFit: "cover", borderRadius: 6 }} />
                ) : c.prevImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.prevImageUrl} alt="Prev color" width={48} height={48} style={{ objectFit: "cover", borderRadius: 6 }} />
                ) : (
                  <div style={{ width: 48, height: 48, background: c.colorHex || "#ddd", borderRadius: 6 }} />
                )}
                <span style={{ width: 20, height: 20, borderRadius: 999, background: isValidHex(c.colorHex) ? String(c.colorHex) : "#000000", border: "1px solid #ddd" }} />
                <input placeholder="Color name" value={c.colorName} onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorName: e.target.value } : x))} required />
                <input type="color" value={isValidHex(c.colorHex) ? String(c.colorHex) : "#000000"} onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: e.target.value } : x))} />
                <input
                  placeholder="#HEX"
                  value={c.colorHex}
                  onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: e.target.value } : x))}
                  onBlur={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: normalizeHex(e.target.value) } : x))}
                  style={{ width: 90 }}
                />
                <input type="file" accept="image/*" onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, file: e.target.files?.[0] } : x))} />
                <button type="button" onClick={() => setColors(prev => prev.filter((_, j) => j !== i))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setColors(prev => [...prev, { colorName: "", colorHex: "#000000" }])} style={{ marginTop: 8 }}>+ Add color</button>
      </div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <button type="submit" disabled={pending}>{pending ? "Saving..." : "Save changes"}</button>
    </form>
  );
}
