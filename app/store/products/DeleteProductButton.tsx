"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function DeleteProductButton({ id, productName }: { id: string; productName?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDelete = async () => {
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
      setLoading(false);
    } finally {
      setShowConfirm(false);
    }
  };

  const modalContent = showConfirm ? (
    <div
      className="fixed inset-0 bg-black/20 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowConfirm(false);
        }
      }}
    >
      <div
        className="bg-white border border-black/10 shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[16px] font-medium mb-2">Delete Product</h3>
        <p className="text-[13px] text-black/60 mb-6">
          Are you sure you want to delete {productName ? `"${productName}"` : "this product"}? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="px-4 py-2 text-[12px] tracking-wider uppercase border border-black/10 hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="px-4 py-2 text-[12px] tracking-wider uppercase bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="text-black/40 text-[11px] font-light tracking-wider uppercase hover:text-red-600 transition-colors disabled:opacity-40"
      >
        Delete
      </button>
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
