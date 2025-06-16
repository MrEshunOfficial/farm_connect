"use client";
import { AppDispatch, RootState } from "@/store";
import {
  selectPostsLoading,
  selectFilteredPosts,
  fetchAllPosts,
} from "@/store/post.slice";
import { selectPagination } from "@/store/profile.slice";
import { useRef, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import SearchSection from "@/components/headerUi/SearchSection";
import { PostsContainer } from "./PostContainer";

interface PostsPageProps {
  search?: string;
  regions?: any[];
}

export default function RenderSearchPosts({
  search,
  regions = [],
}: PostsPageProps) {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectPostsLoading);
  const pagination = useSelector(selectPagination);
  const loadingRef = useRef<HTMLDivElement>(null);

  const queryParam = searchParams?.get("q") || "";
  const initialSearchValue = search || queryParam || "";
  const [searchInput, setSearchInput] = useState(initialSearchValue);

  const { farmPosts, storePosts } = useSelector((state: RootState) =>
    selectFilteredPosts(state, {
      searchQuery: searchInput,
    })
  );

  useEffect(() => {
    setSearchInput(initialSearchValue);
  }, [initialSearchValue]);

  useEffect(() => {
    dispatch(
      fetchAllPosts({
        searchQuery: searchInput,
        page: 1,
        limit: 12,
      })
    );
  }, [searchInput, dispatch]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        dispatch(
          fetchAllPosts({
            searchQuery: searchInput,
            page: (pagination?.page || 0) + 1,
            limit: 12,
          })
        );
      }
    },
    [loading, pagination, searchInput, dispatch]
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

  const handleSearch = (location: string, query: string) => {
    setSearchInput(query);
  };

  const getEmptyStateMessage = () => {
    if (searchInput) {
      return `No results found for "${searchInput}".`;
    }
    return "No posts available at the moment.";
  };

  if (!farmPosts?.length && !storePosts?.length && !loading) {
    return (
      <div className="container max-w-7xl">
        {regions && regions.length > 0 && (
          <div className="mb-4">
            <SearchSection
              profile={null}
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
            Please check back later or try a different search term.
          </p>
        </main>
      </div>
    );
  }

  return <PostsContainer search={search} regions={regions} showSearch={true} />;
}
