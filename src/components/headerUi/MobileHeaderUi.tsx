// MobileHeaderUi.tsx
import React from "react";
import {
  MoreHorizontal,
  UserIcon,
  Sun,
  Moon,
  Laptop,
  Phone,
  Info,
  ShoppingBagIcon,
  HeartIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Session } from "next-auth";
import Logout from "@/app/authclient/Logout";
import { IUserProfile } from "@/models/profileI-interfaces";
import AuthButtons from "./AuthButtons";

interface MobileMenuProps {
  isOpen: boolean;
  profile: IUserProfile | null;
  session?: Session | null;
  handleThemeChange: (theme: string) => void;
}

const MobileHeaderUi = ({
  isOpen,
  profile,
  session,
  handleThemeChange,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden space-y-4 pt-4 border-t">
      <div className="flex justify-between items-center gap-4 px-4">
        <div className="flex flex-col items-center cursor-pointer">
          <ShoppingBagIcon className="mb-1 text-foreground" />
          <Link href="/cart" className="text-xs">
            Shopping Cart
          </Link>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <HeartIcon className="mb-1 text-foreground" />
          <Link href="/profile/wish_list" className="text-xs">
            Wishlist
          </Link>
        </div>
        {/* More Menu */}
        <div className="flex flex-col items-center cursor-pointer">
          <Popover>
            <PopoverTrigger asChild>
              <div className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-secondary cursor-pointer">
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
                  className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 my-2 border-b-2"
                >
                  <Phone size={18} />
                  <span>Contact Us</span>
                </Link>

                {/* Theme Selector */}
                <div className="p-2 hover:bg-secondary transition-colors">
                  <Popover>
                    <PopoverTrigger className="w-full flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Sun className="rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
                      </Button>
                      <span>Change Theme</span>
                    </PopoverTrigger>
                    <PopoverContent align="center" className="w-36">
                      <Button
                        onClick={() => handleThemeChange("light")}
                        className="flex w-full items-center justify-start gap-3 p-2"
                        variant="ghost"
                      >
                        <Sun className="h-5 w-5" />
                        <span>Light</span>
                      </Button>
                      <Button
                        onClick={() => handleThemeChange("dark")}
                        className="flex w-full items-center justify-start gap-3 p-2 my-1"
                        variant="ghost"
                      >
                        <Moon className="h-5 w-5" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        onClick={() => handleThemeChange("system")}
                        className="flex w-full items-center justify-start gap-3 p-2"
                        variant="ghost"
                      >
                        <Laptop className="h-5 w-5" />
                        <span>System</span>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-sm">More</span>
        </div>

        {/* Profile Menu */}
        <div className="flex flex-col items-center cursor-pointer">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User profile"
                className="w-9 h-9"
              >
                <Avatar className="h-full w-full border border-border rounded-full shadow-md">
                  <AvatarImage
                    src={
                      typeof profile?.profilePicture === "object"
                        ? profile.profilePicture.url
                        : typeof profile?.profilePicture === "string"
                        ? profile.profilePicture
                        : session?.user?.image || undefined
                    }
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback>
                    <UserIcon size={18} />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-60 rounded-2xl p-1">
              <div className="flex flex-col text-sm gap-3">
                <Link
                  href="/profile"
                  className="p-2 hover:bg-secondary hover:rounded-lg transition-colors flex items-center gap-3 pb-3 border-b-2"
                >
                  <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                    <AvatarImage
                      src={
                        typeof profile?.profilePicture === "object"
                          ? profile.profilePicture.url
                          : typeof profile?.profilePicture === "string"
                          ? profile.profilePicture
                          : session?.user?.image || undefined
                      }
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>
                      <UserIcon size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate flex flex-col leading-7">
                    <span>{session?.user?.name || "Not Signed In"}</span>
                    <span>{session?.user?.email || ""}</span>
                  </div>
                </Link>
                {session ? (
                  <Logout
                    formClassName="my-custom-form-class"
                    buttonClassName="w-full"
                    buttonVariant="outline"
                    buttonSize="lg"
                    buttonDisabledText="Signing out..."
                    buttonDefaultText="Sign Out"
                    iconSize={18}
                  />
                ) : (
                  <AuthButtons
                    loginHref="/authclient/Login"
                    registerHref="/authclient/Register"
                  />
                )}
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-sm">profile</span>
        </div>
      </div>
    </div>
  );
};

export default MobileHeaderUi;
