import type { Book } from "@/lib/types";
import { ObjectId } from "mongodb";
import { getDb } from "./client";
import { normalizeDocument } from "./normalize";

/**
 * Get books with optional tag filter and pagination.
 * @param tag - Optional tag value to filter by
 * @param page - Page number (1-indexed), defaults to 1
 * @param limit - Number of books per page, defaults to 30
 * @returns Array of normalized Book objects
 */
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getBooks = async (
  tag?: string,
  page: number = 1,
  limit: number = 30,
  q?: string
): Promise<Book[]> => {
  const db = await getDb();

  const filters: Record<string, unknown>[] = [];
  if (tag) filters.push({ "tags.value": tag });

  if (q && q.trim()) {
    const regex = new RegExp(escapeRegex(q.trim()), "i");
    filters.push({
      $or: [
        { title: regex },
        { description: regex },
        { longDescription: regex },
        { "authors.name": regex },
        { "tags.value": regex },
      ],
    });
  }

  const filter = filters.length > 0 ? { $and: filters } : {};
  const skip = (page - 1) * limit;

  const docs = await db
    .collection("books")
    .find(filter)
    .skip(skip)
    .limit(limit)
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<Book>(doc as Record<string, unknown>)
  );
};

/**
 * Get a single book by ID.
 * @param id - The book ID (string or ObjectId hex string)
 * @returns The normalized Book object or null
 */
export const getBookById = async (id: string): Promise<Book | null> => {
  const db = await getDb();
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const doc = await db.collection("books").findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return normalizeDocument<Book>(doc as Record<string, unknown>);
};

/**
 * Get book count with optional tag filter.
 * @param tag - Optional tag value to filter by
 * @returns Total count of matching books
 */
export const getBookCount = async (
  tag?: string,
  q?: string
): Promise<number> => {
  const db = await getDb();

  const filters: Record<string, unknown>[] = [];
  if (tag) filters.push({ "tags.value": tag });

  if (q && q.trim()) {
    const regex = new RegExp(escapeRegex(q.trim()), "i");
    filters.push({
      $or: [
        { title: regex },
        { description: regex },
        { longDescription: regex },
        { "authors.name": regex },
        { "tags.value": regex },
      ],
    });
  }

  const filter = filters.length > 0 ? { $and: filters } : {};
  return db.collection("books").countDocuments(filter);
};

/**
 * Get tags aggregated from books collection.
 * Only returns tags that have at least one matching book.
 * Sorted alphabetically by tag value.
 * @returns Array of tags with id, value, icon, and count
 */
export const getTags = async (): Promise<
  { id: string; value: string; icon?: string; count: number }[]
> => {
  const db = await getDb();

  const pipeline = [
    // Unwind the tags array so each tag becomes a separate document
    { $unwind: "$tags" },
    // Group by tag value to get unique tags with count
    {
      $group: {
        _id: "$tags.value",
        value: { $first: "$tags.value" },
        icon: { $first: "$tags.icon" },
        count: { $sum: 1 },
      },
    },
    // Sort alphabetically by tag value
    { $sort: { value: 1 } },
    // Project to final shape
    {
      $project: {
        _id: 0,
        id: "$_id",
        value: 1,
        icon: 1,
        count: 1,
      },
    },
  ];

  const result = await db.collection("books").aggregate(pipeline).toArray();
  return result as {
    id: string;
    value: string;
    icon?: string;
    count: number;
  }[];
};

/**
 * Get multiple books by their IDs in a single query.
 * @param ids - Array of book ID strings
 * @returns Array of normalized Book objects in the same order as input IDs
 */
export const getBooksByIds = async (ids: string[]): Promise<Book[]> => {
  const db = await getDb();

  // Filter valid IDs
  const validIds = ids.filter((id) => ObjectId.isValid(id));
  if (validIds.length === 0) return [];

  // Convert to ObjectIds
  const objectIds = validIds.map((id) => new ObjectId(id));

  // Batch fetch
  const docs = await db
    .collection("books")
    .find({ _id: { $in: objectIds } })
    .toArray();

  // Create a map for O(1) lookup
  const bookMap = new Map(
    docs.map((doc) => [
      doc._id.toString(),
      normalizeDocument<Book>(doc as Record<string, unknown>),
    ])
  );

  // Return in original order, filtering out not-found books
  return validIds
    .map((id) => bookMap.get(id))
    .filter((book): book is Book => book !== undefined);
};
