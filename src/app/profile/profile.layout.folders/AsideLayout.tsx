"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  UserCircle,
  Tag,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { fetchMyProfile, selectMyProfile } from "@/store/profile.slice";
import { useAppSelector } from "@/store/hooks";
import {
  getNavigationItems,
  NavigationItem,
} from "@/components/navigationItems";
import FooterActions from "./ActionButtons";

interface SidebarProps {
  isMobile?: boolean;
  initialCollapsed?: boolean;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSidebarCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AsideLayout: React.FC<SidebarProps> = ({
  isMobile = false,
  initialCollapsed = false,
  isSidebarOpen = true,
  setIsSidebarOpen,
  setIsSidebarCollapsed,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const activeProfile = useAppSelector(selectMyProfile);

  const [localIsSidebarCollapsed, setLocalIsSidebarCollapsed] =
    useState(initialCollapsed);
  const [localIsSidebarOpen, setLocalIsSidebarOpen] = useState(isSidebarOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const isSidebarCollapsed = setIsSidebarCollapsed
    ? initialCollapsed
    : localIsSidebarCollapsed;
  const actualIsSidebarOpen = setIsSidebarOpen
    ? isSidebarOpen
    : localIsSidebarOpen;

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    setLocalIsSidebarOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  useEffect(() => {
    setLocalIsSidebarCollapsed(initialCollapsed);
  }, [initialCollapsed]);

  const sidebarAnimation = {
    open: {
      width: isMobile ? "100%" : "280px",
      opacity: 1,
      x: 0,
    },
    collapsed: {
      width: isMobile ? "0" : "80px",
      opacity: isMobile ? 0 : 1,
      x: isMobile ? "-100%" : 0,
    },
  };

  const navigationItems = getNavigationItems(activeProfile);

  const toggleSidebar = () => {
    if (isMobile) {
      if (setIsSidebarOpen) {
        setIsSidebarOpen(!actualIsSidebarOpen);
      } else {
        setLocalIsSidebarOpen(!localIsSidebarOpen);
      }
    } else {
      if (setIsSidebarCollapsed) {
        setIsSidebarCollapsed(!isSidebarCollapsed);
      } else {
        setLocalIsSidebarCollapsed(!localIsSidebarCollapsed);
      }
    }
  };

  const toggleExpand = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  const renderProfileContent = () => {
    return (
      <Link href="/profile" className="block">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg">
          <div className="pt-6 pb-12 px-4 relative z-10">
            <div className="flex justify-center">
              <Avatar className="h-20 w-20 ring-1 ring-white dark:ring-gray-800 ring-opacity-50">
                <AvatarImage
                  src={
                    typeof activeProfile?.profilePicture === "string"
                      ? activeProfile?.profilePicture
                      : activeProfile?.profilePicture?.url ||
                        "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  alt={activeProfile?.username || "Profile picture"}
                  className="w-full"
                />
                <AvatarFallback className="bg-white/10 backdrop-blur-sm text-white">
                  <UserCircle size={32} />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-white font-semibold text-lg capitalize">
                {activeProfile?.fullName || session?.user?.name}
              </h2>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Tag size={12} className="text-white/70" />
                <p className="text-white/70 text-sm truncate max-w-full">
                  {activeProfile?.email || "user@gmail.com"}
                </p>
              </div>
            </div>
          </div>
          {/* Abstract shapes for background */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
            <div className="absolute rounded-full h-32 w-32 bg-white -top-10 -right-10"></div>
            <div className="absolute rounded-full h-24 w-24 bg-white -bottom-10 -left-10"></div>
          </div>
        </div>
      </Link>
    );
  };

  const renderCollapsedProfile = () => {
    return (
      <div className="flex justify-center py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={activeProfile ? "/profile" : "/profile/profile_form"}>
                <Avatar className="h-10 w-10 ring-2 ring-indigo-200 dark:ring-indigo-900">
                  {activeProfile && activeProfile.profilePicture ? (
                    <AvatarImage
                      src={
                        typeof activeProfile?.profilePicture === "string"
                          ? activeProfile?.profilePicture
                          : activeProfile?.profilePicture?.url ||
                            "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
                      }
                      alt={activeProfile?.username || "Profile picture"}
                      className="w-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                      <UserCircle size={20} />
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="dark:bg-gray-800 dark:text-gray-200"
            >
              <p>
                {activeProfile
                  ? activeProfile.fullName || session?.user?.name
                  : "Create Profile"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  const renderSearchBar = () => {
    if (isSidebarCollapsed && !isMobile) return null;

    return (
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus-visible:ring-indigo-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    );
  };

  const renderNavigationItem = (item: NavigationItem) => {
    if (!item || (!item.href && !item.subItems)) return null;
    if (item.showIf === false) return null;

    // Render items with sub-items
    if (item.subItems) {
      return (
        <div key={item.label} className="my-1">
          {isSidebarCollapsed && !isMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex justify-center p-2 cursor-pointer rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {item.icon}
                    </motion.div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="dark:bg-gray-800 dark:text-gray-200"
                >
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Collapsible
              open={expandedSection === item.label}
              onOpenChange={() => toggleExpand(item.label)}
              className="rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-2 cursor-pointer rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800 group transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.icon}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      expandedSection === item.label
                        ? "transform rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-2 pl-4 border-l border-dashed border-gray-200 dark:border-gray-700 space-y-1 py-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href || "#"}
                      className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-indigo-50 dark:hover:bg-gray-800 group"
                      aria-label={subItem.ariaLabel}
                      onClick={() => {
                        if (isMobile) {
                          setIsSidebarOpen
                            ? setIsSidebarOpen(false)
                            : setLocalIsSidebarOpen(false);
                        }
                      }}
                    >
                      <span className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {subItem.icon}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm">
                        {subItem.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      );
    }

    // Regular item
    return (
      <TooltipProvider key={item.href}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href || "#"}
              className={`flex items-center ${
                isSidebarCollapsed && !isMobile
                  ? "justify-center p-2"
                  : "gap-3 p-2"
              } rounded-md transition-colors hover:bg-indigo-50 dark:hover:bg-gray-800 group`}
              aria-label={item.ariaLabel}
              onClick={() => {
                if (isMobile) {
                  setIsSidebarOpen
                    ? setIsSidebarOpen(false)
                    : setLocalIsSidebarOpen(false);
                }
              }}
            >
              <span
                className={`text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${
                  isSidebarCollapsed && !isMobile ? "text-lg" : ""
                }`}
              >
                {item.icon}
              </span>

              {(!isSidebarCollapsed || isMobile) && (
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {item.label}
                </span>
              )}

              {/* Example badge - you can conditionally render these */}
              {item.label === "Notifications" && !isSidebarCollapsed && (
                <Badge className="ml-auto bg-indigo-600 hover:bg-indigo-700">
                  3
                </Badge>
              )}
            </Link>
          </TooltipTrigger>
          {isSidebarCollapsed && !isMobile && (
            <TooltipContent
              side="right"
              className="dark:bg-gray-800 dark:text-gray-200"
            >
              <p>{item.label}</p>
              {item.label === "Notifications" && (
                <Badge className="ml-1 bg-indigo-600">3</Badge>
              )}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {isMobile && actualIsSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() =>
            setIsSidebarOpen
              ? setIsSidebarOpen(false)
              : setLocalIsSidebarOpen(false)
          }
        />
      )}

      <motion.aside
        className={`fixed md:relative z-50 h-full overflow-hidden ${
          isMobile ? (actualIsSidebarOpen ? "block" : "hidden") : "flex"
        } flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800`}
        animate={
          (isMobile && !actualIsSidebarOpen) ||
          (!isMobile && isSidebarCollapsed)
            ? "collapsed"
            : "open"
        }
        variants={sidebarAnimation}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          {!isSidebarCollapsed || isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  HB
                </div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                  Harvest Bridge
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isMobile ? <X size={20} /> : <ChevronRight size={20} />}
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Menu size={20} />
              </Button>
            </div>
          )}
        </div>

        <div
          className={`flex-1 overflow-y-auto ${
            isSidebarCollapsed && !isMobile ? "px-2" : "px-4"
          } pb-4`}
        >
          {/* Profile */}
          <div className="my-4">
            {isSidebarCollapsed && !isMobile
              ? renderCollapsedProfile()
              : renderProfileContent()}
          </div>

          {/* Search */}
          <div className="mb-6 mt-4">{renderSearchBar()}</div>

          {/* Navigation */}
          <div className="space-y-1">
            {/* Section Label */}
            {(!isSidebarCollapsed || isMobile) && (
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
                Main Navigation
              </h2>
            )}

            <nav className="space-y-1">
              {navigationItems.map(renderNavigationItem)}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`mt-auto border-t border-gray-100 dark:border-gray-800 ${
            isSidebarCollapsed && !isMobile ? "px-2" : "px-4"
          } pt-4 pb-6`}
        >
          {activeProfile &&
            (isSidebarCollapsed && !isMobile ? (
              <div className="flex justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full h-10 w-10 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400"
                        onClick={toggleSidebar}
                      >
                        <UserCircle size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="dark:bg-gray-800 dark:text-gray-200"
                    >
                      <p>Account Options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <FooterActions activeProfile={activeProfile} />
            ))}
        </div>
      </motion.aside>
    </>
  );
};

export default AsideLayout;
