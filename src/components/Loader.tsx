export default function Loader() {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center gap-6">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-500/10 border-t-blue-500" />

        <div className="absolute inset-3 animate-pulse rounded-full bg-blue-500/10" />

        <span className="text-2xl font-black tracking-tight text-white">
          T<span className="text-blue-500">Z</span>
        </span>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-white">Loading TECHZONE</p>

        <p className="mt-2 animate-pulse text-sm text-gray-400">
          Preparing your shopping experience...
        </p>
      </div>
    </div>
  );
}
