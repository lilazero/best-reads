"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePositioner,
} from "@/components/ui/autocomplete";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, Tags, Book } from "lucide-react";
import type { Book as BookType } from "@/lib/types";

interface Tag {
  id: string;
  value: string;
  icon?: string;
  count?: number;
}

interface SearchItem {
  id: string;
  value: string;
  type: "tag" | "book";
  bookId?: string;
}

interface TagFilterProps {
  tags: Tag[];
  books: BookType[];
  onTagChange?: (tag: string | null) => void;
}

export default function SearchAndTagFilter({ tags, books }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query with 2 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Combine tags and books into search items
  const searchItems: SearchItem[] = useMemo(() => {
    const tagItems: SearchItem[] = tags.map((tag) => ({
      id: `tag-${tag.id}`,
      value: `[Genre] ${tag.value}`,
      type: "tag" as const,
    }));

    const bookItems: SearchItem[] = books.map((book) => ({
      id: `book-${book.id}`,
      value: book.title,
      type: "book" as const,
      bookId: book.id,
    }));

    return [...tagItems, ...bookItems];
  }, [tags, books]);

  // Filter search items based on debounced query
  const filteredSearchItems = useMemo(() => {
    if (!debouncedQuery.trim()) return searchItems;
    const query = debouncedQuery.toLowerCase();
    return searchItems.filter((item) =>
      item.value.toLowerCase().includes(query)
    );
  }, [searchItems, debouncedQuery]);

  // Keyboard shortcut: Ctrl+J or Cmd+J to open command dialog
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

  const handleBookSelect = (bookId: string) => {
    setOpen(false);
    // Navigate to book detail page (adjust path as needed)
    router.push(`/books/${bookId}`);
  };

  const handleSelect = (value: string) => {
    // Clear search query on selection
    setSearchQuery("");
    setDebouncedQuery("");

    // Check if it's a genre selection
    if (value.startsWith("[Genre] ")) {
      const tagValue = value.replace("[Genre] ", "");
      handleTagSelect(tagValue);
      return;
    }
    // Otherwise it's a book
    const item = searchItems.find((i) => i.value === value);
    if (item && item.type === "book" && item.bookId) {
      handleBookSelect(item.bookId);
    }
  };

  return (
    <div className="w-full max-w-6xl px-4 mb-1">
      {/* Unified search bar */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-full max-w-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Autocomplete
                    items={filteredSearchItems}
                    autoHighlight
                    onValueChange={handleSelect}
                  >
                    <AutocompleteInput
                      id="unified-search"
                      placeholder="Search books or genres..."
                      className="bg-white dark:bg-gray-900 rounded-full"
                      onInput={(e) =>
                        setSearchQuery((e.target as HTMLInputElement).value)
                      }
                    />
                    <AutocompletePositioner sideOffset={6}>
                      <AutocompletePopup>
                        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
                        <AutocompleteList>
                          {(item: SearchItem) => (
                            <AutocompleteItem key={item.id} value={item.value}>
                              <div className="flex items-center gap-2">
                                {item.type === "tag" ? (
                                  <Tags className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Book className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="truncate">
                                  {item.type === "tag"
                                    ? item.value.replace("[Genre] ", "")
                                    : item.value}
                                </span>
                                {item.type === "tag" &&
                                  selectedTag ===
                                    item.value.replace("[Genre] ", "") && (
                                    <span className="ml-auto text-xs text-blue-500">
                                      Active
                                    </span>
                                  )}
                              </div>
                            </AutocompleteItem>
                          )}
                        </AutocompleteList>
                      </AutocompletePopup>
                    </AutocompletePositioner>
                  </Autocomplete>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Press Ctrl+J for quick genre selection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Command Dialog (opened with Ctrl+J) */}
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
