import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, AlertCircle } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllPosts,
  selectPostsLoading,
  selectPostsError,
  selectPagination,
  selectFilteredPosts,
  selectCategoryName,
  selectSubcategoryName,
} from "@/store/post.slice";
import { Card } from "@/components/ui/card";
import { PostGrid } from "./PostGrid";

interface PostsPageProps {
  categoryId: string;
  subcategoryId?: string;
}

export function PostsPage({ categoryId, subcategoryId }: PostsPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const pagination = useSelector(selectPagination);
  const loadingRef = useRef<HTMLDivElement>(null);

  const { farmPosts, storePosts } = useSelector((state: RootState) =>
    selectFilteredPosts(state, { categoryId, subcategoryId })
  );

  const categoryName = useSelector((state: RootState) =>
    selectCategoryName(state, categoryId)
  );
  const subcategoryName = useSelector((state: RootState) =>
    subcategoryId ? selectSubcategoryName(state, subcategoryId) : undefined
  );

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading && pagination?.hasNextPage) {
        dispatch(
          fetchAllPosts({
            category: categoryId,
            subcategory: subcategoryId,
            page: (pagination.page || 0) + 1,
            limit: 12,
          })
        );
      }
    },
    [loading, pagination, categoryId, subcategoryId, dispatch]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    dispatch(
      fetchAllPosts({
        category: categoryId,
        subcategory: subcategoryId,
        page: 1,
        limit: 12,
      })
    );
  }, [categoryId, subcategoryId, dispatch]);

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <Card className="w-full p-4 border-destructive/50 bg-destructive/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!farmPosts?.length && !storePosts?.length && !loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
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
          <p className="text-lg font-semibold">
            No posts available in this category at the moment.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please check back later or explore other categories.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl h-[88vh] overflow-auto flex flex-col gap-6 bg-gray-50 dark:bg-gray-900 p-4">
      {(categoryId || subcategoryId) && (
        <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
          Exploring{" "}
          <span className="text-gray-900 dark:text-white">
            {subcategoryName
              ? `${subcategoryName}, ${categoryName}`
              : categoryName}
          </span>{" "}
          Posts
        </h1>
      )}

      {(farmPosts.length > 0 || storePosts.length > 0) && (
        <>
          {farmPosts.length > 0 && (
            <section className="w-full">
              <h2 className="text-2xl font-bold mb-4">Farm Posts</h2>
              <PostGrid posts={farmPosts} type="farm" />
            </section>
          )}
          {storePosts.length > 0 && (
            <section className="w-full">
              <h2 className="text-2xl font-bold mb-4">Store Posts</h2>
              <PostGrid posts={storePosts} type="store" />
            </section>
          )}
        </>
      )}
      <div ref={loadingRef} className="w-full py-8 flex justify-center">
        {loading && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
      </div>
    </div>
  );
}
