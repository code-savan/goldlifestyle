import Link from "next/link";
import DeleteProductButton from "./DeleteProductButton";
import { getBaseUrl } from "@/lib/url";

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
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <h1 className="minimal-heading" style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 }}>Products</h1>
        <Link
          href="/store/products/new"
          style={{
            background: "#111",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "500",
            transition: "all 150ms ease",
            whiteSpace: "nowrap"
          }}
        >
          Add Product
        </Link>
      </div>

      {error && <p style={{ color: "crimson", marginBottom: "24px" }}>{error}</p>}

      <div className="admin-table-section table-responsive" style={{ overflowX: "auto", width: "100%" }}>
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 32px", color: "#6b7280" }}>
            <p style={{ marginBottom: "16px" }}>No products yet.</p>
            <Link
              href="/store/products/new"
              style={{
                background: "#111",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
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
              {products.map((product: any) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {product.previewImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.previewImageUrl}
                          alt={product.name}
                          style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }}
                        />
                      ) : (
                        <div style={{ width: "48px", height: "48px", background: "#f3f4f6", borderRadius: "8px" }} />
                      )}
                      <div>
                        <div style={{ fontWeight: "500", color: "#111" }}>{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>${(product.amountCents / 100).toFixed(2)}</td>
                  <td>{product.colorsCount || 0}</td>
                  <td>{product.sizesCount || 0}</td>
                  <td>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <Link
                        href={`/store/products/${product.id}`}
                        style={{ color: "#6b7280", textDecoration: "none", fontSize: "12px", fontWeight: "500", transition: "color 150ms ease" }}
                      >
                        View
                      </Link>
                      <Link
                        href={`/store/products/${product.id}/edit`}
                        style={{ color: "#6b7280", textDecoration: "none", fontSize: "12px", fontWeight: "500", transition: "color 150ms ease" }}
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
