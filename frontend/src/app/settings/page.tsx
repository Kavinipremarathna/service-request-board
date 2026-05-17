"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Save, Lock as LockIcon } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateProfile, switchRole } = useAuth();
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
    setLoading(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Password update error", err);
      const msg =
        (err as any)?.message ||
        (err as any)?.response?.data?.message ||
        "Failed to update password";
      toast.error(msg);
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
              className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white"
            >
              <Save className="h-4 w-4 text-brand-700 dark:text-brand-200" />
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
              className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white"
            >
              <LockIcon className="h-4 w-4 text-brand-700 dark:text-brand-200" />
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

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-3">Account</h2>
        <p className="text-sm text-slate-500 mb-4">
          Switch into worker view if your account includes that role, otherwise
          you'll be prompted to sign in or sign up.
        </p>
        <div>
          <button
            onClick={async () => {
              if (!user) return router.push("/auth");
              if (user.roles?.includes("worker")) {
                try {
                  await switchRole("worker");
                  router.push("/");
                } catch (err) {
                  toast.error("Failed to switch to worker view");
                }
              } else {
                router.push("/auth");
              }
            }}
            className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white"
          >
            Go to worker view
          </button>
        </div>
      </section>
    </div>
  );
}
