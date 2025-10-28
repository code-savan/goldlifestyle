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
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to delete";
      if (typeof window !== "undefined") alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="text-black/40 text-[11px] font-light tracking-wider uppercase hover:text-red-600 transition-colors disabled:opacity-40"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
