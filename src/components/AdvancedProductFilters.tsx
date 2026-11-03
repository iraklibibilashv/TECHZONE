import { useMemo } from "react";
import type { Product } from "../types/product";

export type AdvancedFilters = {
  brand: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  inStockOnly: boolean;
  sortBy: string;
};

export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  brand: "All",
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  inStockOnly: false,
  sortBy: "default",
};

type AdvancedProductFiltersProps = {
  products: Product[];
  filters: AdvancedFilters;
  onChange: (filters: AdvancedFilters) => void;
  resultCount: number;
};

export default function AdvancedProductFilters({
  products,
  filters,
  onChange,
  resultCount,
}: AdvancedProductFiltersProps) {
  const brands = useMemo(() => {
    const uniqueBrands = products
      .map((product) => product.brand)
      .filter((brand): brand is string => Boolean(brand));

    return [...new Set(uniqueBrands)].sort((a, b) => a.localeCompare(b));
  }, [products]);

  function updateFilter<K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K],
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  function resetFilters() {
    onChange({ ...DEFAULT_ADVANCED_FILTERS });
  }

  const hasActiveFilters =
    filters.brand !== "All" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.minRating !== 0 ||
    filters.inStockOnly ||
    filters.sortBy !== "default";

  const inputClass =
    "block w-full min-w-0 max-w-full rounded-xl " +
    "border border-white/10 bg-[#090d16] " +
    "px-3 py-3 text-sm text-white outline-none " +
    "transition focus:border-cyan-500/60 " +
    "sm:px-4";

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-4 shadow-xl sm:p-6">
        {/* HEADER */}
        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white">Advanced Filters</h2>

            <p className="mt-1 text-sm text-gray-400">
              Find the perfect product for your needs.
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="w-full shrink-0 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:py-2"
          >
            Reset Filters
          </button>
        </div>

        {/* FILTERS GRID */}
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* BRAND */}
          <div className="min-w-0">
            <label
              htmlFor="filter-brand"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Brand
            </label>

            <select
              id="filter-brand"
              value={filters.brand}
              onChange={(e) => updateFilter("brand", e.target.value)}
              className={inputClass}
            >
              <option value="All">All Brands</option>

              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* MIN PRICE */}
          <div className="min-w-0">
            <label
              htmlFor="filter-min-price"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Min Price
            </label>

            <input
              id="filter-min-price"
              type="number"
              min="0"
              placeholder="Minimum price"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* MAX PRICE */}
          <div className="min-w-0">
            <label
              htmlFor="filter-max-price"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Max Price
            </label>

            <input
              id="filter-max-price"
              type="number"
              min="0"
              placeholder="Maximum price"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* RATING */}
          <div className="min-w-0">
            <label
              htmlFor="filter-rating"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Minimum Rating
            </label>

            <select
              id="filter-rating"
              value={filters.minRating}
              onChange={(e) =>
                updateFilter("minRating", Number(e.target.value))
              }
              className={inputClass}
            >
              <option value={0}>All Ratings</option>
              <option value={1}>1+ Stars</option>
              <option value={2}>2+ Stars</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          {/* SORT */}
          <div className="min-w-0">
            <label
              htmlFor="filter-sort"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Sort By
            </label>

            <select
              id="filter-sort"
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className={inputClass}
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-6 flex min-w-0 flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => updateFilter("inStockOnly", e.target.checked)}
              className="h-4 w-4 shrink-0 accent-cyan-500"
            />

            <span className="text-sm font-medium text-gray-300">
              In Stock Only
            </span>
          </label>

          <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-gray-400">
            <span>Showing</span>

            <span className="font-bold text-cyan-400">{resultCount}</span>

            <span>{resultCount === 1 ? "product" : "products"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
