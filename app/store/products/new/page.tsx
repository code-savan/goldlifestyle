"use client";
import { useMemo, useState } from "react";
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
      setSuccess("Product created");
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
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Add product</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
        <label>
          <div>Name</div>
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%" }} />
        </label>
        <label>
          <div>Description</div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} style={{ width: "100%" }} />
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
          <div>Sizes</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {sizes.map((s) => (
              <button type="button" key={s} onClick={() => removeSize(s)} style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 999 }}>
                {s} ×
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {"S M L XL".split(" ").map((s) => (
              <button type="button" key={s} onClick={() => addSize(s)} style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 6 }}>
                {s}
              </button>
            ))}
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
                  ) : (
                    <div style={{ width: 48, height: 48, background: c.colorHex || "#ddd", borderRadius: 6 }} />
                  )}
                  <input placeholder="Color name" value={c.colorName} onChange={(e) => updateColor(i, { colorName: e.target.value })} required />
                  <input type="color" value={c.colorHex || "#000000"} onChange={(e) => updateColor(i, { colorHex: e.target.value })} />
                  <input type="file" accept="image/*" onChange={(e) => updateColor(i, { file: e.target.files?.[0] })} />
                  <button type="button" onClick={() => removeColor(i)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addColor} style={{ marginTop: 8 }}>+ Add color</button>
        </div>
        <button type="submit" disabled={pending}>{pending ? "Saving..." : "Create product"}</button>
      </form>
    </div>
  );
}
