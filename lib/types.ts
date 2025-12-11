export interface Tag {
  icon?: string;
  id: string;
  value: string;
}
export type Book = {
  id: string;
  title: string;
  src?: string;
  price?: string;
  rating?: number;
  description?: string;
  longDescription?: string;
  tags?: Tag[];
  // optional extended metadata
  authors?: { name: string }[];
  published?: string;
  pages?: number;
  publisher?: string;
};

export interface Group {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  membersCount: number;
  lastActiveAt: string;
  url: string;
}

export interface GroupTag {
  name: string;
  url: string;
}

export interface GroupDetail extends Group {
  fullDescription?: string;
  rules?: string[];
  moderators?: string[];
  topics?: {
    id: string;
    title: string;
    author: string;
    lastPostAt: string;
    postsCount: number;
  }[];
  relatedBooks?: Book[];
}

// User-related types
export interface User {
  id: string;
  clerkId: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReadingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  bookIds: Array<{ bookId: string; bookAddedOnListOnDate: Date }>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ReadingStatus =
  | "want-to-read"
  | "currently-reading"
  | "read"
  | "did-not-finish";

export interface UserSavedBook {
  id: string;
  userId: string;
  bookId: string;
  status: ReadingStatus;
  progress?: number; // percentage 0-100
  startedAt?: Date;
  finishedAt?: Date;
  savedAt: Date;
  updatedAt: Date;
}

export type ClubRole = "owner" | "moderator" | "member";

export interface UserClubMembership {
  id: string;
  userId: string;
  clubId: string;
  role: ClubRole;
  joinedAt: Date;
  lastActiveAt: Date;
}

export type CommentTargetType = "book" | "club" | "post" | "review";

export interface UserComment {
  id: string;
  userId: string;
  targetType: CommentTargetType;
  targetId: string;
  content: string;
  parentCommentId?: string; // for nested comments
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReview {
  id: string;
  userId: string;
  bookId: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  isPublic: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}
