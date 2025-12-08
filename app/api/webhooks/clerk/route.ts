import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser, deleteUser } from "@/lib/db/users";
import { NextResponse } from "next/server";

// This whole class is not needed cuz it's all localhost but if we do the vercel deploy later we can use it

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    try {
      // Create user in our database
      const user = await createUser({
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        username: username || null,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
      });

      console.log("User created in database:", user);

      return NextResponse.json(
        { message: "User created successfully", userId: user.id },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    try {
      // Update user in our database
      const user = await updateUser(id, {
        email: email_addresses[0]?.email_address || "",
        username: username || null,
        firstName: first_name || null,
        lastName: last_name || null,
        imageUrl: image_url || null,
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log("User updated in database:", user);

      return NextResponse.json(
        { message: "User updated successfully", userId: user.id },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 }
      );
    }

    try {
      // Delete user from our database
      const deleted = await deleteUser(id);

      if (!deleted) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log("User deleted from database:", id);

      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }
  }

  // For other event types, return success
  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
