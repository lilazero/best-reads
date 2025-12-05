"use client";

import { Search } from "lucide-react";

export default function TagSearchForm() {
  return (
    <form action="/group/show_tag" method="get" className="mt-4">
      <div className="flex gap-2">
        <input
          type="search"
          name="name"
          placeholder="Tag name"
          aria-label="Tag name"
          className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
        >
          Search tags
        </button>
      </div>
    </form>
  );
}
