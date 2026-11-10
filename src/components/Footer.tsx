export default function Footer() {
  return (
    <footer
      id="about"
      className="mt-10 w-full min-w-0 border-t border-white/10 bg-[#090d16] sm:mt-16"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-4">
        {/* BRAND */}
        <div className="min-w-0">
          <a
            href="#home"
            className="inline-block text-2xl font-black text-white"
          >
            TECH<span className="text-blue-500">ZONE</span>
          </a>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
            Discover the latest technology and find the perfect products for
            your everyday needs.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="min-w-0">
          <h3 className="font-semibold text-white">Quick Links</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
            <a href="#home" className="w-fit transition hover:text-blue-400">
              Home
            </a>

            <a
              href="#categories"
              className="w-fit transition hover:text-blue-400"
            >
              Categories
            </a>

            <a
              href="#products"
              className="w-fit transition hover:text-blue-400"
            >
              Products
            </a>
          </div>
        </div>

        {/* CUSTOMER SERVICE */}
        <div className="min-w-0">
          <h3 className="font-semibold text-white">Customer Service</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
            <a href="#contact" className="w-fit transition hover:text-blue-400">
              Contact Us
            </a>

            <a href="#faq" className="w-fit transition hover:text-blue-400">
              FAQ
            </a>

            <a
              href="#shipping"
              className="w-fit transition hover:text-blue-400"
            >
              Shipping Information
            </a>
          </div>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="min-w-0">
          <h3 className="font-semibold text-white">Stay Connected</h3>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
            Follow us for the latest products and updates.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-sm font-bold text-gray-300 transition hover:border-blue-500 hover:text-blue-400"
            >
              f
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-sm font-bold text-gray-300 transition hover:border-blue-500 hover:text-blue-400"
            >
              ig
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-gray-400 sm:flex-row sm:px-6 sm:text-left">
          <p className="break-words">© 2026 TECHZONE. All rights reserved.</p>

          <p className="break-words">Built for technology enthusiasts.</p>
        </div>
      </div>
    </footer>
  );
}
