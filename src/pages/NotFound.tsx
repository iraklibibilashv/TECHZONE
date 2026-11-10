import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090d16] px-4 py-16 text-white">
      <div className="w-full max-w-lg text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-blue-600/10 blur-3xl" />

          <h1 className="relative text-8xl font-black tracking-tight text-blue-500 sm:text-9xl">
            404
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-400 sm:text-base">
          Oops! The page you're looking for doesn't exist or may have been
          moved. Let's get you back on track.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
          >
            ← Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-3 font-semibold text-gray-300 transition hover:border-blue-500 hover:text-white sm:w-auto"
          >
            Go Back
          </button>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          TECHZONE — Electronics & Technology Store
        </p>
      </div>
    </main>
  );
}
