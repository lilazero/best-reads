import { getBooks, getTags } from '@/lib/mongodb.cjs';
import BookCardList from '@/components/DashboardComponents/BookCardList';
import SearchBar from '@/components/DashboardComponents/SearchBar';
import TagFilter from '@/components/BooksListComponents/TagFilter';

interface BooksPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const selectedTag = params.tag;
  
  const [books, tags] = await Promise.all([
    getBooks(selectedTag),
    getTags()
  ]);

  return (
    <div className="flex items-center flex-col min-h-screen mt-10 font-sans dark:bg-black">
      <SearchBar />
      <h2 className="text-2xl font-bold mb-6 mt-20 px-4">Books List</h2>
      <TagFilter tags={tags} />
      {books.length === 0 ? (
        <p className="text-gray-500 mt-8">No books found with this tag.</p>
      ) : (
        <BookCardList books={books} showBuyButton={false} />
      )}
    </div>
  );
}