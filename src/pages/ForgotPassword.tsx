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
    <div className="flex min-h-[100dvh] w-full min-w-0 items-center justify-center bg-[#090d16] px-4 py-8 sm:py-12">
      <div className="w-full min-w-0 max-w-md">
        {/* LOGO */}
        <Link
          to="/"
          className="mb-6 block text-center text-2xl font-black text-white sm:mb-8 sm:text-3xl"
        >
          TECH<span className="text-blue-500">ZONE</span>
        </Link>

        {/* FORGOT PASSWORD CARD */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 shadow-2xl sm:rounded-3xl sm:p-10">
          {/* HEADER */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Forgot Password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Enter your email address to reset your password.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="min-w-0 space-y-5">
            {/* EMAIL */}
            <div className="min-w-0">
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
                className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p
                role="alert"
                className="break-words rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm leading-6 text-red-400"
              >
                {error}
              </p>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <p
                role="status"
                className="break-words rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-400"
              >
                If this email is registered, check your inbox for password reset
                instructions.
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Sending Email..."
              className="w-full"
            >
              Send Reset Link
            </LoadingButton>
          </form>

          {/* BACK TO LOGIN */}
          <Link
            to="/login"
            className="mt-7 block text-center text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            ← Back to Login
          </Link>

          {/* BACK TO STORE */}
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
