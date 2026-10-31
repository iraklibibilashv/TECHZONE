import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareProducts() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  return (
    <main className="min-h-screen bg-[#090d16] px-5 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to Store
            </Link>

            <h1 className="text-3xl font-black">Compare Products</h1>

            <p className="mt-2 text-gray-400">
              Compare up to 3 products side by side.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              Clear All
            </button>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#101622] px-6 py-20 text-center">
            <div className="mb-5 text-5xl">⇄</div>

            <h2 className="text-2xl font-bold">No Products Selected</h2>

            <p className="mt-3 text-gray-400">
              Choose products from the store to compare them.
            </p>

            <Link
              to="/"
              className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#101622]">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-40 border-b border-white/10 p-5 text-gray-400">
                    Product
                  </th>

                  {compareProducts.map((product) => (
                    <th
                      key={product.id}
                      className="min-w-48 border-b border-white/10 p-5 align-top"
                    >
                      <div className="flex flex-col items-start gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-36 w-full object-contain"
                        />

                        <div>
                          <h3 className="text-lg font-bold">{product.name}</h3>
                          <p className="mt-1 text-sm text-gray-400">
                            {product.brand}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCompare(product.id)}
                          className="text-sm font-semibold text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {[
                  {
                    label: "Price",
                    render: (p: (typeof compareProducts)[number]) =>
                      `$${p.price.toFixed(2)}`,
                  },
                  {
                    label: "Brand",
                    render: (p: (typeof compareProducts)[number]) => p.brand,
                  },
                  {
                    label: "Model",
                    render: (p: (typeof compareProducts)[number]) => p.model,
                  },
                  {
                    label: "Category",
                    render: (p: (typeof compareProducts)[number]) =>
                      p.category?.name ?? "N/A",
                  },
                  {
                    label: "Rating",
                    render: (p: (typeof compareProducts)[number]) =>
                      `★ ${p.rating}`,
                  },
                  {
                    label: "Stock",
                    render: (p: (typeof compareProducts)[number]) =>
                      p.stock > 0 ? `${p.stock} available` : "Out of Stock",
                  },
                ].map((row) => (
                  <tr key={row.label}>
                    <th className="border-b border-white/10 p-5 text-sm font-semibold text-gray-400">
                      {row.label}
                    </th>

                    {compareProducts.map((product) => (
                      <td
                        key={product.id}
                        className="border-b border-white/10 p-5 text-sm text-gray-200"
                      >
                        {row.render(product)}
                      </td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <th className="p-5 text-gray-400">Details</th>

                  {compareProducts.map((product) => (
                    <td key={product.id} className="p-5">
                      <Link
                        to={`/products/${product.id}`}
                        className="inline-block rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                      >
                        View Product
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
