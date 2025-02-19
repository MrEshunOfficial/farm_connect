"use client";

import React from "react";
import AllPostsList from "@/app/products/post.components/AllPostsList";
import RecentPostsList from "@/app/products/post.components/RecentPostsList";

export default function Products() {
  return (
    <main className="h-[90vh] overflow-y-auto bg-gradient-to-b from-background to-muted/20">
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

      {/* Main Content */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto py-4">
          <AllPostsList />
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
    </main>
  );
}
