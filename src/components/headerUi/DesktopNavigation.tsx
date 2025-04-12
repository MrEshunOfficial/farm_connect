// DesktopNavigation.tsx
import React from "react";
import {
  MoreHorizontal,
  UserIcon,
  Info,
  Phone,
  ShoppingCartIcon,
  Bell,
  MessageCircle,
  HeartIcon,
} from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Logout from "@/app/authclient/Logout";
import { ThemeToggleButton } from "../ui/ThemeToggle";
import { IUserProfile } from "@/models/profileI-interfaces";
import IconButton from "./HeaderIcons";
import useWishlist from "@/hooks/wishListUtilityHook";
import AuthButtons from "./AuthButtons";

interface DesktopNavigationProps {
  session: Session | null;
  profile: IUserProfile | null;
  totalItems: number;
  hasNotifications: boolean;
  hasMessages: boolean;
  handleNotificationClick: () => void;
  handleMessageClick: () => void;
  handleThemeChange: (theme: string) => void;
}

const DesktopNavigation = ({
  session,
  profile,
  totalItems,
  hasNotifications,
  hasMessages,
  handleNotificationClick,
  handleMessageClick,
  handleThemeChange,
}: DesktopNavigationProps) => {
  // Use the wishlist hook to get the wishlist items
  const { wishlistItems } = useWishlist();

  // Get the length of wishlist items
  const wishlistItemsCount = wishlistItems.length;

  return (
    <>
      <div className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-1 px-4 lg:px-8">
        <TooltipProvider>
          <div className="flex items-center gap-1 lg:gap-3">
            {session && (
              <>
                <IconButton
                  icon={ShoppingCartIcon}
                  label="Shopping Cart"
                  href="/cart"
                  badgeCount={totalItems}
                />
                <IconButton
                  icon={HeartIcon}
                  label="Wishlist"
                  href="/profile/wish_list"
                  badgeCount={wishlistItemsCount}
                />
                <IconButton
                  icon={Bell}
                  label="Notifications"
                  onClick={handleNotificationClick}
                  hasNotification={hasNotifications}
                  notificationColor="bg-red-500"
                />
                <IconButton
                  icon={MessageCircle}
                  label="Messages"
                  href="/messages"
                  onClick={handleMessageClick}
                  hasNotification={hasMessages}
                  notificationColor="bg-blue-500"
                />
              </>
            )}
            <ThemeToggleButton setTheme={handleThemeChange} />
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer">
                  <MoreHorizontal className="text-foreground" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-60 rounded-2xl py-1">
                <div className="flex flex-col text-sm">
                  <Link
                    href="/public-links/about"
                    className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 pb-3 border-b-2"
                  >
                    <Info size={18} />
                    <span>About Us</span>
                  </Link>
                  <Link
                    href="/public-links/contact"
                    className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 mt-1"
                  >
                    <Phone size={18} />
                    <span>Contact Us</span>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer">
                  <Button variant="ghost" size="icon" aria-label="User profile">
                    <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                      <AvatarImage
                        src={
                          profile?.profilePicture?.url ??
                          session?.user?.image ??
                          undefined
                        }
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback>
                        <UserIcon size={18} />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="min-w-60 rounded-2xl p-1 border-none">
                <div className="flex flex-col text-sm gap-3">
                  {session ? (
                    <>
                      <Link
                        href="/profile"
                        className="p-2 hover:bg-secondary hover:rounded-lg transition-colors flex items-center justify-start gap-3 pb-3 border-b-2"
                      >
                        <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                          <AvatarImage
                            src={
                              profile?.profilePicture?.url ||
                              session?.user?.image ||
                              undefined
                            }
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            <UserIcon size={18} />
                          </AvatarFallback>
                        </Avatar>
                        <p className="w-[3/4] truncate flex flex-col leading-7 [&:not(:first-child)]:mt-0 text-sm p-2">
                          <span>{session?.user?.name || "Not Signed In"}</span>
                          <span>{session?.user?.email || ""}</span>
                        </p>
                      </Link>
                      <Logout
                        formClassName="my-custom-form-class"
                        buttonClassName="w-full"
                        buttonVariant="outline"
                        buttonSize="lg"
                        buttonDisabledText="Signing out..."
                        buttonDefaultText="Sign Out"
                        iconSize={18}
                      />
                    </>
                  ) : (
                    <AuthButtons
                      loginHref="/authclient/Login"
                      registerHref="/authclient/Register"
                    />
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </TooltipProvider>
      </div>
    </>
  );
};

export default DesktopNavigation;
