import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareProducts() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  return (
    <main className="min-h-screen w-full min-w-0 bg-[#090d16] px-4 py-8 text-white sm:px-5 sm:py-12">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col items-start gap-5 sm:mb-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              to="/"
              className="mb-4 inline-block text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to Store
            </Link>

            <h1 className="text-2xl font-black sm:text-3xl">
              Compare Products
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-400 sm:text-base">
              Compare up to 3 products side by side.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="w-full rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 sm:w-auto"
            >
              Clear All
            </button>
          )}
        </div>

        {compareProducts.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-2xl border border-white/10 bg-[#101622] px-5 py-14 text-center sm:rounded-3xl sm:px-6 sm:py-20">
            <div className="mb-5 text-5xl">⇄</div>

            <h2 className="text-xl font-bold sm:text-2xl">
              No Products Selected
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
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
          <>
            <p className="mb-3 text-xs text-gray-500 sm:hidden">
              Swipe horizontally to compare products →
            </p>

            {/* SCROLLABLE COMPARISON TABLE */}
            <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 bg-[#101622] sm:rounded-3xl">
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="w-40 border-b border-white/10 p-4 text-gray-400 sm:p-5">
                      Product
                    </th>

                    {compareProducts.map((product) => (
                      <th
                        key={product.id}
                        className="min-w-48 border-b border-white/10 p-4 align-top sm:p-5"
                      >
                        <div className="flex flex-col items-start gap-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-28 w-full object-contain sm:h-36"
                          />

                          <div className="min-w-0">
                            <h3 className="break-words text-base font-bold sm:text-lg">
                              {product.name}
                            </h3>

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
                      <th className="border-b border-white/10 p-4 text-sm font-semibold text-gray-400 sm:p-5">
                        {row.label}
                      </th>

                      {compareProducts.map((product) => (
                        <td
                          key={product.id}
                          className="break-words border-b border-white/10 p-4 text-sm text-gray-200 sm:p-5"
                        >
                          {row.render(product)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr>
                    <th className="p-4 text-gray-400 sm:p-5">Details</th>

                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 sm:p-5">
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
          </>
        )}
      </div>
    </main>
  );
}
