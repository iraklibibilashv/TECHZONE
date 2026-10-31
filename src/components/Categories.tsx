
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
      className="px-6 py-16 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Explore Our Store
          </p>

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Shop by Category
          </h2>

          <p className="mt-3 text-gray-400">
            Find the right technology for your needs.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* All Products */}
          <button
            type="button"
            onClick={() => onSelectCategory("All")}
            className={`overflow-hidden rounded-xl border text-left transition ${
              selectedCategory === "All"
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-white/10 bg-white/5 text-gray-300 hover:border-blue-500"
            }`}
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-600/30 to-blue-950">
              <span className="text-4xl">🛍️</span>
            </div>

            <span className="block px-4 py-3 text-sm font-semibold">
              All Products
            </span>
          </button>

          {/* API Categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={`overflow-hidden rounded-xl border text-left transition ${
                selectedCategory === category.name
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-blue-500"
              }`}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="h-32 w-full object-cover"
              />

              <span className="block px-4 py-3 text-sm font-semibold">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
