"use client";
import { useMemo, useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import MiniEditor from "@/components/MiniEditor";

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
  colorHex: string;
  file?: File;
  originalColorName?: string;
  prevImageUrl?: string | null;
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
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update product";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 mb-6 text-[13px]">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 mb-6 text-[13px]">
          {success}
        </div>
      )}

      <form className="admin-form space-y-12" onSubmit={onSubmit}>
        {/* Basic Information */}
        <div>
          <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-6">Basic Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                Product Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-black/20 text-[13px] font-light outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                Description
              </label>
              <MiniEditor value={description} onChange={setDescription} />
            </div>

            <div className="max-w-[200px]">
              <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0}
                step="0.01"
                required
                className="w-full px-4 py-3 border border-black/20 text-[13px] font-light outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Primary Image */}
        <div>
          <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-6">Primary Image</h3>
          <div className="flex gap-6 items-center">
            <div className="w-32 h-32 border-2 border-dashed border-black/20 flex items-center justify-center bg-[#f9f9f9]">
              {mainPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload size={24} strokeWidth={1.5} color="rgba(0,0,0,0.3)" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainFile(e.target.files?.[0] || null)}
                className="mb-2 text-[13px] font-light"
              />
              <p className="text-[11px] text-black/50">
                Upload a new image to replace the current one
              </p>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-6">Available Sizes</h3>
          <div className="mb-4">
            <div className="flex gap-2 flex-wrap">
              {sizes.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => removeSize(s)}
                  className="flex items-center gap-2 border border-black/20 px-4 py-2 bg-black text-white text-[11px] font-light tracking-wider uppercase hover:bg-black/80 transition-colors"
                >
                  {s} <X size={12} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {"XS S M L XL 2XL 3XL 4XL 5XL 6XL 7XL 8XL".split(" ").map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => addSize(s)}
                disabled={sizes.includes(s)}
                className="border border-black/20 px-4 py-2 text-[11px] font-light tracking-wider uppercase hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50">Color Variants</h3>
            <button
              type="button"
              onClick={() => setColors(prev => [...prev, { colorName: "", colorHex: "#000000" }])}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors"
            >
              <Plus size={14} strokeWidth={1.5} /> Add Color
            </button>
          </div>

          <div className="space-y-4">
            {colors.map((c, i) => (
              <div key={i} className="border border-black/10 p-6 bg-[#f9f9f9]">
                <div className="grid grid-cols-[80px_1fr_80px_120px_1fr_auto] gap-4 items-center color-grid">
                  {/* Color Preview */}
                  <div className="w-20 h-20 border border-black/10 overflow-hidden">
                    {c.file ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(c.file)}
                        alt="Color preview"
                        className="w-full h-full object-cover"
                      />
                    ) : c.prevImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.prevImageUrl}
                        alt="Previous color"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: c.colorHex || "#ddd" }} />
                    )}
                  </div>

                  {/* Color Name */}
                  <div>
                    <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                      Color Name
                    </label>
                    <input
                      placeholder="e.g. Gold, Silver"
                      value={c.colorName}
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorName: e.target.value } : x))}
                      required
                      className="w-full px-3 py-2 border border-black/20 text-[13px] font-light outline-none focus:border-black transition-colors"
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={isValidHex(c.colorHex) ? String(c.colorHex) : "#000000"}
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: e.target.value } : x))}
                      className="w-full h-10 border border-black/20 cursor-pointer"
                    />
                  </div>

                  {/* Hex Input */}
                  <div>
                    <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                      Hex Code
                    </label>
                    <input
                      placeholder="#000000"
                      value={c.colorHex}
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: e.target.value } : x))}
                      onBlur={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, colorHex: normalizeHex(e.target.value) } : x))}
                      className="w-full px-3 py-2 border border-black/20 text-[13px] font-light outline-none focus:border-black transition-colors"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                      New Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setColors(prev => prev.map((x, j) => j === i ? { ...x, file: e.target.files?.[0] } : x))}
                      className="text-[11px] font-light"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => setColors(prev => prev.filter((_, j) => j !== i))}
                    className="w-10 h-10 flex items-center justify-center border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8 border-t border-black/10">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-3 bg-black text-white px-8 py-4 text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pending ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
