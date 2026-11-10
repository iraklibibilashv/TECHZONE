import { useEffect, useState } from "react";
import type { CartItem } from "../types/cart";
import ButtonSpinner from "./ButtonSpinner";

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  loading: boolean;
  error: string;
  updatingId: number | null;
  onIncrease: (item: CartItem) => void;
  onDecrease: (item: CartItem) => void;
  onRemove: (productId: number) => void;
  onClearAll: () => void;
  clearingAll: boolean;
  onCheckout: () => void;
  checkoutLoading: boolean;
  checkoutSuccess: string;
};

type CartAction = {
  id: number;
  type: "increase" | "decrease" | "remove";
} | null;

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  loading,
  error,
  updatingId,
  onIncrease,
  onDecrease,
  onRemove,
  onClearAll,
  clearingAll,
  onCheckout,
  checkoutLoading,
  checkoutSuccess,
}: CartSidebarProps) {
  const [action, setAction] = useState<CartAction>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (updatingId === null) setAction(null);
  }, [updatingId]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const isBusy = updatingId !== null || checkoutLoading || clearingAll;

  function handleIncrease(item: CartItem) {
    if (isBusy || item.quantity >= item.product.stock) return;
    setAction({ id: item.id, type: "increase" });
    onIncrease(item);
  }
  function handleDecrease(item: CartItem) {
    if (isBusy || item.quantity <= 1) return;
    setAction({ id: item.id, type: "decrease" });
    onDecrease(item);
  }
  function handleRemove(item: CartItem) {
    if (isBusy) return;
    setAction({ id: item.id, type: "remove" });
    onRemove(item.id);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute inset-y-0 right-0 flex h-[100dvh] w-full min-w-0 max-w-md flex-col overflow-hidden border-l border-white/10 bg-[#101622] text-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <h2 className="text-xl font-bold sm:text-2xl">Shopping Cart</h2>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              {totalQuantity} items in your cart
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-xl text-gray-400 transition hover:border-blue-500 hover:text-white"
          >
            ×
          </button>
        </div>

        {items.length > 0 && !loading && (
          <div className="flex shrink-0 justify-end border-b border-white/10 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={onClearAll}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearingAll ? (
                <>
                  <ButtonSpinner /> Clearing...
                </>
              ) : (
                "🗑 Clear All"
              )}
            </button>
          </div>
        )}

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
                Loading your cart...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-2 text-center">
              <span className="text-6xl">🛒</span>
              <h3 className="mt-5 text-xl font-semibold">Your cart is empty</h3>
              <p className="mt-2 text-sm text-gray-400">
                Add some products to get started.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const isUpdating = updatingId === item.id;
              const increasing =
                isUpdating &&
                action?.id === item.id &&
                action.type === "increase";
              const decreasing =
                isUpdating &&
                action?.id === item.id &&
                action.type === "decrease";
              const removing =
                isUpdating &&
                action?.id === item.id &&
                action.type === "remove";
              return (
                <div
                  key={item.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] p-3 sm:p-4"
                >
                  <div className="flex min-w-0 gap-3 sm:gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain p-2 min-[380px]:h-20 min-[380px]:w-20 sm:h-24 sm:w-24"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 break-words text-sm font-semibold text-white">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {item.product.brand}
                      </p>
                      <p className="mt-2 break-words text-sm font-bold text-blue-400">
                        ₾{item.totalPrice.toLocaleString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        disabled={isBusy}
                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {removing ? (
                          <>
                            <ButtonSpinner /> Removing...
                          </>
                        ) : (
                          "🗑 Remove"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
                    <div className="flex shrink-0 items-center rounded-xl border border-white/10 bg-white/5">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item)}
                        disabled={isBusy || item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-10 w-10 items-center justify-center text-lg text-white transition hover:text-blue-400 disabled:opacity-40 sm:w-11"
                      >
                        {decreasing ? <ButtonSpinner /> : "−"}
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrease(item)}
                        disabled={isBusy || item.quantity >= item.product.stock}
                        aria-label="Increase quantity"
                        className="flex h-10 w-10 items-center justify-center text-lg text-white transition hover:text-blue-400 disabled:opacity-40 sm:w-11"
                      >
                        {increasing ? <ButtonSpinner /> : "+"}
                      </button>
                    </div>
                    <p className="min-w-0 break-words font-bold text-white">
                      ₾{item.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="shrink-0 border-t border-white/10 bg-[#0c111d] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
          <div className="mb-3 flex items-center justify-between text-sm text-gray-400">
            <span>Items</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="mb-6 flex min-w-0 items-center justify-between gap-3">
            <span className="text-lg font-semibold">Total</span>
            <span className="min-w-0 break-words text-right text-xl font-black text-blue-400 sm:text-2xl">
              ₾{totalPrice.toLocaleString()}
            </span>
          </div>
          {checkoutSuccess && (
            <div
              role="status"
              className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
            >
              <p className="font-semibold text-emerald-400">
                Checkout Successful!
              </p>
              <p className="mt-1 break-words text-sm text-gray-300">
                {checkoutSuccess}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onCheckout}
            disabled={isBusy || loading || items.length === 0}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-3 py-4 text-center text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            {checkoutLoading ? (
              <>
                <ButtonSpinner /> Processing Checkout...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-xl border border-white/10 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500 hover:text-white"
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </div>
  );
}
