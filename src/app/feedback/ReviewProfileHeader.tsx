"use client";

import { motion } from "framer-motion";
import { MessageSquare, Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import VerificationBadge from "@/app/profile/VerifiedBadge";
import { IReview, IUserProfile } from "@/models/profileI-interfaces";

interface ProfileHeaderProps {
  activeProfile: IUserProfile;
  averageRating: number;
  reviewsCount: number;
  reviews: IReview[];
  onOpenReviewForm: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  activeProfile,
  averageRating,
  reviewsCount,
  reviews,
  onOpenReviewForm,
}) => {
  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  // Group reviews by role
  const roleStats = reviews.reduce((acc: Record<string, number>, review) => {
    if (review.role) {
      acc[review.role] = (acc[review.role] || 0) + 1;
    }
    return acc;
  }, {});

  // Get profile image with fallback similar to ProfileSidebar
  const getProfileImage = () => {
    if (typeof activeProfile?.profilePicture === "object") {
      return activeProfile.profilePicture.url;
    }
    return activeProfile?.profilePicture || "";
  };

  if (!activeProfile) {
    return (
      <div className="w-full mb-8 p-6 rounded-xl bg-gradient-to-b from-card/50 to-background border border-border/30 shadow-md">
        <p>Loading profile information...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full mb-8 p-6 rounded-xl bg-gradient-to-b from-card/50 to-background border border-border/30 shadow-md"
    >
      <div className="flex-1 flex flex-col md:flex-row items-center gap-8 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Avatar className="w-28 h-28 border-4 border-white shadow-xl ring-2 ring-primary/20">
            <AvatarImage
              src={getProfileImage()}
              alt={activeProfile?.fullName || ""}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-700 text-white text-3xl font-semibold">
              {activeProfile?.fullName?.charAt(0) || <User />}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 capitalize">
              {activeProfile?.fullName || activeProfile?.username}
            </h1>
            <span>
              {activeProfile?.verified ? (
                <VerificationBadge verified={true} />
              ) : (
                <VerificationBadge size="sm" interactive={false} />
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              {averageRating.toFixed(1)} ({reviewsCount} reviews)
            </span>
          </div>
          {activeProfile?.role && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                {activeProfile.role}
              </span>
            </div>
          )}

          {/* Display username if available, similar to the ProfileSidebar */}
          {activeProfile?.username && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium">@{activeProfile.username}</span>
            </div>
          )}

          {/* Display role-based stats */}
          {Object.keys(roleStats).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(roleStats).map(([role, count]) => (
                <span
                  key={role}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  {role}: {count} {count === 1 ? "review" : "reviews"}
                </span>
              ))}
            </div>
          )}

          {/* Display contact info if available */}
          {activeProfile?.phoneNumber && (
            <div className="mt-3 text-sm text-muted-foreground">
              <span className="font-medium">Contact: </span>
              {activeProfile.phoneNumber}
            </div>
          )}

          {/* Display country if available */}
          {activeProfile?.country && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Location: </span>
              {activeProfile.country}
            </div>
          )}
        </div>

        <div className="mt-6 md:mt-0 md:ml-auto p-2 flex items-center justify-end">
          <Button
            onClick={onOpenReviewForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all duration-300 hover:shadow-lg"
            size="lg"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Leave Feedback
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
