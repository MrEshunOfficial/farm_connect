import React from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface IconButtonProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  badgeCount?: number;
  hasNotification?: boolean;
  notificationColor?: string;
  isWishlist?: boolean;
  wishlistUrl?: string;
}

const IconButton = ({
  icon: Icon,
  label,
  onClick,
  href,
  badgeCount,
  hasNotification = false,
  notificationColor = "bg-red-500",
  isWishlist = false,
  wishlistUrl = "/profile/wish_list",
}: IconButtonProps) => {
  const ButtonContent = (
    <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer transition-colors relative">
      {/* Special styling for wishlist heart icon */}
      <Icon
        className={`${isWishlist ? "text-red-500" : "text-foreground"} w-5 h-5`}
        aria-hidden="true"
      />

      {/* Badge with consistent positioning */}
      {badgeCount && badgeCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-1 text-xs"
          variant="outline"
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </Badge>
      )}

      {/* Notification dot with consistent positioning */}
      {hasNotification && !badgeCount && (
        <div
          className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${notificationColor} border border-background`}
          aria-hidden="true"
        />
      )}
    </div>
  );

  // Wrapper to maintain consistent sizing and positioning
  const ButtonWrapper = ({ children }: { children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>
            {label}
            {hasNotification ? " (New)" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Use the wrapper to ensure consistent behavior
  if (isWishlist) {
    return (
      <ButtonWrapper>
        <Link href={wishlistUrl} className="inline-block">
          {ButtonContent}
        </Link>
      </ButtonWrapper>
    );
  }

  return (
    <ButtonWrapper>
      {href ? (
        <Link href={href} className="inline-block">
          {ButtonContent}
        </Link>
      ) : (
        <div onClick={onClick} className="inline-block">
          {ButtonContent}
        </div>
      )}
    </ButtonWrapper>
  );
};

export default IconButton;
