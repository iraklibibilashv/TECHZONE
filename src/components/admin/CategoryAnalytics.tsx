import type { Product } from "../../types/product";

type Props = {
  products: Product[];
};

export default function CategoryAnalytics({ products }: Props) {
  const categoryCounts = products.reduce<Record<string, number>>(
    (result, product) => {
      const category = product.category?.name ?? "Other";

      result[category] = (result[category] ?? 0) + 1;

      return result;
    },
    {},
  );

  const entries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  const max = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101622] p-7">
      <h2 className="text-xl font-bold">Products by Category</h2>

      <p className="mt-2 text-sm text-gray-400">
        Product distribution across categories
      </p>

      <div className="mt-8 space-y-6">
        {entries.map(([category, count]) => (
          <div key={category}>
            <div className="mb-3 flex justify-between text-sm">
              <span className="font-semibold text-gray-300">{category}</span>

              <span className="text-gray-400">{count} products</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{
                  width: `${(count / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <p className="text-sm text-gray-400">No category data available.</p>
        )}
      </div>
    </div>
  );
}
