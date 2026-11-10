import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
const navigationItems = [
  { label: "Home", id: "home" },
  { label: "Categories", id: "categories" },
  { label: "Products", id: "products" },
  { label: "About Us", id: "about" },
];
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
  const navigate = useNavigate();
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return subscribeToAdminAuth(() => setIsAdmin(isAdminAuthenticated()));
  }, []);
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
        if (!cancelled) console.error("Failed to load user:", error);
      }
    }
    void loadUser();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !desktopProfileRef.current?.contains(target) &&
        !mobileProfileRef.current?.contains(target)
      ) {
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
  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);
  function scrollToSection(sectionId: string) {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    }
    const element = document.getElementById(sectionId);
    if (!element) return false;
    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const targetPosition =
      element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(0, targetPosition), behavior: "smooth" });
    return true;
  }
  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;
    const sectionId = decodeURIComponent(location.hash.slice(1));
    const timeouts = [50, 250, 600].map((delay) =>
      window.setTimeout(() => scrollToSection(sectionId), delay),
    );
    return () => timeouts.forEach(window.clearTimeout);
  }, [location.pathname, location.hash]);
  function handleNavigation(sectionId: string) {
    setMobileMenuOpen(false);
    setMenuOpen(false);
    const target = `/#${sectionId}`;
    if (location.pathname === "/" && location.hash === `#${sectionId}`) {
      scrollToSection(sectionId);
    } else {
      navigate(target);
    }
  }
  function handleSearchChange(value: string) {
    onSearchChange(value);
    if (!value.trim()) return;
    if (location.pathname !== "/") {
      navigate("/#products");
      return;
    }
    scrollToSection("products");
    // Keep the search input mounted and focused while the user types.
  }
  function handleLogoClick() {
    setMobileMenuOpen(false);
    setMenuOpen(false);
    if (location.pathname === "/") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  }
  function handleLogout() {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    setPictureUrl("");
    setFirstName("");
    setImageError(false);
    onLogout();
  }
  const actionClass =
    "flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 text-sm font-semibold text-white transition hover:border-blue-500 hover:bg-blue-500/10";
  const mobileActionClass =
    "flex h-9 shrink-0 items-center justify-center gap-0.5 rounded-xl border border-white/10 bg-white/5 px-1.5 text-white transition hover:border-blue-500/50 sm:h-10 sm:gap-1 sm:px-2";
  const searchClass =
    "h-10 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500";
  function renderProfileMenu(ref: React.RefObject<HTMLDivElement | null>) {
    if (!isLoggedIn) return null;
    return (
      <div className="relative shrink-0" ref={ref}>
        <button
          type="button"
          aria-label="Open profile menu"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 sm:h-10 sm:w-10 border-blue-500 bg-blue-500/10 font-bold text-blue-300"
        >
          {pictureUrl && !imageError ? (
            <img
              src={pictureUrl}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{firstName ? firstName.charAt(0).toUpperCase() : "👤"}</span>
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
    );
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d16]/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] flex-nowrap items-center gap-1 px-2 py-3 sm:gap-3 sm:px-6 lg:gap-4 xl:px-8">
        {/* LOGO */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="order-1 shrink-0 whitespace-nowrap text-left text-base font-black tracking-tight text-white sm:text-2xl"
        >
          TECH<span className="text-blue-500">ZONE</span>
          <span className="ml-1 hidden text-xs font-medium text-gray-500 lg:inline">
            STORE
          </span>
        </button>
        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="order-2 hidden min-w-0 flex-1 items-center justify-center gap-4 whitespace-nowrap text-sm text-gray-400 xl:flex 2xl:gap-6"
        >
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.id)}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </nav>
        {/* MOBILE / TABLET SEARCH — replaces desktop navigation */}
        <div className="order-2 min-w-0 flex-1 px-1 xl:hidden">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            className={`${searchClass} w-full px-2 text-xs sm:px-3 sm:text-sm`}
          />
        </div>
        {/* DESKTOP ACTIONS */}
        <div className="order-3 hidden shrink-0 items-center gap-1.5 xl:flex 2xl:gap-2">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            className={`${searchClass} w-24 2xl:w-36`}
          />
          {!isLoggedIn && (
            <>
              <Link to="/login" className={actionClass}>
                Login
              </Link>
              <Link
                to="/register"
                className="flex h-10 items-center rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Register
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={onWishlistClick}
            aria-label="Open wishlist"
            className={actionClass}
          >
            ♡{" "}
            <span className="rounded-md bg-red-500/20 px-1.5 py-0.5 text-red-400">
              {wishlistCount}
            </span>
          </button>
          <button
            type="button"
            onClick={onCartClick}
            aria-label="Open cart"
            className={actionClass}
          >
            🛒{" "}
            <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-blue-400">
              {cartCount}
            </span>
          </button>
          <Link
            to="/compare"
            aria-label="Compare products"
            className={actionClass}
          >
            ⇄{" "}
            <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-blue-400">
              {compareProducts.length}
            </span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex h-10 items-center rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
            >
              Admin
            </Link>
          )}
          {renderProfileMenu(desktopProfileRef)}
        </div>
        {/* MOBILE / TABLET ACTIONS */}
        <div className="order-3 flex shrink-0 items-center gap-0.5 sm:gap-1.5 xl:hidden">
          <button
            type="button"
            onClick={onWishlistClick}
            aria-label="Open wishlist"
            className={mobileActionClass}
          >
            <span className="text-lg text-red-400">♡</span>
            <span className="hidden text-xs text-red-400 sm:inline">
              {wishlistCount}
            </span>
          </button>
          <button
            type="button"
            onClick={onCartClick}
            aria-label="Open cart"
            className={mobileActionClass}
          >
            <span>🛒</span>
            <span className="hidden text-xs text-blue-400 sm:inline">
              {cartCount}
            </span>
          </button>
          <Link
            to="/compare"
            aria-label="Compare products"
            className={mobileActionClass}
          >
            <span className="text-lg text-cyan-400">⇄</span>
            <span className="hidden text-xs text-cyan-400 sm:inline">
              {compareProducts.length}
            </span>
          </Link>
          {renderProfileMenu(mobileProfileRef)}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white sm:h-10 sm:w-10 sm:text-xl"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {/* MOBILE / TABLET MENU */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-[#101622] px-4 py-5 xl:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 text-sm text-gray-300"
            >
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.id)}
                  className="rounded-xl px-3 py-3 text-left transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="border-t border-white/10" />
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-400"
              >
                ◫ Admin Dashboard
              </Link>
            )}
            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
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
