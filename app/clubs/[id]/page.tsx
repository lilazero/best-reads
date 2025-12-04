import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Users, Calendar, MessageCircle } from "lucide-react";
import { GroupDetails } from "@/lib/mockData";
import { formatRelativeTime } from "@/lib/utils/timeFormat";

interface ClubPageProps {
  params: {
    id: string;
  };
}

export default function ClubPage({ params }: ClubPageProps) {
  const group = GroupDetails[params.id];

  if (!group) {
    notFound();
  }

  const formatMemberCount = (count: number): string => {
    return count.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/clubs"
          className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 inline-block"
        >
          ← Back to Groups
        </Link>

        {/* Group Header */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
          <div className="flex gap-6 items-start">
            {/* Group Icon */}
            <div className="flex-shrink-0">
              {group.iconUrl ? (
                <Image
                  src={group.iconUrl}
                  alt={group.name}
                  width={120}
                  height={120}
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
                className={`w-[120px] h-[120px] rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center ${
                  group.iconUrl ? "hidden" : "flex"
                }`}
              >
                <Users className="w-12 h-12 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>

            {/* Group Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {group.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{formatMemberCount(group.membersCount)} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Active {formatRelativeTime(group.lastActiveAt)}</span>
                </div>
              </div>

              <button className="px-6 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors">
                Join Group
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                About this group
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                {group.fullDescription || group.description}
              </p>
            </section>

            {/* Recent Discussions */}
            {group.topics && group.topics.length > 0 && (
              <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Recent Discussions
                </h2>
                <div className="space-y-4">
                  {group.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="pb-4 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 last:pb-0"
                    >
                      <Link
                        href={`/clubs/${group.id}/topics/${topic.id}`}
                        className="text-neutral-900 dark:text-neutral-100 font-medium hover:underline"
                      >
                        {topic.title}
                      </Link>
                      <div className="flex gap-3 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>by {topic.author}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{topic.postsCount} posts</span>
                        </div>
                        <span>·</span>
                        <span>{formatRelativeTime(topic.lastPostAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rules */}
            {group.rules && group.rules.length > 0 && (
              <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Group Rules
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {group.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ol>
              </section>
            )}

            {/* Moderators */}
            {group.moderators && group.moderators.length > 0 && (
              <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Moderators
                </h2>
                <ul className="space-y-2">
                  {group.moderators.map((moderator, index) => (
                    <li
                      key={index}
                      className="text-neutral-700 dark:text-neutral-300"
                    >
                      {moderator}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
