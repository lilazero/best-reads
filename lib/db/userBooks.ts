import type {
  UserSavedBook,
  UserReadingList,
  ReadingStatus,
} from "@/lib/types";
import { ObjectId } from "mongodb";
import { getDb } from "./client";
import { normalizeDocument } from "./normalize";

// ==================== User Saved Books ====================

/**
 * Save a book for a user with a reading status.
 * @param userId - The user's database ID
 * @param bookId - The book's database ID
 * @param status - Reading status (want-to-read, currently-reading, read, did-not-finish)
 * @returns The created UserSavedBook object
 */
export const saveBookForUser = async (
  userId: string,
  bookId: string,
  status: ReadingStatus = "want-to-read"
): Promise<UserSavedBook> => {
  const db = await getDb();
  const now = new Date();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    throw new Error("Invalid user ID or book ID");
  }

  const savedBookDoc = {
    userId,
    bookId,
    status,
    progress: 0,
    savedAt: now,
    updatedAt: now,
  };

  const result = await db
    .collection("user_saved_books")
    .insertOne(savedBookDoc);

  return normalizeDocument<UserSavedBook>({
    ...savedBookDoc,
    _id: result.insertedId,
  } as Record<string, unknown>);
};

/**
 * Get all saved books for a user, optionally filtered by status.
 * @param userId - The user's database ID
 * @param status - Optional reading status filter
 * @returns Array of UserSavedBook objects
 */
export const getUserSavedBooks = async (
  userId: string,
  status?: ReadingStatus
): Promise<UserSavedBook[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const filter: Record<string, unknown> = { userId };
  if (status) {
    filter.status = status;
  }

  const docs = await db
    .collection("user_saved_books")
    .find(filter)
    .sort({ savedAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserSavedBook>(doc as Record<string, unknown>)
  );
};

/**
 * Get a specific saved book for a user.
 * @param userId - The user's database ID
 * @param bookId - The book's database ID
 * @returns UserSavedBook object or null
 */
export const getUserSavedBook = async (
  userId: string,
  bookId: string
): Promise<UserSavedBook | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    return null;
  }

  const doc = await db
    .collection("user_saved_books")
    .findOne({ userId, bookId });

  if (!doc) return null;
  return normalizeDocument<UserSavedBook>(doc as Record<string, unknown>);
};

/**
 * Update a saved book's status or progress.
 * @param userId - The user's database ID
 * @param bookId - The book's database ID
 * @param updates - Fields to update
 * @returns Updated UserSavedBook object or null
 */
export const updateUserSavedBook = async (
  userId: string,
  bookId: string,
  updates: {
    status?: ReadingStatus;
    progress?: number;
    startedAt?: Date;
    finishedAt?: Date;
  }
): Promise<UserSavedBook | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    return null;
  }

  const result = await db.collection("user_saved_books").findOneAndUpdate(
    { userId, bookId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return normalizeDocument<UserSavedBook>(result as Record<string, unknown>);
};

/**
 * Remove a saved book from a user's collection.
 * @param userId - The user's database ID
 * @param bookId - The book's database ID
 * @returns True if deleted, false if not found
 */
export const removeUserSavedBook = async (
  userId: string,
  bookId: string
): Promise<boolean> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    return false;
  }

  const result = await db
    .collection("user_saved_books")
    .deleteOne({ userId, bookId });

  return result.deletedCount > 0;
};

/**
 * Check if a user has saved a specific book.
 * @param userId - The user's database ID
 * @param bookId - The book's database ID
 * @returns True if book is saved
 */
export const hasUserSavedBook = async (
  userId: string,
  bookId: string
): Promise<boolean> => {
  const savedBook = await getUserSavedBook(userId, bookId);
  return savedBook !== null;
};

// ==================== User Reading Lists ====================

/**
 * Create a new reading list for a user.
 * @param userId - The user's database ID
 * @param name - Name of the reading list
 * @param description - Optional description
 * @param isPublic - Whether the list is public
 * @returns The created UserReadingList object
 */
export const createReadingList = async (
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<UserReadingList> => {
  const db = await getDb();
  const now = new Date();

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const listDoc = {
    userId,
    name,
    description: description || null,
    bookIds: [],
    isPublic,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("user_reading_lists").insertOne(listDoc);

  return normalizeDocument<UserReadingList>({
    ...listDoc,
    _id: result.insertedId,
  } as Record<string, unknown>);
};

/**
 * Get all reading lists for a user.
 * @param userId - The user's database ID
 * @returns Array of UserReadingList objects
 */
export const getUserReadingLists = async (
  userId: string
): Promise<UserReadingList[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const docs = await db
    .collection("user_reading_lists")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserReadingList>(doc as Record<string, unknown>)
  );
};

/**
 * Get a specific reading list by ID.
 * @param listId - The reading list ID
 * @returns UserReadingList object or null
 */
export const getReadingListById = async (
  listId: string
): Promise<UserReadingList | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(listId)) {
    return null;
  }

  const doc = await db
    .collection("user_reading_lists")
    .findOne({ _id: new ObjectId(listId) });

  if (!doc) return null;
  return normalizeDocument<UserReadingList>(doc as Record<string, unknown>);
};

/**
 * Add a book to a reading list.
 * @param listId - The reading list ID
 * @param bookId - The book's database ID
 * @returns Updated UserReadingList object or null
 */
export const addBookToReadingList = async (
  listId: string,
  bookId: string
): Promise<UserReadingList | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(listId) || !ObjectId.isValid(bookId)) {
    return null;
  }

  const result = await db.collection("user_reading_lists").findOneAndUpdate(
    { _id: new ObjectId(listId) },
    {
      $addToSet: { bookIds: bookId },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return normalizeDocument<UserReadingList>(result as Record<string, unknown>);
};

/**
 * Remove a book from a reading list.
 * @param listId - The reading list ID
 * @param bookId - The book's database ID
 * @returns Updated UserReadingList object or null
 */
export const removeBookFromReadingList = async (
  listId: string,
  bookId: string
): Promise<UserReadingList | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(listId) || !ObjectId.isValid(bookId)) {
    return null;
  }

  const result = await db.collection("user_reading_lists").findOneAndUpdate(
    { _id: new ObjectId(listId) },
    {
      // @ts-expect-error - MongoDB $pull type is overly strict
      $pull: { bookIds: bookId },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return normalizeDocument<UserReadingList>(result as Record<string, unknown>);
};

/**
 * Update a reading list's details.
 * @param listId - The reading list ID
 * @param updates - Fields to update
 * @returns Updated UserReadingList object or null
 */
export const updateReadingList = async (
  listId: string,
  updates: {
    name?: string;
    description?: string;
    isPublic?: boolean;
  }
): Promise<UserReadingList | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(listId)) {
    return null;
  }

  const result = await db.collection("user_reading_lists").findOneAndUpdate(
    { _id: new ObjectId(listId) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return normalizeDocument<UserReadingList>(result as Record<string, unknown>);
};

/**
 * Delete a reading list.
 * @param listId - The reading list ID
 * @returns True if deleted, false if not found
 */
export const deleteReadingList = async (listId: string): Promise<boolean> => {
  const db = await getDb();

  if (!ObjectId.isValid(listId)) {
    return false;
  }

  const result = await db
    .collection("user_reading_lists")
    .deleteOne({ _id: new ObjectId(listId) });

  return result.deletedCount > 0;
};
