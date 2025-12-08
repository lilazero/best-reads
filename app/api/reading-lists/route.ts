import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/users";
import { getUserReadingLists } from "@/lib/db/userBooks";

/**
 * GET /api/reading-lists
 * Fetch all reading lists for the current user
 */
export async function GET() {
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

    // Fetch user's reading lists
    const lists = await getUserReadingLists(dbUser.id);

    return NextResponse.json({ lists }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reading lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading lists" },
      { status: 500 }
    );
  }
}
