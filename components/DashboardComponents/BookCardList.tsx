"use client";

import { useEffect, useState } from "react";
import type { Book } from "@/lib/types";
import BookCard from "./BookCard";

interface BookCardListProps {
  books: Book[];
  showBuyButton?: boolean;
  useHorizontalScroll?: boolean;
  hideAddToListButton?: boolean;
  cardWidth?: string;
  cardHeight?: string;
}
/**
 * @props books - An array of Book objects to be displayed in the recommended book list.
 * @props showBuyButton - A boolean indicating whether to show the buy button on each book card. Default is true.
 * @props useHorizontalScroll - Whether to display books in a horizontal scrollable layout instead of grid. Default is false.
 * @props hideAddToListButton - Whether to hide the "Add to List" button on book cards. Default is false.
 * @props cardWidth - Custom width for book cards (e.g., "w-48"). Optional.
 * @props cardHeight - Custom height for book cards (e.g., "h-72"). Optional.
 */
export default function BookCardList({
  books,
  showBuyButton = true,
  useHorizontalScroll = false,
  hideAddToListButton = false,
  cardWidth,
  cardHeight,
}: BookCardListProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = activeCardId ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeCardId]);

  return (
    <div className="mt-3 ">
      <div
        className={
          useHorizontalScroll
            ? "flex gap-2 overflow-x-auto pb-2 scroll-smooth"
            : "grid gap-1 md:grid-cols-2 xl:grid-cols-3"
        }
      >
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            index={index}
            showBuyButton={showBuyButton}
            isActive={activeCardId === book.id}
            onActivate={() => setActiveCardId(book.id)}
            onDeactivate={() => setActiveCardId(null)}
            hideAddToListButton={hideAddToListButton}
            customWidth={cardWidth}
            customHeight={cardHeight}
          />
        ))}
      </div>
    </div>
  );
}
