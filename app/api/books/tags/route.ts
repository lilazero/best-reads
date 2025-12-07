import { getTags } from "@/lib/db/books";

export async function GET() {
  try {
    const tags = await getTags();
    return Response.json({ tags });
  } catch (error) {
    return Response.json(
      { error: (error as Error).message || "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
