
import { useState, type FormEvent } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { resetPassword } from "../services/api";
import LoadingButton from "../components/LoadingButton";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(
    () => searchParams.get("token") ?? ""
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Reset token is required.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token: token.trim(),
        password,
      });

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090d16] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center text-3xl font-black text-white"
        >
          TECH<span className="text-blue-500">ZONE</span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#101622] p-8 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-3xl">
              🔐
            </div>

            <h1 className="text-3xl font-bold text-white">
              Reset Password
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Create a new password for your TECHZONE account.
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div
                role="status"
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5"
              >
                <p className="text-lg font-bold text-emerald-400">
                  Password Reset Successful!
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  Your password has been updated.
                  You can now sign in.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/login", { replace: true })
                }
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Sign In
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="resetToken"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Reset Token
                </label>

                <input
                  id="resetToken"
                  type="text"
                  placeholder="Enter your reset token"
                  value={token}
                  onChange={(event) =>
                    setToken(event.target.value)
                  }
                  required
                  autoComplete="off"
                  className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Enter the token from your password reset email.
                </p>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) =>
                    setShowPassword(event.target.checked)
                  }
                  className="accent-blue-600"
                />
                Show Password
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
                >
                  {error}
                </p>
              )}

              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="Resetting Password..."
                className="w-full"
              >
                Reset Password
              </LoadingButton>
            </form>
          )}

          <Link
            to="/login"
            className="mt-7 block text-center text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            ← Back to Login
          </Link>

          <Link
            to="/"
            className="mt-6 block text-center text-sm text-gray-500 transition hover:text-white"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
