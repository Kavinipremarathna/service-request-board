"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  LogOut,
  User as UserIcon,
  ArrowLeftRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function UserMenu() {
  const { user, logout, switchRole, hasBothRoles, isHomeowner } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((s: string) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-500 ring-1 ring-black/5 shadow-sm transition hover:opacity-95 dark:bg-slate-800 dark:text-white"
        title={user.name}
      >
        <span className="text-sm font-semibold">
          {initials || (
            <UserIcon className="h-4 w-4 text-brand-500 dark:text-white" />
          )}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-card ring-1 ring-black/5">
          <div className="p-2">
            <Link
              href={"/?mine=1"}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-muted-50"
            >
              <UserIcon className="h-4 w-4 text-muted-500" />
              Profile
            </Link>
            {hasBothRoles && (
              <button
                onClick={async () => {
                  const next = isHomeowner ? "worker" : "homeowner";
                  try {
                    await switchRole(next);
                    setOpen(false);
                    // navigate to home after switching
                    router.push("/");
                  } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error("Switch role failed", err);
                  }
                }}
                className="mt-1 w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-muted-50"
              >
                <ArrowLeftRight className="h-4 w-4 text-muted-500" />
                Switch to {isHomeowner ? "Tradesperson" : "Homeowner"}
              </button>
            )}
            <Link
              href={"/settings"}
              className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-muted-50"
            >
              <Settings className="h-4 w-4 text-muted-500" />
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="mt-2 w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-muted-50"
            >
              <LogOut className="h-4 w-4 text-muted-500" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
