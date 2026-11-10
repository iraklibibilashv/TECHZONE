import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import ConfirmModal from "../../components/ConfirmModal";

import { getCategories } from "../../services/api";

import { useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminApi";

import type { Category } from "../../types/category";
import type { CategoryRequest } from "../../services/adminApi";

const emptyForm: CategoryRequest = {
  name: "",
  description: "",
  imageUrl: "",
};

const inputClass =
  "block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm";

const labelClass = "mb-2 block text-sm font-medium text-gray-300";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [form, setForm] = useState<CategoryRequest>({
    ...emptyForm,
  });

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getCategories();
      setCategories(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function openCreate() {
    setEditingCategory(null);
    setForm({ ...emptyForm });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);

    setForm({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
    });

    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingCategory(null);
  }

  function updateField(field: keyof CategoryRequest, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: CategoryRequest = {
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
        setSuccess("Category updated successfully!");
      } else {
        await createCategory(payload);
        setSuccess("Category created successfully!");
      }

      setFormOpen(false);
      setEditingCategory(null);

      // Refresh Admin Categories table
      await loadCategories();

      // Invalidate related React Query caches
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["product"],
        }),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
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
      await deleteCategory(deleteTarget.id);

      setDeleteTarget(null);
      setSuccess("Category deleted successfully!");

      // Refresh Admin Categories table
      await loadCategories();

      // Invalidate related React Query caches
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["product"],
        }),
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category.",
      );

      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#090d16] text-white">
      <AdminSidebar />

      <main className="min-w-0 lg:ml-72">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-12">
          {/* HEADER */}
          <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold text-blue-400">
                TECHZONE ADMIN
              </p>

              <h1 className="break-words text-2xl font-black sm:text-4xl">
                Categories Management
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
                Create, edit and organize product categories.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="w-full shrink-0 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
            >
              + Add Category
            </button>
          </div>

          {/* MESSAGES */}
          {error && (
            <div
              role="alert"
              className="mb-6 break-words rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-6 break-words rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400"
            >
              {success}
            </div>
          )}

          {/* CATEGORY COUNT */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#101622] p-5 sm:p-6">
            <p className="text-sm text-gray-400">Total Categories</p>

            <p className="mt-2 text-3xl font-black">
              {loading ? "..." : categories.length}
            </p>
          </div>

          {/* MOBILE TABLE HINT */}
          <p className="mb-3 text-xs text-gray-500 lg:hidden">
            Swipe horizontally to view all category details →
          </p>

          {/* CATEGORIES TABLE */}
          <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 bg-[#101622]">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr className="text-xs uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Description</th>
                  <th className="px-6 py-5">Products</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/5 p-2">
                            {category.imageUrl ? (
                              <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <span className="text-2xl text-gray-500">▦</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate font-semibold text-white">
                              {category.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ID: {category.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="max-w-xs px-6 py-4 text-sm text-gray-400">
                        <p className="line-clamp-2">
                          {category.description || "No description"}
                        </p>
                      </td>

                      {/* PRODUCT COUNT */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-400">
                          {category.productCount}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => openEdit(category)}
                            className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(category)}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
            className="max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-xl overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#101622] p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-7"
          >
            {/* MODAL HEADER */}
            <div className="mb-6 flex items-start justify-between gap-4 sm:mb-7">
              <div className="min-w-0">
                <h2
                  id="category-form-title"
                  className="text-xl font-bold text-white sm:text-2xl"
                >
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Fill in the category information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSave} className="min-w-0 space-y-5">
              {/* NAME */}
              <div className="min-w-0">
                <label htmlFor="category-name" className={labelClass}>
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Graphics Cards"
                  className={inputClass}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="min-w-0">
                <label htmlFor="category-description" className={labelClass}>
                  Description
                </label>

                <textarea
                  id="category-description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe this category..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* IMAGE URL */}
              <div className="min-w-0">
                <label htmlFor="category-image" className={labelClass}>
                  Image URL
                </label>

                <input
                  id="category-image"
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={inputClass}
                />
              </div>

              {/* IMAGE PREVIEW */}
              {form.imageUrl && (
                <div className="min-w-0 rounded-xl border border-white/10 bg-[#090d16] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Image Preview
                  </p>

                  <img
                    src={form.imageUrl}
                    alt="Category preview"
                    className="h-32 w-full object-contain sm:h-36"
                  />
                </div>
              )}

              {/* FORM ERROR */}
              {error && (
                <p role="alert" className="break-words text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* FORM ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeForm}
                  className="w-full rounded-xl border border-white/10 px-5 py-3 font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 sm:w-auto"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
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
