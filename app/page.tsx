import RecommendedBooksList from "@/components/RecommendedBooksList";
import { fetchBooksAndTags } from "@/lib/fetchBooksAndTags";

export default async function Home() {
  // Server-side data fetching - no client hydration delay
  const { books, tags } = await fetchBooksAndTags();

  return (
    <div className="flex items-center flex-col min-h-screen mt-3 font-sans ">
      <RecommendedBooksList initialBooks={books} initialTags={tags} />
    </div>
  );
}
