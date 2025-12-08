import type { UserClubMembership, ClubRole } from "@/lib/types";
import { ObjectId } from "mongodb";
import { getDb } from "./client";
import { normalizeDocument } from "./normalize";

/**
 * Add a user to a club with a specific role.
 * @param userId - The user's database ID
 * @param clubId - The club's database ID
 * @param role - The user's role in the club (owner, moderator, member)
 * @returns The created UserClubMembership object
 */
export const addUserToClub = async (
  userId: string,
  clubId: string,
  role: ClubRole = "member"
): Promise<UserClubMembership> => {
  const db = await getDb();
  const now = new Date();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(clubId)) {
    throw new Error("Invalid user ID or club ID");
  }

  const membershipDoc = {
    userId,
    clubId,
    role,
    joinedAt: now,
    lastActiveAt: now,
  };

  const result = await db
    .collection("user_club_memberships")
    .insertOne(membershipDoc);

  return normalizeDocument<UserClubMembership>({
    ...membershipDoc,
    _id: result.insertedId,
  } as Record<string, unknown>);
};

/**
 * Get all clubs a user is a member of.
 * @param userId - The user's database ID
 * @param role - Optional role filter
 * @returns Array of UserClubMembership objects
 */
export const getUserClubs = async (
  userId: string,
  role?: ClubRole
): Promise<UserClubMembership[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const filter: Record<string, unknown> = { userId };
  if (role) {
    filter.role = role;
  }

  const docs = await db
    .collection("user_club_memberships")
    .find(filter)
    .sort({ joinedAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserClubMembership>(doc as Record<string, unknown>)
  );
};

/**
 * Get all members of a club.
 * @param clubId - The club's database ID
 * @param role - Optional role filter
 * @returns Array of UserClubMembership objects
 */
export const getClubMembers = async (
  clubId: string,
  role?: ClubRole
): Promise<UserClubMembership[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(clubId)) {
    throw new Error("Invalid club ID");
  }

  const filter: Record<string, unknown> = { clubId };
  if (role) {
    filter.role = role;
  }

  const docs = await db
    .collection("user_club_memberships")
    .find(filter)
    .sort({ joinedAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserClubMembership>(doc as Record<string, unknown>)
  );
};

/**
 * Get a specific user's membership in a club.
 * @param userId - The user's database ID
 * @param clubId - The club's database ID
 * @returns UserClubMembership object or null
 */
export const getUserClubMembership = async (
  userId: string,
  clubId: string
): Promise<UserClubMembership | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(clubId)) {
    return null;
  }

  const doc = await db
    .collection("user_club_memberships")
    .findOne({ userId, clubId });

  if (!doc) return null;
  return normalizeDocument<UserClubMembership>(doc as Record<string, unknown>);
};

/**
 * Check if a user is a member of a club.
 * @param userId - The user's database ID
 * @param clubId - The club's database ID
 * @returns True if user is a member
 */
export const isUserClubMember = async (
  userId: string,
  clubId: string
): Promise<boolean> => {
  const membership = await getUserClubMembership(userId, clubId);
  return membership !== null;
};

/**
 * Update a user's role in a club.
 * @param userId - The user's database ID
 * @param clubId - The club's database ID
 * @param role - The new role
 * @returns Updated UserClubMembership object or null
 */
export const updateUserClubRole = async (
  userId: string,
  clubId: string,
  role: ClubRole
): Promise<UserClubMembership | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(clubId)) {
    return null;
  }

  const result = await db
    .collection("user_club_memberships")
    .findOneAndUpdate(
      { userId, clubId },
      { $set: { role } },
      { returnDocument: "after" }
    );

  if (!result) return null;
  return normalizeDocument<UserClubMembership>(
    result as Record<string, unknown>
  );
};

/**
 * Update a user's last active time in a club.
 * @param userId - The user's database ID
 * @param clubId - The club's database ID
 * @returns Updated UserClubMembership object or null
 */
export const updateUserClubActivity = async (
  userId: string,
  clubId: string
): Promise<UserClubMembership | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(clubId)) {
    return null;
  }

  const result = await db
    .collection("user_club_memberships")
    .findOneAndUpdate(
      { userId, clubId },
      { $set: { lastActiveAt: new Date() } },
      { returnDocument: "after" }
    );

  if (!result) return null;
  return normalizeDocument<UserClubMembership>(
    result as Record<string, unknown>
  );
};

/**
 * Remove a user from a club.
 * @param userId - The user's database ID
 * @param clubId - The club's database ID
 * @returns True if removed, false if not found
 */
export const removeUserFromClub = async (
  userId: string,
  clubId: string
): Promise<boolean> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(clubId)) {
    return false;
  }

  const result = await db
    .collection("user_club_memberships")
    .deleteOne({ userId, clubId });

  return result.deletedCount > 0;
};

/**
 * Get the count of members in a club.
 * @param clubId - The club's database ID
 * @returns Number of members
 */
export const getClubMemberCount = async (clubId: string): Promise<number> => {
  const db = await getDb();

  if (!ObjectId.isValid(clubId)) {
    return 0;
  }

  return await db
    .collection("user_club_memberships")
    .countDocuments({ clubId });
};

/**
 * Get clubs owned by a user.
 * @param userId - The user's database ID
 * @returns Array of UserClubMembership objects where user is owner
 */
export const getUserOwnedClubs = async (
  userId: string
): Promise<UserClubMembership[]> => {
  return getUserClubs(userId, "owner");
};

/**
 * Get clubs where user is a moderator.
 * @param userId - The user's database ID
 * @returns Array of UserClubMembership objects where user is moderator
 */
export const getUserModeratedClubs = async (
  userId: string
): Promise<UserClubMembership[]> => {
  return getUserClubs(userId, "moderator");
};

/**
 * Check if a user has a specific role or higher in a club.
 * @param userId - The user's database ID
 * @param clubId - The club's database ID
 * @param requiredRole - The minimum required role
 * @returns True if user has the role or higher
 */
export const userHasClubRole = async (
  userId: string,
  clubId: string,
  requiredRole: ClubRole
): Promise<boolean> => {
  const membership = await getUserClubMembership(userId, clubId);
  if (!membership) return false;

  const roleHierarchy: Record<ClubRole, number> = {
    member: 1,
    moderator: 2,
    owner: 3,
  };

  return roleHierarchy[membership.role] >= roleHierarchy[requiredRole];
};
