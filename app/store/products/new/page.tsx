"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Plus, Palette } from "lucide-react";
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
      const { ok, message, id } = await postProduct(formData);
      if (!ok) throw new Error(message || "Failed");
      setSuccess("Product created successfully!");
      // Reset form
      setName("");
      setDescription("");
      setAmount(0);
      setSizes([]);
      setColors([{ colorName: "Gold", colorHex: "#D4AF37" }]);
      setMainFile(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link
          href="/store/products"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <h1 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Add New Product</h1>
      </div>

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

      <div className="admin-table-section" style={{ width: "100%", overflowX: "hidden" }}>
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
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "6px", display: "block" }}>
                  Description
                </label>
                <MiniEditor value={description} onChange={setDescription} placeholder="Write a rich description..." />
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
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Primary Image */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111", marginBottom: "16px" }}>Primary Image</h3>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
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
                  style={{ marginBottom: "8px", maxWidth: "100%" }}
                />
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                  Upload the main product image. Recommended size: 800x600px
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
                onClick={addColor}
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
                      gridTemplateColumns: "60px 1fr 60px 1fr auto",
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
                        onChange={(e) => updateColor(i, { colorName: e.target.value })}
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
                        value={c.colorHex || "#000000"}
                        onChange={(e) => updateColor(i, { colorHex: e.target.value })}
                        style={{
                          width: "100%",
                          height: "32px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "4px", display: "block" }}>
                        Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateColor(i, { file: e.target.files?.[0] })}
                        style={{ fontSize: "12px" }}
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
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
              {pending ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
