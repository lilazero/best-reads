import { NextResponse } from "next/server";
import { getFeaturedBooks } from "@/lib/db/featuredBooks";

export async function GET() {
  try {
    const books = await getFeaturedBooks();
    return NextResponse.json({ books });
  } catch (error) {
    console.error("Failed to fetch featured books", error);
    return NextResponse.json(
      { error: "Failed to fetch featured books" },
      { status: 500 }
    );
  }
}
