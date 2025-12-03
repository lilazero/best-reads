"use client";

import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BookOpen, Star } from "lucide-react";

import type { Book } from "@/lib/types";
import { tags as tagCatalog } from "@/lib/mockData";
import { ExpandableCard } from "../ui/expandableCard";

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
}

export default function BookCard({
  book,
  index,
  showBuyButton = true,
  isActive,
  onActivate,
  onDeactivate,
}: BookCardProps) {
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
    ctaText: showBuyButton
      ? book.price
        ? `Buy for ${book.price}`
        : "Learn More"
      : undefined,
    ctaLink: showBuyButton ? "#" : undefined,
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
    <ExpandableCard
      card={cardData}
      isActive={isActive}
      onActivate={onActivate}
      onDeactivate={onDeactivate}
    />
  );
}
