import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId, createUser } from "@/lib/db/users";
import type { User } from "@/lib/types";

/**
 * Get or create a user in the database based on the current Clerk session.
 * Use this in Server Components or Server Actions to ensure the user exists in your DB.
 *
 * @returns The user from the database, or null if not authenticated
 *
 * @example
 * ```typescript
 * // In a Server Component
 * export default async function MyBooksPage() {
 *   const user = await getCurrentDbUser();
 *   if (!user) {
 *     redirect('/sign-in');
 *   }
 *   // Use user.id for database queries
 * }
 * ```
 */
export async function getCurrentDbUser(): Promise<User | null> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  // Try to get user from database
  let dbUser = await getUserByClerkId(clerkUser.id);

  // If user doesn't exist, create them (webhook alternative for localhost)
  if (!dbUser) {
    console.log("Creating new user in database:", clerkUser.id);

    dbUser = await createUser({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      username: clerkUser.username || null,
      firstName: clerkUser.firstName || null,
      lastName: clerkUser.lastName || null,
      imageUrl: clerkUser.imageUrl || null,
    });
  }

  return dbUser;
}

/**
 * Get the current user's database ID or redirect to sign-in.
 * Shorthand for getting just the ID when you need it for queries.
 *
 * @returns The user's database ID
 * @throws Redirects to /sign-in if not authenticated
 *
 * @example
 * ```typescript
 * const userId = await requireUserId();
 * const savedBooks = await getUserSavedBooks(userId);
 * ```
 */
export async function requireUserId(): Promise<string> {
  const user = await getCurrentDbUser();

  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/sign-in");
    // This line is unreachable but helps TypeScript understand user is not null below
    return null as never;
  }

  return user.id;
}

/**
 * Check if the current user exists in Clerk (for client-side checks).
 * Use this in Server Actions or API routes.
 */
export async function isAuthenticated(): Promise<boolean> {
  const clerkUser = await currentUser();
  return clerkUser !== null;
}
