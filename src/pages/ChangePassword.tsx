import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { changePassword } from "../services/api";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different.");
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password.",
      );
    } finally {
      setLoading(false);
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

        {/* CHANGE PASSWORD CARD */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#101622] p-5 shadow-2xl sm:rounded-3xl sm:p-10">
          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Change Password
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Update your account password
            </p>
          </div>

          {/* PASSWORD FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 min-w-0 space-y-5 sm:mt-8"
          >
            {(
              [
                [
                  "current",
                  "Current Password",
                  currentPassword,
                  setCurrentPassword,
                ],
                ["new", "New Password", newPassword, setNewPassword],
                [
                  "confirm",
                  "Confirm New Password",
                  confirmPassword,
                  setConfirmPassword,
                ],
              ] as const
            ).map(([id, label, value, setter]) => (
              <div key={id} className="min-w-0">
                <label
                  htmlFor={id}
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  {label}
                </label>

                <input
                  id={id}
                  type="password"
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  required
                  autoComplete={
                    id === "current" ? "current-password" : "new-password"
                  }
                  className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-4 py-3.5 text-base text-white outline-none transition focus:border-blue-500 sm:text-sm"
                />
              </div>
            ))}

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
                {success}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Updating Password..."
              className="w-full"
            >
              Change Password
            </LoadingButton>
          </form>

          {/* BACK TO PROFILE */}
          <Link
            to="/profile"
            className="mt-7 block text-center text-sm text-blue-400 transition hover:text-blue-300"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
