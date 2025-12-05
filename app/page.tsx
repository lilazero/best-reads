"use client";

import BookCardList from "@/components/DashboardComponents/BookCardList";
import SearchBar from "@/components/DashboardComponents/SearchBar";
import { RecommendedBooks } from "@/lib/mockData";

export default function Home() {
  return (
    <div className="flex items-center flex-col min-h-vh mt-10 justify-center font-sans dark:bg-black">
      <SearchBar />
      <h2 className="text-2xl font-bold mb-6 mt-20 px-4">Recommended Books</h2>
      {/* Instead of the /mockData/RecommendedBooks add the ones from MongoDB */}
      <BookCardList books={RecommendedBooks} showBuyButton={false} />
    </div>
  );
}
