"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BookOpen, Star } from "lucide-react";

import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "../ui/expandableCard";
import { Button } from "../ui/button";
import type { Book } from "@/lib/types";
import { tags as tagCatalog } from "@/lib/mockData";

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

interface RecommendedBookProps {
  book: Book;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function RecommendedBook({
  book,
  index,
  isExpanded,
  onToggle,
}: RecommendedBookProps) {
  const rating = (4.2 + (index % 4) * 0.2).toFixed(1);
  const reviews = 120 + index * 9;

  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      expanded={isExpanded}
      onToggle={onToggle}
      transitionDuration={0.4}
      onExpandStart={() => console.log(`Opening card for ${book.title}`)}
      onExpandEnd={() => console.log(`Expanded card for ${book.title}`)}
    >
      {({ isExpanded: cardExpanded }) => (
        <ExpandableTrigger>
          <ExpandableCard
            className="w-full"
            collapsedSize={{ width: 320, height: 220 }}
            expandedSize={{ width: 500, height: 520 }}
            hoverToExpand={false}
            expandDelay={400}
            collapseDelay={400}
          >
            <ExpandableCardHeader className="pb-4">
              <div className="flex w-full items-center justify-between text-sm">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  Trending Pick
                </span>
                <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                  {book.price ?? "No price"}
                </span>
              </div>
            </ExpandableCardHeader>

            <ExpandableCardContent>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div
                  className="relative rounded-lg shadow-sm"
                  style={{
                    width: cardExpanded ? 120 : 86,
                    height: cardExpanded ? 120 : 86,
                    transition: "width 0.3s ease, height 0.3s ease",
                  }}
                >
                  <Image
                    src={book.src ?? "/logo.png"}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 86px, 120px"
                    className="rounded-lg object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <h3
                      className="text-lg text-foreground transition-all duration-300"
                      style={{
                        fontSize: cardExpanded ? "1.5rem" : "1.125rem",
                        fontWeight: cardExpanded ? 700 : 500,
                      }}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs uppercase text-muted-foreground">
                      Classic Literature
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star
                        key={`${book.id}-star-${star}`}
                        className="h-4 w-4 fill-current text-amber-400"
                      />
                    ))}

                    <span className="font-semibold text-foreground">
                      {rating}
                    </span>
                    <AnimatePresence mode="wait" initial={false}>
                      {cardExpanded ? (
                        <motion.span
                          key={`${book.id}-expanded`}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap text-xs text-muted-foreground"
                        >
                          ({reviews} community reviews)
                        </motion.span>
                      ) : (
                        <motion.span
                          key={`${book.id}-collapsed`}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap text-xs text-muted-foreground"
                        >
                          ({reviews})
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {book.tags?.slice(0, 3).map((tag) => {
                      const Icon = resolveTagIcon(tag.id);
                      return (
                        <span
                          key={`${book.id}-${tag.id}`}
                          className="flex items-center gap-1 rounded-full bg-accent/40 px-3 py-1 text-xs font-medium text-accent-foreground"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {tag.value}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <ExpandableContent
                preset="fade"
                keepMounted={false}
                animateIn={{
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { type: "spring", stiffness: 280, damping: 24 },
                }}
              >
                <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <p className="leading-relaxed">
                    {book.description ?? "No description available."}
                  </p>
                  <Button className="w-full" variant="secondary">
                    Keep on radar
                  </Button>
                </div>
              </ExpandableContent>
            </ExpandableCardContent>

            <ExpandableContent preset="slide-up">
              <ExpandableCardFooter className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <span>Average reading time • 6 hrs</span>
                <span>Updated {2020 + index} edition</span>
              </ExpandableCardFooter>
            </ExpandableContent>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  );
}
