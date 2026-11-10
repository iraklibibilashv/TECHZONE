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
            {/* MOBILE / TABLET */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
              {compareProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101622] p-4"
                >
                  {/* PRODUCT IMAGE */}
                  <div className="flex h-44 items-center justify-center rounded-xl bg-white/5 p-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* PRODUCT INFO */}
                  <h3 className="mt-4 break-words text-lg font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">{product.brand}</p>

                  {/* PRODUCT SPECIFICATIONS */}
                  <div className="mt-5 flex-1 divide-y divide-white/10">
                    <div className="flex min-w-0 items-start justify-between gap-3 py-3">
                      <span className="shrink-0 text-sm text-gray-400">
                        Price
                      </span>
                      <span className="min-w-0 break-words text-right font-bold text-blue-400">
                        ₾{product.price.toLocaleString("en-US")}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start justify-between gap-3 py-3">
                      <span className="shrink-0 text-sm text-gray-400">
                        Brand
                      </span>
                      <span className="min-w-0 break-words text-right text-sm">
                        {product.brand}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start justify-between gap-3 py-3">
                      <span className="shrink-0 text-sm text-gray-400">
                        Model
                      </span>
                      <span className="min-w-0 break-words text-right text-sm">
                        {product.model}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start justify-between gap-3 py-3">
                      <span className="shrink-0 text-sm text-gray-400">
                        Category
                      </span>
                      <span className="min-w-0 break-words text-right text-sm">
                        {product.category?.name ?? "N/A"}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start justify-between gap-3 py-3">
                      <span className="text-sm text-gray-400">Rating</span>
                      <span className="text-sm text-yellow-400">
                        ★ {product.rating}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start justify-between gap-3 py-3">
                      <span className="text-sm text-gray-400">Stock</span>
                      <span
                        className={`text-right text-sm ${
                          product.stock > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} available`
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      to={`/products/${product.id}`}
                      className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold transition hover:bg-blue-500"
                    >
                      View Product
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* DESKTOP COMPARISON TABLE */}
            <div className="hidden w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#101622] lg:block">
              <table className="w-full table-fixed border-collapse text-left">
                <thead>
                  <tr>
                    <th className="w-36 border-b border-white/10 p-4 text-sm text-gray-400 xl:w-40 xl:p-5">
                      Product
                    </th>

                    {compareProducts.map((product) => (
                      <th
                        key={product.id}
                        className="min-w-0 border-b border-white/10 p-4 align-top xl:p-5"
                      >
                        <div className="flex min-w-0 flex-col items-start gap-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-28 w-full max-w-full object-contain xl:h-36"
                          />

                          <div className="min-w-0 w-full">
                            <h3 className="break-words text-base font-bold xl:text-lg">
                              {product.name}
                            </h3>

                            <p className="mt-1 break-words text-sm text-gray-400">
                              {product.brand}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCompare(product.id)}
                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
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
                        `₾${p.price.toLocaleString("en-US")}`,
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
                      <th className="break-words border-b border-white/10 p-4 text-sm font-semibold text-gray-400 xl:p-5">
                        {row.label}
                      </th>

                      {compareProducts.map((product) => (
                        <td
                          key={product.id}
                          className="break-words border-b border-white/10 p-4 text-sm text-gray-200 xl:p-5"
                        >
                          {row.render(product)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr>
                    <th className="p-4 text-sm text-gray-400 xl:p-5">
                      Details
                    </th>

                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 xl:p-5">
                        <Link
                          to={`/products/${product.id}`}
                          className="inline-block max-w-full rounded-xl bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold transition hover:bg-blue-500 xl:px-4"
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
