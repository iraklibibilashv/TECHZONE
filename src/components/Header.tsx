import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [pictureUrl, setPictureUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [imageError, setImageError] = useState(false);

  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated);

  const { compareProducts } = useCompare();
  const location = useLocation();

  const menuRef = useRef<HTMLDivElement>(null);

  // ADMIN AUTH
  useEffect(() => {
    return subscribeToAdminAuth(() => {
      setIsAdmin(isAdminAuthenticated());
    });
  }, []);

  // LOAD USER
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

  // CLOSE MENUS
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // CLOSE ON ROUTE CHANGE
  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    setPictureUrl("");
    setFirstName("");
    setImageError(false);
    onLogout();
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const actionClass =
    "flex items-center justify-center gap-2 rounded-xl " +
    "border border-white/10 bg-white/5 px-3 py-2.5 " +
    "text-sm font-semibold text-white transition " +
    "hover:border-blue-500 hover:bg-blue-500/10";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d16]/95 backdrop-blur-xl">
      {/* HEADER CONTENT */}
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => {
            closeMobileMenu();
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="shrink-0 whitespace-nowrap text-xl font-black tracking-tight text-white sm:text-2xl"
        >
          TECH<span className="text-blue-500">ZONE</span>
          <span className="ml-1 hidden text-xs font-medium text-gray-500 sm:inline">
            STORE
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden shrink-0 items-center gap-5 text-sm text-gray-400 xl:flex">
          <Link to="/#home" className="hover:text-white">
            Home
          </Link>

          <Link to="/#categories" className="hover:text-white">
            Categories
          </Link>

          <Link to="/#products" className="hover:text-white">
            Products
          </Link>

          <Link to="/#about" className="hover:text-white">
            About Us
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="ml-auto hidden min-w-0 items-center gap-2 xl:flex">
          {/* SEARCH */}
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500 xl:w-36"
          />

          {/* LOGIN / REGISTER */}
          {!isLoggedIn && (
            <>
              <Link to="/login" className={actionClass}>
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Register
              </Link>
            </>
          )}

          {/* WISHLIST */}
          <button
            type="button"
            onClick={onWishlistClick}
            aria-label="Open wishlist"
            className={actionClass}
          >
            ♡
            <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-red-400">
              {wishlistCount}
            </span>
          </button>

          {/* CART */}
          <button
            type="button"
            onClick={onCartClick}
            aria-label="Open cart"
            className={actionClass}
          >
            🛒
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-blue-400">
              {cartCount}
            </span>
          </button>

          {/* COMPARE */}
          <Link
            to="/compare"
            aria-label="Compare products"
            className={actionClass}
          >
            ⇄
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-blue-400">
              {compareProducts.length}
            </span>
          </Link>

          {/* ADMIN */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2.5 text-sm font-semibold text-blue-400 hover:bg-blue-500/20"
            >
              Admin
            </Link>
          )}
        </div>

        {/* MOBILE / TABLET ACTIONS */}
        <div className="ml-auto flex shrink-0 items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={onCartClick}
            aria-label="Open cart"
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-white"
          >
            🛒
            <span className="text-xs text-blue-400">{cartCount}</span>
          </button>
        </div>

        {/* PROFILE */}
        {isLoggedIn && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 bg-blue-500/10 font-bold text-blue-300"
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
                  {firstName ? firstName.charAt(0).toUpperCase() : "👤"}
                </span>
              )}
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-3 w-52 rounded-2xl border border-white/10 bg-[#101622] p-2 shadow-2xl"
              >
                <Link
                  to="/profile"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                >
                  👤 My Profile
                </Link>

                <div className="my-1 border-t border-white/10" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10"
                >
                  ↪ Log Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* HAMBURGER BUTTON */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-white xl:hidden"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE / TABLET MENU */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-[#101622] px-4 py-5 xl:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {/* SEARCH */}
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3 text-base text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />

            {/* NAVIGATION */}
            <nav className="flex flex-col gap-1 text-sm text-gray-300">
              <Link
                to="/#home"
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-3 hover:bg-white/5"
              >
                Home
              </Link>

              <Link
                to="/#categories"
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-3 hover:bg-white/5"
              >
                Categories
              </Link>

              <Link
                to="/#products"
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-3 hover:bg-white/5"
              >
                Products
              </Link>

              <Link
                to="/#about"
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-3 hover:bg-white/5"
              >
                About Us
              </Link>
            </nav>

            <div className="border-t border-white/10" />

            {/* WISHLIST */}
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                onWishlistClick();
              }}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              <span>♡ Wishlist</span>

              <span className="text-red-400">{wishlistCount}</span>
            </button>

            {/* COMPARE */}
            <Link
              to="/compare"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              <span>⇄ Compare</span>

              <span className="text-blue-400">{compareProducts.length}</span>
            </Link>

            {/* ADMIN */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={closeMobileMenu}
                className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-400"
              >
                ◫ Admin Dashboard
              </Link>
            )}

            {/* LOGIN / REGISTER */}
            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
