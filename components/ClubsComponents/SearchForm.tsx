"use client";

import { Search } from "lucide-react";

interface SearchFormProps {
  placeholder?: string;
  buttonText?: string;
  action?: string;
}

export default function SearchForm({
  placeholder = "Group name, description",
  buttonText = "Search groups",
  action = "/clubs/search",
}: SearchFormProps) {
  return (
    <form action={action} method="get" className="mb-8">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            name="q"
            placeholder={placeholder}
            aria-label="Search groups"
            className="w-full px-4 py-2 pr-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
