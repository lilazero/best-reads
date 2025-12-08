"use client";

import { useState } from "react";
import type { Book } from "@/lib/types";
import BookCard from "./BookCard";

interface BookCardListProps {
  books: Book[];
  showBuyButton?: boolean;
  useHorizontalScroll?: boolean;
  hideAddToListButton?: boolean;
  cardWidth?: string;
  cardHeight?: string;
  columnCount?: number;
  previewImageFit?: "card" | "fixed";
  previewImageHeight?: string;
  previewImageWidth?: string;
  previewImageBackgroundTransparent?: boolean;
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
  columnCount,
  previewImageFit = "card",
  previewImageHeight,
  previewImageWidth,
  previewImageBackgroundTransparent = false,
}: BookCardListProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Body scroll locking is handled by the card/modal itself via `useScrollLock`.
  // This component only tracks which card is active and delegates the UI behavior.

  return (
    <div className="mt-3 ">
      <div
        className={
          useHorizontalScroll
            ? "flex gap-2 overflow-x-auto pb-2 scroll-smooth"
            : (() => {
                // Map allowed column counts to explicit class strings so Tailwind
                // can detect them at build time. We only allow 1..6 columns.
                const count = Math.min(
                  Math.max(Math.floor(columnCount || 3), 1),
                  6
                );
                const colsMap: Record<number, string> = {
                  1: "grid-cols-1 md:grid-cols-1 xl:grid-cols-1",
                  2: "grid-cols-2 md:grid-cols-2 xl:grid-cols-2",
                  3: "grid-cols-3 md:grid-cols-3 xl:grid-cols-3",
                  4: "grid-cols-4 md:grid-cols-4 xl:grid-cols-4",
                  5: "grid-cols-5 md:grid-cols-5 xl:grid-cols-5",
                  6: "grid-cols-6 md:grid-cols-6 xl:grid-cols-6",
                };

                return `grid gap-1 ${colsMap[count]}`;
              })()
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
            previewImageFit={previewImageFit}
            previewImageHeight={previewImageHeight}
            previewImageWidth={previewImageWidth}
            previewImageBackgroundTransparent={
              previewImageBackgroundTransparent
            }
          />
        ))}
      </div>
    </div>
  );
}
