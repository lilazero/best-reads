"use client";

import { useState, useEffect } from "react";
import { fetchBooksAndTags } from "@/lib/fetchBooksAndTags";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import SearchBar from "@/components/DashboardComponents/SearchBar";
import TagFilter from "@/components/BooksListComponents/TagFilter";

interface BooksPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default function BooksPage({ searchParams }: BooksPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<
    Awaited<ReturnType<typeof fetchBooksAndTags>>["books"]
  >([]);
  const [tags, setTags] = useState<
    Awaited<ReturnType<typeof fetchBooksAndTags>>["tags"]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const params = await searchParams;
      const selectedTag = params.tag;

      const result = await fetchBooksAndTags(selectedTag);
      setBooks(result.books);
      setTags(result.tags);
      setError(result.error);
    };

    loadData();
  }, [searchParams]);

  return (
    <div className="flex items-center flex-col min-h-screen mt-10 font-sans dark:bg-black">
      <SearchBar />
      <h2 className="text-2xl font-bold mb-6 mt-20 px-4">Books List</h2>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Display error message */}
      <TagFilter tags={tags} />
      {books.length === 0 ? (
        <p className="text-gray-500 mt-8">No books found with this tag.</p>
      ) : (
        <BookCardList books={books} showBuyButton={false} />
      )}
    </div>
  );
}
