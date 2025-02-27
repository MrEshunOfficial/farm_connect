import React, { useState, useEffect } from "react";
import { BadgeCheck, BadgeInfo, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectUserProfileLoading,
  selectUserProfile,
  verifyUserProfile,
} from "@/store/profile.slice";
import { UserRole } from "@/models/profileI-interfaces";

interface VerificationBadgeProps {
  verified?: boolean;
  userId?: string;
  className?: string;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verified: propVerified,
  userId,
  className = "",
  interactive = true,
  size = "md",
  showText = false,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUserProfileLoading);
  const currentProfile = useSelector(selectUserProfile);

  const [isHovered, setIsHovered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // If verified prop is provided, use it; otherwise, use the current profile's verification status
  const verified =
    propVerified !== undefined ? propVerified : currentProfile?.verified;

  // Handle verification request
  const handleVerification = () => {
    if (userId && !verified && interactive) {
      setIsVerifying(true);
      dispatch(verifyUserProfile(userId) as any).finally(() => {
        setIsVerifying(false);
      });
    }
  };

  // Size configuration
  const sizeConfig = {
    sm: {
      badgeSize: "w-8 h-8",
      iconSize: "w-4 h-4",
      textSize: "text-xs",
      padding: "p-1.5",
    },
    md: {
      badgeSize: "w-10 h-10",
      iconSize: "w-6 h-6",
      textSize: "text-sm",
      padding: "p-2",
    },
    lg: {
      badgeSize: "w-12 h-12",
      iconSize: "w-8 h-8",
      textSize: "text-base",
      padding: "p-2.5",
    },
  };

  // Determine role-based colors
  const getRoleBasedStyles = () => {
    const role = currentProfile?.role;

    switch (role) {
      case UserRole.Farmer:
        return {
          bgColor: verified
            ? "bg-green-100 dark:bg-green-900"
            : "bg-gray-100 dark:bg-gray-800",
          textColor: verified
            ? "text-green-700 dark:text-green-400"
            : "text-gray-600 dark:text-gray-400",
          borderColor: verified
            ? "border-green-400"
            : "border-gray-300 dark:border-gray-600",
          hoverBg: verified
            ? "hover:bg-green-200 dark:hover:bg-green-800"
            : "hover:bg-gray-200 dark:hover:bg-gray-700",
        };
      case UserRole.Seller:
        return {
          bgColor: verified
            ? "bg-blue-100 dark:bg-blue-900"
            : "bg-gray-100 dark:bg-gray-800",
          textColor: verified
            ? "text-blue-700 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400",
          borderColor: verified
            ? "border-blue-400"
            : "border-gray-300 dark:border-gray-600",
          hoverBg: verified
            ? "hover:bg-blue-200 dark:hover:bg-blue-800"
            : "hover:bg-gray-200 dark:hover:bg-gray-700",
        };
      case UserRole.Buyer:
        return {
          bgColor: verified
            ? "bg-purple-100 dark:bg-purple-900"
            : "bg-gray-100 dark:bg-gray-800",
          textColor: verified
            ? "text-purple-700 dark:text-purple-400"
            : "text-gray-600 dark:text-gray-400",
          borderColor: verified
            ? "border-purple-400"
            : "border-gray-300 dark:border-gray-600",
          hoverBg: verified
            ? "hover:bg-purple-200 dark:hover:bg-purple-800"
            : "hover:bg-gray-200 dark:hover:bg-gray-700",
        };
      case UserRole.Both:
        return {
          bgColor: verified
            ? "bg-amber-100 dark:bg-amber-900"
            : "bg-gray-100 dark:bg-gray-800",
          textColor: verified
            ? "text-amber-700 dark:text-amber-400"
            : "text-gray-600 dark:text-gray-400",
          borderColor: verified
            ? "border-amber-400"
            : "border-gray-300 dark:border-gray-600",
          hoverBg: verified
            ? "hover:bg-amber-200 dark:hover:bg-amber-800"
            : "hover:bg-gray-200 dark:hover:bg-gray-700",
        };
      default:
        return {
          bgColor: verified
            ? "bg-green-100 dark:bg-green-900"
            : "bg-gray-100 dark:bg-gray-800",
          textColor: verified
            ? "text-green-700 dark:text-green-400"
            : "text-gray-600 dark:text-gray-400",
          borderColor: verified
            ? "border-green-400"
            : "border-gray-300 dark:border-gray-600",
          hoverBg: verified
            ? "hover:bg-green-200 dark:hover:bg-green-800"
            : "hover:bg-gray-200 dark:hover:bg-gray-700",
        };
    }
  };

  const styles = getRoleBasedStyles();
  const selectedSize = sizeConfig[size];

  // Badge base styles
  const badgeBaseStyles = `
    ${selectedSize.padding} 
    ${styles.bgColor} 
    ${styles.borderColor} 
    flex items-center rounded-full 
    shadow-md transition-all duration-300 ease-in-out 
    border ${styles.hoverBg}
    ${interactive ? "cursor-pointer" : ""}
  `;

  // Verified state configuration
  const verifiedConfig = {
    icon: (
      <BadgeCheck className={`${selectedSize.iconSize} ${styles.textColor}`} />
    ),
    text: "Elite Verified – Trust & Excellence",
    tooltip: "This profile has been verified for authenticity",
  };

  // Unverified state configuration
  const unverifiedConfig = {
    icon: (
      <BadgeInfo className={`${selectedSize.iconSize} ${styles.textColor}`} />
    ),
    text: "Unverified – Building Trust",
    tooltip: "This profile is not yet verified",
  };

  // Loading state
  const loadingConfig = {
    icon: (
      <Shield
        className={`${selectedSize.iconSize} ${styles.textColor} animate-pulse`}
      />
    ),
    text: "Verifying...",
    tooltip: "Verification in progress",
  };

  const config =
    isVerifying || loading === "pending"
      ? loadingConfig
      : verified
      ? verifiedConfig
      : unverifiedConfig;

  return (
    <div
      className={`relative z-10 ${className}`}
      role="status"
      aria-label={verified ? "Verified" : "Unverified"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleVerification}
      title={config.tooltip}
    >
      <div
        className={`${badgeBaseStyles} ${
          isHovered || showText ? "w-auto" : selectedSize.badgeSize
        } overflow-hidden`}
      >
        {config.icon}
        <span
          className={`${styles.textColor} ${
            selectedSize.textSize
          } font-semibold ${
            isHovered || showText
              ? "opacity-100 max-w-xs ml-2"
              : "opacity-0 max-w-0"
          } transition-all duration-300 whitespace-nowrap overflow-hidden`}
        >
          {config.text}
        </span>
      </div>
    </div>
  );
};

export default VerificationBadge;
