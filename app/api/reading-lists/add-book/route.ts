import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/users";
import { addBookToReadingList, getReadingListById } from "@/lib/db/userBooks";

/**
 * POST /api/reading-lists/add-book
 * Add a book to a reading list
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const dbUser = await getUserByClerkId(clerkUser.id);
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { listId, bookId } = body;

    // Validate input
    if (!listId || typeof listId !== "string") {
      return NextResponse.json(
        { error: "List ID is required" },
        { status: 400 }
      );
    }

    if (!bookId || typeof bookId !== "string") {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Verify the list exists and belongs to the user
    const list = await getReadingListById(listId);
    if (!list) {
      return NextResponse.json(
        { error: "Reading list not found" },
        { status: 404 }
      );
    }

    if (list.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "You do not have permission to modify this list" },
        { status: 403 }
      );
    }

    // Check if book is already in the list
    if (list.bookIds.includes(bookId)) {
      return NextResponse.json(
        { error: "This book is already in the list" },
        { status: 400 }
      );
    }

    // Add the book to the reading list
    const updatedList = await addBookToReadingList(listId, bookId);

    if (!updatedList) {
      return NextResponse.json(
        { error: "Failed to add book to list" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Book added to list successfully",
        list: updatedList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding book to reading list:", error);
    return NextResponse.json(
      { error: "Failed to add book to reading list" },
      { status: 500 }
    );
  }
}
