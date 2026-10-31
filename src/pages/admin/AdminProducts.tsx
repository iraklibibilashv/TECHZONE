import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import ConfirmModal from "../../components/ConfirmModal";
import SpecificationEditor from "../../components/admin/SpecificationEditor";

import { getProducts, getCategories } from "../../services/api";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/adminApi";

import type { ProductRequest } from "../../services/adminApi";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

type ProductForm = {
  name: string;
  description: string;
  brand: string;
  model: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  imageUrls: string;
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  brand: "",
  model: "",
  price: "",
  stock: "",
  categoryId: "",
  imageUrl: "",
  imageUrls: "",
  additionalProp1: "",
  additionalProp2: "",
  additionalProp3: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500";

const labelClass = "mb-2 block text-sm font-medium text-gray-300";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [specifications, setSpecifications] = useState<Record<string, string>>(
    {},
  );

  const [form, setForm] = useState<ProductForm>({
    ...emptyForm,
  });

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.model.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        String(product.category?.id) === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const outOfStock = products.filter((product) => product.stock <= 0).length;

  function updateField(field: keyof ProductForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function openCreate() {
    setEditingProduct(null);
    setSpecifications({});

    setForm({
      ...emptyForm,
      categoryId: categories.length > 0 ? String(categories[0].id) : "",
    });

    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      description: "",
      brand: product.brand,
      model: product.model,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: String(product.category?.id ?? ""),
      imageUrl: product.imageUrl,
      imageUrls: "",
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    });

    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingProduct(null);
  }

  function buildPayload(): ProductRequest {
    const imageUrls = form.imageUrls
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const price = Number(form.price);
    const stock = Number(form.stock);
    const categoryId = Number(form.categoryId);

    if (!form.name.trim()) {
      throw new Error("Product name is required.");
    }

    if (!form.brand.trim()) {
      throw new Error("Brand is required.");
    }

    if (!form.model.trim()) {
      throw new Error("Model is required.");
    }

    if (form.price.trim() === "" || !Number.isFinite(price) || price < 0) {
      throw new Error("Enter a valid price.");
    }

    if (form.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
      throw new Error("Stock must be a non-negative integer.");
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new Error("Please select a category.");
    }

    if (!form.imageUrl.trim()) {
      throw new Error("Main image URL is required.");
    }

    const cleanedSpecifications = Object.fromEntries(
      Object.entries(specifications)
        .map(([key, value]) => [key.trim(), value.trim()])
        .filter(([key, value]) => key !== "" && value !== ""),
    );

    return {
      name: form.name.trim(),
      description: form.description.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      price,
      stock,
      categoryId,
      imageUrl: form.imageUrl.trim(),
      imageUrls,
      specifications: cleanedSpecifications,
    };
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    let payload: ProductRequest;

    try {
      payload = buildPayload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid product information.",
      );
      return;
    }

    setSaving(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully!");
      }

      setFormOpen(false);
      setEditingProduct(null);

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteProduct(deleteTarget.id);

      setDeleteTarget(null);
      setSuccess("Product deleted successfully!");

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete product.",
      );

      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      <AdminSidebar />

      <main className="lg:ml-72">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {/* HEADER */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-400">
                TECHZONE ADMIN
              </p>

              <h1 className="text-3xl font-black sm:text-4xl">
                Products Management
              </h1>

              <p className="mt-3 text-gray-400">
                Manage products, pricing, stock and details.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              + Add Product
            </button>
          </div>

          {/* MESSAGES */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400"
            >
              {success}
            </div>
          )}

          {/* STATISTICS */}
          <div className="mb-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                label: "Total Products",
                value: products.length,
                color: "text-blue-400",
              },
              {
                label: "Total Stock",
                value: totalStock,
                color: "text-emerald-400",
              },
              {
                label: "Out of Stock",
                value: outOfStock,
                color: "text-red-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[#101622] p-6"
              >
                <p className="text-sm text-gray-400">{stat.label}</p>

                <p className={`mt-3 text-3xl font-black ${stat.color}`}>
                  {loading ? "..." : stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#101622] p-5 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className={`${inputClass} sm:flex-1`}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className={`${inputClass} sm:w-64`}
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101622]">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr className="text-xs uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-5">Product</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Stock</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/5 p-2">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate font-semibold">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {product.brand} · {product.model}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">
                        {product.category?.name ?? "Unknown"}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ₾{product.price.toLocaleString("en-US")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                            product.stock > 0
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#101622] p-7 shadow-2xl"
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h2 id="product-form-title" className="text-2xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Enter the product information below.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={closeForm}
                aria-label="Close form"
                className="text-xl text-gray-400 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* BASIC INFORMATION */}
              <div>
                <h3 className="mb-4 border-b border-white/10 pb-3 font-semibold text-blue-400">
                  Basic Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="product-name" className={labelClass}>
                      Product Name
                    </label>

                    <input
                      id="product-name"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. NVIDIA RTX 5070"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="product-brand" className={labelClass}>
                      Brand
                    </label>

                    <input
                      id="product-brand"
                      required
                      value={form.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                      placeholder="e.g. ASUS"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="product-model" className={labelClass}>
                      Model
                    </label>

                    <input
                      id="product-model"
                      required
                      value={form.model}
                      onChange={(e) => updateField("model", e.target.value)}
                      placeholder="e.g. ROG Strix"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="product-description" className={labelClass}>
                      Description
                    </label>

                    <textarea
                      id="product-description"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="Product description..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* PRICING AND INVENTORY */}
              <div>
                <h3 className="mb-4 border-b border-white/10 pb-3 font-semibold text-blue-400">
                  Pricing & Inventory
                </h3>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="product-price" className={labelClass}>
                      Price (₾)
                    </label>

                    <input
                      id="product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="product-stock" className={labelClass}>
                      Stock
                    </label>

                    <input
                      id="product-stock"
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={form.stock}
                      onChange={(e) => updateField("stock", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="product-category" className={labelClass}>
                      Category
                    </label>

                    <select
                      id="product-category"
                      required
                      value={form.categoryId}
                      onChange={(e) =>
                        updateField("categoryId", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select category</option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* IMAGES */}
              <div>
                <h3 className="mb-4 border-b border-white/10 pb-3 font-semibold text-blue-400">
                  Product Images
                </h3>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="product-image" className={labelClass}>
                      Main Image URL
                    </label>

                    <input
                      id="product-image"
                      type="url"
                      required
                      value={form.imageUrl}
                      onChange={(e) => updateField("imageUrl", e.target.value)}
                      placeholder="https://example.com/product.jpg"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="product-images" className={labelClass}>
                      Additional Image URLs
                    </label>

                    <textarea
                      id="product-images"
                      rows={3}
                      value={form.imageUrls}
                      onChange={(e) => updateField("imageUrls", e.target.value)}
                      placeholder={
                        "https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                      }
                      className={`${inputClass} resize-none`}
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Enter one image URL per line.
                    </p>
                  </div>

                  {form.imageUrl && (
                    <div className="flex h-44 items-center justify-center rounded-xl border border-white/10 bg-[#090d16] p-4">
                      <img
                        src={form.imageUrl}
                        alt="Product preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SPECIFICATIONS */}
              <div className="border-t border-white/10 pt-6">
                <SpecificationEditor
                  value={specifications}
                  onChange={setSpecifications}
                />
              </div>

              {/* FORM ERROR */}
              {error && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeForm}
                  className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        loading={deleting}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
