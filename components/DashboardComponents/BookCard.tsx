"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BookOpen, Star, ListPlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import EditBookDialog from "../EditBookDialog";

import type { Book } from "@/lib/types";
import { tags as tagCatalog } from "@/lib/mockData";
import { ExpandableCard } from "../ui/expandableCard";
import AddToListDialog from "../AddToListDialog";
import { Button } from "../ui/button";

const tagIconLookup = tagCatalog.reduce<Record<string, string | undefined>>(
  (acc, tag) => {
    acc[tag.id] = tag.icon;
    return acc;
  },
  {}
);

const resolveTagIcon = (tagId: string): LucideIcon => {
  const iconName = tagIconLookup[tagId];
  if (!iconName) {
    return BookOpen;
  }

  const Icon = LucideIcons[iconName as keyof typeof LucideIcons];

  return (Icon as LucideIcon) ?? BookOpen;
};

interface BookCardProps {
  book: Book;
  index: number;
  showBuyButton?: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  hideAddToListButton?: boolean;
  customWidth?: string;
  customHeight?: string;
  previewImageFit?: "card" | "fixed";
  previewImageHeight?: string;
  previewImageWidth?: string;
  previewImageBackgroundTransparent?: boolean;
}

export default function BookCard({
  book,
  index,
  showBuyButton = true,
  isActive,
  onActivate,
  onDeactivate,
  hideAddToListButton = false,
  customWidth,
  customHeight,
  previewImageFit = "card",
  previewImageHeight,
  previewImageWidth,
  previewImageBackgroundTransparent = false,
}: BookCardProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  const [showAddToList, setShowAddToList] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const rating = (book.rating ?? 0).toFixed(1);
  const reviews = 120 + index * 9;

  const cardData = {
    id: book.id,
    title: book.title,
    description:
      book.description || `Rating: ${rating} ⭐ (${reviews} reviews)`,
    rating: rating,
    firstTag:
      book.tags && book.tags.length > 0 ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs">
          {(() => {
            const Icon = resolveTagIcon(book.tags[0].id);
            return <Icon className="w-3 h-3" />;
          })()}
          {book.tags[0].value}
        </span>
      ) : undefined,
    src: book.src,
    href: `/books/${book.id}`,
    ctaText: showBuyButton
      ? book.price
        ? `Buy for ${book.price}`
        : "Learn More"
      : undefined,
    ctaLink: showBuyButton ? "#" : undefined,
    ctaButtons:
      !hideAddToListButton && isLoaded && isSignedIn ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setShowAddToList(true);
          }}
          className="px-4 py-3 text-sm rounded-full font-bold bg-blue-500 hover:bg-blue-600 text-white"
        >
          <ListPlus className="w-4 h-4 mr-1" />
          Add to List
        </Button>
      ) : undefined,
    actions:
      isLoaded &&
      user?.primaryEmailAddress?.emailAddress === "andililajal@gmail.com" ? (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActionsMenu((s) => !s);
            }}
            aria-label="Actions"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {showActionsMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 rounded-lg shadow-lg z-50 border"
            >
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  setShowActionsMenu(false);
                  setShowEditDialog(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Edit
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  setShowActionsMenu(false);
                  const ok = confirm(
                    "Delete this book? This action cannot be undone."
                  );
                  if (!ok) return;
                  setIsDeleting(true);
                  try {
                    const res = await fetch(`/api/books/${book.id}`, {
                      method: "DELETE",
                    });
                    if (!res.ok) {
                      const json = await res.json().catch(() => ({}));
                      alert(json?.error || "Failed to delete book");
                    } else {
                      // refresh the page data
                      router.refresh();
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Failed to delete book");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
          <EditBookDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            book={{
              id: book.id,
              title: book.title,
              description: book.description,
              longDescription: book.longDescription,
              src: book.src,
            }}
          />
        </div>
      ) : undefined,
    content: () => (
      <div className="space-y-4 ">
        <div>
          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            Description
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400">
            {book.longDescription ||
              book.description ||
              "No description available."}
          </p>
        </div>

        {book.tags && book.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag) => {
                const Icon = resolveTagIcon(tag.id);
                return (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {tag.value}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {rating}
            </span>
          </div>
          <span className="text-neutral-600 dark:text-neutral-400">
            ({reviews} reviews)
          </span>
        </div>
      </div>
    ),
  };

  return (
    <>
      <ExpandableCard
        card={cardData}
        isActive={isActive}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        cardClassName={
          customWidth || customHeight
            ? `${customWidth || ""} ${customHeight || ""}`
            : undefined
        }
        previewImageFit={previewImageFit}
        previewImageHeight={previewImageHeight}
        previewImageWidth={previewImageWidth}
        previewImageBackgroundTransparent={previewImageBackgroundTransparent}
      />
      <AddToListDialog
        open={showAddToList}
        onOpenChange={setShowAddToList}
        bookId={book.id}
        bookTitle={book.title}
      />
    </>
  );
}
