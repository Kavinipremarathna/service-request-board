import { clsx } from "clsx";
import type { JobCategory } from "@/types";

interface CategoryBadgeProps {
  category: JobCategory;
  className?: string;
}

const categoryColors: Record<string, string> = {
  Plumbing:
    "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:!text-slate-900",
  Electrical:
    "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200 dark:!text-slate-900",
  Painting:
    "bg-pink-50 text-pink-700 ring-1 ring-pink-200 dark:!text-slate-900",
  Joinery:
    "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:!text-slate-900",
  Roofing: "bg-red-50 text-red-700 ring-1 ring-red-200 dark:!text-slate-900",
  Flooring:
    "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:!text-slate-900",
  Gardening:
    "bg-green-50 text-green-700 ring-1 ring-green-200 dark:!text-slate-900",
  Cleaning:
    "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200 dark:!text-slate-900",
  Other:
    "bg-slate-50 text-slate-600 ring-1 ring-slate-200 dark:!text-slate-900",
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        categoryColors[category] || categoryColors.Other,
        className,
      )}
    >
      {category}
    </span>
  );
}
