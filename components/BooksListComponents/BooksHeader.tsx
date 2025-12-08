"use client";

import { useEffect, useState } from "react";
import SearchFilter from "./SearchFilter";
import TagFilter from "./TagFilter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { RefreshCw, Tags } from "lucide-react";
import type { TagWithCount } from "@/lib/fetchBooksAndTags";
import type { Book } from "@/lib/types";

interface BooksHeaderProps {
  title: string;
  searchQuery: string;
  tags: TagWithCount[];
  books: Book[];
  selectedTag?: string | null;
  totalCount: number;
  filteredCount?: number;
  startItem: number;
  endItem: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onClearTag: () => void;
  basePath: string;
}

export default function BooksHeader({
  title,
  searchQuery,
  tags,
  books,
  selectedTag,
  totalCount,
  filteredCount,
  startItem,
  endItem,
  isRefreshing,
  onRefresh,
  onClearTag,
  basePath,
}: BooksHeaderProps) {
  const [tipOpen, setTipOpen] = useState(false);

  // Use filteredCount if provided (for search results), otherwise use totalCount (for tag filtering)
  const displayCount = filteredCount !== undefined ? filteredCount : totalCount;

  // Briefly show hint after a search term is entered
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const openTimer = setTimeout(() => setTipOpen(true), 0);
    const closeTimer = setTimeout(() => setTipOpen(false), 1000);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [searchQuery]);

  return (
    <div className="w-full max-w-6xl px-4 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 className="text-2xl font-bold w-full sm:w-auto">{title}</h2>

      <div className="flex-1 flex justify-center w-full">
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:justify-center">
          <SearchFilter
            books={books}
            initialQuery={searchQuery}
            basePath={basePath}
          />
          <TagFilter tags={tags} basePath={basePath} />
        </div>
      </div>

      <div className="w-full sm:w-auto">
        {selectedTag && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                  <Tags className="h-4 w-4" />
                  <span className="border-b border-dotted border-muted-foreground">
                    Filtering by:{" "}
                    <strong className="text-foreground">{selectedTag}</strong>
                  </span>
                  <button
                    onClick={onClearTag}
                    className="ml-1 text-xs underline hover:text-foreground"
                  >
                    <Tooltip open={tipOpen} onOpenChange={setTipOpen}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center">
                          ✕
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Press Escape to clear all filters
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Search results will only show books in the {selectedTag} genre
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="flex flex-col items-start sm:items-end gap-1 text-gray-600 dark:text-gray-400 w-full sm:min-w-fit">
          {totalCount > 0 && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[10px]">
                  {searchQuery.trim() && selectedTag ? (
                    <>
                      Showing {startItem}-{Math.min(endItem, displayCount)} of{" "}
                      {displayCount} books matching &quot;{searchQuery}&quot;
                      from {totalCount} in {selectedTag}
                    </>
                  ) : searchQuery.trim() ? (
                    <>
                      Showing {startItem}-{Math.min(endItem, displayCount)} of{" "}
                      {displayCount} books matching &quot;{searchQuery}&quot;
                    </>
                  ) : selectedTag ? (
                    <>
                      Showing {startItem}-{endItem} of {totalCount} books in{" "}
                      {selectedTag}
                    </>
                  ) : (
                    <>
                      Showing {startItem}-{endItem} of {totalCount} books
                    </>
                  )}
                </span>
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
                  title="Refresh book count"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
