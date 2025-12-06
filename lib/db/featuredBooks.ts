import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";
import { normalizeDocument } from "@/lib/db/normalize";
import type { Book } from "@/lib/types";

// Fetch a featured list by name, resolve its book ObjectIds, and return normalized books in list order.
export async function getFeaturedBooks(
  listName: string = "Recommended_Books"
): Promise<Book[]> {
  const db = await getDb();

  // Grab the list document that holds the ordered array of book ids.
  const listDoc = await db.collection("featuredbookLists").findOne({
    listName,
  });

  // If the list is missing or malformed, short-circuit with an empty set.
  if (!listDoc || !Array.isArray((listDoc as { List?: unknown }).List)) {
    return [];
  }

  // Convert stored ids to ObjectId while skipping any invalid values.
  const ids = ((listDoc as { List?: unknown }).List as unknown[])
    .map((id) => {
      try {
        return new ObjectId(id as string);
      } catch {
        return null;
      }
    })
    .filter((id): id is ObjectId => id !== null);

  if (ids.length === 0) return [];

  // Fetch books by ids and preserve the original order using $indexOfArray.
  const books = await db
    .collection("books")
    .aggregate([
      { $match: { _id: { $in: ids } } },
      { $addFields: { order: { $indexOfArray: [ids, "$_id"] } } },
      { $sort: { order: 1 } },
      { $project: { order: 0 } },
    ])
    .toArray();

  // Normalize Mongo types (ObjectId, Date) to plain JSON friendly values.
  return books.map((doc) =>
    normalizeDocument<Book>(doc as Record<string, unknown>)
  );
}
