import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-primary-background dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/clubs"
          className="inline-block mb-4 text-neutral-600 dark:text-neutral-400 hover:underline"
        >
          ← Back to Groups
        </Link>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
          <div className="flex gap-6 items-start">
            <div className="shrink-0">
              <Image
                alt="Read With Jenna (Official)"
                src="https://images.gr-assets.com/groups/1643040655p3/988700.jpg"
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Read With Jenna (Official)
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                <div className="flex items-center gap-1">
                  <span>29532 members</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Active recently</span>
                </div>
              </div>

              <a
                className="px-6 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
                href="/group/join/988700-read-with-jenna-official"
              >
                Join Group
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                About this group
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                When anyone on the TODAY team is looking for a book
                recommendation, there is only one person to turn to: Jenna Bush
                Hager. Jenna will select a book and as you read along,
                we&apos;ll be posting updates and discussion prompts here.
              </p>
            </section>

            <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Currently Reading
              </h2>
              <div className="flex items-start gap-4">
                <img
                  src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1639314979l/57846320._SX98_.jpg"
                  alt="The School for Good Mothers"
                  width={98}
                  height={150}
                />
                <div>
                  <a
                    href="https://www.goodreads.com/en/book/show/57846320"
                    className="font-medium hover:underline"
                  >
                    The School for Good Mothers
                  </a>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    by Jessamine Chan
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Group Rules
              </h2>
              <ol className="list-decimal list-inside text-sm text-neutral-700 dark:text-neutral-300">
                <li>Be respectful to all members</li>
                <li>Stay on topic - book discussions only</li>
                <li>No spam or self-promotion</li>
              </ol>
            </section>

            <section className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Moderators
              </h2>
              <ul className="text-neutral-700 dark:text-neutral-300">
                <li>Jenna Bush Hager</li>
                <li>TODAY Show Team</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
