import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import LoadingButton from "../components/LoadingButton";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
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

        {/* REGISTER CARD */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 shadow-2xl sm:rounded-3xl sm:p-10">
          {/* HEADER */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Create Account
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Join TECHZONE and explore our products
            </p>
          </div>

          {/* REGISTER FORM */}
          <form className="min-w-0 space-y-5" onSubmit={handleSubmit}>
            {/* FIRST NAME */}
            <div className="min-w-0">
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                placeholder="John"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* LAST NAME */}
            <div className="min-w-0">
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm"
              />
            </div>

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
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="min-w-0">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* SUBMIT BUTTON */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Creating Account..."
              className="w-full"
            >
              Create Account
            </LoadingButton>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-7 break-words text-center text-sm leading-6 text-gray-400">
            Already have an account?{" "}
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
