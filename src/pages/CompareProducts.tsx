import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import type { Product } from "../types/product";

type CompareField = "price" | "rating" | "stock";

type ComparisonResult = "better" | "worse" | "equal";

function getComparisonResult(
  product: Product,
  products: Product[],
  field: CompareField,
): ComparisonResult {
  if (products.length < 2) return "equal";

  const values = products.map((p) => p[field]);
  const currentValue = product[field];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) return "equal";

  if (field === "price") {
    if (currentValue === min) return "better";
    if (currentValue === max) return "worse";
  } else {
    if (currentValue === max) return "better";
    if (currentValue === min) return "worse";
  }

  // Middle value when comparing 3 products
  return "equal";
}

function ComparisonValue({
  product,
  products,
  field,
}: {
  product: Product;
  products: Product[];
  field: CompareField;
}) {
  const result = getComparisonResult(product, products, field);

  const value =
    field === "price"
      ? `₾${product.price.toLocaleString("en-US")}`
      : field === "rating"
        ? `★ ${product.rating}`
        : product.stock > 0
          ? `${product.stock} available`
          : "Out of Stock";

  const colorClass =
    result === "better"
      ? "text-emerald-400"
      : result === "worse"
        ? "text-red-400"
        : "text-gray-300";

  const arrow =
    result === "equal"
      ? "−"
      : field === "price"
        ? result === "better"
          ? "↓"
          : "↑"
        : result === "better"
          ? "↑"
          : "↓";

  return (
    <span
      className={`inline-flex max-w-full flex-wrap items-center justify-end gap-2 font-semibold ${colorClass}`}
      title={
        result === "better"
          ? "Best value among compared products"
          : result === "worse"
            ? "Lowest-ranked value among compared products"
            : "Equal or intermediate value"
      }
    >
      <span aria-hidden="true" className="text-lg font-black">
        {arrow}
      </span>
      <span>{value}</span>
    </span>
  );
}

export default function CompareProducts() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  const rows: {
    label: string;
    field?: CompareField;
    render?: (product: Product) => string;
  }[] = [
    { label: "Price", field: "price" },
    { label: "Brand", render: (p) => p.brand },
    { label: "Model", render: (p) => p.model },
    {
      label: "Category",
      render: (p) => p.category?.name ?? "N/A",
    },
    { label: "Rating", field: "rating" },
    { label: "Stock", field: "stock" },
  ];

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
            {/* COMPARISON LEGEND */}
            {compareProducts.length >= 2 && (
              <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-white/10 bg-[#101622] px-4 py-3 text-xs sm:text-sm">
                <span className="font-medium text-emerald-400">
                  ↑↓ Better value
                </span>

                <span className="font-medium text-red-400">↑↓ Worse value</span>

                <span className="font-medium text-gray-400">
                  − Equal / Middle
                </span>
              </div>
            )}

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
                    {rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex min-w-0 items-start justify-between gap-3 py-3"
                      >
                        <span className="shrink-0 text-sm text-gray-400">
                          {row.label}
                        </span>

                        {row.field ? (
                          <div className="min-w-0 text-right text-sm">
                            <ComparisonValue
                              product={product}
                              products={compareProducts}
                              field={row.field}
                            />
                          </div>
                        ) : (
                          <span className="min-w-0 break-words text-right text-sm text-gray-200">
                            {row.render?.(product)}
                          </span>
                        )}
                      </div>
                    ))}
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
                  {rows.map((row) => (
                    <tr key={row.label}>
                      <th className="break-words border-b border-white/10 p-4 text-sm font-semibold text-gray-400 xl:p-5">
                        {row.label}
                      </th>

                      {compareProducts.map((product) => (
                        <td
                          key={product.id}
                          className="break-words border-b border-white/10 p-4 text-sm text-gray-200 xl:p-5"
                        >
                          {row.field ? (
                            <ComparisonValue
                              product={product}
                              products={compareProducts}
                              field={row.field}
                            />
                          ) : (
                            row.render?.(product)
                          )}
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
