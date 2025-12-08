import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/users";
import { createReadingList, getUserReadingLists } from "@/lib/db/userBooks";

/**
 * POST /api/reading-lists/create
 * Create a new reading list for the current user
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
    const { name, description, isPublic } = body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "List name is required and must not be empty" },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "List name must be 100 characters or less" },
        { status: 400 }
      );
    }

    // Check if list name is unique for this user
    const existingLists = await getUserReadingLists(dbUser.id);
    const isDuplicate = existingLists.some(
      (list) => list.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: "You already have a list with this name" },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedDescription = description
      ? String(description).trim().slice(0, 500)
      : undefined;

    // Create the reading list
    const newList = await createReadingList(
      dbUser.id,
      sanitizedName,
      sanitizedDescription,
      Boolean(isPublic)
    );

    return NextResponse.json(
      {
        message: "Reading list created successfully",
        list: newList,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reading list:", error);
    return NextResponse.json(
      { error: "Failed to create reading list" },
      { status: 500 }
    );
  }
}
