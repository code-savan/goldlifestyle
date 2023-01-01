"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    const ok = typeof window !== "undefined" ? window.confirm("Delete this product?") : true;
    if (!ok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Failed with ${res.status}`);
      }
      router.refresh();
    } catch (e: any) {
      if (typeof window !== "undefined") alert(e.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={onDelete} disabled={loading} style={{ color: "#b91c1c", fontSize: 12, fontWeight: 500 }}>
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}

