import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";

export async function GET() {
  try {
    const db = await getDb();
    const lists = await db
      .collection("user_reading_lists")
      .find({})
      .limit(100)
      .toArray();
    // Return raw docs (serializable)
    const safe = lists.map((d: Record<string, unknown>) => ({
      id:
        d._id &&
        typeof d._id === "object" &&
        typeof (d._id as { toString?: unknown }).toString === "function"
          ? (d._id as { toString: () => string }).toString()
          : null,
      userId: d.userId,
      name: d.name,
      bookIds: d.bookIds,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
    return NextResponse.json({ count: safe.length, lists: safe });
  } catch (err) {
    console.error("debug/lists error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
