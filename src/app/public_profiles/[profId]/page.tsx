// ProfilePage.tsx - Main component
"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useSelector } from "react-redux";

import { Skeleton } from "@/components/ui/skeleton";

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
import { IUserProfile, UserRole } from "@/models/profileI-interfaces";
import ProfileContent from "./ProfileContent";
import ProfileSidebar from "./ProfileSidebar";

// Extended interface for UI display purposes
export interface ExtendedUserProfile extends IUserProfile {
  listingsCount?: number;
  averageRating?: number;
}

// Define farm profiles state type
interface FarmProfilesState {
  farmProfiles: any[];
  currentFarmProfile: any | null;
  loading: string;
  error: string | null;
}

// Main Profile Page Component
export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const paramsId = params.profId as string;

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

  // Effects
  useEffect(() => {
    if (paramsId) {
      dispatch(fetchProfileByParams(paramsId));
    }
  }, [dispatch, paramsId]);

  useEffect(() => {
    if (activeProfile?.userId) {
      dispatch(
        fetchAllPosts({
          page: 1,
          limit: 10,
          userId: activeProfile.userId,
        })
      );
    }
  }, [dispatch, activeProfile?.userId]);

  useEffect(() => {
    if (!activeProfile?.userId) return;

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
  }, [dispatch, activeProfile?.userId, activeProfile?.role]);

  if (!activeProfile) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-[#F3F5F2] dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <main className="max-h-[90vh] bg-[#F3F5F2] dark:bg-gray-900 text-[#3D4035] dark:text-gray-200 overflow-auto py-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileSidebar profile={activeProfile} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <ProfileContent
              activeProfile={activeProfile}
              postsLoading={postsLoading}
              postsError={postsError}
              farmPosts={farmPosts}
              storePosts={storePosts}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
