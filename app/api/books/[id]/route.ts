import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";
import { normalizeDocument } from "@/lib/db/normalize";

const ADMIN_EMAIL = "andililajal@gmail.com";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (email !== ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  const body = await req.json().catch(() => ({}));
  const { title, description, longDescription, src } = body;

  const update: Record<string, unknown> = {};
  if (typeof title === "string") update.title = title;
  if (typeof description === "string") update.description = description;
  if (typeof longDescription === "string")
    update.longDescription = longDescription;
  if (typeof src === "string") update.src = src;

  if (Object.keys(update).length === 0) {
    return new Response(JSON.stringify({ error: "No fields to update" }), {
      status: 400,
    });
  }

  const db = await getDb();
  const result = await db
    .collection("books")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

  if (!result || !result.value) {
    return new Response(JSON.stringify({ error: "Book not found" }), {
      status: 404,
    });
  }

  const book = normalizeDocument(result.value as Record<string, unknown>);
  return new Response(JSON.stringify({ book }), { status: 200 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (email !== ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  const db = await getDb();
  const result = await db
    .collection("books")
    .deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "Book not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ deleted: true }), { status: 200 });
}
