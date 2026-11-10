import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { saveTokens } from "../services/auth";
import LoadingButton from "../components/LoadingButton";

type LoginProps = {
  onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim(),
        password,
      });

      const accessToken = result.data.accessToken;
      const refreshToken = result.data.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error("Tokens were not returned by the server.");
      }

      saveTokens(accessToken, refreshToken);
      onLogin();

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
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

        {/* LOGIN CARD */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 shadow-2xl sm:rounded-3xl sm:p-10">
          {/* HEADER */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Sign in to your TECHZONE account
            </p>
          </div>

          {/* LOGIN FORM */}
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

            {/* PASSWORD */}
            <div className="min-w-0">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="inline-block text-sm font-medium text-blue-400 transition hover:text-blue-300"
              >
                Forgot Password?
              </Link>
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

            {/* SUBMIT BUTTON */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Signing In..."
              className="w-full"
            >
              Sign In
            </LoadingButton>
          </form>

          {/* REGISTER LINK */}
          <p className="mt-7 break-words text-center text-sm leading-6 text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Create Account
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
