
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { getCurrentUser } from "../services/api";
import { useCompare } from "../context/CompareContext";

import {
  isAdminAuthenticated,
  subscribeToAdminAuth,
} from "../services/adminAuth";

type HeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  cartCount: number;
  onCartClick: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
};

export default function Header({
  searchQuery,
  onSearchChange,
  isLoggedIn,
  onLogout,
  cartCount,
  onCartClick,
  wishlistCount,
  onWishlistClick,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pictureUrl, setPictureUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [imageError, setImageError] = useState(false);

  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated);

  const { compareProducts } = useCompare();

  const menuRef = useRef<HTMLDivElement>(null);

  // ADMIN AUTH LISTENER
  useEffect(() => {
    return subscribeToAdminAuth(() => {
      setIsAdmin(isAdminAuthenticated());
    });
  }, []);

  // LOAD CURRENT USER
  useEffect(() => {
    if (!isLoggedIn) {
      setPictureUrl("");
      setFirstName("");
      setImageError(false);
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        const user = await getCurrentUser();

        if (cancelled) return;

        setPictureUrl(user.details?.pictureUrl || "");
        setFirstName(user.firstName || "");
        setImageError(false);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load user:", error);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  // CLOSE PROFILE MENU ON OUTSIDE CLICK OR ESCAPE
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    setPictureUrl("");
    setFirstName("");
    setImageError(false);
    onLogout();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090d16]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">

        {/* LOGO */}
        <Link
          to="/"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="shrink-0 text-2xl font-black tracking-tight text-white"
        >
          TECH<span className="text-blue-500">ZONE</span>
          <span className="ml-2 text-xs font-medium text-gray-500">
            STORE
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-8 text-sm text-gray-400 lg:flex">
          <a href="#home" className="transition hover:text-white">
            Home
          </a>

          <a href="#categories" className="transition hover:text-white">
            Categories
          </a>

          <a href="#products" className="transition hover:text-white">
            Products
          </a>

          <a href="#about" className="transition hover:text-white">
            About Us
          </a>
        </nav>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 sm:w-40"
          />

          {/* LOGIN / REGISTER */}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Register
              </Link>
            </>
          )}

          {/* WISHLIST */}
          <button
            type="button"
            onClick={onWishlistClick}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-500 hover:bg-red-500/10"
          >
            <span>♡</span>

            <span className="hidden sm:inline">
              Wishlist
            </span>

            <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-red-400">
              {wishlistCount}
            </span>
          </button>

          {/* CART */}
          <button
            type="button"
            onClick={onCartClick}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-blue-500/10"
          >
            <span>🛒</span>

            <span className="hidden sm:inline">
              Cart
            </span>

            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-blue-400">
              {cartCount}
            </span>
          </button>

          {/* COMPARE */}
          <Link
            to="/compare"
            aria-label={`Compare products, ${compareProducts.length} selected`}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-blue-500/10"
          >
            <span>⇄</span>

            <span className="hidden sm:inline">
              Compare
            </span>

            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-blue-400">
              {compareProducts.length}
            </span>
          </Link>

          {/* ADMIN DASHBOARD */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
            >
              <span>◫</span>

              <span className="hidden sm:inline">
                Admin Dashboard
              </span>
            </Link>
          )}

          {/* PROFILE */}
          {isLoggedIn && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 bg-blue-500/10 text-lg font-bold text-blue-300 transition hover:border-blue-300"
              >
                {pictureUrl && !imageError ? (
                  <img
                    src={pictureUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>
                    {firstName
                      ? firstName.charAt(0).toUpperCase()
                      : "👤"}
                  </span>
                )}
              </button>

              {/* PROFILE DROPDOWN */}
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#101622] p-2 shadow-2xl"
                >
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/5 hover:text-white"
                  >
                    <span>👤</span>
                    My Profile
                  </Link>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                  >
                    <span>↪</span>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
