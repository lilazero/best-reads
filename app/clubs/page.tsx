import Link from "next/link";
import SearchForm from "@/components/ClubsComponents/SearchForm";
import GroupList from "@/components/ClubsComponents/GroupList";
import TagList from "@/components/ClubsComponents/TagList";
import TagSearchForm from "@/components/ClubsComponents/TagSearchForm";
import {
  FeaturedGroups,
  PopularGroups,
  MyBooksGroups,
  GroupTags,
} from "@/lib/mockData";

export default function Clubs() {
  return (
    <div className="min-h-screen bg-primary-background dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Groups
            </h1>

            <SearchForm />

            {/* Featured Groups */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Featured groups
              </h2>
              <GroupList groups={FeaturedGroups} showDescription={true} />
            </section>

            {/* Popular Groups */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Popular groups
              </h2>
              <GroupList groups={PopularGroups} showDescription={true} />
              <Link
                href="/group/popular"
                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
              >
                See all popular groups
              </Link>
            </section>

            {/* Groups reading my books */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Groups reading my to-read/currently-reading books
              </h2>
              <GroupList groups={MyBooksGroups} showDescription={true} />
              <Link
                href="/group/my_books"
                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
              >
                See all groups shelving my books
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Browse groups by tag
              </h2>
              <TagList tags={GroupTags} />
              <TagSearchForm />
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                More groups
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/group/show/220-goodreads-librarians-group"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
                  >
                    Goodreads Librarians Group
                  </Link>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    : request changes to book records
                  </span>
                </li>
                <li>
                  <Link
                    href="/group/new"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
                  >
                    Create a group
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
