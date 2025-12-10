import React, { Suspense } from "react";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import ReadingListCardActionsWrapper from "./ReadingListCardActionsClientWrapper";
import type { ListWithBooks } from "./types";

interface ReadingListCardProps {
  list: ListWithBooks;
}

export function ReadingListCard({ list }: ReadingListCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{list.name}</h2>
            <span className="text-sm text-muted-foreground">
              ({list.totalBooks} {list.totalBooks === 1 ? "book" : "books"})
            </span>
          </div>
          {list.description && (
            <p className="text-muted-foreground mt-1">{list.description}</p>
          )}
        </div>

        <Suspense fallback={<div className="w-8 h-8" />}>
          <ReadingListCardActionsWrapper />
        </Suspense>
      </div>

      {list.books.length > 0 ? (
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-2 w-12 bg-linear-to-l pointer-events-none z-10" />

          <Suspense fallback={<div className="h-48" />}>
            <BookCardList
              books={list.books}
              showBuyButton={false}
              useHorizontalScroll={true}
              hideAddToListButton={true}
              cardWidth="w-48 flex-shrink-0"
            />
          </Suspense>
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg">
          No books in this list yet
        </div>
      )}
    </div>
  );
}
