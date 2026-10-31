
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

  // COMPARE CONTEXT
  const {
    compareProducts,
    addToCompare,
    removeFromCompare,
    isCompared,
  } = useCompare();

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
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101622] transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/30">

      {/* PRODUCT IMAGE */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-white/[0.03] p-6">
        <Link
          to={detailsUrl}
          aria-label={`View details for ${product.name}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
          />
        </Link>

        {/* FAVORITE BUTTON */}
        <button
          type="button"
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          aria-pressed={isFavorite}
          disabled={favoriteLoading}
          onClick={() => onToggleFavorite(product)}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#090d16]/80 text-xl transition disabled:cursor-wait disabled:opacity-50 ${
            isFavorite
              ? "text-red-400"
              : "text-gray-300 hover:text-red-400"
          }`}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {/* CATEGORY */}
        <span className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#090d16]/80 px-3 py-1 text-xs text-gray-300">
          {product.category.name}
        </span>
      </div>

      {/* PRODUCT CONTENT */}
      <div className="p-5">

        {/* BRAND */}
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          {product.brand}
        </p>

        {/* PRODUCT NAME */}
        <Link
          to={detailsUrl}
          className="mt-2 block"
        >
          <h3 className="line-clamp-1 text-lg font-bold text-white transition hover:text-blue-400">
            {product.name}
          </h3>
        </Link>

        {/* MODEL */}
        <p className="mt-1 text-sm text-gray-500">
          {product.model}
        </p>

        {/* RATING AND STOCK */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-amber-400">★</span>

            <span className="font-semibold text-white">
              {product.rating.toFixed(1)}
            </span>
          </div>

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
        </div>

        {/* COMPARE BUTTON */}
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
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            compared
              ? "border-blue-500 bg-blue-500/20 text-blue-400"
              : "border-white/10 bg-white/5 text-gray-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-white"
          }`}
        >
          <span>{compared ? "✓" : "⇄"}</span>

          {compared ? "Added to Compare" : "Compare"}
        </button>

        {/* PRICE AND ADD TO CART */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-2xl font-black text-white">
            ₾{product.price.toLocaleString("en-US")}
          </p>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product)}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
