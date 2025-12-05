import { getBooks } from "@/lib/db/books";
import BookCardList from "@/components/DashboardComponents/BookCardList";
import SearchBar from "@/components/DashboardComponents/SearchBar";

export default async function BooksPage() {
  const books = await getBooks();
  return (
    <div className="flex items-center flex-col min-h-vh mt-10 justify-center font-sans dark:bg-black">
      <SearchBar />
      <h2 className="text-2xl font-bold mb-6 mt-20 px-4">Books List</h2>
      <BookCardList books={books} showBuyButton={false} />
    </div>
  );
}
