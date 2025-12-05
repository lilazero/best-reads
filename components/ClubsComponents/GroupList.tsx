"use client";

import type { Group } from "@/lib/types";
import GroupCard from "./GroupCard";

interface GroupListProps {
  groups: Group[];
  showDescription?: boolean;
}

export default function GroupList({
  groups,
  showDescription = false,
}: GroupListProps) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 mb-6">
      {/* Mobile */}
      <div className="md:hidden">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            iconSize="medium"
            showDescription={false}
            showMemberCount={true}
          />
        ))}
      </div>

      {/* Tablet */}
      <div className="hidden md:block lg:hidden">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            iconSize="large"
            showDescription={false}
            showMemberCount={true}
          />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            iconSize="large"
            showDescription={showDescription}
            showMemberCount={true}
          />
        ))}
      </div>
    </div>
  );
}
