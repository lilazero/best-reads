"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import BooksHeader from "@/components/BooksListComponents/BooksHeader";
import type { Book } from "@/lib/types";
import type { TagWithCount } from "@/lib/fetchBooksAndTags";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("q") || "";
  const selectedTag = searchParams.get("tag") || undefined;

  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load of all featured books and all tags
  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/featured-books");
        if (!res.ok) throw new Error("Failed to load featured books");

        const data = await res.json();
        const fetchedBooks = data.books || [];
        setAllBooks(fetchedBooks);

        // Get ALL tags from database (not just from featured books)
        const tagsRes = await fetch("/api/books/tags");
        if (!tagsRes.ok) throw new Error("Failed to load tags");
        const tagsData = await tagsRes.json();
        const allTags = tagsData.tags || [];

        // Build tag counts from featured books only
        const tagCountMap = new Map<string, number>();
        for (const book of fetchedBooks) {
          for (const tag of book.tags || []) {
            tagCountMap.set(tag.id, (tagCountMap.get(tag.id) || 0) + 1);
          }
        }

        // Map all tags with their counts in featured books
        const tagsWithCounts = allTags.map((tag: TagWithCount) => ({
          ...tag,
          count: tagCountMap.get(tag.id) || 0,
        }));

        setTags(tagsWithCounts);
      } catch (err) {
        setError((err as Error).message || "Failed to load featured books");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  // Filter books based on tag and search query
  useEffect(() => {
    let filtered = allBooks;

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

    setBooks(filtered);
  }, [allBooks, selectedTag, searchQuery]);

  return (
    <div className="flex items-center flex-col min-h-screen mt-3 font-sans ">
      {error && <p className="text-red-500">{error}</p>}

      <BooksHeader
        title="Recommended Books"
        searchQuery={searchQuery}
        tags={tags}
        books={allBooks}
        selectedTag={selectedTag}
        totalCount={books.length}
        startItem={books.length > 0 ? 1 : 0}
        endItem={books.length}
        isRefreshing={false}
        onRefresh={() => {}}
        onClearTag={() => router.push("/")}
        basePath="/"
      />

      {isLoading ? (
        <p className="text-gray-500 mt-8">Loading featured books...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500 mt-8">No books match the current filter.</p>
      ) : (
        <BookCardList books={books} showBuyButton={false} />
      )}
    </div>
  );
}
