"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AddBookDialog from "../AddBookDialog";
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
  const { isLoaded, user } = useUser();
  const [showAddBook, setShowAddBook] = useState(false);

  // Body scroll locking is handled by the card/modal itself via `useScrollLock`.
  // This component only tracks which card is active and delegates the UI behavior.

  return (
    <div className="mt-3 ">
      <div
        className={
          useHorizontalScroll
            ? "flex gap-2 overflow-x-auto pb-2 scroll-smooth"
            : (() => {
                // Map allowed column counts to mobile-first responsive Tailwind classes.
                const count = Math.min(
                  Math.max(Math.floor(columnCount || 3), 1),
                  6
                );
                const colsMap: Record<number, string> = {
                  1: "grid-cols-1",
                  2: "grid-cols-1 sm:grid-cols-2",
                  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
                  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
                  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
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
        {/* Render Add button after books for admin user */}
        {isLoaded &&
          user?.primaryEmailAddress?.emailAddress ===
            "andililajal@gmail.com" && (
            <div className="flex items-center justify-center p-4">
              <button
                onClick={() => setShowAddBook(true)}
                className="w-full h-48 flex items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 text-4xl text-neutral-500 hover:bg-neutral-50"
                aria-label="Add book"
              >
                +
              </button>
              <AddBookDialog open={showAddBook} onOpenChange={setShowAddBook} />
            </div>
          )}
      </div>
    </div>
  );
}
