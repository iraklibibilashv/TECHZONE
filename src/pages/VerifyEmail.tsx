import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { verifyEmail, resendVerificationCode } from "../services/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      await verifyEmail({
        email: email.trim(),
        code: code.trim(),
      });

      navigate("/login", {
        replace: true,
        state: { verified: true },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Email verification failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setResending(true);

      await resendVerificationCode(email.trim());

      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend verification code.",
      );
    } finally {
      setResending(false);
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
            <h1 className="text-3xl font-bold text-white">Verify Your Email</h1>

            <p className="mt-3 text-sm text-gray-400">
              Enter the verification code sent to your email address.
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Verification Code
              </label>

              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                autoComplete="one-time-code"
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

            {message && (
              <p
                role="status"
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              >
                {message}
              </p>
            )}

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Verifying Email..."
              className="w-full"
            >
              Verify Email
            </LoadingButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Didn't receive the code?</p>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading || resending}
              className="mt-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300 disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-gray-400">
            Already verified?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>

          <Link
            to="/"
            className="mt-6 block text-center text-sm text-gray-500 transition hover:text-white"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
