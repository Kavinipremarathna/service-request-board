"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  User,
  Mail,
  Calendar,
  Trash2,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useJob } from "@/hooks/useJob";
import { jobsApi } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { STATUSES } from "@/lib/validations";
import { useAuth } from "@/context/AuthContext";
import type { JobStatus } from "@/types";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { job, loading, error, setJob } = useJob(params.id);
  const { user, isHomeowner, isWorker } = useAuth();

  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOwner =
    user &&
    job?.owner &&
    (typeof job.owner === "string"
      ? job.owner === user._id
      : (job.owner as { _id: string })._id === user._id);

  // Workers can update any job status; homeowners only their own
  const canUpdateStatus = isWorker || (isHomeowner && isOwner);
  // Only the homeowner who owns the job may delete it
  const canDelete = Boolean(user && isHomeowner && isOwner);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!user) {
      toast.error("Please sign in to update status");
      return;
    }
    const newStatus = e.target.value as JobStatus;
    setStatusLoading(true);
    try {
      const res = await jobsApi.updateStatus(params.id, newStatus);
      setJob(res.data);
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await jobsApi.delete(params.id);
      toast.success("Job deleted successfully");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete job");
      setDeleteLoading(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Skeleton className="h-4 w-24 mb-8" />
        <Skeleton className="h-7 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-6" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 text-center">
        <p className="text-sm text-slate-500 mb-4">
          {error || "Job not found"}
        </p>
        <Link href="/" className="text-sm font-medium text-slate-900 underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  const date = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500 dark:text-slate-300" />
          Back to jobs
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <CategoryBadge category={job.category} />
            <StatusBadge status={job.status} />
          </div>

          {job.assignedTo && (
            <div className="mb-4 text-sm text-slate-600">
              <User className="inline-block h-4 w-4 mr-2 text-slate-400" />
              Assigned to{" "}
              {typeof job.assignedTo === "string"
                ? job.assignedTo
                : job.assignedTo.name}
            </div>
          )}

          <h1 className="text-xl font-bold tracking-tight text-slate-900 mb-3">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-400 mb-6">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-300" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-300" />
              Posted {date}
            </span>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Job Details
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Contact — only visible to logged-in users */}
          {(job.contactName || job.contactEmail) && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                Contact
              </h2>
              {user ? (
                <div className="space-y-2">
                  {job.contactName && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <User className="h-4 w-4 text-slate-400 dark:text-slate-300" />
                      {job.contactName}
                    </div>
                  )}
                  {job.contactEmail && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Mail className="h-4 w-4 text-slate-400 dark:text-slate-300" />
                      <a
                        href={`mailto:${job.contactEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {job.contactEmail}
                      </a>
                    </div>
                  )}
                  {job.contactNumber && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <User className="h-4 w-4 text-slate-400 dark:text-slate-300" />
                      <a
                        href={`tel:${job.contactNumber}`}
                        className="text-blue-600 hover:underline"
                      >
                        {job.contactNumber}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock className="h-4 w-4 text-slate-400 dark:text-slate-300" />
                  <span>
                    <Link
                      href="/auth"
                      className="font-medium text-slate-700 hover:underline"
                    >
                      Sign in
                    </Link>{" "}
                    to view contact details
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions panel */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
              Manage
            </h2>

            {!user && (
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <Link
                  href="/auth"
                  className="font-medium text-slate-700 hover:underline"
                >
                  Sign in
                </Link>{" "}
                to manage this job
              </p>
            )}

            {user && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Status dropdown — workers + job owner */}
                {canUpdateStatus ? (
                  <div className="flex items-center gap-3 flex-1">
                    <label className="text-sm font-medium text-slate-700 shrink-0">
                      Status:
                    </label>
                    <div className="relative flex-1">
                      <select
                        value={job.status}
                        onChange={handleStatusChange}
                        disabled={statusLoading}
                        aria-label="Job status"
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:opacity-60"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {statusLoading && (
                        <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-slate-400 dark:text-slate-300" />
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="flex-1 text-xs text-slate-400">
                    {isHomeowner ? "You can only manage your own jobs." : ""}
                  </p>
                )}

                {/* Quick accept action for workers when job is Open */}
                {isWorker && job.status === "Open" && (
                  <button
                    onClick={async () => {
                      setStatusLoading(true);
                      try {
                        const res = await jobsApi.updateStatus(
                          params.id,
                          "In Progress",
                        );
                        setJob(res.data);
                        toast.success("You accepted the job");
                      } catch (err) {
                        toast.error(
                          err instanceof Error
                            ? err.message
                            : "Failed to accept job",
                        );
                      } finally {
                        setStatusLoading(false);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                  >
                    Accept job
                  </button>
                )}

                {/* Delete — signed-in users */}
                {canDelete && (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete this job?"
        message="This action cannot be undone. The job request will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={deleteLoading}
      />
    </>
  );
}
