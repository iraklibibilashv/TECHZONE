import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminLogout } from "../../services/adminAuth";

const links = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "◫",
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: "▣",
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: "▦",
  },
  {
    name: "Inventory",
    path: "/admin/inventory",
    icon: "▤",
  },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // CLOSE SIDEBAR WHEN ROUTE CHANGES
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ESCAPE KEY + PREVENT BACKGROUND SCROLL
  useEffect(() => {
    if (!mobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function handleAdminLogout() {
    adminLogout();
    setMobileOpen(false);
    navigate("/admin/login", { replace: true });
  }

  return (
    <>
      {/* MOBILE / TABLET HEADER */}
      <div className="sticky top-0 z-40 flex w-full items-center justify-between gap-3 border-b border-white/10 bg-[#101622] px-4 py-4 sm:px-6 lg:hidden">
        <Link
          to="/admin/dashboard"
          onClick={closeMobileMenu}
          className="min-w-0 whitespace-nowrap text-lg font-black tracking-tight text-white sm:text-xl"
        >
          TECH<span className="text-blue-500">ZONE</span>
          <span className="ml-2 text-xs font-medium text-gray-400">ADMIN</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-white transition hover:bg-white/10"
          aria-label="Open admin menu"
          aria-expanded={mobileOpen}
          aria-controls="admin-navigation"
        >
          ☰
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        id="admin-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-white/10 bg-[#101622] shadow-2xl transition-transform duration-300 lg:w-72 lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 sm:px-7">
          <Link
            to="/admin/dashboard"
            onClick={closeMobileMenu}
            className="whitespace-nowrap text-xl font-black tracking-tight text-white sm:text-2xl"
          >
            TECH<span className="text-blue-500">ZONE</span>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close admin menu"
          >
            ✕
          </button>
        </div>

        {/* SECTION TITLE */}
        <div className="shrink-0 px-5 pt-7 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Administration
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto px-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex min-h-12 items-center gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="shrink-0 space-y-2 border-t border-white/10 p-4 sm:p-5">
          {/* VIEW STORE */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <span>↗</span>
            View Store
          </Link>

          {/* ADMIN LOGOUT */}
          <button
            type="button"
            onClick={handleAdminLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <span>⇥</span>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
