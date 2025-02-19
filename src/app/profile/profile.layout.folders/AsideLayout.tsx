import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { UserCircle, Tag, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { fetchMyProfile, selectMyProfile } from "@/store/profile.slice";
import { useAppSelector } from "@/store/hooks";
import { getNavigationItems, NavigationItem } from "@/lib/navigationItems";
import FooterActions from "./ActionButtons";

interface SidebarProps {
  isMobile?: boolean;
  initialCollapsed?: boolean;
}

const AsideLayout: React.FC<SidebarProps> = ({
  isMobile = false,
  initialCollapsed = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const activeProfile = useAppSelector(selectMyProfile);

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(initialCollapsed);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const sidebarAnimation = {
    open: {
      width: isMobile ? "100%" : "24rem",
      opacity: 1,
      x: 0,
    },
    collapsed: {
      width: isMobile ? "0" : "5rem",
      opacity: isMobile ? 0 : 0.9,
      x: isMobile ? "-100%" : 0,
    },
  };

  const navigationItems = getNavigationItems(activeProfile);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const renderProfileContent = () => {
    if (!activeProfile) {
      return (
        <Link href={"/profile/profile_form"} className="block">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-1">
            <Avatar className="w-full h-32 md:h-48 rounded-lg">
              <AvatarFallback className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500">
                <UserCircle size={32} />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <h2 className="text-white font-semibold truncate">
                Create Profile
              </h2>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <Tag size={14} />
                User
              </p>
            </div>
          </div>
        </Link>
      );
    }
    return (
      <Link href={`/profile`} className="block">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-1">
          <Avatar className="w-full h-32 md:h-48 rounded-lg">
            <AvatarImage
              src={
                typeof activeProfile?.profilePicture === "string"
                  ? activeProfile?.profilePicture
                  : activeProfile?.profilePicture?.url ||
                    "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt={activeProfile?.username || "Profile picture"}
              className="object-cover w-full h-full"
            />
          </Avatar>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <h2 className="text-white font-semibold truncate">
              {activeProfile?.fullName || session?.user?.name}
            </h2>
            <p className="text-white/80 text-sm flex items-center gap-2">
              <Tag size={14} />
              {activeProfile?.email || "user@gmail.com"}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const renderNavigationItem = (item: NavigationItem) => {
    if (!item || (!item.href && !item.subItems)) return null;
    if (item.showIf === false) return null;

    if (item.subItems) {
      return (
        <div key={item.label} className="space-y-1 ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isSidebarCollapsed && !isMobile ? "justify-center" : ""
                  }`}
                >
                  <AnimatePresence>
                    {(!isSidebarCollapsed || isMobile) && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="w-full flex items-center justify-between cursor-pointer"
                          >
                            <span className="flex items-center justify-start gap-2">
                              <>{item.icon}</>
                              <>{item.label}</>
                            </span>
                            <ChevronDown size={16} className="mr-3" />
                          </motion.div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2 mt-3 text-md">
                          {/* Sub-items */}
                          {item.subItems.map((subItem) => (
                            <TooltipProvider key={subItem.href}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={subItem.href || "#"}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                                      hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 group
                                      ${
                                        isSidebarCollapsed && !isMobile
                                          ? "justify-center"
                                          : "pl-8"
                                      }`}
                                    aria-label={subItem.ariaLabel}
                                    onClick={() =>
                                      isMobile && setIsSidebarOpen(false)
                                    }
                                  >
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    >
                                      {subItem.icon}
                                    </motion.div>
                                    <AnimatePresence>
                                      {(!isSidebarCollapsed || isMobile) && (
                                        <motion.span
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -10 }}
                                          className="font-medium dark:text-gray-300 text-sm"
                                        >
                                          {subItem.label}
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </Link>
                                </TooltipTrigger>
                                {isSidebarCollapsed && !isMobile && (
                                  <TooltipContent className="dark:bg-gray-800 dark:text-gray-300">
                                    <p>{subItem.label}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </PopoverContent>
                      </Popover>
                    )}
                  </AnimatePresence>
                </div>
              </TooltipTrigger>
              {isSidebarCollapsed && !isMobile && (
                <TooltipContent className="dark:bg-gray-800 dark:text-gray-300">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
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
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 group
                ${isSidebarCollapsed && !isMobile ? "justify-center" : ""}`}
              aria-label={item.ariaLabel}
              onClick={() => isMobile && setIsSidebarOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm"
              >
                {item.icon}
              </motion.div>
              <AnimatePresence>
                {(!isSidebarCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium dark:text-gray-300"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </TooltipTrigger>
          {isSidebarCollapsed && !isMobile && (
            <TooltipContent className="dark:bg-gray-800 dark:text-gray-300">
              <p>{item.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <motion.aside
        className={`fixed md:relative z-50 h-full bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden ${
          isMobile ? (isSidebarOpen ? "block" : "hidden") : ""
        }`}
        animate={
          (isMobile && !isSidebarOpen) || (!isMobile && isSidebarCollapsed)
            ? "collapsed"
            : "open"
        }
        variants={sidebarAnimation}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full p-4 gap-6">
          {/* Profile Section */}
          <AnimatePresence>
            {!isSidebarCollapsed && !isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative group"
              >
                {renderProfileContent()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map(renderNavigationItem)}
          </nav>

          {/* Footer Actions */}
          <div className="space-y-3">
            {activeProfile && <FooterActions activeProfile={activeProfile} />}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="absolute top-4 right-4 z-10 md:hidden"
            >
              {isSidebarOpen ? "Close" : "Menu"}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AsideLayout;
