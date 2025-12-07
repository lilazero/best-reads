"use client";

import { useRouter } from "next/navigation";
import BooksHeader from "./BooksHeader";
import type { TagWithCount } from "@/lib/fetchBooksAndTags";
import type { Book } from "@/lib/types";

interface HomeBooksHeaderProps {
  tags: TagWithCount[];
  books: Book[];
  basePath: string;
}

export default function HomeBooksHeader({
  tags,
  books,
  basePath,
}: HomeBooksHeaderProps) {
  const router = useRouter();

  return (
    <BooksHeader
      title="Recommended Books"
      searchQuery=""
      tags={tags}
      books={books}
      selectedTag={undefined}
      totalCount={books.length}
      startItem={books.length > 0 ? 1 : 0}
      endItem={books.length}
      isRefreshing={false}
      onRefresh={() => {}}
      onClearTag={() => router.push("/")}
      basePath={basePath}
    />
  );
}
