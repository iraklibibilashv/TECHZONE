import type { Category } from "../types/category";

type CategoriesProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function Categories({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesProps) {
  return (
    <section
      id="categories"
      className="w-full min-w-0 px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-8"
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        {/* SECTION HEADER */}
        <div className="mb-6 min-w-0 sm:mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 sm:text-sm">
            Explore Our Store
          </p>

          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Shop by Category
          </h2>

          <p className="mt-3 text-sm text-gray-400 sm:text-base">
            Find the right technology for your needs.
          </p>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {/* ALL PRODUCTS */}
          <button
            type="button"
            onClick={() => onSelectCategory("All")}
            aria-pressed={selectedCategory === "All"}
            className={`h-full min-w-0 overflow-hidden rounded-xl border text-left transition duration-300 hover:-translate-y-1 ${
              selectedCategory === "All"
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-white/10 bg-white/5 text-gray-300 hover:border-blue-500"
            }`}
          >
            <div className="flex h-24 items-center justify-center bg-gradient-to-br from-blue-600/30 to-blue-950 sm:h-32">
              <span className="text-3xl sm:text-4xl">🛍️</span>
            </div>

            <span className="block min-w-0 break-words px-3 py-3 text-xs font-semibold sm:px-4 sm:text-sm">
              All Products
            </span>
          </button>

          {/* API CATEGORIES */}
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              aria-pressed={selectedCategory === category.name}
              className={`h-full min-w-0 overflow-hidden rounded-xl border text-left transition duration-300 hover:-translate-y-1 ${
                selectedCategory === category.name
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-blue-500"
              }`}
            >
              {/* CATEGORY IMAGE */}
              <div className="h-24 w-full min-w-0 overflow-hidden bg-white/5 sm:h-32">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full max-w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              {/* CATEGORY NAME */}
              <span className="block min-w-0 break-words px-3 py-3 text-xs font-semibold sm:px-4 sm:text-sm">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
