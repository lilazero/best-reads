"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchBooksAndTags, refreshBookCount } from "@/lib/fetchBooksAndTags";
import { BOOKS_PER_PAGE } from "@/lib/constants";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import BooksHeader from "@/components/BooksListComponents/BooksHeader";
import BooksPagination from "@/components/BooksListComponents/BooksPagination";

export default function BooksPage() {
  const currentSearchParams = useSearchParams();
  const router = useRouter();

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
    ? books.filter((book: (typeof books)[0]) => {
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

  const selectedTag = currentSearchParams.get("tag") || undefined;
  const pageParam = parseInt(currentSearchParams.get("page") || "1", 10);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchBooksAndTags(selectedTag, pageParam);
      setBooks(result.books);
      setTags(result.tags);
      setTotalCount(result.totalCount);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setError(result.error);
    };

    loadData();
  }, [selectedTag, pageParam]);

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

  const startItem = (currentPage - 1) * BOOKS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * BOOKS_PER_PAGE, totalCount);

  return (
    <div className="flex items-center flex-col min-h-screen mt-3 font-sans ">
      {error && <p className="text-red-500">{error}</p>}

      <BooksHeader
        title="All Books"
        searchQuery={searchQuery}
        tags={tags}
        books={books}
        selectedTag={selectedTag}
        totalCount={totalCount}
        filteredCount={searchQuery.trim() ? filteredBooks.length : undefined}
        startItem={startItem}
        endItem={endItem}
        isRefreshing={isRefreshing}
        onRefresh={handleRefreshCount}
        onClearTag={() => router.push("/books")}
        basePath="/books"
      />

      {books.length === 0 ? (
        <p className="text-gray-500 mt-8">No books found with this tag.</p>
      ) : filteredBooks.length === 0 ? (
        <p className="text-gray-500 mt-8">No books match your search.</p>
      ) : (
        <>
          <BookCardList books={filteredBooks} showBuyButton={false} />

          {totalPages > 1 && (
            <div className="mt-8 mb-12">
              <BooksPagination
                currentPage={currentPage}
                totalPages={totalPages}
                buildPageUrl={buildPageUrl}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
