"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

export default function ProductActionsDropdown({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
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
      setIsOpen(false);
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
            onClick={handleDelete}
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
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors rounded"
          aria-label="Actions"
        >
          <MoreVertical size={18} className="text-black/40" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-black/10 shadow-lg z-50">
            <Link
              href={`/store/products/${productId}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-black/70 hover:bg-black/5 transition-colors"
            >
              <Eye size={14} />
              View
            </Link>
            <Link
              href={`/store/products/${productId}/edit`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-black/70 hover:bg-black/5 transition-colors"
            >
              <Edit size={14} />
              Edit
            </Link>
            <div className="border-t border-black/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowConfirm(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
