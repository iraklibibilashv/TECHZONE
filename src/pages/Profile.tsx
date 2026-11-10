import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";

import {
  getCurrentUser,
  updateUserProfile,
  deleteUserProfile,
} from "../services/api";

import { logout } from "../services/auth";

import type { User, UpdateUserData } from "../types/user";

type ProfileProps = {
  onLogout: () => void;
};

const emptyForm: UpdateUserData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  pictureUrl: "",
  dateOfBirth: "",
};

export default function Profile({ onLogout }: ProfileProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<UpdateUserData>(emptyForm);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function fillForm(data: User) {
    setForm({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phoneNumber: data.details?.phoneNumber ?? "",
      address: data.details?.address ?? "",
      pictureUrl: data.details?.pictureUrl ?? "",
      dateOfBirth: data.details?.dob ? data.details.dob.slice(0, 10) : "",
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);

        const data = await getCurrentUser();

        if (cancelled) return;

        setUser(data);
        fillForm(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load profile.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field: keyof UpdateUserData, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateUserProfile({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth
          ? new Date(`${form.dateOfBirth}T00:00:00`).toISOString()
          : new Date(0).toISOString(),
      });

      const updatedUser = await getCurrentUser();

      setUser(updatedUser);
      fillForm(updatedUser);

      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await deleteUserProfile();
      logout();
      onLogout();
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete account.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full min-w-0 bg-[#090d16] px-3 py-6 text-white sm:px-4 sm:py-12">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <Link to="/" className="mb-8 block text-3xl font-black">
          TECH<span className="text-blue-500">ZONE</span>
        </Link>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101622] p-4 shadow-2xl sm:rounded-3xl sm:p-10">
          <div className="mb-8 flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-500/30 bg-blue-500/10 text-3xl">
              {user?.details?.pictureUrl ? (
                <img
                  src={user.details.pictureUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                "👤"
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-3xl">My Profile</h1>

              <p className="mt-2 text-sm text-gray-400">
                Manage your personal information
              </p>

              {user && (
                <span className="mt-2 inline-block rounded-lg bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  {user.role}
                </span>
              )}
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400"
            >
              {success}
            </p>
          )}

          {user && (
            <form onSubmit={handleSave}>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {(
                  [
                    ["firstName", "First Name", "text"],
                    ["lastName", "Last Name", "text"],
                    ["email", "Email Address", "email"],
                    ["phoneNumber", "Phone Number", "tel"],
                    ["address", "Address", "text"],
                    ["dateOfBirth", "Date of Birth", "date"],
                    ["pictureUrl", "Picture URL", "url"],
                  ] as const
                ).map(([field, label, type]) => (
                  <div
                    key={field}
                    className={`min-w-0 ${
                      field === "pictureUrl" ? "sm:col-span-2" : ""
                    }`}
                  >
                    <label
                      htmlFor={field}
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      {label}
                    </label>

                    <input
                      id={field}
                      type={type}
                      value={form[field]}
                      onChange={(event) =>
                        updateField(field, event.target.value)
                      }
                      disabled={!editing || saving}
                      required={
                        field === "firstName" ||
                        field === "lastName" ||
                        field === "email"
                      }
                      className="block w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-3 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 disabled:cursor-default disabled:opacity-70 sm:px-4 sm:py-3.5"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:flex-wrap">
                {editing ? (
                  <>
                    <div className="w-full sm:w-auto sm:flex-1">
                      <LoadingButton
                        type="submit"
                        loading={saving}
                        loadingText="Saving Changes..."
                        className="w-full"
                      >
                        Save Changes
                      </LoadingButton>
                    </div>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        fillForm(user);
                        setEditing(false);
                        setError("");
                      }}
                      className="w-full rounded-xl border border-white/10 px-6 py-3 text-center font-semibold text-gray-300 transition hover:border-blue-500 hover:text-white disabled:opacity-50 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setSuccess("");
                    }}
                    className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
                  >
                    Edit Profile
                  </button>
                )}

                <Link
                  to="/change-password"
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-center font-semibold text-gray-300 transition hover:border-blue-500 hover:text-white sm:w-auto"
                >
                  Change Password
                </Link>
              </div>
            </form>
          )}

          <div className="mt-10 border-t border-red-500/20 pt-6">
            <h2 className="font-semibold text-red-400">Danger Zone</h2>

            <p className="mt-2 text-sm text-gray-500">
              Permanently delete your account and associated data.
            </p>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="mt-4 w-full rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50 sm:w-auto"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>

          <Link
            to="/"
            className="mt-8 block text-center text-sm text-gray-500 transition hover:text-white"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
