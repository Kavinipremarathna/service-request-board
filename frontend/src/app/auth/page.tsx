"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2, Wrench, Home, HardHat } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ── Schemas ──────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["homeowner", "worker"], {
    errorMap: () => ({ message: "Please choose a role" }),
  }),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

// ── Small helpers ─────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// ── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }: LoginValues) => {
    try {
      // debug
      // eslint-disable-next-line no-console
      console.debug("Logging in", { email });
      await login(email, password);
      toast.success("Welcome back!");
      onSuccess();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Login error", err);
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={inputClass}
        />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className={inputClass}
        />
        <FieldError message={errors.password?.message} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

// ── Register form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register: authRegister } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "homeowner" },
  });

  const selectedRole = watch("role");

  const onSubmit = async ({ name, email, password, role }: RegisterValues) => {
    try {
      await authRegister(name, email, password, role);
      toast.success("Account created! Welcome aboard.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          {...register("name")}
          placeholder="Jane Smith"
          className={inputClass}
        />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={inputClass}
        />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <input
          {...register("password")}
          type="password"
          placeholder="min. 6 characters"
          className={inputClass}
        />
        <FieldError message={errors.password?.message} />
      </div>

      {/* Role selector */}
      <div>
        <label className={labelClass}>I am a...</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: "homeowner",
              label: "Homeowner",
              desc: "Post & manage jobs",
              Icon: Home,
            },
            {
              value: "worker",
              label: "Tradesperson",
              desc: "Browse & work jobs",
              Icon: HardHat,
            },
          ].map(({ value, label, desc, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("role", value as "homeowner" | "worker")}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition ${
                selectedRole === value
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-semibold">{label}</span>
              <span
                className={`text-xs ${selectedRole === value ? "text-slate-300" : "text-slate-400"}`}
              >
                {desc}
              </span>
            </button>
          ))}
        </div>
        <FieldError message={errors.role?.message} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const router = useRouter();

  const handleSuccess = () => router.push("/");

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            TradeBoard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Connect homeowners with skilled tradespeople
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          {/* Tabs */}
          <div className="mb-6 flex rounded-xl bg-slate-50 p-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  tab === t
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === "login" ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "login" ? (
                <LoginForm onSuccess={handleSuccess} />
              ) : (
                <RegisterForm onSuccess={handleSuccess} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Switch tab */}
          <p className="mt-5 text-center text-xs text-slate-400">
            {tab === "login" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => setTab("register")}
                  className="font-medium text-slate-700 hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setTab("login")}
                  className="font-medium text-slate-700 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
