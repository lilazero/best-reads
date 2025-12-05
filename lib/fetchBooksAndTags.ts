"use server";

import { getBooks, getTags, getBookCount } from "@/lib/db/books";
import { getCount, setCount, invalidateCount } from "@/lib/bookCountCache";
import type { Book } from "@/lib/types";

export interface TagWithCount {
  id: string;
  value: string;
  icon?: string;
  count: number;
}

export interface FetchBooksAndTagsResult {
  books: Book[];
  tags: TagWithCount[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  error: string | null;
}

const BOOKS_PER_PAGE = 30;

/**
 * Fetches books and tags from MongoDB with pagination support.
 * Uses server-side cache for book counts (2-hour TTL).
 * @param selectedTag - Optional tag to filter books by.
 * @param page - Page number (1-indexed), defaults to 1.
 * @param forceRefresh - If true, bypasses cache and fetches fresh count.
 * @returns An object containing books, tags, pagination info, and any error message.
 */
export async function fetchBooksAndTags(
  selectedTag?: string,
  page: number = 1,
  forceRefresh: boolean = false
): Promise<FetchBooksAndTagsResult> {
  try {
    const cacheKey = selectedTag || "all";

    // Check cache for count (unless forceRefresh)
    let totalCount = forceRefresh ? null : getCount(cacheKey);

    // Fetch books, tags, and count (if not cached) in parallel
    const [books, tags, freshCount] = await Promise.all([
      getBooks(selectedTag, page, BOOKS_PER_PAGE),
      getTags(),
      totalCount === null ? getBookCount(selectedTag) : Promise.resolve(null),
    ]);

    // Use fresh count if fetched, otherwise use cached
    if (freshCount !== null) {
      totalCount = freshCount;
      setCount(cacheKey, freshCount);
    }

    const totalPages = Math.ceil((totalCount || 0) / BOOKS_PER_PAGE);

    return {
      books,
      tags,
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages,
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error && err.name === "MongoError"
        ? "There was a problem fetching data from MongoDB."
        : "Unable to load books right now.";

    return {
      books: [],
      tags: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      error: errorMessage,
    };
  }
}

/**
 * Refresh the book count for a specific tag (or all books).
 * Invalidates cache and fetches fresh count from database.
 * @param selectedTag - Optional tag to filter by, or undefined for all books.
 * @returns The fresh count.
 */
export async function refreshBookCount(
  selectedTag?: string
): Promise<{ count: number; error: string | null }> {
  try {
    const cacheKey = selectedTag || "all";
    invalidateCount(cacheKey);

    const freshCount = await getBookCount(selectedTag);
    setCount(cacheKey, freshCount);

    return { count: freshCount, error: null };
  } catch {
    return {
      count: 0,
      error: "Failed to refresh book count.",
    };
  }
}
