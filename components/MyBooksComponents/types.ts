import type { Book, UserReadingList } from "@/lib/types";

export interface ListWithBooks extends UserReadingList {
  books: Book[];
  totalBooks: number;
}
