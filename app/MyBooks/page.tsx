import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getMyBooks } from "@/lib/getMyBooks";
import { Button } from "@/components/ui/button";
import { ReadingListsSection } from "@/components/MyBooksComponents/ReadingListsSection";
import type { ListWithBooks } from "@/components/MyBooksComponents/types";

const LISTS_PER_PAGE = 5;

export default async function MyBooksPage({
  searchParams,
}: {
  searchParams?: { page?: string } | Promise<{ page?: string }>;
}) {
  // `searchParams` may be a plain object or a Promise depending on Next version.
  let paramsObj: { page?: string } | undefined = undefined;
  if (searchParams) {
    // If it's a thenable (some Next versions), await it
    if (
      typeof searchParams === "object" &&
      searchParams !== null &&
      "then" in searchParams &&
      typeof (searchParams as { then?: unknown }).then === "function"
    ) {
      paramsObj = await (searchParams as Promise<{ page?: string }>);
    } else {
      paramsObj = searchParams as { page?: string };
    }
  }

  const currentPage = Number(paramsObj?.page ?? "1") || 1;

  // Ensure the user is authenticated with Clerk before calling the API.
  const clerkUser = await currentUser();
  if (!clerkUser) {
    // Instead of redirecting immediately (which blocks debugging), render
    // a friendly prompt so we can see server logs and the page layout.
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Books</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl text-muted-foreground mb-4">
            You are not signed in
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to view your reading lists.
          </p>
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get the prepared lists+books directly from server helper (no HTTP fetch)
  let listsWithBooks: ListWithBooks[] = [];
  let totalLists = 0;
  try {
    const payload = await getMyBooks(currentPage);
    listsWithBooks = payload.lists ?? [];
    totalLists = payload.total ?? 0;
  } catch (err) {
    console.error("Error getting my books", err);
  }

  const totalPages = Math.ceil(totalLists / LISTS_PER_PAGE);
  const buildPageUrl = (page: number) => `/MyBooks?page=${page}`;

  if (totalLists === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Books</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl text-muted-foreground mb-4">
            No reading lists yet
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Browse books to get started and create your first reading list
          </p>
          <Link href="/books">
            <Button>Browse Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Books</h1>

      <ReadingListsSection
        lists={listsWithBooks}
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageUrl={buildPageUrl}
      />
    </div>
  );
}
