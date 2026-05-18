"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { jobsApi } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import type { JobRequest } from "@/types";

interface JobCardProps {
  job: JobRequest;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const { isWorker } = useAuth();
  const date = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link
        href={`/jobs/${job._id}`}
        className="group block"
        aria-label={`View details for ${job.title}`}
      >
        <div
          role="link"
          aria-hidden="false"
          className="relative overflow-hidden rounded-xl bg-white p-6 shadow-card transition-transform duration-200 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-brand-500 opacity-90" />
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            {/* Light mode: show separate category + status badges. In dark mode we show a combined pill. */}
            <div className="hidden dark:block">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-800 text-slate-100 ring-1 ring-slate-700">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${job.status === "Open" ? "bg-emerald-500" : job.status === "In Progress" ? "bg-amber-500" : "bg-slate-400"} dark:!bg-white`}
                />
                {job.status} · {job.category}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <div className="block dark:hidden">
                  <CategoryBadge category={job.category} />
                </div>
              </div>
              <div>
                <div className="block dark:hidden">
                  <StatusBadge status={job.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-slate-200">
            {job.title}
          </h3>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-base leading-relaxed text-muted-600 dark:text-slate-300">
            {job.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-500 dark:text-slate-300">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-500 dark:!text-white" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-500 dark:!text-white" />
                {date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isWorker && job.status === "Open" && (
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await jobsApi.updateStatus(job._id, "In Progress");
                      toast.success("Job accepted");
                      // reload current page to reflect change (simple approach)
                      window.location.reload();
                    } catch (err) {
                      toast.error(
                        err instanceof Error
                          ? err.message
                          : "Failed to accept job",
                      );
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-emerald-700"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </button>
              )}
              <ArrowRight
                className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:!text-white dark:group-hover:!text-white"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
