import { getCurrentDbUser } from "@/lib/auth/getCurrentUser";
import { updateUser } from "@/lib/db/users";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, username } = body;

    // Update in our database
    const updatedUser = await updateUser(user.clerkId, {
      firstName: firstName || null,
      lastName: lastName || null,
      username: username || null,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Also update Clerk user
    const clerkUser = await currentUser();
    if (clerkUser) {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      await client.users.updateUser(clerkUser.id, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
      });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
