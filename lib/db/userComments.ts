import type { UserComment, UserReview, CommentTargetType } from "@/lib/types";
import { ObjectId } from "mongodb";
import { getDb } from "./client";
import { normalizeDocument } from "./normalize";

// ==================== User Comments ====================

/**
 * Create a new comment.
 * @param userId - The user's database ID
 * @param targetType - Type of target (book, club, post, review)
 * @param targetId - The target's database ID
 * @param content - Comment content
 * @param parentCommentId - Optional parent comment ID for nested comments
 * @returns The created UserComment object
 */
export const createComment = async (
  userId: string,
  targetType: CommentTargetType,
  targetId: string,
  content: string,
  parentCommentId?: string
): Promise<UserComment> => {
  const db = await getDb();
  const now = new Date();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(targetId)) {
    throw new Error("Invalid user ID or target ID");
  }

  if (parentCommentId && !ObjectId.isValid(parentCommentId)) {
    throw new Error("Invalid parent comment ID");
  }

  const commentDoc = {
    userId,
    targetType,
    targetId,
    content,
    parentCommentId: parentCommentId || null,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("user_comments").insertOne(commentDoc);

  return normalizeDocument<UserComment>({
    ...commentDoc,
    _id: result.insertedId,
  } as Record<string, unknown>);
};

/**
 * Get comments for a specific target.
 * @param targetType - Type of target
 * @param targetId - The target's database ID
 * @param parentCommentId - Optional filter for replies to a specific comment
 * @returns Array of UserComment objects
 */
export const getComments = async (
  targetType: CommentTargetType,
  targetId: string,
  parentCommentId?: string | null
): Promise<UserComment[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(targetId)) {
    throw new Error("Invalid target ID");
  }

  const filter: Record<string, unknown> = {
    targetType,
    targetId,
  };

  // Filter by parent: null for top-level, specific ID for replies
  if (parentCommentId === null) {
    filter.parentCommentId = null;
  } else if (parentCommentId) {
    if (!ObjectId.isValid(parentCommentId)) {
      throw new Error("Invalid parent comment ID");
    }
    filter.parentCommentId = parentCommentId;
  }

  const docs = await db
    .collection("user_comments")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserComment>(doc as Record<string, unknown>)
  );
};

/**
 * Get a comment by ID.
 * @param commentId - The comment's database ID
 * @returns UserComment object or null
 */
export const getCommentById = async (
  commentId: string
): Promise<UserComment | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(commentId)) {
    return null;
  }

  const doc = await db
    .collection("user_comments")
    .findOne({ _id: new ObjectId(commentId) });

  if (!doc) return null;
  return normalizeDocument<UserComment>(doc as Record<string, unknown>);
};

/**
 * Get all comments by a user.
 * @param userId - The user's database ID
 * @param targetType - Optional filter by target type
 * @returns Array of UserComment objects
 */
export const getUserComments = async (
  userId: string,
  targetType?: CommentTargetType
): Promise<UserComment[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const filter: Record<string, unknown> = { userId };
  if (targetType) {
    filter.targetType = targetType;
  }

  const docs = await db
    .collection("user_comments")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserComment>(doc as Record<string, unknown>)
  );
};

/**
 * Update a comment's content.
 * @param commentId - The comment's database ID
 * @param content - New content
 * @returns Updated UserComment object or null
 */
export const updateComment = async (
  commentId: string,
  content: string
): Promise<UserComment | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(commentId)) {
    return null;
  }

  const result = await db.collection("user_comments").findOneAndUpdate(
    { _id: new ObjectId(commentId) },
    {
      $set: {
        content,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return normalizeDocument<UserComment>(result as Record<string, unknown>);
};

/**
 * Delete a comment.
 * @param commentId - The comment's database ID
 * @returns True if deleted, false if not found
 */
export const deleteComment = async (commentId: string): Promise<boolean> => {
  const db = await getDb();

  if (!ObjectId.isValid(commentId)) {
    return false;
  }

  const result = await db
    .collection("user_comments")
    .deleteOne({ _id: new ObjectId(commentId) });

  return result.deletedCount > 0;
};

/**
 * Get the count of comments for a target.
 * @param targetType - Type of target
 * @param targetId - The target's database ID
 * @returns Number of comments
 */
export const getCommentCount = async (
  targetType: CommentTargetType,
  targetId: string
): Promise<number> => {
  const db = await getDb();

  if (!ObjectId.isValid(targetId)) {
    return 0;
  }

  return await db
    .collection("user_comments")
    .countDocuments({ targetType, targetId });
};

// ==================== User Reviews ====================

/**
 * Create a new book review.
 * @param userId - The user's database ID
 * @param bookId - The book's database ID
 * @param rating - Rating (1-5)
 * @param content - Review content
 * @param title - Optional review title
 * @param isPublic - Whether the review is public
 * @returns The created UserReview object
 */
export const createReview = async (
  userId: string,
  bookId: string,
  rating: number,
  content: string,
  title?: string,
  isPublic: boolean = true
): Promise<UserReview> => {
  const db = await getDb();
  const now = new Date();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    throw new Error("Invalid user ID or book ID");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const reviewDoc = {
    userId,
    bookId,
    rating,
    title: title || null,
    content,
    isPublic,
    helpfulCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("user_reviews").insertOne(reviewDoc);

  return normalizeDocument<UserReview>({
    ...reviewDoc,
    _id: result.insertedId,
  } as Record<string, unknown>);
};

/**
 * Get reviews for a specific book.
 * @param bookId - The book's database ID
 * @param onlyPublic - Only return public reviews
 * @returns Array of UserReview objects
 */
export const getBookReviews = async (
  bookId: string,
  onlyPublic: boolean = true
): Promise<UserReview[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(bookId)) {
    throw new Error("Invalid book ID");
  }

  const filter: Record<string, unknown> = { bookId };
  if (onlyPublic) {
    filter.isPublic = true;
  }

  const docs = await db
    .collection("user_reviews")
    .find(filter)
    .sort({ helpfulCount: -1, createdAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserReview>(doc as Record<string, unknown>)
  );
};

/**
 * Get a user's review for a specific book.
 * @param userId - The user's database ID
 * @param bookId - The book's database ID
 * @returns UserReview object or null
 */
export const getUserBookReview = async (
  userId: string,
  bookId: string
): Promise<UserReview | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(bookId)) {
    return null;
  }

  const doc = await db.collection("user_reviews").findOne({ userId, bookId });

  if (!doc) return null;
  return normalizeDocument<UserReview>(doc as Record<string, unknown>);
};

/**
 * Get all reviews by a user.
 * @param userId - The user's database ID
 * @returns Array of UserReview objects
 */
export const getUserReviews = async (userId: string): Promise<UserReview[]> => {
  const db = await getDb();

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const docs = await db
    .collection("user_reviews")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) =>
    normalizeDocument<UserReview>(doc as Record<string, unknown>)
  );
};

/**
 * Update a review.
 * @param reviewId - The review's database ID
 * @param updates - Fields to update
 * @returns Updated UserReview object or null
 */
export const updateReview = async (
  reviewId: string,
  updates: {
    rating?: number;
    title?: string;
    content?: string;
    isPublic?: boolean;
  }
): Promise<UserReview | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(reviewId)) {
    return null;
  }

  if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  const result = await db.collection("user_reviews").findOneAndUpdate(
    { _id: new ObjectId(reviewId) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return normalizeDocument<UserReview>(result as Record<string, unknown>);
};

/**
 * Delete a review.
 * @param reviewId - The review's database ID
 * @returns True if deleted, false if not found
 */
export const deleteReview = async (reviewId: string): Promise<boolean> => {
  const db = await getDb();

  if (!ObjectId.isValid(reviewId)) {
    return false;
  }

  const result = await db
    .collection("user_reviews")
    .deleteOne({ _id: new ObjectId(reviewId) });

  return result.deletedCount > 0;
};

/**
 * Increment the helpful count for a review.
 * @param reviewId - The review's database ID
 * @returns Updated UserReview object or null
 */
export const incrementReviewHelpfulCount = async (
  reviewId: string
): Promise<UserReview | null> => {
  const db = await getDb();

  if (!ObjectId.isValid(reviewId)) {
    return null;
  }

  const result = await db
    .collection("user_reviews")
    .findOneAndUpdate(
      { _id: new ObjectId(reviewId) },
      { $inc: { helpfulCount: 1 } },
      { returnDocument: "after" }
    );

  if (!result) return null;
  return normalizeDocument<UserReview>(result as Record<string, unknown>);
};

/**
 * Get the average rating for a book.
 * @param bookId - The book's database ID
 * @returns Average rating or 0 if no reviews
 */
export const getBookAverageRating = async (bookId: string): Promise<number> => {
  const db = await getDb();

  if (!ObjectId.isValid(bookId)) {
    return 0;
  }

  const result = await db
    .collection("user_reviews")
    .aggregate([
      { $match: { bookId, isPublic: true } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ])
    .toArray();

  return result[0]?.avgRating || 0;
};

/**
 * Get the count of reviews for a book.
 * @param bookId - The book's database ID
 * @returns Number of reviews
 */
export const getBookReviewCount = async (bookId: string): Promise<number> => {
  const db = await getDb();

  if (!ObjectId.isValid(bookId)) {
    return 0;
  }

  return await db
    .collection("user_reviews")
    .countDocuments({ bookId, isPublic: true });
};
