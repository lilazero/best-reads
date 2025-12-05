"use server";

import { getBooks, getTags } from "@/lib/mongodb.cjs";

export interface FetchBooksAndTagsResult {
  books: ReturnType<typeof getBooks> extends Promise<infer T> ? T : never;
  tags: ReturnType<typeof getTags> extends Promise<infer T> ? T : never;
  error: string | null;
}

/**
 * Fetches books and tags from MongoDB.
 * @param selectedTag - Optional tag to filter books by.
 * @returns An object containing books, tags, and any error message.
 */
export async function fetchBooksAndTags(
  selectedTag?: string
): Promise<FetchBooksAndTagsResult> {
  try {
    const [books, tags] = await Promise.all([getBooks(selectedTag), getTags()]);
    return { books, tags, error: null };
  } catch (err) {
    const errorMessage =
      err instanceof Error && err.name === "MongoError"
        ? "There was a problem fetching data from MongoDB."
        : "Unable to load books right now.";

    return { books: [], tags: [], error: errorMessage };
  }
}
