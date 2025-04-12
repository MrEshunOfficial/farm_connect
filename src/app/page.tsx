"use client";

import React, { useState, useEffect } from "react";
import AllPostsList from "@/app/products/post.components/AllPostsList";
import RecentPostsList from "@/app/products/post.components/RecentPostsList";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { usePathname } from "next/navigation";
import ProfileList from "@/components/ProfileLists";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profile");
  const isParamsPage = pathname.startsWith("/public_profiles");
  const showCategoryNav = !isProfilePage && !isParamsPage;

  const toggleVisibility = () => {
    const scrolled = document.documentElement.scrollTop;
    setIsVisible(scrolled > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="w-full flex flex-1 gap-2 flex-col md:flex-row">
      {showCategoryNav && (
        <div className="w-full md:w-80 flex flex-col gap-2">
          <CategoryNavigation />
        </div>
      )}

      <div className="flex-1 min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="w-full bg-background border-b">
          <div className="max-w-7xl mx-auto py-8">
            <div className="px-4 mb-8">
              <h1 className="text-xl font-bold tracking-tight">Marketplace</h1>
              <p className="mt-2 text-muted-foreground">
                Discover fresh farm products and quality store items
              </p>
            </div>
            <RecentPostsList />
          </div>
        </div>

        <div className="w-full">
          <div className="max-w-7xl mx-auto py-4">
            <AllPostsList />
          </div>
        </div>

        {isVisible && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Scroll to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        )}
      </div>

      {!isProfilePage && (
        <div className="w-full md:w-80 flex flex-col gap-2">
          <ProfileList />
        </div>
      )}
    </div>
  );
}
