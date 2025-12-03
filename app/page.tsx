"use client";

import BookCardList from "@/components/DashboardComponents/BookCardList";
import SearchBar from "@/components/DashboardComponents/SearchBar";
import { RecommendedBooks } from "@/lib/mockData";

export default function Home() {
  return (
    <div className="flex items-center flex-col min-h-vh mt-10 justify-center font-sans dark:bg-black">
      <SearchBar />
      {/* Instead of the /mockData/RecommendedBooks add the ones from MongoDB */}
      <BookCardList books={RecommendedBooks} showBuyButton={false} />
    </div>
  );
}
