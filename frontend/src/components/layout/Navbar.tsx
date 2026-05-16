"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Wrench, Plus, LogOut, LogIn, Home, HardHat } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export function Navbar() {
          {(!user || !isHomeowner) && (
            <Link href="/" className={clsx('text-sm font-medium transition-colors', pathname === '/' ? 'text-slate-900' : 'text-muted-500 hover:text-slate-900')}>
              Browse Jobs
            </Link>
          )}
  const router = useRouter();
  const { user, logout, isHomeowner } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-slate-900"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-md">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm tracking-tight">TradeBoard</span>
            <span className="text-xs text-muted-500">
              Connect homeowners & trades
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className={clsx(
              "text-sm font-medium transition-colors",
              pathname === "/"
                ? "text-slate-900"
                : "text-muted-500 hover:text-slate-900",
            )}
          >
            Browse Jobs
                </div>
            <>
              {/* Role pill */}
              <span
                className={clsx(
                  "hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  isHomeowner
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    : "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
                )}
              >
                {isHomeowner ? (
                  <Home className="h-3 w-3" />
                ) : (
                  <HardHat className="h-3 w-3" />
                )}
                {isHomeowner ? "Homeowner" : "Tradesperson"}
              </span>

              {/* Post a Job — homeowners only */}
              {isHomeowner && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/jobs/new"
                    className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
                  >
                    <Plus className="h-4 w-4" />
                    Post a Job
                  </Link>
                </motion.div>
              )}

              {/* User name + logout */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-medium text-slate-900">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-500">
                    {isHomeowner ? "Homeowner" : "Tradesperson"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
