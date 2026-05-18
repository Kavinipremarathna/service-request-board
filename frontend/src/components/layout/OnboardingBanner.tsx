"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

export function OnboardingBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem("onboard_seen");
      if (!seen) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="mx-auto my-4 flex max-w-6xl justify-end px-4 sm:px-6">
      <div className="group relative">
        <button
          type="button"
          aria-label="Show help guide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 shadow-sm transition hover:bg-brand-100 hover:text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-300 no-focus-ring"
        >
          <Info className="h-5 w-5" />
        </button>

        <div className="invisible absolute right-0 top-12 z-20 w-80 max-w-xs rounded-2xl bg-white p-4 text-sm text-slate-700 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <strong className="block text-base text-brand-900">
            How to use this site
          </strong>
          <p className="mt-1">Find a job, or post one-simple steps below.</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5">
            <li>Search for the service you need, like "tap" or "painting".</li>
            <li>Open a listing to see details, contact, or request the job.</li>
            <li>Create an account to post or manage jobs.</li>
          </ol>
          <button
            onClick={() => {
              try {
                localStorage.setItem("onboard_seen", "1");
              } catch (e) {}
              setVisible(false);
            }}
            className="mt-4 rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
