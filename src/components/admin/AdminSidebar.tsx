import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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

  function handleAdminLogout() {
    adminLogout();
    setMobileOpen(false);
    navigate("/admin/login", { replace: true });
  }

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#101622] px-5 py-4 lg:hidden">
        <Link
          to="/admin/dashboard"
          className="text-xl font-black tracking-tight text-white"
        >
          TECH<span className="text-blue-500">ZONE</span>
          <span className="ml-2 text-xs font-medium text-gray-400">ADMIN</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-white/10 px-3 py-2 text-white"
          aria-label="Open admin menu"
        >
          ☰
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#101622] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-7">
          <Link
            to="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-black tracking-tight text-white"
          >
            TECH<span className="text-blue-500">ZONE</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-xl text-gray-400 lg:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* SECTION TITLE */}
        <div className="px-7 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Administration
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-5 flex-1 space-y-2 px-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="space-y-3 border-t border-white/10 p-5">
          {/* VIEW STORE */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <span>↗</span>
            View Store
          </Link>

          {/* ADMIN LOGOUT */}
          <button
            type="button"
            onClick={handleAdminLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <span>⇥</span>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
