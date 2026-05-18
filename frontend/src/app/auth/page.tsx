"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Loader2,
  Wrench,
  Home,
  HardHat,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
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
  roles: z
    .array(z.enum(["homeowner", "worker"]).transform((v) => v))
    .min(1, "Please select at least one role"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

// ── Small helpers ─────────────────────────────────────────────────────────────
function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-600" role="alert">
      {message}
    </p>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

// ── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginDebug, setLoginDebug] = useState<string | null>(null);
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
      setLoginDebug("Submitting...");
      await login(email, password);
      setLoginDebug("Success");
      toast.success("Welcome back!");
      onSuccess();
    } catch (err) {
      setLoginDebug((err as any)?.message || "Login failed");
      // eslint-disable-next-line no-console
      console.error("Login error", err);
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          className={`${inputClass} focus-ring`}
        />
        <FieldError id="login-email-error" message={errors.email?.message} />
      </div>
      <div>
        <label className={labelClass} htmlFor="login-password">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            className={`${inputClass} focus-ring pr-10`}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <FieldError
          id="login-password-error"
          message={errors.password?.message}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-brand-500 dark:text-slate-950 dark:hover:bg-brand-400"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
      {loginDebug && (
        <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Debug: {loginDebug}
        </div>
      )}
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
    defaultValues: { roles: ["homeowner"] },
  });

  const selectedRoles = watch("roles") ?? [];

  const toggleRole = (role: "homeowner" | "worker") => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter((r: string) => r !== role)
      : [...selectedRoles, role];
    setValue("roles", updated as ("homeowner" | "worker")[], {
      shouldValidate: true,
    });
  };

  const onSubmit = async ({ name, email, password, roles }: RegisterValues) => {
    try {
      await authRegister(
        name,
        email,
        password,
        roles as ("homeowner" | "worker")[],
      );
      toast.success("Account created! Welcome aboard.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="reg-name">
          Full Name
        </label>
        <input
          id="reg-name"
          {...register("name")}
          placeholder="Jane Smith"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "reg-name-error" : undefined}
          className={`${inputClass} focus-ring`}
        />
        <FieldError id="reg-name-error" message={errors.name?.message} />
      </div>
      <div>
        <label className={labelClass} htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "reg-email-error" : undefined}
          className={`${inputClass} focus-ring`}
        />
        <FieldError id="reg-email-error" message={errors.email?.message} />
      </div>
      <div>
        <label className={labelClass} htmlFor="reg-password">
          Password
        </label>
        <input
          id="reg-password"
          {...register("password")}
          type="password"
          placeholder="min. 6 characters"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "reg-password-error" : undefined}
          className={`${inputClass} focus-ring`}
        />
        <FieldError
          id="reg-password-error"
          message={errors.password?.message}
        />
      </div>

      {/* Role selector */}
      <div>
        <label className={labelClass}>I am a...</label>

        <div
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-label="Role"
        >
          {(
            [
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
            ] as const
          ).map(({ value, label, desc, Icon }) => (
            <button
              key={value}
              type="button"
              role="button"
              aria-pressed={selectedRoles.includes(value)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleRole(value);
                }
              }}
              onClick={() => toggleRole(value)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition focus-ring ${
                selectedRoles.includes(value)
                  ? "border-slate-900 bg-slate-900 text-white dark:border-brand-400 dark:bg-brand-500 dark:text-slate-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />

              <span className="text-sm font-semibold">{label}</span>

              <span
                className={`text-xs ${
                  selectedRoles.includes(value)
                    ? "text-slate-300 dark:text-slate-900/70"
                    : "text-slate-400 dark:text-slate-400"
                }`}
              >
                {desc}
              </span>
            </button>
          ))}
        </div>

        <FieldError message={errors.roles?.message as any} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-brand-500 dark:text-slate-950 dark:hover:bg-brand-400"
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
    <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center overflow-hidden px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/20 sm:p-7"
      >
        {/* Logo */}
        <div className="mb-5 text-center sm:mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 shadow-md shadow-brand-500/20 dark:bg-brand-400 dark:shadow-brand-400/20">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            TradeBoard
          </h1>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
            Find trusted local help - fast
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex items-center justify-center gap-3 sm:mb-5">
          <button
            onClick={() => setTab("login")}
            className={`rounded-full px-5 py-2 text-base font-medium transition ${
              tab === "login"
                ? "bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950"
                : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setTab("register")}
            className={`rounded-full px-5 py-2 text-base font-medium transition ${
              tab === "register"
                ? "bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950"
                : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            Create account
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-medium">Quick help</span>
            <div className="group relative">
              <button
                type="button"
                aria-label="Show help guide"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-50 text-yellow-800 shadow-sm transition hover:bg-yellow-100 hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-300 no-focus-ring"
              >
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="invisible absolute left-0 top-9 z-20 w-80 max-w-xs rounded-2xl bg-white p-4 text-sm text-slate-700 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:bg-slate-900 dark:text-slate-200">
                <p>
                  Choose whether you want to post a job as a Homeowner or find
                  jobs as a Tradesperson. Create an account, and it only takes a
                  minute.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <LoginForm onSuccess={handleSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <RegisterForm onSuccess={handleSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
