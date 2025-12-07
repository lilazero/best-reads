import { getCurrentDbUser } from "@/lib/auth/getCurrentUser";
import { redirect } from "next/navigation";

export default async function MyBooksPage() {
  // This will automatically create the user in MongoDB on first visit
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Books</h1>

      {/* User info - to verify it worked */}
      <div className="mb-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Logged in as: {user.firstName} {user.lastName} ({user.email})
        </p>
        <p className="text-xs text-muted-foreground mt-1">User ID: {user.id}</p>
      </div>

      {/* TODO: Display user's saved books */}
      <p className="text-muted-foreground">
        Your saved books will appear here...
      </p>
    </div>
  );
}
