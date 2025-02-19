// ProfilePage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/store/hooks";
import { selectMyProfile } from "@/store/profile.slice";
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
import { IUserProfile } from "@/models/profileI-interfaces";

export default function ProfilePage() {
  const activeProfile = useAppSelector(selectMyProfile) || ({} as IUserProfile);
  const dispatch = useDispatch<AppDispatch>();
  const storePosts = useSelector(selectAllStorePosts);
  const farmPosts = useSelector(selectAllFarmPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Add state to track if initial fetch has been made
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userId && !hasInitialFetch) {
          await Promise.all([
            dispatch(fetchStorePosts()).unwrap(),
            dispatch(fetchFarmPosts()).unwrap(),
          ]);
          setHasInitialFetch(true);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [dispatch, userId, hasInitialFetch]);

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
    if (loading) {
      return <div>Loading posts...</div>;
    }

    if (error) {
      return <div>Error loading posts: {error}</div>;
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
      <Tabs defaultValue="store-posts" className="w-full ">
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
            <CardContent className="p-2 ">
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
      className="h-[70vh]"
    />
  );
}
