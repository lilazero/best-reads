import RecommendedBooksList from "@/components/RecommendedBooksList";
import { getTags } from "@/lib/db/books";
import { getFeaturedBooks } from "@/lib/db/featuredBooks";

export default async function Home() {
  // Server-side data fetching - fetch featured Recommended Books and available tags
  const [books, tags] = await Promise.all([
    getFeaturedBooks("Recommended_Books"),
    getTags(),
  ]);

  return (
    <div className="flex items-center flex-col min-h-screen mt-3 font-sans ">
      <RecommendedBooksList initialBooks={books} initialTags={tags} />
    </div>
  );
}
