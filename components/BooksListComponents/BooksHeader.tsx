"use client";

import SearchAndTagFilter from "./SearchAndTagFilter";
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
  startItem: number;
  endItem: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onClearTag: () => void;
}

export default function BooksHeader({
  title,
  searchQuery,
  tags,
  books,
  selectedTag,
  totalCount,
  startItem,
  endItem,
  isRefreshing,
  onRefresh,
  onClearTag,
}: BooksHeaderProps) {
  return (
    <div className="w-full max-w-6xl px-4 mb-3 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-bold ">{title}</h2>

      <div className="flex-1 flex justify-center">
        <SearchAndTagFilter
          tags={tags}
          books={books}
          initialQuery={searchQuery}
        />
      </div>

      <div className="min-w-fit flex-col">
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
                    ✕
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
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 min-w-fit">
          {totalCount > 0 && (
            <>
              <span className="text-sm">
                Showing {startItem}-{endItem} of {totalCount} books
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
