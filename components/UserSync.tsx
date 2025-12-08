import { getCurrentDbUser } from "@/lib/auth/getCurrentUser";

/**
 * Server component that syncs authenticated users to the database.
 * This ensures users created via OAuth (Google, etc.) are added to MongoDB
 * even when webhooks aren't available (e.g., localhost development).
 */
export default async function UserSync() {
  // This will create the user in DB if they don't exist
  await getCurrentDbUser();
  return null;
}
