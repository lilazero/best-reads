"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  basePath?: string;
}

export default function TagFilter({
  tags,
  basePath = "/books",
}: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [open, setOpen] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd+J opens dialog, Escape clears tag filter
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (isModifier && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        router.push(basePath);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router, basePath]);

  const handleTagSelect = (tagValue: string | null) => {
    setOpen(false);
    if (tagValue === null) {
      router.push(basePath);
    } else {
      router.push(`${basePath}?tag=${encodeURIComponent(tagValue)}`);
    }
  };

  return (
    <div className="w-full max-w-xs px-2 mb-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <button
                className="w-fit bg-white dark:bg-gray-900 rounded-full border px-4 py-2 flex items-center gap-2 justify-between text-sm"
                onClick={() => setOpen(true)}
                aria-label="Filter by genre"
              >
                <Tags className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{selectedTag || "All Genres"}</span>
                <span className="pointer-events-none text-[10px] text-muted-foreground border border-muted-foreground/40 rounded px-1">
                  Ctrl+J
                </span>
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ctrl+J to open genre filter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
                key={tag.id}
                value={tag.value}
                onSelect={() => handleTagSelect(tag.value)}
              >
                <Tags className="mr-2 h-4 w-4" />
                <span>{tag.value}</span>
                {tag.count !== undefined && (
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
