// PostsContainer.tsx
import React, { useRef, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AppDispatch, RootState } from "@/store";
import {
  selectPostsLoading,
  selectPostsError,
  selectFilteredPosts,
  fetchAllPosts,
} from "@/store/post.slice";
import { selectPagination } from "@/store/profile.slice";
import { PostGrid } from "./PostGrid"; // Keep the existing PostGrid component
import SearchSection from "@/components/headerUi/SearchSection";

interface PostsContainerProps {
  // Search related props
  search?: string;
  regions?: any[];
  showSearch?: boolean;

  // Location/category filter props
  categoryId?: string;
  subcategoryId?: string;
  region?: string;
  district?: string;

  // Additional options
  title?: string;
  emptyStateMessage?: string;
}

export function PostsContainer({
  // Search props
  search = "",
  regions = [],
  showSearch = false,

  // Filter props
  categoryId,
  subcategoryId,
  region,
  district,

  // Additional options
  title,
  emptyStateMessage,
}: PostsContainerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const pagination = useSelector(selectPagination);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Search state management
  const queryParam = searchParams?.get("q") || "";
  const initialSearchValue = search || queryParam || "";
  const [searchInput, setSearchInput] = useState(initialSearchValue);

  // Get filtered posts based on all criteria
  const { farmPosts, storePosts } = useSelector((state: RootState) =>
    selectFilteredPosts(state, {
      searchQuery: searchInput,
      categoryId,
      subcategoryId,
      region,
      district,
    })
  );

  const farmPostCount = farmPosts?.length || 0;
  const storePostCount = storePosts?.length || 0;

  // Update search input when prop changes
  useEffect(() => {
    setSearchInput(initialSearchValue);
  }, [initialSearchValue]);

  // Fetch posts based on current criteria
  useEffect(() => {
    dispatch(
      fetchAllPosts({
        searchQuery: searchInput,
        category: categoryId,
        subcategory: subcategoryId,
        region: region,
        district: district,
        page: 1,
        limit: 12,
      })
    );
  }, [searchInput, categoryId, subcategoryId, region, district, dispatch]);

  // Infinite scroll implementation
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        dispatch(
          fetchAllPosts({
            searchQuery: searchInput,
            category: categoryId,
            subcategory: subcategoryId,
            region: region,
            district: district,
            page: (pagination?.page || 0) + 1,
            limit: 12,
          })
        );
      }
    },
    [
      loading,
      pagination,
      searchInput,
      categoryId,
      subcategoryId,
      region,
      district,
      dispatch,
    ]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    const currentRef = loadingRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleObserver]);

  // Handle search input
  const handleSearch = (location: string, query: string) => {
    setSearchInput(query);
  };

  // Dynamic empty state message
  const getEmptyStateMessage = () => {
    if (emptyStateMessage) {
      return emptyStateMessage;
    }

    if (searchInput) {
      return `No results found for "${searchInput}".`;
    }

    if (district && region) {
      return `No posts available in ${district}, ${region} at the moment.`;
    } else if (region && categoryId) {
      return `No posts available in ${region} for this category at the moment.`;
    } else if (region) {
      return `No posts available in ${region} at the moment.`;
    } else if (categoryId) {
      return "No posts available in this category at the moment.";
    }

    return "No posts available at the moment.";
  };

  // Render empty state
  if (!farmPosts?.length && !storePosts?.length && !loading) {
    return (
      <div className="container max-w-7xl">
        {showSearch && regions && regions.length > 0 && (
          <div className="mb-4">
            <SearchSection
              regions={regions}
              onSearch={handleSearch}
              initialSearchValue={searchInput}
            />
          </div>
        )}

        <main className="w-full flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-lg font-semibold">{getEmptyStateMessage()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please check back later or{" "}
            {searchInput
              ? "try a different search term"
              : district
              ? "explore other districts"
              : region
              ? "explore other regions"
              : "explore other categories"}
            .
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl">
      {showSearch && regions && regions.length > 0 && (
        <div className="mb-4">
          <SearchSection
            regions={regions}
            onSearch={handleSearch}
            initialSearchValue={searchInput}
          />
        </div>
      )}

      <div className="h-[88vh] overflow-auto flex flex-col gap-6 bg-gray-50 dark:bg-gray-900 p-4">
        {title ? (
          <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
            {title}
          </h1>
        ) : (
          <>
            {searchInput && (
              <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
                Search Results for{" "}
                <span className="text-gray-900 dark:text-white">
                  {searchInput}
                </span>
              </h1>
            )}
            {(region || district) && !categoryId && !searchInput && (
              <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
                Available Listings in{" "}
                <span className="text-gray-900 dark:text-white">
                  {district ? `${district}, ${region}` : region}
                </span>
              </h1>
            )}
          </>
        )}

        {(farmPosts.length > 0 || storePosts.length > 0) && (
          <>
            {farmPosts.length > 0 && (
              <section className="w-full">
                <h2 className="text-2xl font-bold mb-4">
                  Farm Posts{" "}
                  <span className="text-gray-500 font-normal">
                    ({farmPostCount})
                  </span>
                </h2>
                <PostGrid posts={farmPosts} type="farm" />
              </section>
            )}

            {storePosts.length > 0 && (
              <section className="w-full">
                <h2 className="text-2xl font-bold mb-4">
                  Store Posts{" "}
                  <span className="text-gray-500 font-normal">
                    ({storePostCount})
                  </span>
                </h2>
                <PostGrid posts={storePosts} type="store" />
              </section>
            )}
          </>
        )}

        <div ref={loadingRef} className="w-full py-8 flex justify-center">
          {loading && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
        </div>
      </div>
    </div>
  );
}
