"use client";

import RecommendedBookList from "@/components/DashboardComponents/RecommendedBookList";
import SearchBar from "@/components/DashboardComponents/SearchBar";
import { RecommendedBooks } from "@/lib/mockData";

export default function Home() {
  return (
    <div className="flex items-center flex-col min-h-vh mt-10 justify-center font-sans dark:bg-black">
      <SearchBar />
      <RecommendedBookList books={RecommendedBooks} />
    </div>
  );
}
