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
  onClearAll: () => void;
  clearingAll: boolean;
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
  onClearAll,
  clearingAll,
  onAddToCart,
}: WishlistSidebarProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* OVERLAY */}
      <button
        type="button"
        aria-label="Close wishlist"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
      />

      {/* SIDEBAR */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className="absolute inset-y-0 right-0 flex h-[100dvh] w-full min-w-0 max-w-md flex-col overflow-hidden border-l border-white/10 bg-[#101622] text-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <h2 className="text-xl font-bold sm:text-2xl">My Wishlist</h2>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              {products.length} favorite products
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xl text-gray-400 transition hover:border-blue-500 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* CLEAR ALL */}
        {products.length > 0 && !loading && (
          <div className="flex shrink-0 justify-end border-b border-white/10 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={onClearAll}
              disabled={clearingAll || updatingFavoriteId !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearingAll ? (
                <>
                  <ButtonSpinner />
                  Clearing...
                </>
              ) : (
                "🗑 Clear All"
              )}
            </button>
          </div>
        )}

        {/* PRODUCTS */}
        <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-3 sm:p-6">
          {error && (
            <p
              role="alert"
              className="break-words rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
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
            <div className="flex h-full flex-col items-center justify-center px-2 text-center">
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
              const isRemoving = updatingFavoriteId === product.id;
              const isAdding = addingToCartId === product.id;

              return (
                <div
                  key={product.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] p-3 sm:p-4"
                >
                  {/* PRODUCT INFORMATION */}
                  <div className="flex min-w-0 gap-3 sm:gap-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain p-2 min-[380px]:h-20 min-[380px]:w-20 sm:h-24 sm:w-24"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 break-words text-sm font-semibold text-white">
                        {product.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {product.brand}
                      </p>

                      <p className="mt-2 break-words text-sm font-bold text-blue-400">
                        ₾{product.price.toLocaleString()}
                      </p>

                      {/* REMOVE */}
                      <button
                        type="button"
                        onClick={() => onRemove(product)}
                        disabled={updatingFavoriteId !== null || clearingAll}
                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {isRemoving ? (
                          <>
                            <ButtonSpinner />
                            Removing...
                          </>
                        ) : (
                          "🗑 Remove"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* STOCK AND ADD TO CART */}
                  <div className="mt-4 flex min-w-0 flex-col gap-3 border-t border-white/10 pt-4">
                    <span
                      className={`text-xs ${
                        product.stock > 0 ? "text-emerald-400" : "text-red-400"
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
                        addingToCartId !== null ||
                        clearingAll
                      }
                      onClick={() => onAddToCart(product)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* FOOTER */}
        <div className="shrink-0 border-t border-white/10 bg-[#0c111d] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
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
