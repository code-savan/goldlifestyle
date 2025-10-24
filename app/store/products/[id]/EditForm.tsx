"use client";
import { useMemo, useState } from "react";
import { Upload, X, Plus, Palette } from "lucide-react";

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

  const addSize = (s: string) => {
    if (!s) return;
    if (!sizes.includes(s)) setSizes((prev) => [...prev, s]);
  };
  const removeSize = (s: string) => setSizes((prev) => prev.filter((x) => x !== s));

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
      setSuccess("Product updated successfully!");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {error && (
        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          fontSize: "14px"
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: "#dcfce7",
          color: "#166534",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          fontSize: "14px"
        }}>
          {success}
        </div>
      )}

      <form className="admin-form" onSubmit={onSubmit} style={{ display: "grid", gap: "24px", width: "100%" }}>
        {/* Basic Information */}
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>Basic Information</h3>
          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "6px", display: "block" }}>
                Product Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "6px", display: "block" }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ maxWidth: "200px" }}>
              <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "6px", display: "block" }}>
                Price ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0}
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Primary Image */}
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>Primary Image</h3>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{
              width: "120px",
              height: "120px",
              border: "2px dashed #e5e7eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: mainPreview ? "transparent" : "#f9fafb"
            }}>
              {mainPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainPreview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                />
              ) : (
                <Upload size={24} color="#9ca3af" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainFile(e.target.files?.[0] || null)}
                style={{ marginBottom: "8px" }}
              />
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                Upload a new image to replace the current one
              </p>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>Available Sizes</h3>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {sizes.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => removeSize(s)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    border: "1px solid #e5e7eb",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  {s} <X size={14} />
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {"S M L XL XXL".split(" ").map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => addSize(s)}
                disabled={sizes.includes(s)}
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  background: sizes.includes(s) ? "#f3f4f6" : "white",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: sizes.includes(s) ? "not-allowed" : "pointer",
                  opacity: sizes.includes(s) ? 0.5 : 1
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", margin: 0 }}>Color Variants</h3>
            <button
              type="button"
              onClick={() => setColors(prev => [...prev, { colorName: "", colorHex: "#000000" }])}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#111",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              <Plus size={14} /> Add Color
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {colors.map((c, i) => (
                <div key={i} style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#fafafa"
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 60px 100px 1fr auto",
                    gap: "8px",
                    alignItems: "center"
                  }} className="color-grid">
                  {/* Color Preview */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    overflow: "hidden"
                  }}>
                    {c.file ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(c.file)}
                        alt="Color preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : c.prevImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.prevImageUrl}
                        alt="Previous color"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: c.colorHex || "#ddd"
                      }} />
                    )}
                  </div>

                  {/* Color Name */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "4px", display: "block" }}>
                      Color Name
                    </label>
                    <input
                      placeholder="e.g. Gold, Silver"
                      value={c.colorName}
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorName: e.target.value } : x))}
                      required
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
                        fontSize: "12px"
                      }}
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "4px", display: "block" }}>
                      Color
                    </label>
                    <input
                      type="color"
                      value={isValidHex(c.colorHex) ? String(c.colorHex) : "#000000"}
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: e.target.value } : x))}
                      style={{
                        width: "100%",
                        height: "32px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    />
                  </div>

                  {/* Hex Input */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "4px", display: "block" }}>
                      Hex Code
                    </label>
                    <input
                      placeholder="#000000"
                      value={c.colorHex}
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: e.target.value } : x))}
                      onBlur={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: normalizeHex(e.target.value) } : x))}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
                        fontSize: "12px"
                      }}
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "4px", display: "block" }}>
                      New Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, file: e.target.files?.[0] } : x))}
                      style={{ fontSize: "12px" }}
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => setColors(prev => prev.filter((_, j) => j !== i))}
                    style={{
                      background: "#fee2e2",
                      color: "#991b1b",
                      border: "1px solid #fecaca",
                      padding: "8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
          <button
            type="submit"
            disabled={pending}
            style={{
              background: pending ? "#9ca3af" : "#111",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: pending ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {pending ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
