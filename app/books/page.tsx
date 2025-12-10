import React, { Suspense } from "react";
import BooksListContainer from "./BooksListContainer";

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading books...
        </div>
      }
    >
      <BooksListContainer />
    </Suspense>
  );
}
