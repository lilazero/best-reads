"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Tag {
  id: string;
  value: string;
  icon?: string;
}

interface TagFilterProps {
  tags: Tag[];
}

export default function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");

  const handleTagClick = (tagValue: string) => {
    if (selectedTag === tagValue) {
      // If clicking the same tag, clear the filter
      router.push("/books");
    } else {
      // Apply the tag filter
      router.push(`/books?tag=${encodeURIComponent(tagValue)}`);
    }
  };

  const handleShowAll = () => {
    router.push("/books");
  };

  return (
    <div className="w-full max-w-6xl px-4 mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleShowAll}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            !selectedTag
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          All Books
        </button>
        {tags.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleTagClick(tag.value)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedTag === tag.value
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {tag.value}
          </button>
        ))}
      </div>
    </div>
  );
}
