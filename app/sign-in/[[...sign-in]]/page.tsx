import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
  // Ensure the user is authenticated with Clerk before showing sign-in prompt.
  const clerkUser = await currentUser();
  if (clerkUser) {
    // If already signed in, redirect to home page.
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">You are already signed in</h1>
        </div>
      </div>
    );
  }
    return (
        <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <SignIn />
        </div>
      </div>
    );
}
