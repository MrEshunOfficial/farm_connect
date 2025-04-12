"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  User,
  MapPin,
  Phone,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import VerificationBadge from "@/app/profile/VerifiedBadge";
import { IReview } from "@/models/profileI-interfaces";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import {
  fetchProfileByParams,
  selectViewedProfile,
} from "@/store/profile.slice";
import { ExtendedUserProfile } from "@/app/public_profiles/[profId]/page";

interface ProfileHeaderProps {
  paramsId: string;
  averageRating: number;
  reviewsCount: number;
  reviews: IReview[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  paramsId,
  averageRating,
  reviewsCount,
  reviews,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeProfile = useAppSelector(
    selectViewedProfile
  ) as ExtendedUserProfile;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (paramsId) {
      dispatch(fetchProfileByParams(paramsId));
    }
  }, [dispatch, paramsId]);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: i * 0.05,
            type: "spring",
            stiffness: 300,
          }}
        >
          <Star
            className={`w-4 h-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        </motion.div>
      ));
  };

  // Group reviews by role
  const roleStats = reviews.reduce((acc: Record<string, number>, review) => {
    if (review.role) {
      acc[review.role] = (acc[review.role] || 0) + 1;
    }
    return acc;
  }, {});

  // Get profile image with fallback
  const getProfileImage = () => {
    if (typeof activeProfile?.profilePicture === "object") {
      return activeProfile.profilePicture.url;
    }
    return activeProfile?.profilePicture || "";
  };

  if (!activeProfile) {
    return (
      <Card className="w-full mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-4 overflow-hidden">
      {/* Animated Banner */}
      <motion.div
        className="relative overflow-hidden rounded-t-lg h-24 sm:h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white_2px,_transparent_0)]"
          style={{ backgroundSize: "20px 20px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        ></motion.div>

        <div className="flex justify-between items-center h-full px-6">
          <div>
            <motion.h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Feedbacks and Ratings
            </motion.h1>
            <motion.div
              className="flex items-center mt-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
              <motion.span
                className="ml-2 text-sm font-medium px-2 py-0.5 bg-white/20 rounded-full text-white"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {averageRating.toFixed(1)} ({reviewsCount})
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* User Info Section */}
      <motion.div
        className="px-6 py-3 flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.4,
            }}
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <Avatar className="w-12 h-12 border-2 border-white shadow-md">
              <AvatarImage
                src={getProfileImage()}
                alt={activeProfile?.fullName || ""}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-700 text-white text-lg font-semibold">
                {activeProfile?.fullName?.charAt(0) || (
                  <User className="w-6 h-6" />
                )}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-center gap-1">
              <h2 className="text-lg font-semibold capitalize">
                {activeProfile?.fullName || activeProfile?.username}
              </h2>
              {activeProfile?.verified && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.7,
                    type: "spring",
                    stiffness: 500,
                  }}
                >
                  <VerificationBadge verified={true} />
                </motion.div>
              )}
            </div>

            {activeProfile?.username && (
              <motion.span
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                @{activeProfile.username}
              </motion.span>
            )}
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0 rounded-full"
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>

      {/* Animated collapsible details section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="px-6 pb-4 pt-1 space-y-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              opacity: { duration: 0.3 },
              height: { type: "spring", stiffness: 300, damping: 30 },
            }}
          >
            <motion.div
              className="h-px bg-gray-200 dark:bg-gray-800 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1: Contact Information */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Information
                </h3>

                <div className="space-y-1">
                  {activeProfile?.phoneNumber && (
                    <motion.div
                      className="flex items-center text-xs"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                      <span>{activeProfile.phoneNumber}</span>
                    </motion.div>
                  )}

                  {activeProfile?.country && (
                    <motion.div
                      className="flex items-center text-xs"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <MapPin className="w-3 h-3 mr-2 text-muted-foreground" />
                      <span>{activeProfile.country}</span>
                    </motion.div>
                  )}

                  {activeProfile?.createdAt && (
                    <motion.div
                      className="flex items-center text-xs"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                      <span>
                        Joined {moment(activeProfile.createdAt).format("lll")}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Column 2: Role Stats */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Review Categories
                </h3>

                {Object.keys(roleStats).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(roleStats).map(([role, count], index) => (
                      <motion.div
                        key={role}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: 0.2 + index * 0.05,
                          type: "spring",
                          stiffness: 300,
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge variant="secondary" className="text-xs">
                          {role}: {count}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.p
                    className="text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    No category data available
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ProfileHeader;
