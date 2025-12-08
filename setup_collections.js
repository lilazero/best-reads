// MongoDB Collections Setup for User Features
// Run this file with: mongosh < setup_collections.js

// 1. Users Collection - stores synced Clerk user data
db.createCollection("users");
db.users.createIndex({ clerkId: 1 }, { unique: true });
db.users.createIndex({ email: 1 });
db.users.createIndex({ username: 1 });
db.users.createIndex({ createdAt: -1 });

print(
  " Users collection created with indexes on clerkId, email, username, createdAt"
);

// 2. User Reading Lists Collection - custom book lists per user
db.createCollection("user_reading_lists");
db.user_reading_lists.createIndex({ userId: 1 });
db.user_reading_lists.createIndex({ userId: 1, name: 1 }, { unique: true });
db.user_reading_lists.createIndex({ createdAt: -1 });

print(
  " User reading lists collection created with indexes on userId, userId+name, createdAt"
);

// 3. User Saved Books Collection - books saved/favorited by users
db.createCollection("user_saved_books");
db.user_saved_books.createIndex({ userId: 1 });
db.user_saved_books.createIndex({ bookId: 1 });
db.user_saved_books.createIndex({ userId: 1, bookId: 1 }, { unique: true });
db.user_saved_books.createIndex({ savedAt: -1 });
db.user_saved_books.createIndex({ status: 1 });

print(
  " User saved books collection created with indexes on userId, bookId, userId+bookId, savedAt, status"
);

// 4. User Club Memberships Collection - tracks which users belong to which clubs
db.createCollection("user_club_memberships");
db.user_club_memberships.createIndex({ userId: 1 });
db.user_club_memberships.createIndex({ clubId: 1 });
db.user_club_memberships.createIndex(
  { userId: 1, clubId: 1 },
  { unique: true }
);
db.user_club_memberships.createIndex({ joinedAt: -1 });
db.user_club_memberships.createIndex({ role: 1 });

print(
  " User club memberships collection created with indexes on userId, clubId, userId+clubId, joinedAt, role"
);

// 5. User Comments Collection - comments on books, clubs, etc.
db.createCollection("user_comments");
db.user_comments.createIndex({ userId: 1 });
db.user_comments.createIndex({ targetType: 1, targetId: 1 });
db.user_comments.createIndex({ userId: 1, targetType: 1 });
db.user_comments.createIndex({ createdAt: -1 });

print(
  " User comments collection created with indexes on userId, targetType+targetId, userId+targetType, createdAt"
);

// 6. User Reviews Collection - book reviews with ratings
db.createCollection("user_reviews");
db.user_reviews.createIndex({ userId: 1 });
db.user_reviews.createIndex({ bookId: 1 });
db.user_reviews.createIndex({ userId: 1, bookId: 1 }, { unique: true });
db.user_reviews.createIndex({ rating: 1 });
db.user_reviews.createIndex({ createdAt: -1 });

print(
  " User reviews collection created with indexes on userId, bookId, userId+bookId, rating, createdAt"
);

print("\n All collections and indexes created successfully!");
print("\nCollection Summary:");
print("- users: User profiles synced from Clerk");
print(
  "- user_reading_lists: Custom book lists (Want to Read, Currently Reading, etc.)"
);
print("- user_saved_books: Books saved/favorited with reading status");
print("- user_club_memberships: User-club relationships with roles");
print("- user_comments: User comments on books/clubs/posts");
print("- user_reviews: Book reviews with ratings");
