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
        if (active) {
          setProducts(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load inventory.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // FILTER PRODUCTS
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

  // STATISTICS
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  ).length;

  const outOfStock = products.filter((product) => product.stock === 0).length;

  const stats = [
    {
      label: "Total Products",
      count: products.length,
      color: "text-blue-400",
    },
    {
      label: "Low Stock",
      count: lowStock,
      color: "text-amber-400",
    },
    {
      label: "Out of Stock",
      count: outOfStock,
      color: "text-red-400",
    },
  ];

  const filters = [
    {
      value: "all",
      label: "All Products",
    },
    {
      value: "low",
      label: "Low Stock",
    },
    {
      value: "out",
      label: "Out of Stock",
    },
  ] as const;

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#090d16] text-white">
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:ml-72 lg:px-10 lg:py-10">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          {/* HEADER */}
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold text-blue-400 sm:text-sm">
              TECHZONE ADMIN
            </p>

            <h1 className="break-words text-2xl font-black sm:text-3xl">
              Inventory Management
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
              Monitor product availability and stock levels.
            </p>
          </div>

          {/* STATISTICS */}
          <div className="my-8 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 sm:p-6"
              >
                <p className="text-sm text-gray-400">{stat.label}</p>

                <p className={`mt-3 text-3xl font-black ${stat.color}`}>
                  {loading ? "..." : stat.count}
                </p>
              </div>
            ))}
          </div>

          {/* FILTER BUTTONS */}
          <div className="mb-6 grid grid-cols-1 gap-3 min-[400px]:grid-cols-3 sm:flex sm:flex-wrap">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`min-w-0 rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-5 ${
                  filter === value
                    ? "bg-blue-600 text-white"
                    : "border border-white/10 bg-[#101622] text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-5 break-words rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          {/* MOBILE SCROLL HINT */}
          <p className="mb-3 text-xs text-gray-500 lg:hidden">
            Swipe horizontally to view inventory details →
          </p>

          {/* INVENTORY TABLE */}
          <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 bg-[#101622]">
            <table className="w-full min-w-[600px] text-left">
              <thead className="border-b border-white/10 text-sm text-gray-400">
                <tr>
                  <th className="p-5">Product</th>
                  <th className="p-5">Stock</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {/* LOADING */}
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-10 text-center text-sm text-gray-400"
                    >
                      Loading inventory...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  /* EMPTY STATE */
                  <tr>
                    <td
                      colSpan={3}
                      className="p-10 text-center text-sm text-gray-400"
                    >
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  /* PRODUCT ROWS */
                  filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      {/* PRODUCT */}
                      <td className="p-5">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/5 p-1">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[280px] truncate font-semibold">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STOCK */}
                      <td className="p-5 font-bold">{product.stock}</td>

                      {/* STATUS */}
                      <td className="p-5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold ${
                            product.stock === 0
                              ? "bg-red-500/10 text-red-400"
                              : product.stock <= 5
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {product.stock === 0
                            ? "Out of Stock"
                            : product.stock <= 5
                              ? "Low Stock"
                              : "In Stock"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* RESULTS COUNT */}
          {!loading && !error && (
            <p className="mt-4 text-xs text-gray-500">
              Showing {filtered.length} of {products.length} products
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
