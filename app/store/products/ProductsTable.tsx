"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link";
import ProductActionsDropdown from "./ProductActionsDropdown";
import { Trash2, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  amountCents: number;
  previewImageUrl: string | null;
  colorsCount: number;
  sizesCount: number;
};

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const allSelected = selectedIds.size === products.length && products.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < products.length;
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
      setShowBulkActions(true);
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/products/${id}`, { method: "DELETE" }).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to delete product ${id}`);
          }
        })
      );

      await Promise.all(deletePromises);
      setSelectedIds(new Set());
      setShowBulkActions(false);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete products";
      alert(message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {showBulkActions && (
        <div className="mb-4 p-4 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[13px]">
              {selectedIds.size} {selectedIds.size === 1 ? "product" : "products"} selected
            </span>
            <button
              onClick={() => {
                setSelectedIds(new Set());
                setShowBulkActions(false);
              }}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Clear selection"
            >
              <X size={18} />
            </button>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] tracking-wider uppercase transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete Selected
          </button>
        </div>
      )}

      <div className="admin-table-section table-responsive">
        {products.length === 0 ? (
          <div className="text-center py-20 text-black/50">
            <p className="mb-6 text-[13px]">No products yet.</p>
            <Link
              href="/store/products/new"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    ref={selectAllRef}
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                    aria-label="Select all products"
                  />
                </th>
                <th>Product</th>
                <th>Price</th>
                <th>Colors</th>
                <th>Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                      className="cursor-pointer"
                      aria-label={`Select ${product.name}`}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      {product.previewImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.previewImageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover bg-[#f9f9f9]"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#f9f9f9]" />
                      )}
                      <div className="font-light">{product.name}</div>
                    </div>
                  </td>
                  <td className="font-light">${(product.amountCents / 100).toFixed(2)}</td>
                  <td className="text-black/60">{product.colorsCount || 0}</td>
                  <td className="text-black/60">{product.sizesCount || 0}</td>
                  <td>
                    <ProductActionsDropdown productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mounted &&
        showConfirm &&
        createPortal(
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
              <h3 className="text-[16px] font-medium mb-2">Delete Products</h3>
              <p className="text-[13px] text-black/60 mb-6">
                Are you sure you want to delete {selectedIds.size}{" "}
                {selectedIds.size === 1 ? "product" : "products"}? This action cannot be undone.
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
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-4 py-2 text-[12px] tracking-wider uppercase bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
