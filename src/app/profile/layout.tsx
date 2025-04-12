// Layout.tsx - Updated version (No Timeout)
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useSession } from "next-auth/react";
import {
  fetchMyProfile,
  selectMyProfile,
  selectUserProfileLoading,
} from "@/store/profile.slice";
import AsideLayout from "./profile.layout.folders/AsideLayout";
import { useAppSelector } from "@/store/hooks";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const activeProfile = useAppSelector(selectMyProfile);
  const profileLoadingStatus = useAppSelector(selectUserProfileLoading);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  useEffect(() => {
    if (
      session?.user &&
      profileLoadingStatus !== "succeeded" &&
      profileLoadingStatus !== "pending" &&
      !hasAttemptedFetch
    ) {
      dispatch(fetchMyProfile());
      setHasAttemptedFetch(true);
    }
  }, [dispatch, session, profileLoadingStatus, hasAttemptedFetch]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (profileLoadingStatus === "pending" && !hasAttemptedFetch) {
    return (
      <motion.main className="w-full h-[88vh] bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <h1 className="text-2xl font-semibold">Loading...</h1>
          <p className="text-gray-600">
            Please wait while we fetch your information
          </p>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main className="w-full h-[88vh] flex flex-col md:flex-row items-stretch gap-2 dark:bg-black text-gray-900 dark:text-gray-100">
      <AsideLayout
        isMobile={isMobile}
        initialCollapsed={isSidebarCollapsed}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <motion.section
        layout
        className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg p-2 h-full"
      >
        <main className="flex-1 overflow-auto pt-2">{children}</main>
      </motion.section>
    </motion.main>
  );
};

export default Layout;
