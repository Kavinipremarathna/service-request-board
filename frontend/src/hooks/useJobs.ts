'use client';

import { useState, useEffect, useCallback } from 'react';
import { jobsApi } from '@/lib/api';
import type { JobRequest } from '@/types';

interface UseJobsOptions {
  category?: string;
  status?: string;
  search?: string;
}

export function useJobs(options: UseJobsOptions = {}) {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobsApi.getAll(options);
      setJobs(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [options.category, options.status, options.search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}
