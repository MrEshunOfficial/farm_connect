"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { DynamicPostRendering } from "./DynamicPostRendering";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileDetails, ProfileHeader } from "./ConsolidatedComponents";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

// Redux action imports
import { selectUserProfile, fetchProfileByParams } from "@/store/profile.slice";
import {
  fetchStoreProfileById,
  selectStoreProfile,
  selectStoreLoading,
  selectStoreError,
} from "@/store/store.slice";
import {
  fetchAllPosts,
  fetchStorePostsParam,
  selectUserFarmPosts,
  selectUserStorePosts,
  selectPostsLoading,
  selectPostsError,
  selectAllFarmPosts,
  selectAllStorePosts,
} from "@/store/post.slice";
import { fetchFarmProfiles } from "@/store/farm.slice";
import {
  FarmPostsList,
  StorePostsList,
} from "@/app/products/post.components/StorePostsList";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const paramsId = params.profId as string;

  // Selectors
  const activeProfile = useAppSelector(selectUserProfile);
  const storeProfile = useAppSelector(selectStoreProfile);
  const storeLoading = useAppSelector(selectStoreLoading);
  const storeError = useAppSelector(selectStoreError);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsError = useAppSelector(selectPostsError);
  const farmPosts = useSelector(selectAllFarmPosts);
  const storePosts = useSelector(selectAllStorePosts);

  console.log("Active profile Id: ", activeProfile?.userId);

  const {
    farmProfiles = [],
    currentFarmProfile = null,
    loading: farmLoading = "idle",
    error: farmError = null,
  } = useAppSelector((state) => state.farmProfiles) || {};

  // Effects
  useEffect(() => {
    if (paramsId) {
      dispatch(fetchProfileByParams(paramsId));
    }
  }, [dispatch, paramsId]);

  useEffect(() => {
    dispatch(
      fetchAllPosts({
        page: 1,
        limit: 10,
        userId: activeProfile?.userId,
      })
    );
  }, [dispatch, activeProfile?.userId]);

  useEffect(() => {
    if (!activeProfile?.userId) return;

    const isStoreUser =
      activeProfile.role === "Seller" || activeProfile.role === "Both";
    const isFarmUser =
      activeProfile.role === "Farmer" || activeProfile.role === "Both";

    const fetchData = async () => {
      try {
        if (isStoreUser) {
          await Promise.all([
            dispatch(fetchStoreProfileById(activeProfile.userId)).unwrap(),
            dispatch(
              fetchStorePostsParam({ userId: activeProfile.userId })
            ).unwrap(),
          ]);
        }

        if (isFarmUser) {
          await dispatch(
            fetchFarmProfiles({ userId: activeProfile.userId })
          ).unwrap();
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchData();
  }, [dispatch, activeProfile?.userId, activeProfile?.role]);

  const renderContent = () => {
    if (postsLoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <div className="text-lg">Loading posts...</div>
        </div>
      );
    }

    if (postsError) {
      return (
        <div className="text-red-500 p-4">
          Error loading posts: {postsError}
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
              <div className="text-center p-4">No farm posts available</div>
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
              <div className="text-center p-4">No store posts available</div>
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
                <div className="text-center p-4">No store posts available</div>
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
                <div className="text-center p-4">No farm posts available</div>
              ) : (
                <FarmPostsList farmPosts={farmPosts} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  if (!activeProfile) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-[#F3F5F2] dark:bg-gray-900">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <main className="max-h-[90vh] bg-[#F3F5F2] dark:bg-gray-900 text-[#3D4035] dark:text-gray-200 overflow-auto">
      <div className="container mx-auto flex flex-col justify-between p-2 gap-2">
        <div className="w-full flex items-start justify-between gap-2">
          <Card className="w-1/3 overflow-hidden border-0 shadow-lg">
            <ProfileHeader profile={activeProfile} />
            <ProfileDetails profile={activeProfile} />
          </Card>
          <Card className="h-full border w-3/4 dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Profile Content</CardTitle>
            </CardHeader>
            <CardContent className="w-full max-h-[70vh] overflow-auto">
              <DynamicPostRendering
                activeProfile={activeProfile}
                storeProfile={storeProfile}
                farmProfiles={farmProfiles}
                currentFarmProfile={currentFarmProfile}
                storeLoading={storeLoading}
                storeError={storeError}
                farmLoading={
                  farmLoading === "pending" ? "loading" : farmLoading
                }
                farmError={farmError}
                onTabChange={() => {}}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="w-full shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </main>
  );
}
