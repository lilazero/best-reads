import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";

export async function GET() {
  try {
    const db = await getDb();
    const users = await db.collection("users").find({}).limit(100).toArray();
    const safe = users.map((u: Record<string, unknown>) => ({
      id:
        u._id &&
        typeof u._id === "object" &&
        typeof (u._id as { toString?: unknown }).toString === "function"
          ? (u._id as { toString: () => string }).toString()
          : null,
      clerkId: u.clerkId,
      email: u.email,
      username: u.username,
      createdAt: u.createdAt,
    }));
    return NextResponse.json({ count: safe.length, users: safe });
  } catch (err) {
    console.error("debug/users error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
