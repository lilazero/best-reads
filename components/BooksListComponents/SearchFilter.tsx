"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePositioner,
} from "@/components/ui/autocomplete";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Book } from "lucide-react";
import type { Book as BookType } from "@/lib/types";

interface SearchItem {
  id: string;
  value: string;
  bookId: string;
}

interface SearchFilterProps {
  books: BookType[];
  initialQuery?: string;
  basePath?: string;
}
export default function SearchFilter({
  books,
  initialQuery = "",
  basePath = "/books",
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Keep local state in sync with URL (e.g., back/forward nav)
  useEffect(() => {
    setSearchQuery(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  // Debounce search changes to avoid spamming URL/parent updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL query (?q=) to drive BooksPage filtering via searchParams
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    const nextQ = debouncedQuery.trim();
    if (currentQ === nextQ) return;

    const params = new URLSearchParams(searchParams.toString());
    if (nextQ) {
      params.set("q", nextQ);
      params.delete("page"); // reset pagination on new search
    } else {
      params.delete("q");
      params.delete("page");
    }
    const qs = params.toString();
    router.replace(`${basePath}${qs ? `?${qs}` : ""}`);
  }, [debouncedQuery, searchParams, router, basePath]);
  // Only books as search items
  const bookItems: SearchItem[] = useMemo(
    () =>
      books.map((book) => ({
        id: `book-${book.id}`,
        value: book.title,
        bookId: book.id,
      })),
    [books]
  );

  const filteredBookItems = useMemo(() => {
    if (!debouncedQuery.trim()) return bookItems;
    const query = debouncedQuery.toLowerCase();
    return bookItems.filter((item) => item.value.toLowerCase().includes(query));
  }, [bookItems, debouncedQuery]);

  // Keyboard shortcuts: Ctrl/Cmd+K focuses search, Escape clears filters
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (isModifier && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById(
          "unified-search"
        ) as HTMLInputElement | null;
        input?.focus();
        input?.select();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setSearchQuery("");
        setDebouncedQuery("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        params.delete("page");
        router.replace(basePath);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [searchParams, router, basePath]);

  const handleBookSelect = (bookId: string) => {
    // Navigate to book detail page; books are always under /books regardless of basePath
    router.push(`/books/${bookId}`);
  };

  const handleSelect = (value: string) => {
    const item = bookItems.find((i) => i.id === value);
    if (!item) {
      setSearchQuery(value);
      return;
    }
    setSearchQuery("");
    setDebouncedQuery("");
    if (item.bookId) {
      handleBookSelect(item.bookId);
    }
  };

  return (
    <div className="w-full max-w-6xl px-4 mb-1">
      {/* Unified search bar */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-full max-w-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Autocomplete
                    items={filteredBookItems}
                    autoHighlight
                    onValueChange={handleSelect}
                  >
                    <div className="relative">
                      <AutocompleteInput
                        id="unified-search"
                        placeholder="Search books..."
                        className="bg-white dark:bg-gray-900 rounded-full pr-16"
                        value={searchQuery}
                        onInput={(e) => {
                          const value = (e.target as HTMLInputElement).value;
                          setSearchQuery(value);
                        }}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground border border-muted-foreground/40 rounded px-1">
                        Ctrl+K
                      </span>
                    </div>
                    <AutocompletePositioner sideOffset={6}>
                      <AutocompletePopup>
                        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
                        <AutocompleteList>
                          {(item: SearchItem) => (
                            <AutocompleteItem key={item.id} value={item.id}>
                              <div className="flex items-center gap-2">
                                <Book className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{item.value}</span>
                              </div>
                            </AutocompleteItem>
                          )}
                        </AutocompleteList>
                      </AutocompletePopup>
                    </AutocompletePositioner>
                  </Autocomplete>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Escape to clear filters · Ctrl+J for tags · Ctrl+K to focus
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
