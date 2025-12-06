"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchBooksAndTags, refreshBookCount } from "@/lib/fetchBooksAndTags";
import { BOOKS_PER_PAGE } from "@/lib/constants";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import SearchAndTagFilter from "@/components/BooksListComponents/SearchAndTagFilter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RefreshCw, Tags } from "lucide-react";

export default function BooksPage() {
  const currentSearchParams = useSearchParams();
  const router = useRouter();
  const selectedTag = currentSearchParams.get("tag");

  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<
    Awaited<ReturnType<typeof fetchBooksAndTags>>["books"]
  >([]);
  const [tags, setTags] = useState<
    Awaited<ReturnType<typeof fetchBooksAndTags>>["tags"]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search query comes from URL (?q=), keeps behavior consistent with tag filtering
  const searchQuery = currentSearchParams.get("q") || "";

  // Filter books based on search query (same logic as dropdown)
  const filteredBooks = searchQuery.trim()
    ? books.filter((book) => {
        const query = searchQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          (book.description &&
            book.description.toLowerCase().includes(query)) ||
          (book.longDescription &&
            book.longDescription.toLowerCase().includes(query))
        );
      })
    : books;

  const selectedTagParam = currentSearchParams.get("tag") || undefined;
  const pageParam = parseInt(currentSearchParams.get("page") || "1", 10);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchBooksAndTags(selectedTagParam, pageParam);
      setBooks(result.books);
      setTags(result.tags);
      setTotalCount(result.totalCount);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setError(result.error);
    };

    loadData();
  }, [selectedTagParam, pageParam]);

  const handleRefreshCount = async () => {
    setIsRefreshing(true);
    const selectedTag = currentSearchParams.get("tag") || undefined;
    const result = await refreshBookCount(selectedTag);

    if (!result.error) {
      setTotalCount(result.count);
      setTotalPages(Math.ceil(result.count / BOOKS_PER_PAGE));
    }
    setIsRefreshing(false);
  };

  const buildPageUrl = (page: number) => {
    const tag = currentSearchParams.get("tag");
    const query = currentSearchParams.get("q");
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (query) params.set("q", query);
    if (page > 1) params.set("page", page.toString());
    const queryString = params.toString();
    return `/books${queryString ? `?${queryString}` : ""}`;
  };

  // Calculate displayed range
  const startItem = (currentPage - 1) * BOOKS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * BOOKS_PER_PAGE, totalCount);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={buildPageUrl(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href={buildPageUrl(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages near current
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={buildPageUrl(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis before last
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={buildPageUrl(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex items-center flex-col min-h-screen mt-3 font-sans dark:bg-black">
      {error && <p className="text-red-500">{error}</p>}

      {/* Book count, search bar, and filtering info - all inline */}
      <div className="w-full max-w-6xl px-4 mb-3 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold ">All Books</h2>

        {/* Search bar in center */}
        <div className="flex-1 flex justify-center">
          <SearchAndTagFilter
            tags={tags}
            books={books}
            initialQuery={searchQuery}
          />
        </div>

        {/* Filter indicator on right */}
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
                      onClick={() => {
                        router.push("/books");
                      }}
                      className="ml-1 text-xs underline hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Search results will only show books in the {selectedTag}{" "}
                    genre
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {/* Book count on left */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 min-w-fit">
            {totalCount > 0 && (
              <>
                <span className="text-sm">
                  Showing {startItem}-{endItem} of {totalCount} books
                </span>
                <button
                  onClick={handleRefreshCount}
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

      {books.length === 0 ? (
        <p className="text-gray-500 mt-8">No books found with this tag.</p>
      ) : filteredBooks.length === 0 ? (
        <p className="text-gray-500 mt-8">No books match your search.</p>
      ) : (
        <>
          <BookCardList books={filteredBooks} showBuyButton={false} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 mb-12">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={buildPageUrl(currentPage - 1)}
                      />
                    </PaginationItem>
                  )}

                  {renderPaginationItems()}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={buildPageUrl(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
