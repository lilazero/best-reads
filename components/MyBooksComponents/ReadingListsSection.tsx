import BooksPagination from "@/components/BooksListComponents/BooksPagination";
import type { ListWithBooks } from "./types";
import { ReadingListCard } from "./ReadingListCard";

interface ReadingListsSectionProps {
  lists: ListWithBooks[];
  currentPage: number;
  totalPages: number;
  buildPageUrl: (page: number) => string;
}

export function ReadingListsSection({
  lists,
  currentPage,
  totalPages,
  buildPageUrl,
}: ReadingListsSectionProps) {
  return (
    <div className="space-y-8">
      {lists.map((list) => (
        <ReadingListCard key={list.id} list={list} />
      ))}

      {totalPages > 1 && (
        <div className="mt-12">
          <BooksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildPageUrl={buildPageUrl}
          />
        </div>
      )}
    </div>
  );
}
