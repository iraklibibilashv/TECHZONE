import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";

import { getProducts, getCategories } from "../../services/api";

import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (cancelled) return;

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Failed to load dashboard.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalProducts = products.length;
  const totalCategories = categories.length;

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const outOfStock = products.filter((product) => product.stock === 0).length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: "▣",
      color: "text-blue-400",
      background: "bg-blue-500/10",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: "▦",
      color: "text-purple-400",
      background: "bg-purple-500/10",
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: "◈",
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      icon: "!",
      color: "text-red-400",
      background: "bg-red-500/10",
    },
  ];

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#090d16] text-white">
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="min-w-0 lg:ml-72">
        <main className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-12">
          {/* HEADER */}
          <div className="mb-8 flex flex-col items-start gap-5 sm:mb-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold text-blue-400 sm:text-sm">
                TECHZONE ADMIN
              </p>

              <h1 className="break-words text-2xl font-black tracking-tight sm:text-4xl">
                Dashboard Overview
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
                Manage your store, products and categories.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-[#101622] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/50 hover:text-white sm:w-auto"
            >
              View Store ↗
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-8 break-words rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 sm:p-5"
            >
              {error}
            </div>
          )}

          {/* STATS */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 transition hover:border-blue-500/30 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 text-sm font-medium text-gray-400">
                    {stat.title}
                  </span>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${stat.color} ${stat.background}`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <p className="mt-5 text-3xl font-black sm:text-4xl">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* MANAGEMENT */}
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 sm:mt-10 sm:gap-6 xl:grid-cols-2">
            {/* PRODUCTS */}
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 sm:p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-400">
                ▣
              </div>

              <h2 className="text-xl font-bold sm:text-2xl">
                Products Management
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
                Add new products, update prices and stock, manage product
                information and remove items.
              </p>

              <Link
                to="/admin/products"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 sm:w-auto"
              >
                Manage Products →
              </Link>
            </div>

            {/* CATEGORIES */}
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 sm:p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl text-purple-400">
                ▦
              </div>

              <h2 className="text-xl font-bold sm:text-2xl">
                Categories Management
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
                Create categories, edit their information, update images and
                organize your store.
              </p>

              <Link
                to="/admin/categories"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500 sm:w-auto"
              >
                Manage Categories →
              </Link>
            </div>
          </div>

          {/* PRODUCTS PREVIEW */}
          <div className="mt-8 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101622] sm:mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:p-6">
              <h2 className="text-lg font-bold sm:text-xl">Products Preview</h2>

              <Link
                to="/admin/products"
                className="text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <p className="p-6 text-sm text-gray-400 sm:p-8">
                Loading products...
              </p>
            ) : (
              <div className="divide-y divide-white/10">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex min-w-0 items-center justify-between gap-3 p-4 transition hover:bg-white/[0.02] sm:gap-4 sm:p-5"
                  >
                    {/* PRODUCT INFO */}
                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 p-2 sm:h-16 sm:w-16">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white sm:text-base">
                          {product.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-400">
                          {product.category?.name}
                        </p>
                      </div>
                    </div>

                    {/* PRICE AND STOCK */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-white sm:text-base">
                        ₾{product.price.toLocaleString("en-US")}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          product.stock > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}

                {products.length === 0 && (
                  <p className="p-6 text-sm text-gray-400 sm:p-8">
                    No products found.
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
