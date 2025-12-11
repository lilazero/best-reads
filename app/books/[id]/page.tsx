import React from "react";
import { getBookById } from "@/lib/db/books";
import BookCommentsThreaded from "@/components/BookCommentsThreaded";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
  // `params` may be a Promise in some Next setups; handle both shapes without `any`
  const maybePromise = params as { then?: unknown };
  const resolvedParams =
    typeof maybePromise.then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });
  const { id } = resolvedParams;
  const book = await getBookById(id);
  if (!book) return notFound();

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {book.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.src}
              alt={book.title}
              className="w-full rounded shadow"
            />
          ) : (
            <div className="w-full h-64 bg-neutral-100 rounded" />
          )}
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <div className="text-sm text-neutral-600 mb-4">
            By {book.authors?.map((a) => a.name).join(", ")}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold">Description</h3>
            <p className="text-neutral-700 mt-2">
              {book.longDescription ||
                book.description ||
                "No description available."}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold">Details</h3>
            <ul className="list-disc pl-5 mt-2 text-neutral-700">
              {book.published && <li>Published: {book.published}</li>}
              {book.pages && <li>Pages: {book.pages}</li>}
              {book.publisher && <li>Publisher: {book.publisher}</li>}
            </ul>
          </div>

          <hr className="my-6" />

          <BookCommentsThreaded bookId={id} />
        </div>
      </div>
    </main>
  );
}
