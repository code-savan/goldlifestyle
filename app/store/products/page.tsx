import Link from "next/link";
import DeleteProductButton from "./DeleteProductButton";
import { getBaseUrl } from "@/lib/url";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function fetchProducts() {
  const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" });
  if (!res.ok) {
    return { products: [], error: `Failed: ${res.status}` };
  }
  const json = await res.json();
  return { products: json.products as Array<{ id: string; name: string; amountCents: number; previewImageUrl: string | null; colorsCount: number; sizesCount: number }>, error: undefined as string | undefined };
}

export default async function ProductsPage() {
  const { products, error } = await fetchProducts();
  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-[24px] font-light tracking-[-0.01em]">Products</h1>
        <Link
          href="/store/products/new"
          className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add Product
        </Link>
      </div>

      {error && <p className="text-red-600 mb-6 text-[13px]">{error}</p>}

      <div className="admin-table-section table-responsive">
        {products.length === 0 ? (
          <div className="text-center py-20 text-black/50">
            <p className="mb-6 text-[13px]">No products yet.</p>
            <Link
              href="/store/products/new"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] font-light tracking-widest uppercase hover:bg-black/80 transition-colors"
            >
              <Plus size={14} strokeWidth={1.5} />
              Add your first product
            </Link>
          </div>
        ) : (
          <table className="admin-table" style={{ width: 1000, maxWidth: "none" }}>
            <thead>
              <tr>
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
                    <div className="flex items-center gap-4">
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
                    <div className="flex gap-4 flex-wrap">
                      <Link
                        href={`/store/products/${product.id}`}
                        className="text-black/50 text-[11px] font-light tracking-wider uppercase hover:text-black transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/store/products/${product.id}/edit`}
                        className="text-black/50 text-[11px] font-light tracking-wider uppercase hover:text-black transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
