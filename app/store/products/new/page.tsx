"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import MiniEditor from "@/components/MiniEditor";

const postProduct = async (fd: FormData) => {
  const res = await fetch("/api/products", { method: "POST", body: fd });
  return res.json();
};

type ColorInput = { colorName: string; colorHex?: string; file?: File };

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<ColorInput[]>([{ colorName: "Gold", colorHex: "#D4AF37" }]);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mainPreview = useMemo(() => (mainFile ? URL.createObjectURL(mainFile) : null), [mainFile]);

  const addSize = (s: string) => {
    if (!s) return;
    if (!sizes.includes(s)) setSizes((prev) => [...prev, s]);
  };
  const removeSize = (s: string) => setSizes((prev) => prev.filter((x) => x !== s));

  const addColor = () => setColors((prev) => [...prev, { colorName: "", colorHex: "#000000" }]);
  const updateColor = (idx: number, patch: Partial<ColorInput>) =>
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  const removeColor = (idx: number) => setColors((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("amountDollars", String(Number(amount)));
      sizes.forEach((s) => formData.append("sizes[]", s));
      if (mainFile) formData.set("mainImage", mainFile);
      colors.forEach((c, i) => {
        formData.append(`colors[${i}][colorName]`, c.colorName);
        if (c.colorHex) formData.append(`colors[${i}][colorHex]`, c.colorHex);
        if (c.file) formData.append(`colors[${i}][file]`, c.file);
      });
      const { ok, message} = await postProduct(formData);
      if (!ok) throw new Error(message || "Failed");
      setSuccess("Product created successfully!");
      // Reset form
      setName("");
      setDescription("");
      setAmount(0);
      setSizes([]);
      setColors([{ colorName: "Gold", colorHex: "#D4AF37" }]);
      setMainFile(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to create product";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/store/products"
          className="flex items-center gap-2 text-black/50 text-[11px] font-light tracking-wider uppercase hover:text-black transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Products
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-[24px] font-light tracking-[-0.01em]">Add New Product</h1>
      </div>

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

      <div className="admin-table-section">
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
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                  Description
                </label>
                <MiniEditor value={description} onChange={setDescription} placeholder="Write a rich description..." />
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
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Primary Image */}
          <div>
            <h3 className="text-[13px] font-light tracking-wider uppercase text-black/50 mb-6">Primary Image</h3>
            <div className="flex gap-6 items-center flex-wrap">
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
                  Upload the main product image. Recommended size: 800x600px
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
            <div className="flex gap-2">
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
                onClick={addColor}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors"
              >
                <Plus size={14} strokeWidth={1.5} /> Add Color
              </button>
            </div>

            <div className="space-y-4">
              {colors.map((c, i) => (
                <div key={i} className="border border-black/10 p-6 bg-[#f9f9f9]">
                  <div className="grid grid-cols-[80px_1fr_80px_1fr_auto] gap-4 items-center color-grid">
                    {/* Color Preview */}
                    <div className="w-20 h-20 border border-black/10 overflow-hidden">
                      {c.file ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={URL.createObjectURL(c.file)}
                          alt="Color preview"
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
                        onChange={(e) => updateColor(i, { colorName: e.target.value })}
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
                        value={c.colorHex || "#000000"}
                        onChange={(e) => updateColor(i, { colorHex: e.target.value })}
                        className="w-full h-10 border border-black/20 cursor-pointer"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-[11px] font-light tracking-wider uppercase text-black/50 mb-2">
                        Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateColor(i, { file: e.target.files?.[0] })}
                        className="text-[11px] font-light"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
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
              {pending ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
