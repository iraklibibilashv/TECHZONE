export type ProductFilters = {
  brand: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  inStockOnly: boolean;
  sortBy: string;
};

type Props = {
  brands: string[];
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3 text-sm text-white outline-none focus:border-blue-500";

export default function AdvancedProductFilters({
  brands,
  filters,
  onChange,
}: Props) {
  function update<K extends keyof ProductFilters>(
    field: K,
    value: ProductFilters[K],
  ) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101622] p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Advanced Filters</h2>

        <button
          type="button"
          onClick={() =>
            onChange({
              brand: "All",
              minPrice: "",
              maxPrice: "",
              minRating: "0",
              inStockOnly: false,
              sortBy: "default",
            })
          }
          className="text-sm font-semibold text-blue-400 hover:text-blue-300"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm text-gray-400">Brand</label>

          <select
            value={filters.brand}
            onChange={(e) => update("brand", e.target.value)}
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

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Minimum Price
          </label>

          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="Min ₾"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Maximum Price
          </label>

          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="Max ₾"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Minimum Rating
          </label>

          <select
            value={filters.minRating}
            onChange={(e) => update("minRating", e.target.value)}
            className={inputClass}
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">Sort By</label>

          <select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value)}
            className={inputClass}
          >
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => update("inStockOnly", e.target.checked)}
            className="h-4 w-4 accent-blue-500"
          />
          In Stock Only
        </label>
      </div>
    </div>
  );
}
