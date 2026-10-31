
type HeroProps = {
  onViewAllProducts: () => void;
};

export default function Hero({
  onViewAllProducts,
}: HeroProps) {
  return (
    <section
      id="home"
      className="relative mx-auto mt-8 max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#151f35] via-[#101827] to-[#090d16] px-8 py-16 md:px-14 md:py-24"
    >
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
          Technology for Everyone
        </span>

        <h1 className="mt-7 text-4xl font-black leading-tight text-white md:text-6xl">
          Technology
          <br />
          That Moves
          <span className="text-blue-500"> You Forward.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">
          Discover the latest tech, find your perfect product,
          and upgrade your everyday experience.
        </p>

        <button
          type="button"
          onClick={onViewAllProducts}
          className="mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500"
        >
          Explore Products <span>→</span>
        </button>

        <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-7">
          <div>
            <p className="text-2xl font-bold text-white">
              100%
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Quality
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-white">
              24/7
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Support
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-white">
              Fast
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Delivery
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 hidden text-[180px] opacity-10 lg:block">
        💻
      </div>
    </section>
  );
}
