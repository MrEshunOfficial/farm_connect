import React, { useState, useEffect } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCategoryNavigation } from "@/hooks/useCategoryNavigation";
import { useAppSelector } from "@/store/hooks";
import { fetchMyProfile, selectMyProfile } from "@/store/profile.slice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";

function CategorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"
        />
      ))}
    </div>
  );
}

export function CategoryNavigation() {
  const {
    categories,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    handleSearchClear,
  } = useCategoryNavigation();

  const activeProfile = useAppSelector((state) =>
    selectMyProfile(state as any)
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    else if (hour >= 12 && hour < 17) return "Good Afternoon";
    else if (hour >= 17 && hour < 22) return "Good Evening";
    else return "Good Night";
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subcategories?.some((sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className=" w-full max-w-2xl mx-auto p-2 space-y-4">
      {/* Profile Header */}
      <div className="w-full flex flex-col items-start gap-4 shadow-lg rounded-xl bg-white dark:bg-gray-800 p-1 border border-gray-100 dark:border-gray-700">
        <Avatar className="w-full h-40 rounded-xl relative overflow-hidden group">
          <AvatarImage
            src={
              typeof activeProfile?.profilePicture === "string"
                ? activeProfile?.profilePicture
                : activeProfile?.profilePicture?.url ||
                  "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
            }
            alt={activeProfile?.username || "Profile picture"}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm flex flex-col text-white">
            <span className="text-sm">{getTimeBasedGreeting()}</span>
            <b className="capitalize">{activeProfile?.fullName}</b>
          </div>
        </Avatar>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={18}
        />
        <Input
          type="text"
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={handleSearchClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Categories Dropdown */}
      <ScrollArea className="h-screen w-full">
        {isLoading ? (
          <CategorySkeleton />
        ) : (
          <div className="space-y-2">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No categories found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredCategories.map((category) => (
                <DropdownMenu key={category.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between ${
                        selectedCategory === category.id
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : ""
                      }`}
                    >
                      {category.name}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/products/${category.id}`}
                        className="w-full"
                      >
                        View All {category.name}
                      </Link>
                    </DropdownMenuItem>
                    {category.subcategories?.map((subcategory) => (
                      <DropdownMenuItem
                        key={subcategory.id}
                        asChild
                        className="p-2"
                      >
                        <Link
                          href={`/products/${category.id}/${subcategory.id}`}
                          className="w-full p-1"
                        >
                          {subcategory.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default CategoryNavigation;
