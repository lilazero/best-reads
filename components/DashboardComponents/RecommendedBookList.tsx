"use client";

import { useState } from "react";

import type { Book } from "@/lib/types";
import RecommendedBook from "./RecommendedBook";

interface RecommendedBookListProps {
  books: Book[];
}

export default function RecommendedBookList({
  books,
}: RecommendedBookListProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleToggle = (bookId: string) => {
    setActiveCardId((prev) => (prev === bookId ? null : bookId));
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {books.map((book, index) => (
        <RecommendedBook
          key={book.id}
          book={book}
          index={index}
          isExpanded={activeCardId === book.id}
          onToggle={() => handleToggle(book.id)}
        />
      ))}
    </div>
  );
}
