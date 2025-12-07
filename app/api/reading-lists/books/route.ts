import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/users";
import { getBooksByIds } from "@/lib/db/books";

/**
 * POST /api/reading-lists/books
 * Fetch multiple books by their IDs
 * Body: { bookIds: string[] }
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const dbUser = await getUserByClerkId(clerkUser.id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { bookIds } = body;

    if (!Array.isArray(bookIds)) {
      return NextResponse.json(
        { error: "bookIds must be an array" },
        { status: 400 }
      );
    }

    // Fetch books
    const books = await getBooksByIds(bookIds);

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch books",
      },
      { status: 500 }
    );
  }
}
