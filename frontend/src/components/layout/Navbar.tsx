"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  Wrench,
  Plus,
  LogIn,
  Home,
  HardHat,
  ArrowLeftRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { UserMenu } from "./UserMenu";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isHomeowner, switchRole, hasBothRoles } = useAuth();

  const [switching, setSwitching] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/");
  };

  const handleSwitch = async () => {
    const next = user!.activeRole === "homeowner" ? "worker" : "homeowner";
    setSwitching(true);
    try {
      await switchRole(next);
      toast.success(
        `Switched to ${next === "homeowner" ? "🏠 Homeowner" : "🔧 Tradesperson"} mode`,
      );
    } catch (err) {
      toast.error("Failed to switch role");
    } finally {
      setSwitching(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-md shadow-brand-500/20 dark:bg-brand-400 dark:shadow-brand-400/20">
            <Wrench className="h-5 w-5 text-white dark:text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm tracking-tight">TradeBoard</span>
            <span className="text-xs text-muted-500 dark:text-slate-400">
              Find local help fast
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {(!user || !isHomeowner) && (
            <Link
              href="/"
              className={clsx(
                "text-sm font-medium transition-colors",
                pathname === "/"
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-muted-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              )}
            >
              Browse Jobs
            </Link>
          )}

          {user && isHomeowner && (
            <Link
              href="/my-jobs"
              className={clsx(
                "text-sm font-medium transition-colors",
                pathname === "/my-jobs"
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-muted-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              )}
            >
              My jobs
            </Link>
          )}

          {user ? (
            <>
              {/* Role pill */}
              <span
                className={clsx(
                  "hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  "bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-200 dark:ring-brand-500/20",
                )}
              >
                {isHomeowner ? (
                  <Home className="h-3 w-3 text-brand-700 dark:text-brand-200" />
                ) : (
                  <HardHat className="h-3 w-3 text-brand-700 dark:text-brand-200" />
                )}
                {isHomeowner ? "Homeowner" : "Tradesperson"}
              </span>

              {hasBothRoles && (
                <button
                  onClick={handleSwitch}
                  disabled={switching}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  Switch to {isHomeowner ? "Tradesperson" : "Homeowner"}
                </button>
              )}

              {/* Post a Job — homeowners only */}
              {isHomeowner && (
                <Link
                  href="/jobs/new"
                  aria-label="Post a new job"
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-base font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-700 hover:shadow-lg dark:bg-brand-700 dark:text-white dark:hover:bg-brand-500"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Post job</span>
                </Link>
              )}

              {/* User menu */}
              <div className="flex items-center gap-3">
                <UserMenu />
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              aria-label="Sign in or create account"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              <LogIn className="h-5 w-5" />
              Sign in / Create account
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
