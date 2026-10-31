
import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getProducts } from "../../services/api";
import type { Product } from "../../types/product";

type StockFilter = "all" | "low" | "out";

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<StockFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load inventory."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter((product) => {
        if (filter === "low") {
          return product.stock > 0 && product.stock <= 5;
        }

        if (filter === "out") {
          return product.stock === 0;
        }

        return true;
      })
      .sort((a, b) => a.stock - b.stock);
  }, [products, filter]);

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 5
  ).length;

  const outOfStock = products.filter(
    (p) => p.stock === 0
  ).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      <AdminSidebar />

      <main className="px-5 py-10 lg:ml-72 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-sm font-semibold text-blue-400">
            TECHZONE ADMIN
          </p>

          <h1 className="text-3xl font-black">
            Inventory Management
          </h1>

          <p className="mt-3 text-gray-400">
            Monitor product availability and stock levels.
          </p>

          <div className="my-8 grid gap-5 sm:grid-cols-3">
            {[
              ["Total Products", products.length],
              ["Low Stock", lowStock],
              ["Out of Stock", outOfStock],
            ].map(([label, count]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-[#101622] p-6"
              >
                <p className="text-sm text-gray-400">{label}</p>
                <p className="mt-3 text-3xl font-black">
                  {loading ? "..." : count}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {(
              [
                ["all", "All Products"],
                ["low", "Low Stock"],
                ["out", "Out of Stock"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-blue-600 text-white"
                    : "border border-white/10 bg-[#101622] text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="mb-5 text-red-400">
              {error}
            </p>
          )}

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101622]">
            <table className="w-full min-w-[600px] text-left">
              <thead className="border-b border-white/10 text-sm text-gray-400">
                <tr>
                  <th className="p-5">Product</th>
                  <th className="p-5">Stock</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-contain"
                        />
                        <span className="font-semibold">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 font-bold">
                      {product.stock}
                    </td>

                    <td className="p-5">
                      <span
                        className={
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 5
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 5
                            ? "Low Stock"
                            : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && filtered.length === 0 && (
              <p className="p-8 text-center text-gray-400">
                No matching products found.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
