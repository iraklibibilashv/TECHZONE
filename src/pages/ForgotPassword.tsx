import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";
import LoadingButton from "../components/LoadingButton";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset request.",
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
            <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>

            <p className="mt-3 text-sm text-gray-400">
              Enter your email address to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              >
                If this email is registered, check your inbox for password reset
                instructions.
              </p>
            )}

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Sending Email..."
              className="w-full"
            >
              Send Reset Link
            </LoadingButton>
          </form>

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
