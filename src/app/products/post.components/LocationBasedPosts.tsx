import { AppDispatch, RootState } from "@/store";
import {
  selectPostsLoading,
  selectPostsError,
  selectFilteredPosts,
  fetchAllPosts,
} from "@/store/post.slice";
import { selectPagination } from "@/store/profile.slice";
import { useRef, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostsContainer } from "./PostContainer";

interface PostsPageProps {
  categoryId?: string;
  subcategoryId?: string;
  region?: string;
  district?: string;
}

export function LocationBasedPosts({
  categoryId,
  subcategoryId,
  region,
  district,
}: PostsPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const pagination = useSelector(selectPagination);
  const memoizedPagination = useMemo(
    () => pagination || { page: 0 },
    [pagination]
  ); // Provide default if undefined
  const loadingRef = useRef<HTMLDivElement>(null);

  const { farmPosts, storePosts } = useSelector((state: RootState) =>
    selectFilteredPosts(state, {
      categoryId,
      subcategoryId,
      region,
      district,
    })
  );

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        dispatch(
          fetchAllPosts({
            category: categoryId,
            subcategory: subcategoryId,
            region: region,
            page: (pagination?.page || 0) + 1,
            limit: 12,
          })
        );
      }
    },
    [loading, dispatch, categoryId, subcategoryId, region, pagination?.page]
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

  useEffect(() => {
    dispatch(
      fetchAllPosts({
        category: categoryId,
        subcategory: subcategoryId,
        region: region,
        district: district,
        page: 1,
        limit: 12,
      })
    );
  }, [categoryId, subcategoryId, region, district, dispatch]);

  const getEmptyStateMessage = () => {
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
          <p className="text-lg font-semibold">{getEmptyStateMessage()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please check back later or explore other{" "}
            {district ? "districts" : region ? "regions" : "categories"}.
          </p>
        </main>
      </div>
    );
  }

  return (
    <PostsContainer
      categoryId={categoryId}
      subcategoryId={subcategoryId}
      region={region}
      district={district}
    />
  );
}
