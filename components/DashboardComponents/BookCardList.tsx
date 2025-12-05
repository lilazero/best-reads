"use client";

import { useEffect, useState } from "react";
import type { Book } from "@/lib/types";
import BookCard from "./BookCard";

interface BookCardListProps {
  books: Book[];
  showBuyButton?: boolean;
}
/**
 * @props books - An array of Book objects to be displayed in the recommended book list.
 * @props showBuyButton - A boolean indicating whether to show the buy button on each book card. Default is true.
 */
export default function BookCardList({
  books,
  showBuyButton = true,
}: BookCardListProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    if (activeCardId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [activeCardId]);

  return (
    <div className="mt-20">
      <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3">
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            index={index}
            showBuyButton={showBuyButton}
            isActive={activeCardId === book.id}
            onActivate={() => setActiveCardId(book.id)}
            onDeactivate={() => setActiveCardId(null)}
          />
        ))}
      </div>
    </div>
  );
}
