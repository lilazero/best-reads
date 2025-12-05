import Link from "next/link";
import SearchForm from "@/components/ClubsComponents/SearchForm";
import GroupList from "@/components/ClubsComponents/GroupList";
import { PopularGroups } from "@/lib/mockData";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function ClubsSearch({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Filter groups based on search query
  const filteredGroups = query
    ? PopularGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(query.toLowerCase()) ||
          group.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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

        <h1 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-100 mb-6">
          Search Groups
        </h1>

        <SearchForm />

        {query && (
          <div className="mb-6">
            <p className="text-neutral-700 dark:text-neutral-300">
              {filteredGroups.length > 0
                ? `Found ${filteredGroups.length} ${
                    filteredGroups.length === 1 ? "group" : "groups"
                  } matching "${query}"`
                : `No groups found matching "${query}"`}
            </p>
          </div>
        )}

        {filteredGroups.length > 0 && (
          <GroupList groups={filteredGroups} showDescription={true} />
        )}

        {query && filteredGroups.length === 0 && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Try adjusting your search terms or browse all groups.
            </p>
            <Link
              href="/clubs"
              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
            >
              View all groups
            </Link>
          </div>
        )}

        {!query && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              Enter a search term to find groups
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
