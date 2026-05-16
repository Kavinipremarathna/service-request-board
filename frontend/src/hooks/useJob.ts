'use client';

import { useState, useEffect } from 'react';
import { jobsApi } from '@/lib/api';
import type { JobRequest } from '@/types';

export function useJob(id: string) {
  const [job, setJob] = useState<JobRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await jobsApi.getById(id);
        setJob(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  return { job, loading, error, setJob };
}
