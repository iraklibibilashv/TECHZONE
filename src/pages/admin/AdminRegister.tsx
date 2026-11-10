import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { adminRegister } from "../../services/adminApi";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminRegister({
        login: login.trim(),
        password,
      });

      navigate("/admin/login", {
        replace: true,
        state: {
          message: "Admin account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Admin registration failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500";

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

          <h1 className="mt-6 text-3xl font-black">Admin Registration</h1>

          <p className="mt-3 text-sm text-gray-400">
            Create an administrator account.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#101622] p-7 shadow-2xl shadow-black/20 sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="register-admin-login"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Admin Login
              </label>

              <input
                id="register-admin-login"
                required
                autoComplete="username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Choose admin login"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="register-admin-password"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Password
              </label>

              <input
                id="register-admin-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="register-admin-confirm"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Confirm Password
              </label>

              <input
                id="register-admin-confirm"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={inputClass}
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
              className="w-full rounded-xl bg-blue-600 px-5 py-4 font-bold transition hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an admin account?{" "}
              <Link
                to="/admin/login"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Sign In
              </Link>
            </p>
          </div>
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
