"use client";

import React, { useCallback, useEffect, useId, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import useScrollLock from "@/hooks/use-scroll-lock";

export interface ExpandableCardData {
  id: string;
  title: string;
  description: string;
  rating?: string;
  firstTag?: React.ReactNode;
  src?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaButtons?: React.ReactNode; // Custom buttons to display alongside or instead of default CTA
  content: React.ReactNode | (() => React.ReactNode);
}

interface ExpandableCardProps {
  card: ExpandableCardData;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  /**
   * Optional extra classes to apply to the compact card. These will be appended
   * to the default base classes so server and client markup remain consistent.
   */
  cardClassName?: string;
  /**
   * How the collapsed preview image should fit the card.
   * - 'card': image fills the card width (responsive)
   * - 'fixed': fixed 180x240 canvas centered
   */
  previewImageFit?: "card" | "fixed";
  /** Height for the preview image canvas (Tailwind class string). Defaults to 'h-60'. */
  previewImageHeight?: string;
  /** Width for the preview image canvas in 'fixed' mode (Tailwind class string). Defaults to 'w-[180px]'. */
  previewImageWidth?: string;
  /** If true, the preview image container will have a transparent background. */
  previewImageBackgroundTransparent?: boolean;
}

export function ExpandableCard({
  card,
  isActive,
  onActivate,
  onDeactivate,
  cardClassName,
  previewImageFit = "card",
  previewImageHeight = "h-60",
  previewImageWidth = "w-[180px]",
  previewImageBackgroundTransparent = false,
}: ExpandableCardProps) {
  const baseCardClass =
    " p-1 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer";
  const combinedCardClass = cardClassName
    ? `${baseCardClass} ${cardClassName}`
    : baseCardClass;
  const id = useId();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isActive) {
        onDeactivate();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, onDeactivate]);

  const handleOutsideClick = useCallback(() => {
    if (isActive) {
      onDeactivate();
    }
  }, [isActive, onDeactivate]);

  useOutsideClick(ref, handleOutsideClick);
  // Lock body scroll while the card is active (overlay open)
  useScrollLock(isActive);

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
            <div className="fixed inset-0 grid place-items-center z-20">
              <motion.button
                key={`button-${card.id}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                onClick={onDeactivate}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${card.id}-${id}`}
                ref={ref}
                className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
              >
                {card.src && (
                  <motion.div layoutId={`image-${card.id}-${id}`}>
                    <Image
                      width={500}
                      height={320}
                      src={card.src}
                      alt={card.title}
                      className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                    />
                  </motion.div>
                )}

                <div>
                  <div className="flex justify-between items-start p-4">
                    <div className="">
                      <motion.h3
                        layoutId={`title-${card.id}-${id}`}
                        className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                      >
                        {card.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${card.id}-${id}`}
                        className="text-neutral-600 dark:text-neutral-400 text-base"
                      >
                        {card.description}
                      </motion.p>
                    </div>

                    <div className="flex gap-2">
                      {card.ctaButtons && (
                        <motion.div
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {card.ctaButtons}
                        </motion.div>
                      )}
                      {card.ctaText && card.ctaLink && (
                        <motion.a
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          href={card.ctaLink}
                          target="_blank"
                          className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                        >
                          {card.ctaText}
                        </motion.a>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 relative px-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400  [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                    >
                      {typeof card.content === "function"
                        ? card.content()
                        : card.content}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${card.id}-${id}`}
        onClick={onActivate}
        className={combinedCardClass}
      >
        <div className="flex gap-4 flex-col w-full">
          {card.src && (
            <motion.div layoutId={`image-${card.id}-${id}`}>
              {previewImageFit === "card" ? (
                <div
                  className={`w-full rounded-lg overflow-hidden ${
                    previewImageBackgroundTransparent
                      ? "bg-transparent"
                      : "bg-neutral-100 dark:bg-neutral-800"
                  } ${previewImageHeight}`}
                >
                  <Image
                    width={400}
                    height={240}
                    src={card.src}
                    alt={card.title}
                    className="h-full w-full object-contain object-center"
                  />
                </div>
              ) : (
                <div
                  className={`mx-auto rounded-lg overflow-hidden ${
                    previewImageBackgroundTransparent
                      ? "bg-transparent"
                      : "bg-neutral-100 dark:bg-neutral-800"
                  } ${previewImageHeight} ${previewImageWidth}`}
                >
                  <Image
                    width={400}
                    height={240}
                    src={card.src}
                    alt={card.title}
                    className="h-full w-full object-contain object-center"
                  />
                </div>
              )}
            </motion.div>
          )}
          <div className="flex justify-center items-center flex-col w-full">
            <motion.h3
              layoutId={`title-${card.id}-${id}`}
              className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base truncate w-full"
            >
              {card.title}
            </motion.h3>
            <div className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {card.rating && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = parseFloat(card.rating || "0");
                      const isYellow = i < Math.round(ratingValue);
                      return (
                        <svg
                          key={i}
                          className={`w-2.5 h-2.5 ${
                            isYellow
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
                          }`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      );
                    })}
                  </div>
                )}
              </div>
              {card.firstTag && <div className="shrink-0">{card.firstTag}</div>}
            </div>
            <motion.p
              layoutId={`description-${card.id}-${id}`}
              className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base w-full h-24 overflow-hidden"
            >
              {card.description}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
