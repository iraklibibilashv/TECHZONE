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
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

            <p className="mt-3 text-sm text-gray-400">
              Sign in to your TECHZONE account
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

            <div>
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
                className="w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
              >
                Forgot Password?
              </Link>
            </div>

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
              loadingText="Signing In..."
              className="w-full"
            >
              Sign In
            </LoadingButton>
          </form>

          <p className="mt-7 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Create Account
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
