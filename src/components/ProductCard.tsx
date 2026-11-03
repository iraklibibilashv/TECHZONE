import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { useCompare } from "../context/CompareContext";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  favoriteLoading: boolean;
};

export default function ProductCard({
  product,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  favoriteLoading,
}: ProductCardProps) {
  const detailsUrl = `/products/${product.id}`;

  const { compareProducts, addToCompare, removeFromCompare, isCompared } =
    useCompare();

  const compared = isCompared(product.id);
  const compareLimitReached = compareProducts.length >= 3;

  function handleCompare() {
    if (compared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  }

  return (
    <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101622] transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/30">
      {/* PRODUCT IMAGE */}
      <div className="relative flex h-48 min-w-0 items-center justify-center overflow-hidden bg-white/[0.03] p-4 sm:h-56 sm:p-6">
        <Link
          to={detailsUrl}
          aria-label={`View details for ${product.name}`}
          className="flex h-full w-full min-w-0 items-center justify-center"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-full max-h-full w-full max-w-full object-contain transition duration-500 group-hover:scale-110"
          />
        </Link>

        {/* FAVORITE */}
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          disabled={favoriteLoading}
          onClick={() => onToggleFavorite(product)}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#090d16]/80 text-xl transition disabled:cursor-wait disabled:opacity-50 sm:right-4 sm:top-4 ${
            isFavorite ? "text-red-400" : "text-gray-300 hover:text-red-400"
          }`}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {/* CATEGORY */}
        <span className="pointer-events-none absolute bottom-3 left-3 max-w-[80%] truncate rounded-lg border border-white/10 bg-[#090d16]/80 px-3 py-1 text-xs text-gray-300 sm:bottom-4 sm:left-4">
          {product.category?.name}
        </span>
      </div>

      {/* PRODUCT CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        {/* BRAND */}
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-blue-400">
          {product.brand}
        </p>

        {/* PRODUCT NAME */}
        <Link to={detailsUrl} className="mt-2 block min-w-0">
          <h3 className="line-clamp-2 min-h-[3.5rem] break-words text-lg font-bold text-white transition hover:text-blue-400 sm:line-clamp-1 sm:min-h-0">
            {product.name}
          </h3>
        </Link>

        {/* MODEL */}
        <p className="mt-1 truncate text-sm text-gray-500">{product.model}</p>

        {/* RATING AND STOCK */}
        <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-amber-400">★</span>
            <span className="font-semibold text-white">
              {product.rating.toFixed(1)}
            </span>
          </div>

          <span
            className={`text-xs ${
              product.stock > 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </span>
        </div>

        {/* COMPARE */}
        <button
          type="button"
          onClick={handleCompare}
          disabled={!compared && compareLimitReached}
          aria-pressed={compared}
          title={
            !compared && compareLimitReached
              ? "You can compare up to 3 products"
              : compared
                ? "Remove from comparison"
                : "Add to comparison"
          }
          className={`mt-5 flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 ${
            compared
              ? "border-blue-500 bg-blue-500/20 text-blue-400"
              : "border-white/10 bg-white/5 text-gray-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-white"
          }`}
        >
          <span>{compared ? "✓" : "⇄"}</span>
          {compared ? "Added to Compare" : "Compare"}
        </button>

        {/* PRICE AND CART */}
        <div className="mt-auto flex min-w-0 flex-col gap-3 border-t border-white/10 pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 break-words text-2xl font-black text-white">
            ₾{product.price.toLocaleString("en-US")}
          </p>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product)}
            className="w-full shrink-0 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700 sm:w-auto"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
