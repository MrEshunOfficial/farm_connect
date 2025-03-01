"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

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
import ProfileContent from "./ProfileContent";
import ProfileSidebar from "./ProfileSidebar";
import DynamicProfileRendering from "./DynamicPostRendering";

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

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const paramsId = params.profId as string;
  const [activeTab, setActiveTab] = useState<string>("farms");
  const [activeContent, setActiveContent] = useState<string>("profiles");

  // Selectors
  const activeProfile = useAppSelector(
    selectUserProfile
  ) as ExtendedUserProfile;
  const storeProfile = useAppSelector(selectStoreProfile);
  const storeLoading = useAppSelector(selectStoreLoading);
  const storeError = useAppSelector(selectStoreError);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsError = useAppSelector(selectPostsError);
  const farmPosts = useSelector(selectAllFarmPosts);
  const storePosts = useSelector(selectAllStorePosts);

  const {
    farmProfiles = [],
    currentFarmProfile = null,
    loading: farmLoading = "idle",
    error: farmError = null,
  } = useAppSelector(
    (state: RootState) => state.farmProfiles as FarmProfilesState
  );

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

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleContentRender = (value: string) => {
    setActiveContent(value);
  };

  // Loading state
  if (!activeProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F5F2] dark:bg-gray-900">
        <div className="container p-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="md:col-span-3">
              <Skeleton className="h-16 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/3 mb-6" />
              <Skeleton className="h-12 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="h-[88vh] overflow-auto bg-[#F3F5F2] dark:bg-gray-900 text-[#3D4035] dark:text-gray-200 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="max-h-[85vh] overflow-auto md:col-span-1 space-y-2">
            <ProfileSidebar profile={activeProfile} paramsId={paramsId} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Tabs
                  defaultValue={activeContent}
                  onValueChange={handleContentRender}
                  className="w-full p-1"
                >
                  <TabsList className="w-full grid grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                    <TabsTrigger
                      value="profiles"
                      className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 rounded-md"
                    >
                      Profiles
                    </TabsTrigger>
                    <TabsTrigger
                      value="listings"
                      className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 rounded-md"
                    >
                      Listings
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profiles" className="mt-2 space-y-4">
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

                  <TabsContent value="listings" className="mt-2">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
