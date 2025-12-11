"use client";

import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import type { Group } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils/timeFormat";

interface GroupCardProps {
  group: Group;
  iconSize?: "medium" | "large";
  showDescription?: boolean;
  showMemberCount?: boolean;
}

export default function GroupCard({
  group,
  iconSize = "medium",
  showDescription = false,
  showMemberCount = true,
}: GroupCardProps) {
  const sizeClasses = {
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const formatMemberCount = (count: number): string => {
    return count.toLocaleString();
  };

  const groupLink = `/clubs/${group.id}`;

  return (
    <div className="flex gap-4 p-4 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
      <div className={`shrink-0 ${sizeClasses[iconSize]}`}>
        <Link href={groupLink} className="block">
          {group.iconUrl ? (
            <Image
              src={group.iconUrl}
              alt={group.name}
              width={iconSize === "medium" ? 48 : 64}
              height={iconSize === "medium" ? 48 : 64}
              className="rounded-lg object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`${
              sizeClasses[iconSize]
            } rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center ${
              group.iconUrl ? "hidden" : "flex"
            }`}
          >
            <Users className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
          </div>
        </Link>
      </div>

      <div className="flex-1 min-w-0">
        <Link href={groupLink} className="hover:underline">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            {group.name}
          </h3>
        </Link>

        {showMemberCount && (
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span>{formatMemberCount(group.membersCount)} members</span>
            <span className="mx-1">·</span>
            <span>Active {formatRelativeTime(group.lastActiveAt)}</span>
          </div>
        )}

        {showDescription && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
            {group.description}
          </p>
        )}
      </div>
    </div>
  );
}
