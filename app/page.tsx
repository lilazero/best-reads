import React, { Suspense } from "react";
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
      <Suspense
        fallback={
          <div className="min-h-40 w-full flex items-center justify-center">
            Loading recommended books...
          </div>
        }
      >
        <RecommendedBooksList initialBooks={books} initialTags={tags} />
      </Suspense>
    </div>
  );
}
