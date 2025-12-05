"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchBooksAndTags, refreshBookCount } from "@/lib/fetchBooksAndTags";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import SearchBar from "@/components/DashboardComponents/SearchBar";
import TagFilter from "@/components/BooksListComponents/TagFilter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RefreshCw } from "lucide-react";

interface BooksPageProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default function BooksPage({ searchParams }: BooksPageProps) {
  const currentSearchParams = useSearchParams();

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

  useEffect(() => {
    const loadData = async () => {
      const params = await searchParams;
      const selectedTag = params.tag;
      const page = parseInt(params.page || "1", 10);

      const result = await fetchBooksAndTags(selectedTag, page);
      setBooks(result.books);
      setTags(result.tags);
      setTotalCount(result.totalCount);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setError(result.error);
    };

    loadData();
  }, [searchParams]);

  const handleRefreshCount = async () => {
    setIsRefreshing(true);
    const selectedTag = currentSearchParams.get("tag") || undefined;
    const result = await refreshBookCount(selectedTag);

    if (!result.error) {
      setTotalCount(result.count);
      setTotalPages(Math.ceil(result.count / 30));
    }
    setIsRefreshing(false);
  };

  const buildPageUrl = (page: number) => {
    const tag = currentSearchParams.get("tag");
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (page > 1) params.set("page", page.toString());
    const queryString = params.toString();
    return `/books${queryString ? `?${queryString}` : ""}`;
  };

  // Calculate displayed range
  const startItem = (currentPage - 1) * 30 + 1;
  const endItem = Math.min(currentPage * 30, totalCount);

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
      <h2 className="text-2xl font-bold mb-3 mt-3 px-4">All Books</h2>
      {error && <p className="text-red-500">{error}</p>}
      <TagFilter tags={tags} />

      {/* Book count display with refresh button */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 ">
          <span className="text-[10px]">
            Showing {startItem}-{endItem} of {totalCount} books
          </span>
          <button
            onClick={handleRefreshCount}
            disabled={isRefreshing}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
            title="Refresh book count"
          >
            <RefreshCw
              className={`w-2 h-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      )}

      {books.length === 0 ? (
        <p className="text-gray-500 mt-8">No books found with this tag.</p>
      ) : (
        <>
          <BookCardList books={books} showBuyButton={false} />

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
