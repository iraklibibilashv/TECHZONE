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
    <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-[#090d16] px-4 py-8 sm:py-12">
      <div className="w-full min-w-0 max-w-md">
        {/* LOGO */}
        <Link
          to="/"
          className="mb-6 block text-center text-2xl font-black text-white sm:mb-8 sm:text-3xl"
        >
          TECH<span className="text-blue-500">ZONE</span>
        </Link>

        {/* VERIFICATION CARD */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 shadow-2xl sm:rounded-3xl sm:p-10">
          {/* HEADER */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Verify Your Email
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Enter the verification code sent to your email address.
            </p>
          </div>

          {/* VERIFICATION FORM */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* VERIFICATION CODE */}
            <div className="min-w-0">
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
                autoCapitalize="none"
                spellCheck={false}
                required
                className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p
                role="alert"
                className="break-words rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            {/* SUCCESS MESSAGE */}
            {message && (
              <p
                role="status"
                className="break-words rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              >
                {message}
              </p>
            )}

            {/* VERIFY BUTTON */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Verifying Email..."
              className="w-full"
            >
              Verify Email
            </LoadingButton>
          </form>

          {/* RESEND CODE */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Didn't receive the code?</p>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading || resending}
              className="mt-2 inline-flex min-h-10 items-center justify-center px-3 text-sm font-semibold text-blue-400 transition hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          {/* LOGIN LINK */}
          <p className="mt-7 break-words text-center text-sm leading-6 text-gray-400">
            Already verified?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>

          {/* BACK TO STORE */}
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
