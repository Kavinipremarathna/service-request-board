import { clsx } from 'clsx';
import type { JobStatus } from '@/types';

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  Open: {
    label: 'Open',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  Closed: {
    label: 'Closed',
    className: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      <span
        className={clsx('h-1.5 w-1.5 rounded-full', {
          'bg-emerald-500': status === 'Open',
          'bg-amber-500': status === 'In Progress',
          'bg-slate-400': status === 'Closed',
        })}
      />
      {config.label}
    </span>
  );
}
