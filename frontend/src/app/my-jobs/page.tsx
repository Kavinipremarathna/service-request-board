"use client";

import { useEffect, useState } from "react";
import { jobsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { JobCard } from "@/components/jobs/JobCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MyJobsPage() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await jobsApi.getMine();
        setJobs(res.data || []);
      } catch (err) {
        // ignore; jobsApi already surfaces readable errors
      } finally {
        setIsLoading(false);
      }
    };
    if (!loading && user) fetch();
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-sm text-slate-500">
          You have not posted any jobs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((j, i) => (
            <JobCard job={j} key={j._id} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
