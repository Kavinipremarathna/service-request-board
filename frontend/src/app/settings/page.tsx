"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userApi.updateProfile({ name, email });
      updateProfile?.(res.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
        // Log full error for debugging (network / CORS / server errors)
        // Axios may provide `response` with more details
        // eslint-disable-next-line no-console
    setLoading(true);
        const msg = (err as any)?.message || (err as any)?.response?.data?.message || 'Failed to update';
        toast.error(msg);
      await userApi.changePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") as "light" | "dark") || "light"
      : "light",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-3">Update profile</h2>
        <form onSubmit={handleProfile} className="space-y-3">
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <button
              disabled={loading}
              className="rounded-md bg-brand-500 px-4 py-2 text-white"
            >
              Save profile
            </button>
          </div>
        </form>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-3">Change password</h2>
        <form onSubmit={handlePassword} className="space-y-3">
          <div>
            <label className="text-sm text-slate-600">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <button
              disabled={loading}
              className="rounded-md bg-brand-500 px-4 py-2 text-white"
            >
              Change password
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-3">Appearance</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-700">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "light" | "dark")}
            className="rounded-md border px-3 py-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </section>
    </div>
  );
}
