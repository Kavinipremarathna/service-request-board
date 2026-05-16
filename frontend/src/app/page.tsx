'use client';

import { useState, useCallback } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters } from '@/components/jobs/JobFilters';
import { EmptyState } from '@/components/jobs/EmptyState';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [filters, setFilters] = useState({ category: '', status: '', search: '' });

  const handleFilterChange = useCallback(
    (f: { category: string; status: string; search: string }) => {
      setFilters(f);
    },
    []
  );

  const { jobs, loading, error } = useJobs(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Service Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse open jobs posted by homeowners across the UK.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <JobFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results count */}
      {!loading && !error && (
        <p className="mb-4 text-xs text-slate-400">
          {jobs.length} {jobs.length === 1 ? 'result' : 'results'}
        </p>
      )}

      {/* Grid */}
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
              ? 'Try adjusting your filters or search terms.'
              : 'No service requests have been posted yet.'
          }
          showCta={!filters.search && !filters.category && !filters.status}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <JobCard key={job._id} job={job} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
