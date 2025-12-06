import BookCardList from "@/components/DashboardComponents/BookCardList";
import SearchBar from "@/components/DashboardComponents/SearchBar";
import { getFeaturedBooks } from "@/lib/db/featuredBooks";
import type { Book } from "@/lib/types";

export default async function Home() {
  let books: Book[] = [];
  let error: string | null = null;

  try {
    // Read the featured list directly on the server (no client fetch needed).
    books = await getFeaturedBooks();
  } catch (err) {
    // Keep a friendly message on failures instead of crashing the page.
    error = (err as Error).message || "Failed to load featured books";
  }

  return (
    <div className="flex items-center flex-col min-h-vh mt-2 justify-center font-sans ">
      <SearchBar />
      <h2 className="text-2xl font-bold  mt-6 px-4">Recommended Books</h2>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!error && books.length === 0 ? (
        <p className="text-gray-500 mt-6">No featured books found.</p>
      ) : (
        <BookCardList books={books} showBuyButton={false} />
      )}
    </div>
  );
}
