"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

// UI Components
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Redux action imports
import {
  selectUserProfile,
  fetchProfileByParams,
  selectViewedProfile,
} from "@/store/profile.slice";
import {
  fetchStoreProfileById,
  selectStoreProfile,
  selectStoreLoading,
  selectStoreError,
} from "@/store/store.slice";

import {
  fetchAllPosts,
  fetchStorePostsParam,
  selectAllFarmPosts,
  selectAllStorePosts,
  selectPostsLoading,
  selectPostsError,
} from "@/store/post.slice";

import { fetchFarmProfiles } from "@/store/farm.slice";

// Import interfaces
import {
  IFarmProfile,
  IUserProfile,
  UserRole,
} from "@/models/profileI-interfaces";

// Component imports
import ProfileContent from "./ProfileContent";
import ProfileSidebar from "./ProfileSidebar";
import DynamicProfileRendering from "./DynamicPostRendering";

// Types
export interface ExtendedUserProfile extends IUserProfile {
  listingsCount?: number;
  averageRating?: number;
  paramsId: string;
}

interface FarmProfilesState {
  farmProfiles: IFarmProfile[];
  currentFarmProfile: IFarmProfile | null;
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export default function PublicProfilePage() {
  // Hooks
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const paramsId = params.profId as string;

  // State
  const [activeTab, setActiveTab] = useState<string>("farms");
  const [activeContent, setActiveContent] = useState<string>("profiles");

  // Selectors
  const activeProfile = useAppSelector(
    selectViewedProfile
  ) as ExtendedUserProfile;

  const storeProfile = useAppSelector(selectStoreProfile);
  const storeLoading = useAppSelector(selectStoreLoading);
  const storeError = useAppSelector(selectStoreError);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsError = useAppSelector(selectPostsError);
  const farmPosts = useAppSelector(selectAllFarmPosts);
  const storePosts = useAppSelector(selectAllStorePosts);

  const {
    farmProfiles = [],
    currentFarmProfile = null,
    loading: farmLoading = "idle",
    error: farmError = null,
  } = useAppSelector(
    (state: RootState) => state.farmProfiles as FarmProfilesState
  );

  // Data fetching
  useEffect(() => {
    if (paramsId) {
      dispatch(fetchProfileByParams(paramsId));
    }
  }, [dispatch, paramsId]);

  useEffect(() => {
    if (paramsId) {
      dispatch(
        fetchAllPosts({
          page: 1,
          limit: 10,
          userId: paramsId,
        })
      );
    }
  }, [dispatch, paramsId]);

  useEffect(() => {
    if (!activeProfile?.userId || !paramsId) return;

    const isStoreUser =
      activeProfile.role === UserRole.Seller ||
      activeProfile.role === UserRole.Both;

    const isFarmUser =
      activeProfile.role === UserRole.Farmer ||
      activeProfile.role === UserRole.Both;

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
  }, [dispatch, activeProfile?.userId, activeProfile?.role, paramsId]);

  // Event handlers
  const handleTabChange = (value: string) => setActiveTab(value);
  const handleContentRender = (value: string) => setActiveContent(value);

  // Loading state
  if (!activeProfile) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="h-[88vh] py-4">
      <div className="container mx-auto max-w-7xl px-2 sm:px-6">
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-160px)]">
              {/* Sidebar - Fixed position on large screens */}
              <div className="lg:col-span-4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="sticky top-0 p-6 max-h-[85vh] overflow-auto space-y-3">
                  <ProfileSidebar profile={activeProfile} paramsId={paramsId} />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-8 bg-white dark:bg-gray-900">
                <div className="p-6">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeProfile.username ||
                        activeProfile.fullName ||
                        "User Profile"}
                    </CardTitle>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {activeProfile.bio || "No bio available"}
                    </p>
                  </CardHeader>

                  <Separator className="my-4" />

                  {/* Tabs Navigation */}
                  <Tabs
                    defaultValue={activeContent}
                    onValueChange={handleContentRender}
                    className="w-full"
                  >
                    <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <TabsTrigger
                        value="profiles"
                        className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 data-[state=active]:shadow-sm rounded-md py-2"
                      >
                        Profiles
                      </TabsTrigger>
                      <TabsTrigger
                        value="listings"
                        className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 data-[state=active]:shadow-sm rounded-md py-2"
                      >
                        Listings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="profiles"
                      className="mt-2 space-y-4 animate-in fade-in-50"
                    >
                      <DynamicProfileRendering
                        activeProfile={activeProfile}
                        storeProfile={storeProfile}
                        farmProfiles={farmProfiles}
                        currentFarmProfile={currentFarmProfile}
                        storeLoading={storeLoading}
                        storeError={storeError}
                        farmLoading={farmLoading}
                        farmError={farmError}
                        onTabChange={handleTabChange}
                      />
                    </TabsContent>

                    <TabsContent
                      value="listings"
                      className="mt-2 animate-in fade-in-50"
                    >
                      <ProfileContent
                        activeProfile={activeProfile}
                        postsLoading={postsLoading}
                        postsError={postsError}
                        farmPosts={farmPosts}
                        storePosts={storePosts}
                        activeTab={activeTab}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// Extracted skeleton loader component for better organization
function ProfileSkeleton() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-160px)]">
              {/* Sidebar skeleton */}
              <div className="lg:col-span-4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
                <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Main content skeleton */}
              <div className="lg:col-span-8 p-6 bg-white dark:bg-gray-900">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />

                <Skeleton className="h-12 w-64 mx-auto mb-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>

                <div className="mt-8">
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <Skeleton className="h-32 w-full rounded-lg mb-4" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
