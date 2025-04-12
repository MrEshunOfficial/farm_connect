// ProfilePage.tsx - Updated version
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/store/hooks";
import {
  selectMyProfile,
  selectUserProfileLoading,
} from "@/store/profile.slice";
import { StorePostsList } from "@/app/products/post.components/StorePostsList";
import { FarmPostsList } from "@/app/products/post.components/StorePostsList";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFarmPosts,
  fetchStorePosts,
  selectAllFarmPosts,
  selectAllStorePosts,
  selectPostsError,
  selectPostsLoading,
} from "@/store/post.slice";
import { AppDispatch } from "@/store";
import { useSession } from "next-auth/react";
import ProfileCard from "./ProfileCard";

export default function ProfilePage() {
  const activeProfile = useAppSelector(selectMyProfile);
  const profileLoadingStatus = useAppSelector(selectUserProfileLoading);
  const dispatch = useDispatch<AppDispatch>();
  const storePosts = useSelector(selectAllStorePosts);
  const farmPosts = useSelector(selectAllFarmPosts);
  const error = useSelector(selectPostsError);
  const postsLoading = useSelector(selectPostsLoading);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      // Only fetch posts if we have a user ID, active profile, and haven't fetched already
      if (userId && activeProfile && !hasInitialFetch && !loading) {
        setLoading(true);

        try {
          const results = await Promise.allSettled([
            dispatch(fetchStorePosts()).unwrap(),
            dispatch(fetchFarmPosts()).unwrap(),
          ]);

          const rejected = results.filter((r) => r.status === "rejected");
          if (rejected.length > 0) {
            console.error("Some post fetches failed:", rejected);
            setFetchError("Some posts couldn't be loaded");
          }

          setHasInitialFetch(true);
        } catch (err) {
          console.error("Error fetching posts:", err);
          setFetchError(err instanceof Error ? err.message : "Unknown error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPosts();
  }, [dispatch, userId, hasInitialFetch, activeProfile, loading]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setHasInitialFetch(true);
        setFetchError("Loading timed out. Please try refreshing the page.");
        console.warn("Loading posts timed out");
      }, 15000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  if (profileLoadingStatus === "pending") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-3">No Profile Found</h2>
          <p className="mb-4">You don&apos;t have an active profile yet.</p>
          <a
            href="/profile/profile_form"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Profile
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Ads Posted",
      value:
        activeProfile?.role === "Farmer"
          ? farmPosts.length
          : activeProfile?.role === "Both"
          ? Math.floor(storePosts.length + farmPosts.length)
          : storePosts.length,
    },
    { label: "Items Sold", value: 0 },
    { label: "Wishlist", value: 0 },
  ];

  const renderContent = () => {
    if (error || fetchError) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          Error loading posts: {error || fetchError}
          <button
            className="ml-2 text-blue-600 underline"
            onClick={() => {
              setHasInitialFetch(false);
              setFetchError(null);
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (activeProfile?.role === "Farmer") {
      return (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Farm Listings ({farmPosts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {farmPosts.length === 0 ? (
              <div>No farm posts available</div>
            ) : (
              <FarmPostsList farmPosts={farmPosts} />
            )}
          </CardContent>
        </Card>
      );
    }

    if (activeProfile?.role === "Seller") {
      return (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Store Listings ({storePosts.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {storePosts.length === 0 ? (
              <div>No store posts available</div>
            ) : (
              <StorePostsList storePosts={storePosts} />
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <Tabs defaultValue="store-posts" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-3">
          <TabsTrigger value="store-posts">
            Store Listings ({storePosts.length})
          </TabsTrigger>
          <TabsTrigger value="farm-posts">
            Farm Listings ({farmPosts.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="store-posts">
          <Card>
            <CardHeader className="bg-yellow-700">
              <CardTitle>Store Listings</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {storePosts.length === 0 ? (
                <div>No store posts available</div>
              ) : (
                <StorePostsList storePosts={storePosts} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="farm-posts">
          <Card>
            <CardHeader className="bg-yellow-700">
              <CardTitle>Farm Listings</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {farmPosts.length === 0 ? (
                <div>No farm posts available</div>
              ) : (
                <FarmPostsList farmPosts={farmPosts} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <ProfileCard
      profile={activeProfile}
      stats={stats}
      renderContent={renderContent}
      className="h-[60vh]"
    />
  );
}
