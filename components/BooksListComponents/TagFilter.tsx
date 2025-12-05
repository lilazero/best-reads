"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BookOpen, Tags } from "lucide-react";

interface Tag {
  id: string;
  value: string;
  icon?: string;
  count?: number;
}

interface TagFilterProps {
  tags: Tag[];
}

export default function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [open, setOpen] = useState(false);

  // Keyboard shortcut: Ctrl+J or Cmd+J to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleTagSelect = (tagValue: string | null) => {
    setOpen(false);
    if (tagValue === null) {
      router.push("/books");
    } else {
      router.push(`/books?tag=${encodeURIComponent(tagValue)}`);
    }
  };

  return (
    <div className="w-full max-w-6xl px-4 mb-1">
      {/* Trigger button and hint */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-all"
        >
          <Tags className="w-4 h-4" />
          <span>
            {selectedTag ? (
              <>
                Filtering by: <strong>{selectedTag}</strong>
              </>
            ) : (
              "Browse by Genre"
            )}
          </span>
          <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-[10px]">⌘</span>J
          </kbd>
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click or press{" "}
          <kbd className="px-1 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 rounded">
            Ctrl+J
          </kbd>{" "}
          to browse by genre
        </p>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search genres..." />
        <CommandList>
          <CommandEmpty>No genre found.</CommandEmpty>
          <CommandGroup heading="Genres">
            <CommandItem onSelect={() => handleTagSelect(null)}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>All Books</span>
              {!selectedTag && (
                <span className="ml-auto text-xs text-blue-500">Active</span>
              )}
            </CommandItem>
            {tags.map((tag) => (
              <CommandItem
                key={tag.value}
                value={tag.value}
                onSelect={() => handleTagSelect(tag.value)}
              >
                <Tags className="mr-2 h-4 w-4" />
                <span>{tag.value}</span>
                {tag.count && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({tag.count})
                  </span>
                )}
                {selectedTag === tag.value && (
                  <span className="ml-auto text-xs text-blue-500">Active</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
