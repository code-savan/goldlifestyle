import Link from "next/link";
import ProductsTable from "./ProductsTable";
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

      <ProductsTable products={products} />
    </div>
  );
}
