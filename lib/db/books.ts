import type { Book } from "@/lib/types";
import { getDb } from "./client";
import { normalizeValue } from "./normalize";

// Fetch all books and normalize ObjectIds to strings
export const getBooks = async (): Promise<Book[]> => {
  const db = await getDb();
  const docs = await db.collection("books").find({}).toArray();

  return docs.map((doc) => {
    const { _id, ...rest } = doc as Record<string, unknown> & { _id?: unknown };
    const id =
      _id &&
      typeof (doc as { _id: { toString: () => string } })._id.toString ===
        "function"
        ? (doc as { _id: { toString: () => string } })._id.toString()
        : (doc as { id?: string }).id ?? "";

    const normalized = normalizeValue(rest) as Record<string, unknown>;
    return { ...normalized, id } as Book;
  });
};
