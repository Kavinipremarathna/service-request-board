import { Inbox } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showCta?: boolean;
}

export function EmptyState({
  title = 'No jobs found',
  description = 'Try adjusting your filters or search terms.',
  showCta = false,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mb-4">
        <Inbox className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs">{description}</p>
      {showCta && (
        <Link
          href="/jobs/new"
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Post the first job
        </Link>
      )}
    </div>
  );
}
