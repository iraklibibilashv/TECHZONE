
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";

import {
  getProducts,
  getCategories,
} from "../../services/api";

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

        const [productsData, categoriesData] =
          await Promise.all([
            getProducts(),
            getCategories(),
          ]);

        if (cancelled) return;

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
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

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

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
    <div className="min-h-screen bg-[#090d16] text-white">
      <AdminSidebar />

      <div className="lg:ml-72">
        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {/* HEADER */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-400">
                TECHZONE ADMIN
              </p>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Dashboard Overview
              </h1>

              <p className="mt-3 text-gray-400">
                Manage your store, products and categories.
              </p>
            </div>

            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-[#101622] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/50 hover:text-white"
            >
              View Store ↗
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400"
            >
              {error}
            </div>
          )}

          {/* STATS */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-[#101622] p-6 transition hover:border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">
                    {stat.title}
                  </span>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${stat.color} ${stat.background}`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <p className="mt-5 text-4xl font-black">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* MANAGEMENT */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* PRODUCTS */}
            <div className="rounded-2xl border border-white/10 bg-[#101622] p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-400">
                ▣
              </div>

              <h2 className="text-2xl font-bold">
                Products Management
              </h2>

              <p className="mt-3 leading-relaxed text-gray-400">
                Add new products, update prices and stock,
                manage product information and remove items.
              </p>

              <Link
                to="/admin/products"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
              >
                Manage Products →
              </Link>
            </div>

            {/* CATEGORIES */}
            <div className="rounded-2xl border border-white/10 bg-[#101622] p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl text-purple-400">
                ▦
              </div>

              <h2 className="text-2xl font-bold">
                Categories Management
              </h2>

              <p className="mt-3 leading-relaxed text-gray-400">
                Create categories, edit their information,
                update images and organize your store.
              </p>

              <Link
                to="/admin/categories"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
              >
                Manage Categories →
              </Link>
            </div>
          </div>

          {/* RECENT PRODUCTS */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#101622]">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-xl font-bold">
                Products Preview
              </h2>

              <Link
                to="/admin/products"
                className="text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <p className="p-8 text-gray-400">
                Loading products...
              </p>
            ) : (
              <div className="divide-y divide-white/10">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 p-5 transition hover:bg-white/[0.02]"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/5 p-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {product.category?.name}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-bold text-white">
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
                  <p className="p-8 text-gray-400">
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
