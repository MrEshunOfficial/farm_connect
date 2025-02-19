import React, { useState } from "react";
import { BadgeCheck, BadgeInfo } from "lucide-react";

interface VerificationBadgeProps {
  verified: boolean;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verified,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const badgeBaseStyles =
    "text-sm flex items-center p-2 rounded-full " +
    "shadow-md transition-all duration-300 ease-in-out " +
    "transform hover:scale-105 hover:shadow-lg";

  // Verified state configuration
  const verifiedConfig = {
    icon: <BadgeCheck className="w-6 h-6 text-green-700 dark:text-green-400" />,
    text: "Elite Verified – Trust & Excellence",
    textStyles: "text-green-700 dark:text-green-400 text-sm font-semibold",
  };

  // Unverified state configuration
  const unverifiedConfig = {
    icon: <BadgeInfo className="w-6 h-6 text-green-700 dark:text-green-400" />,
    text: "Unverified – Building Trust",
    textStyles: "text-green-700 dark:text-green-400 text-sm font-semibold",
  };

  const config = verified ? verifiedConfig : unverifiedConfig;

  return (
    <div
      className={`absolute top-4 right-4 z-10 ${className}`}
      role="status"
      aria-label={verified ? "Verified" : "Unverified"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${badgeBaseStyles} ${
          isHovered ? "w-auto" : "w-10"
        } overflow-hidden`}
      >
        {config.icon}
        <span
          className={`${config.textStyles} ${
            isHovered ? "opacity-100 max-w-[500px] ml-2" : "opacity-0 max-w-0"
          } transition-all duration-300 whitespace-nowrap overflow-hidden`}
        >
          {config.text}
        </span>
      </div>
    </div>
  );
};

export default VerificationBadge;
