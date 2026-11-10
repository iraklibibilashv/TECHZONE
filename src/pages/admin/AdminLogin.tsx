import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { adminLogin } from "../../services/adminApi";
import { saveAdminToken } from "../../services/adminAuth";

type AdminLoginResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
};

export default function AdminLogin() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = (await adminLogin({
        login: login.trim(),
        password,
      })) as AdminLoginResponse;

      const accessToken = result.data?.accessToken ?? result.accessToken;

      if (!accessToken) {
        throw new Error(
          "Login succeeded, but the access token was not found in the response.",
        );
      }

      saveAdminToken(accessToken);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090d16] px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-black tracking-tight">
            TECH<span className="text-blue-500">ZONE</span>
          </Link>

          <div className="mx-auto mt-5 w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-400">
            Admin Portal
          </div>

          <h1 className="mt-6 text-3xl font-black">Admin Sign In</h1>

          <p className="mt-3 text-sm text-gray-400">
            Sign in to manage your TECHZONE store.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#101622] p-7 shadow-2xl shadow-black/20 sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="admin-login"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Admin Login
              </label>

              <input
                id="admin-login"
                type="text"
                autoComplete="username"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Enter admin login"
                className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="mt-7 block text-center text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
