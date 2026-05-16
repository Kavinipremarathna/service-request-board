'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import type { JobRequest } from '@/types';

interface JobCardProps {
  job: JobRequest;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const date = new Date(job.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link href={`/jobs/${job._id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-200 hover:shadow-md">
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <CategoryBadge category={job.category} />
            <StatusBadge status={job.status} />
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 leading-snug mb-2 group-hover:text-slate-700 transition-colors line-clamp-2">
            {job.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {job.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {date}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
