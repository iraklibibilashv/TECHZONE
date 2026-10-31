
export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101622] p-5">
      <div className="mb-5 aspect-square animate-pulse rounded-xl bg-white/10" />

      <div className="mb-3 h-3 w-20 animate-pulse rounded bg-white/10" />

      <div className="mb-3 h-5 w-4/5 animate-pulse rounded bg-white/10" />

      <div className="mb-5 h-4 w-2/3 animate-pulse rounded bg-white/10" />

      <div className="flex items-center justify-between">
        <div className="h-7 w-24 animate-pulse rounded bg-white/10" />

        <div className="h-10 w-28 animate-pulse rounded-xl bg-blue-500/20" />
      </div>
    </div>
  );
}
