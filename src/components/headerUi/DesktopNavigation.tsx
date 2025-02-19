import React from "react";
import {
  MoreHorizontal,
  UserIcon,
  Info,
  Phone,
  ShoppingBagIcon,
} from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Logout from "@/app/authclient/Logout";
import { ThemeToggleButton } from "../ui/ThemeToggle";

interface IconButtonProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DesktopNavigationProps {
  session: Session | null;
  profile: any;
}

const IconButton = ({ icon: Icon, label, onClick, href }: IconButtonProps) => {
  const ButtonContent = (
    <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer transition-colors">
      <Icon className="text-foreground w-5 h-5" />
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Link href={href}>{ButtonContent}</Link>
          ) : (
            <div onClick={onClick}>{ButtonContent}</div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DesktopNavigation = ({ session, profile }: DesktopNavigationProps) => {
  const { setTheme } = useTheme();

  return (
    <div className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-1 px-4 lg:px-8">
      <TooltipProvider>
        <div className="flex items-center gap-1 lg:gap-3">
          <IconButton
            icon={ShoppingBagIcon}
            label="Market"
            href="/marketplace"
          />

          <ThemeToggleButton setTheme={setTheme} />

          {/* More Menu */}
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

          {/* User Profile Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer">
                <Button variant="ghost" size="icon" aria-label="User profile">
                  <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                    <AvatarImage
                      src={profile?.profilePicture.url || session?.user?.image}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>
                      <UserIcon size={18} />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="min-w-60 rounded-2xl p-1">
              <div className="flex flex-col text-sm gap-3">
                <Link
                  href="/profile"
                  className="p-2 hover:bg-secondary hover:rounded-lg transition-colors flex items-center justify-start gap-3 pb-3 border-b-2"
                >
                  <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                    <AvatarImage
                      src={
                        profile?.profilePicture ||
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
                {!session ? (
                  <Button>
                    <Link href="/authclient/Login">SignUp</Link>
                  </Button>
                ) : (
                  <Logout
                    formClassName="my-custom-form-class"
                    buttonClassName="w-full"
                    buttonVariant="outline"
                    buttonSize="lg"
                    buttonDisabledText="Signing out..."
                    buttonDefaultText="Sign Out"
                    iconSize={18}
                  />
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default DesktopNavigation;
