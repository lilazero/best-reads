"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import HomeBooksHeader from "@/components/BooksListComponents/HomeBooksHeader";
import type { TagWithCount } from "@/lib/fetchBooksAndTags";
import type { Book } from "@/lib/types";

interface RecommendedBooksListProps {
  initialBooks: Book[];
  initialTags: TagWithCount[];
}

export default function RecommendedBooksList({
  initialBooks,
  initialTags,
}: RecommendedBooksListProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const selectedTag = searchParams.get("tag") || undefined;

  // Filter books based on tag and search query
  const filteredBooks = useMemo(() => {
    let filtered = initialBooks;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((book) =>
        book.tags?.some((tag) => tag.value === selectedTag)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          (book.description &&
            book.description.toLowerCase().includes(query)) ||
          (book.longDescription &&
            book.longDescription.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [initialBooks, selectedTag, searchQuery]);

  return (
    <>
      <HomeBooksHeader tags={initialTags} books={initialBooks} basePath="/" />

      {filteredBooks.length === 0 ? (
        <p className="text-gray-500 mt-8">
          {searchQuery || selectedTag
            ? "No books match the current filter."
            : "No books found."}
        </p>
      ) : (
        <BookCardList
          books={filteredBooks}
          showBuyButton={false}
          columnCount={4}
          previewImageFit="card"
          previewImageHeight={"h-92"}
          previewImageBackgroundTransparent={true}
        />
      )}
    </>
  );
}
