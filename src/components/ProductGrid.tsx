import ProductCard from "./ProductCard";
import type { Product } from "../types/product";
import { useMemo } from "react";

type ProductGridProps = {
  products: Product[];
  onAddToCart: (product: Product) => void;
  favoriteIds: number[];
  onToggleFavorite: (product: Product) => void;
  updatingFavoriteId: number | null;
};

export default function ProductGrid({
  products,
  onAddToCart,
  favoriteIds,
  onToggleFavorite,
  updatingFavoriteId,
}: ProductGridProps) {
  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
      {/* SECTION HEADER */}
      <div className="mb-7 flex min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 sm:text-sm">
            Our Collection
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl md:text-4xl">
            Popular Products
          </h2>

          <p className="mt-3 text-sm text-gray-400">
            Discover the right technology for you.
          </p>
        </div>

        <a
          href="#products"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:border-blue-500 hover:text-white sm:w-auto"
        >
          View All Products →
        </a>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="h-full min-w-0">
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              isFavorite={favoriteIdSet.has(product.id)}
              onToggleFavorite={onToggleFavorite}
              favoriteLoading={updatingFavoriteId === product.id}
            />
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center sm:py-16">
          <p className="text-4xl">📦</p>

          <p className="mt-4 font-semibold text-white">No Products Found</p>

          <p className="mt-2 text-sm text-gray-500">
            No products match your current filters.
          </p>
        </div>
      )}
    </section>
  );
}
