"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/hooks/useJobs";
import { jobsApi } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { EmptyState } from "@/components/jobs/EmptyState";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { user, isHomeowner } = useAuth();

  const [myJobsCount, setMyJobsCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchMyJobs = async () => {
      if (!user || !isHomeowner) return setMyJobsCount(null);
      try {
        const res = await jobsApi.getMine();
        if (!mounted) return;
        setMyJobsCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch (err) {
        if (!mounted) return;
        setMyJobsCount(null);
      }
    };
    fetchMyJobs();
    return () => {
      mounted = false;
    };
  }, [user, isHomeowner]);

  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });
  const searchParams = useSearchParams();
  const browse = searchParams?.get("browse");

  // Latest jobs preview
  const { jobs: latestJobs, loading: latestLoading } = useJobs();
  // Jobs listing when browsing
  const { jobs, loading, error } = useJobs(filters);

  const handleFilterChange = useCallback(
    (f: { category: string; status: string; search: string }) => setFilters(f),
    [],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Service Requests
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse open jobs posted by homeowners across Sri Lanka.
        </p>
        {user && isHomeowner && (
          <div className="mt-4 flex gap-3">
            <a
              href="/my-jobs"
              className="rounded-md bg-brand-500 px-3 py-2 text-white"
            >
              My jobs{myJobsCount !== null ? ` (${myJobsCount})` : ""}
            </a>
            <a
              href="/jobs/new"
              className="rounded-md border border-slate-200 px-3 py-2 text-slate-700"
            >
              Post a job
            </a>
          </div>
        )}
      </div>

      {/* Intro / About the system */}
      <div className="mb-8 rounded-xl bg-white p-8 shadow-card">
        <h2 className="text-xl font-semibold mb-2">
          {isHomeowner
            ? "About TradeBoard"
            : "About TradeBoard for Tradespeople"}
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          {isHomeowner ? (
            <>
              TradeBoard connects homeowners with trusted local tradespeople.
              Post jobs, review proposals, and accept workers - all in one
              place.
            </>
          ) : (
            <>
              TradeBoard helps tradespeople find local work: browse posted jobs,
              submit proposals, and manage accepted work efficiently.
            </>
          )}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-stretch">
          {isHomeowner ? (
            <>
              <div className="p-6 rounded-lg bg-slate-50 shadow-sm h-full">
                <h3 className="font-medium">Post a job</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Share details, photos and timing.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-slate-50 shadow-sm h-full">
                <h3 className="font-medium">Hire local trades</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Browse skilled workers near you.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-slate-50 shadow-sm h-full">
                <h3 className="font-medium">Manage jobs</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Accept, message and update job statuses.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 rounded-lg bg-slate-50 shadow-sm h-full">
                <h3 className="font-medium">Browse jobs</h3>
                <p className="text-sm text-slate-500 mt-2">
                  See nearby jobs that match your skills.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-slate-50 shadow-sm h-full">
                <h3 className="font-medium">Send proposals</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Respond with quotes and availability.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-slate-50 shadow-sm h-full">
                <h3 className="font-medium">Manage work</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Track accepted jobs and update status.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = query.trim();
              router.push(
                `/jobs${q ? `?search=${encodeURIComponent(q)}` : ""}`,
              );
            }}
            className="max-w-2xl"
          >
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, categories, locations..."
                className="flex-1 rounded-md border border-slate-200 px-4 py-3"
              />
              <button className="rounded-md bg-brand-500 px-4 py-3 text-white">
                Search
              </button>
            </div>
          </form>

          {/* If browsing, show full listing; otherwise show latest preview */}
          {browse === "1" ? (
            <div className="mt-8">
              <div className="mb-6">
                <JobFilters onFilterChange={handleFilterChange} />
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/10 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
                  {error}
                </div>
              )}

              {!loading && !error && (
                <p className="mb-4 text-xs text-slate-400">
                  {jobs.length} {jobs.length === 1 ? "result" : "results"}
                </p>
              )}

              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <EmptyState
                  title="No jobs found"
                  description={
                    filters.search || filters.category || filters.status
                      ? "Try adjusting your filters or search terms."
                      : "No service requests have been posted yet."
                  }
                  showCta={
                    !filters.search && !filters.category && !filters.status
                  }
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job, i) => (
                    <JobCard key={job._id} job={job} index={i} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Latest jobs</h3>
              {latestLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : latestJobs.length === 0 ? (
                <p className="text-sm text-slate-500">No recent jobs yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {latestJobs.slice(0, 3).map((job, i) => (
                    <JobCard key={job._id} job={job} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
