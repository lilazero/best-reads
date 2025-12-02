"use client";

import RecommendedBooks from "@/components/DashboardComponents/RecommendedBooks";
import SearchBar from "@/components/DashboardComponents/SearchBar";

export default function Home() {
  return (
    <div className="flex min-h-vh mt-10 justify-center font-sans dark:bg-black">
      <SearchBar />
      <RecommendedBooks />
    </div>
  );
}
