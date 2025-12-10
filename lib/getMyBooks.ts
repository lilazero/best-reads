import { getCurrentDbUser } from "@/lib/auth/getCurrentUser";
import { getUserReadingLists } from "@/lib/db/userBooks";
import { getBooksByIds } from "@/lib/db/books";
import type { ListWithBooks } from "@/components/MyBooksComponents/types";

const LISTS_PER_PAGE = 5;

export async function getMyBooks(page: number) {
  const p = Math.max(1, Number(page || 1));

  const user = await getCurrentDbUser();
  if (!user) {
    return { lists: [] as ListWithBooks[], total: 0 };
  }

  const allLists = await getUserReadingLists(user.id);
  const total = allLists.length;

  const start = (p - 1) * LISTS_PER_PAGE;
  const slice = allLists.slice(start, start + LISTS_PER_PAGE);

  const listsWithBooks: ListWithBooks[] = await Promise.all(
    slice.map(async (list) => {
      type BookEntry = {
        bookId: string;
        bookAddedOnListOnDate: string | Date;
      };
      const entries = (list.bookIds ?? []) as BookEntry[];
      const newest = [...entries]
        .sort((a, b) => {
          const da = new Date(a.bookAddedOnListOnDate).getTime();
          const db = new Date(b.bookAddedOnListOnDate).getTime();
          return db - da;
        })
        .slice(0, 10)
        .map((b) => String(b.bookId));

      const books = newest.length ? await getBooksByIds(newest) : [];

      return {
        ...list,
        books,
      } as ListWithBooks;
    })
  );

  return { lists: listsWithBooks, total };
}
