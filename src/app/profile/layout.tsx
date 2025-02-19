"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Link from "next/link";
import { Search, Bell, Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import { fetchMyProfile } from "@/store/profile.slice";
import AsideLayout from "./profile.layout.folders/AsideLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle responsive states
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

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <motion.main className="w-full h-full flex flex-col md:flex-row items-stretch gap-2 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AsideLayout />

      {/* Main Content */}
      <motion.section
        layout
        className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg p-2 h-full "
      >
        <header className="sticky top-0 z-30 w-full backdrop-blur-sm bg-white/75 dark:bg-gray-900/75 border-b shadow-sm dark:border-gray-700">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                className="dark:hover:bg-gray-800"
              >
                <Menu size={20} />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative dark:hover:bg-gray-800"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Link href="/" className="dark:hover:bg-gray-800 p-2 rounded-lg">
                <Home size={20} />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">{children}</main>
      </motion.section>
    </motion.main>
  );
};

export default Layout;
