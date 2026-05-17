"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, STATUSES } from "@/lib/validations";

interface JobFiltersProps {
  onFilterChange: (filters: {
    category: string;
    status: string;
    search: string;
  }) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const notify = useCallback(() => {
    onFilterChange({ category, status, search: debouncedSearch });
  }, [category, status, debouncedSearch, onFilterChange]);

  useEffect(() => {
    notify();
  }, [notify]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-300 pointer-events-none" />
        <input
          type="text"
          placeholder="Search — e.g. leaky tap, paint, fence"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search jobs"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      {/* Category filter */}
      <div className="relative">
        <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-300 pointer-events-none" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by job type"
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-8 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-44"
        >
          <option value="">Any job type</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label="Filter by job status"
        className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-36"
      >
        <option value="">Any status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
