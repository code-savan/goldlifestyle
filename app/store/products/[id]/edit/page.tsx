import { getBaseUrl } from "@/lib/url";
import EditForm from "../EditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return <p className="text-red-600 text-[13px]">Failed to load</p>;
  const { product } = await res.json();
  if (!product) return <p className="text-red-600 text-[13px]">Not found</p>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/store/products/${id}`}
          className="flex items-center gap-2 text-black/50 text-[11px] font-light tracking-wider uppercase hover:text-black transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Product
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-light tracking-[-0.01em] mb-2">
            Edit Product
          </h1>
          <p className="text-black/50 text-[13px]">
            {product.name}
          </p>
        </div>
      </div>

      <div className="admin-table-section">
        <EditForm
          id={product.id}
          name={product.name}
          description={product.description}
          amountCents={product.amount_cents}
          sizes={product.sizes}
          primaryImageUrl={product.primary_image_url}
          colors={product.product_colors || []}
          images={product.product_images || []}
        />
      </div>
    </div>
  );
}
