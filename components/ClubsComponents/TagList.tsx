"use client";

import Link from "next/link";
import type { GroupTag } from "@/lib/types";

interface TagListProps {
  tags: GroupTag[];
}

export default function TagList({ tags }: TagListProps) {
  return (
    <ul className="space-y-2">
      {tags.map((tag) => (
        <li key={tag.name}>
          <Link
            href={tag.url}
            className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
          >
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
