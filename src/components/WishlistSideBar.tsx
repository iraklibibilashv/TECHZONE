
import { useEffect } from "react";
import type { Product } from "../types/product";
import ButtonSpinner from "./ButtonSpinner";

type WishlistSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  loading: boolean;
  error: string;
  updatingFavoriteId: number | null;
  addingToCartId?: number | null;
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export default function WishlistSidebar({
  isOpen,
  onClose,
  products,
  loading,
  error,
  updatingFavoriteId,
  addingToCartId = null,
  onRemove,
  onAddToCart,
}: WishlistSidebarProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close wishlist"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
      />

      {/* Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#101622] text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <h2 className="text-2xl font-bold">
              My Wishlist
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {products.length} favorite products
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xl text-gray-400 transition hover:border-blue-500 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Wishlist Products */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {loading ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center gap-4 py-16"
            >
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-500/10 border-t-blue-500" />

                <span className="text-lg font-black text-white">
                  T<span className="text-blue-500">Z</span>
                </span>
              </div>

              <p className="animate-pulse text-sm text-gray-400">
                Loading your wishlist...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="text-6xl">♡</span>

              <h3 className="mt-5 text-xl font-semibold">
                Your wishlist is empty
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Save products you love for later.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Explore Products
              </button>
            </div>
          ) : (
            products.map((product) => {
              const isRemoving =
                updatingFavoriteId === product.id;

              const isAdding =
                addingToCartId === product.id;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-white/10 bg-[#090d16] p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-24 w-24 shrink-0 rounded-xl bg-white object-contain p-2"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold text-white">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.brand}
                      </p>

                      <p className="mt-2 text-sm font-bold text-blue-400">
                        ₾{product.price.toLocaleString()}
                      </p>

                      <button
                        type="button"
                        onClick={() => onRemove(product)}
                        disabled={updatingFavoriteId !== null}
                        className="mt-2 inline-flex min-h-5 items-center gap-2 text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
                      >
                        {isRemoving ? (
                          <>
                            <ButtonSpinner />
                            Removing...
                          </>
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <span
                      className={`text-xs ${
                        product.stock > 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {product.stock > 0
                        ? `In Stock: ${product.stock}`
                        : "Out of Stock"}
                    </span>

                    <button
                      type="button"
                      disabled={
                        product.stock <= 0 ||
                        addingToCartId !== null
                      }
                      onClick={() => onAddToCart(product)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isAdding ? (
                        <>
                          <ButtonSpinner />
                          Adding...
                        </>
                      ) : (
                        "🛒 Add to Cart"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#0c111d] p-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/10 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500 hover:text-white"
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </div>
  );
}
