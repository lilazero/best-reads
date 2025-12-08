import type { User } from "@/lib/types";
import { ObjectId } from "mongodb";
import { getDb } from "./client";
import { normalizeDocument } from "./normalize";

/**
 * Create a new user in the database from Clerk webhook data.
 * @param userData - User data from Clerk
 * @returns The created User object
 */
export const createUser = async (userData: {
  clerkId: string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}): Promise<User> => {
  const db = await getDb();
  const now = new Date();

  const userDoc = {
    clerkId: userData.clerkId,
    email: userData.email,
    username: userData.username || null,
    firstName: userData.firstName || null,
    lastName: userData.lastName || null,
    imageUrl: userData.imageUrl || null,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("users").insertOne(userDoc);

  return normalizeDocument<User>({
    ...userDoc,
    _id: result.insertedId,
  } as Record<string, unknown>);
};

/**
 * Get a user by their Clerk ID.
 * @param clerkId - The Clerk user ID
 * @returns The User object or null if not found
 */
export const getUserByClerkId = async (
  clerkId: string
): Promise<User | null> => {
  const db = await getDb();
  const doc = await db.collection("users").findOne({ clerkId });

  if (!doc) return null;
  return normalizeDocument<User>(doc as Record<string, unknown>);
};

/**
 * Get a user by their database ID.
 * @param id - The user's database ID
 * @returns The User object or null if not found
 */
export const getUserById = async (id: string): Promise<User | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(id)) {
    return null;
  }

  const doc = await db.collection("users").findOne({ _id: new ObjectId(id) });

  if (!doc) return null;
  return normalizeDocument<User>(doc as Record<string, unknown>);
};

/**
 * Get a user by their email address.
 * @param email - The user's email
 * @returns The User object or null if not found
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const db = await getDb();
  const doc = await db.collection("users").findOne({ email });

  if (!doc) return null;
  return normalizeDocument<User>(doc as Record<string, unknown>);
};

/**
 * Update a user's information from Clerk webhook data.
 * @param clerkId - The Clerk user ID
 * @param updates - Fields to update
 * @returns The updated User object or null if user not found
 */
export const updateUser = async (
  clerkId: string,
  updates: {
    email?: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
  }
): Promise<User | null> => {
  const db = await getDb();

  const result = await db.collection("users").findOneAndUpdate(
    { clerkId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return normalizeDocument<User>(result as Record<string, unknown>);
};

/**
 * Delete a user from the database.
 * @param clerkId - The Clerk user ID
 * @returns True if deleted, false if user not found
 */
export const deleteUser = async (clerkId: string): Promise<boolean> => {
  const db = await getDb();
  const result = await db.collection("users").deleteOne({ clerkId });
  return result.deletedCount > 0;
};

/**
 * Get all users (for admin purposes, use with caution).
 * @param limit - Maximum number of users to return
 * @param skip - Number of users to skip for pagination
 * @returns Array of User objects
 */
export const getAllUsers = async (
  limit: number = 50,
  skip: number = 0
): Promise<User[]> => {
  const db = await getDb();

  const docs = await db
    .collection("users")
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<User>(doc as Record<string, unknown>)
  );
};

/**
 * Search users by username.
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Array of User objects
 */
export const searchUsersByUsername = async (
  query: string,
  limit: number = 20
): Promise<User[]> => {
  const db = await getDb();

  const docs = await db
    .collection("users")
    .find({
      username: { $regex: query, $options: "i" },
    })
    .limit(limit)
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<User>(doc as Record<string, unknown>)
  );
};
