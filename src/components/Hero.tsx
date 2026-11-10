type HeroProps = {
  onViewAllProducts: () => void;
};

export default function Hero({ onViewAllProducts }: HeroProps) {
  return (
    <section
      id="home"
      className="
        relative mx-3 mt-4 w-auto min-w-0
        overflow-hidden rounded-2xl
        border border-white/10
        bg-gradient-to-br
        from-[#151f35] via-[#101827] to-[#090d16]
        px-5 py-10
        sm:mx-6 sm:mt-6 sm:px-8 sm:py-14
        md:mx-auto md:mt-8 md:rounded-3xl
        md:px-14 md:py-24
        max-w-7xl
      "
    >
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10 min-w-0 max-w-2xl">
        {/* BADGE */}
        <span
          className="
            inline-flex max-w-full
            rounded-full border border-blue-400/30
            bg-blue-500/10 px-3 py-2
            text-[10px] font-semibold
            uppercase tracking-wider
            text-blue-400
            sm:px-4 sm:text-xs sm:tracking-widest
          "
        >
          Technology for Everyone
        </span>

        {/* TITLE */}
        <h1
          className="
            mt-6 text-3xl font-black
            leading-tight tracking-tight
            text-white
            sm:text-4xl
            md:mt-7 md:text-6xl
          "
        >
          Technology
          <br />
          That Moves
          <span className="text-blue-500"> You Forward.</span>
        </h1>

        {/* DESCRIPTION */}
        <p
          className="
            mt-5 max-w-lg
            text-sm leading-6
            text-gray-400
            sm:text-base sm:leading-7
            md:mt-6
          "
        >
          Discover the latest tech, find your perfect product, and upgrade your
          everyday experience.
        </p>

        {/* BUTTON */}
        <button
          type="button"
          onClick={onViewAllProducts}
          className="
            mt-7 inline-flex w-full
            items-center justify-center gap-3
            rounded-xl bg-blue-600
            px-6 py-3.5
            font-semibold text-white
            transition hover:bg-blue-500
            sm:w-auto sm:py-4
            md:mt-8
          "
        >
          Explore Products
          <span>→</span>
        </button>

        {/* STATS */}
        <div
          className="
            mt-9 grid grid-cols-3 gap-3
            border-t border-white/10 pt-6
            sm:mt-12 sm:flex sm:flex-wrap
            sm:gap-8 sm:pt-7
          "
        >
          <div className="min-w-0">
            <p className="text-lg font-bold text-white sm:text-2xl">100%</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Quality</p>
          </div>

          <div className="min-w-0">
            <p className="text-lg font-bold text-white sm:text-2xl">24/7</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Support</p>
          </div>

          <div className="min-w-0">
            <p className="text-lg font-bold text-white sm:text-2xl">Fast</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Delivery</p>
          </div>
        </div>
      </div>

      {/* DECORATIVE ICON */}
      <div className="pointer-events-none absolute bottom-10 right-10 hidden text-[180px] opacity-10 lg:block">
        💻
      </div>
    </section>
  );
}
