"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { jobsApi } from "@/lib/api";
import {
  createJobSchema,
  CATEGORIES,
  type CreateJobFormValues,
} from "@/lib/validations";
import { useAuth } from "@/context/AuthContext";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function NewJobPage() {
  const router = useRouter();
  const { user, isHomeowner, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
  });

  // Redirect if not a homeowner
  useEffect(() => {
    if (!loading && (!user || !isHomeowner)) {
      toast.error("Only homeowners can post jobs");
      router.replace("/auth");
    }
  }, [user, isHomeowner, loading, router]);

  const onSubmit = async (data: CreateJobFormValues) => {
    try {
      await jobsApi.create(data);
      toast.success("Job posted successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post job");
    }
  };

  // Show gate while auth loads or if wrong role
  if (loading || !user || !isHomeowner) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <Lock className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4 text-slate-500 dark:text-slate-300" />
        Back to jobs
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Post a Service Request
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Qualified tradespeople will be able to find and respond to your
          request.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className={labelClass}>
            Job Title <span className="text-red-400">*</span>
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Leaking kitchen tap needs urgent repair"
            className={inputClass}
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <label className={labelClass}>
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe the work needed, any access requirements, urgency..."
            className={`${inputClass} resize-none`}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Category <span className="text-red-400">*</span>
            </label>
            <select {...register("category")} className={inputClass}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>
          <div>
            <label className={labelClass}>
              Location <span className="text-red-400">*</span>
            </label>
            <input
              {...register("location")}
              placeholder="e.g. Colombo, Kandy, Galle"
              className={inputClass}
            />
            <FieldError message={errors.location?.message} />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Contact Details
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Your Name <span className="text-red-400">*</span>
            </label>
            <input
              {...register("contactName")}
              placeholder="Full name"
              className={inputClass}
            />
            <FieldError message={errors.contactName?.message} />
          </div>
          <div>
            <label className={labelClass}>
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              {...register("contactEmail")}
              type="email"
              placeholder="you@example.com"
              className={inputClass}
            />
            <FieldError message={errors.contactEmail?.message} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Phone number</label>
          <input
            {...register("contactNumber")}
            placeholder="e.g. +441234567890"
            className={inputClass}
          />
          <FieldError message={errors.contactNumber?.message} />
        </div>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-50 dark:text-white" />
                Posting...
              </>
            ) : (
              "Post Job Request"
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
