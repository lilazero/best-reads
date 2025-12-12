import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db/client";
import { normalizeDocument } from "@/lib/db/normalize";

const ADMIN_EMAIL = "andililajal@gmail.com";

export async function POST(req: Request) {
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

  const body = await req.json().catch(() => ({}));
  const {
    title,
    description,
    longDescription,
    src,
    publicationYear,
    rating,
    tags,
  } = body;

  if (!title || typeof title !== "string") {
    return new Response(JSON.stringify({ error: "Title is required" }), {
      status: 400,
    });
  }

  const doc: Record<string, unknown> = {
    title,
    description: typeof description === "string" ? description : "",
    longDescription: typeof longDescription === "string" ? longDescription : "",
    src: typeof src === "string" ? src : "",
  };

  if (publicationYear) doc.publicationYear = Number(publicationYear);
  if (rating) doc.rating = Number(rating);
  if (Array.isArray(tags)) doc.tags = tags;

  const db = await getDb();
  const result = await db.collection("books").insertOne(doc);
  const inserted = await db
    .collection("books")
    .findOne({ _id: result.insertedId });
  if (!inserted) {
    return new Response(JSON.stringify({ error: "Failed to create book" }), {
      status: 500,
    });
  }

  const book = normalizeDocument(inserted as Record<string, unknown>);
  return new Response(JSON.stringify({ book }), { status: 201 });
}
