import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen dark:bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Group Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Sorry, we couldn&apos;t find the group you&apos;re looking for.
        </p>
        <Link
          href="/clubs"
          className="px-6 py-3 bg-neutral-800 dark:bg-neutral-700 text-white rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors inline-block"
        >
          Back to Groups
        </Link>
      </div>
    </div>
  );
}
