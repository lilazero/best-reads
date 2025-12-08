import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth/getCurrentUser";
import { getUserReadingLists } from "@/lib/db/userBooks";
import { getBooksByIds } from "@/lib/db/books";

export async function GET(request: Request) {
  try {
    console.log("[api/my-books] incoming request:", request.url);
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page") ?? "1";
    const page = Math.max(1, Number(pageParam || "1"));

    const listsPerPage = 5;

    const user = await getCurrentDbUser();
    console.log(
      "[api/my-books] current db user:",
      user ? { id: user.id, clerkId: user.clerkId } : null
    );
    if (!user) {
      return NextResponse.json({ lists: [], total: 0 });
    }

    const allLists = await getUserReadingLists(user.id);
    const total = allLists.length;

    // If debug flag present, return diagnostic info to help with debugging
    if (url.searchParams.get("debug") === "1") {
      const slice = allLists.slice(0, 5);
      return NextResponse.json({
        debug: true,
        user: { id: user.id, clerkId: user.clerkId, email: user.email },
        total,
        sample: slice.map((l) => ({
          id: l.id,
          userId: l.userId,
          name: l.name,
        })),
      });
    }

    const start = (page - 1) * listsPerPage;
    const slice = allLists.slice(start, start + listsPerPage);

    // For each list, take the newest 10 book entries and fetch book details
    const listsWithBooks = await Promise.all(
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
        };
      })
    );

    return NextResponse.json({ lists: listsWithBooks, total });
  } catch (err) {
    console.error("api/my-books error", err);
    return NextResponse.json({ lists: [], total: 0 }, { status: 500 });
  }
}
