import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProducts } from "../services/api";
import type { Product } from "../types/product";
import ProductReviews from "../components/ProductReview";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const products = await getProducts();

        if (cancelled) return;

        const foundProduct = products.find((item) => item.id === Number(id));

        if (!foundProduct) {
          setError("Product not found.");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Failed to load product.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#090d16] px-4 text-center text-white">
        <h1 className="break-words text-xl font-bold sm:text-2xl">
          {error || "Product not found."}
        </h1>

        <Link
          to="/"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#090d16] text-white">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* BACK BUTTON */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-blue-400"
        >
          ← Back to Products
        </Link>

        {/* PRODUCT DETAILS */}
        <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          {/* PRODUCT IMAGE */}
          <div className="flex min-h-[260px] min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#101622] p-4 sm:min-h-[350px] sm:rounded-3xl sm:p-8 lg:min-h-[400px] lg:p-10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-[260px] w-full max-w-full object-contain sm:max-h-[350px] lg:max-h-[400px]"
            />
          </div>

          {/* PRODUCT INFO */}
          <div className="flex min-w-0 flex-col justify-center">
            {/* CATEGORY */}
            <p className="break-words text-xs font-semibold uppercase tracking-widest text-blue-400 sm:text-sm">
              {product.category.name}
            </p>

            {/* PRODUCT NAME */}
            <h1 className="mt-4 break-words text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
              {product.name}
            </h1>

            {/* BRAND AND MODEL */}
            <p className="mt-3 break-words text-sm text-gray-400 sm:text-lg">
              {product.brand} · {product.model}
            </p>

            {/* RATING */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-xl text-amber-400">★</span>

              <span className="text-lg font-bold">
                {product.rating.toFixed(1)}
              </span>

              <span className="text-sm text-gray-500">Product Rating</span>
            </div>

            {/* STOCK */}
            <div className="mt-5">
              <span
                className={`inline-flex max-w-full break-words rounded-lg px-4 py-2 text-sm font-semibold ${
                  product.stock > 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {product.stock > 0
                  ? `In Stock: ${product.stock}`
                  : "Out of Stock"}
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-6 min-w-0 border-t border-white/10 pt-6 sm:mt-8 sm:pt-8">
              <p className="text-sm text-gray-400">Price</p>

              <p className="mt-2 break-words text-3xl font-black text-blue-400 sm:text-4xl">
                ₾{product.price.toLocaleString("en-US")}
              </p>
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101622] p-4 sm:mt-8 sm:p-6">
              <h2 className="text-lg font-bold">Product Information</h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex min-w-0 justify-between gap-4">
                  <span className="shrink-0 text-gray-400">Brand</span>

                  <span className="min-w-0 break-words text-right">
                    {product.brand}
                  </span>
                </div>

                <div className="flex min-w-0 justify-between gap-4">
                  <span className="shrink-0 text-gray-400">Model</span>

                  <span className="min-w-0 break-words text-right">
                    {product.model}
                  </span>
                </div>

                <div className="flex min-w-0 justify-between gap-4">
                  <span className="shrink-0 text-gray-400">Category</span>

                  <span className="min-w-0 break-words text-right">
                    {product.category.name}
                  </span>
                </div>

                <div className="flex min-w-0 justify-between gap-4">
                  <span className="shrink-0 text-gray-400">
                    Available Stock
                  </span>

                  <span className="min-w-0 break-words text-right">
                    {product.stock}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT REVIEWS */}
        <div className="mt-8 min-w-0 sm:mt-12">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}
