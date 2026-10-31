
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

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
  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Our Collection
          </p>

          <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
            Popular Products
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Discover the right technology for you.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:border-blue-500 hover:text-white"
        >
          View All Products →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            isFavorite={favoriteIds.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            favoriteLoading={
              updatingFavoriteId === product.id
            }
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-4xl">📦</p>

          <p className="mt-4 font-semibold text-white">
            No Products Found
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Products will appear here once they are loaded from the API.
          </p>
        </div>
      )}
    </section>
  );
}
