// MainHeader.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useApi } from "@/hooks/useApi";
import { ApiService } from "@/services/api-service";
import { Region } from "@/store/type/apiTypes";
import { Button } from "@/components/ui/button";
import SearchSection from "./SearchSection";
import MobileHeaderUi from "./MobileHeaderUi";
import { Alert, AlertDescription } from "../ui/alert";
import DesktopNavigation from "./DesktopNavigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "../ui/skeleton";
import { selectMyProfile, fetchMyProfile } from "@/store/profile.slice";
import { useTheme } from "next-themes";
import { fetchCart, selectCartTotalItems } from "@/store/cart.slice";

function CategorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="pl-4 space-y-2">
          <Skeleton className="h-8 w-3/4 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function MainHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session, status } = useSession();
  const myProfile = useSelector(selectMyProfile);
  const [mounted, setMounted] = useState(false);
  const { data: regions, loading, error, execute } = useApi<Region[]>();
  const { setTheme } = useTheme();
  const totalItems = useSelector(selectCartTotalItems);

  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasMessages, setHasMessages] = useState(true);

  useEffect(() => {
    if (session && !myProfile) {
      dispatch(fetchMyProfile());
    }
  }, [dispatch, myProfile, session, status]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const apiService = new ApiService();
    execute(() => apiService.getRegions());
  }, [execute]);

  // Cart and notification effects (moved from DesktopNavigation)
  useEffect(() => {
    if (session) {
      dispatch(fetchCart());
    }

    const notificationInterval = setInterval(() => {
      setHasNotifications((prev) => !prev);
    }, 30000);

    return () => clearInterval(notificationInterval);
  }, [dispatch, session]);

  // Handlers (moved from child components)
  const handleNotificationClick = () => {
    setHasNotifications(false);
  };

  const handleMessageClick = () => {
    setHasMessages(false);
  };

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) return <CategorySkeleton />;
  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!mounted) {
    return (
      <div className="bg-background/80 backdrop-blur-sm transition-colors">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <h2 className="scroll-m-20 font-extrabold tracking-tight text-xl sm:text-2xl md:text-3xl text-foreground">
                Harvest Bridge
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="scroll-m-20 font-extrabold tracking-tight text-xl text-foreground hover:text-primary transition-colors"
            >
              Harvest Bridge
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Find or Sell a Product
                  </span>
                  {isSearchOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[50vw] p-0"
                align="center"
                sideOffset={8}
              >
                {regions && (
                  <SearchSection regions={regions} profile={myProfile} />
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-4">
            <DesktopNavigation
              session={session}
              profile={myProfile}
              totalItems={totalItems}
              hasNotifications={hasNotifications}
              hasMessages={hasMessages}
              handleNotificationClick={handleNotificationClick}
              handleMessageClick={handleMessageClick}
              handleThemeChange={handleThemeChange}
            />
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="hover:bg-secondary/80"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <MobileHeaderUi
            isOpen={isMobileMenuOpen}
            profile={myProfile}
            handleThemeChange={handleThemeChange}
            session={session}
          />
        )}
      </div>
    </div>
  );
}
