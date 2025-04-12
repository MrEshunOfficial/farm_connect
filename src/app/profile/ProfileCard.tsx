import React, { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  MapPin,
  ExternalLinkIcon,
  UserIcon,
  PhoneIcon,
  GlobeIcon,
  MailIcon,
  ShieldIcon,
  Star,
  StarHalf,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IUserProfile, IReview } from "@/models/profileI-interfaces";
import VerificationBadge from "./VerifiedBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchMyReviews } from "@/store/review.slice";
import { useRouter } from "next/navigation";

export interface ProfileStats {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export interface ProfileCardProps {
  profile: IUserProfile;
  stats?: ProfileStats[];
  isLoading?: boolean;
  renderContent?: () => React.ReactNode;
  className?: string;
  showReviews?: boolean;
  reviews?: IReview; // Make reviews optional
}

// Helper function to render stars based on rating
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
};

// Review summary component
const ReviewSummary = ({ userId }: { userId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { reviews, isLoading, pagination } = useSelector(
    (state: RootState) => state.review
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchMyReviews({ page: 1, limit: 3 }));
    }
  }, [dispatch, userId]);

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const navigateToReviews = () => {
    router.push(`/feedback/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={averageRating} />
            <span className="text-sm font-medium">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({pagination.totalDocs} reviews)
            </span>
          </div>
        </div>
        <Badge variant="outline">{pagination.totalDocs} total</Badge>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review._id.toString()}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={review.reviewerAvatar || "/placeholder.png"}
                      alt={review?.authorName || "Reviewer"}
                    />
                  </Avatar>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No reviews yet</p>
        </div>
      )}

      {reviews.length > 0 && (
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-1"
          onClick={navigateToReviews}
        >
          View all reviews
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  stats = [],
  isLoading,
  renderContent,
  className = "",
  showReviews = true,
  reviews,
}) => {
  // Loading state handler with skeleton UI
  if (isLoading) {
    return (
      <Card className="w-full bg-white dark:bg-gray-800">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
          <div className="absolute bottom-4 left-4 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Profile image retrieval with fallback
  const getProfileImage = () => {
    if (typeof profile.profilePicture === "string") {
      return profile.profilePicture;
    }
    return (
      profile.profilePicture?.url ||
      "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden shadow-md border-0">
              {/* Profile Header with Cover Image */}
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${getProfileImage()})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Verification Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  {profile?.verified ? (
                    <VerificationBadge verified={true} />
                  ) : (
                    <VerificationBadge size="sm" interactive={false} />
                  )}
                </div>

                {/* Profile Picture - Overlapping position */}
                <div className="absolute -bottom-16 left-6">
                  <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
                    <AvatarImage
                      src={getProfileImage()}
                      alt={profile.username || "Profile"}
                      className="object-cover w-full"
                    />
                  </Avatar>
                </div>
              </div>

              {/* Profile Information Section */}
              <CardContent className="pt-20 pb-6 px-6">
                <div className="space-y-4">
                  {/* Name and Role */}
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 capitalize">
                      {profile.fullName || profile.username}
                      {profile.role && (
                        <Badge variant="outline" className="ml-2 capitalize">
                          {profile.role}
                        </Badge>
                      )}
                    </h1>
                    <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                      <span>@{profile.username}</span>
                      {profile.country && (
                        <>
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          <MapPin className="w-4 h-4" />
                          <span>{profile.country}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  {profile.bio && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {profile.bio}
                    </p>
                  )}

                  {/* Stats Section */}
                  {stats.length > 0 && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-4 gap-3 py-2">
                        {stats.map((stat) => (
                          <div key={stat.label} className="text-center">
                            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                              {stat.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact and Details Card */}
            <Card className="shadow-md border-0">
              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="identity">Identity</TabsTrigger>
                </TabsList>

                {/* Contact Information Tab */}
                <TabsContent value="contact" className="p-4 space-y-4">
                  {profile.email && (
                    <div className="flex items-center gap-3">
                      <MailIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{profile.phoneNumber}</span>
                    </div>
                  )}
                  {profile.gender && (
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Gender: {profile.gender}</span>
                    </div>
                  )}
                  {!profile.email &&
                    !profile.phoneNumber &&
                    !profile.gender && (
                      <p className="text-sm text-gray-500 italic">
                        No contact information available
                      </p>
                    )}
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social" className="p-4 space-y-4">
                  {profile.socialMediaLinks &&
                  Object.entries(profile.socialMediaLinks).length > 0 ? (
                    Object.entries(profile.socialMediaLinks).map(
                      ([platform, url]) =>
                        typeof url === "string" && (
                          <div
                            key={platform}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <GlobeIcon className="w-4 h-4 text-gray-400" />
                              <span className="capitalize text-sm">
                                {platform}
                              </span>
                            </div>
                            <a
                              href={url}
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 text-xs"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                              <ExternalLinkIcon className="w-3 h-3" />
                            </a>
                          </div>
                        )
                    )
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No social links available
                    </p>
                  )}
                </TabsContent>

                {/* Identity Verification Tab */}
                <TabsContent value="identity" className="p-4 space-y-4">
                  {profile.identityCardType ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldIcon className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Verified Identity</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">ID Type:</span>
                        <span>{profile.identityCardType}</span>
                      </div>
                      {profile.identityCardNumber && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">ID Number:</span>
                          <span>{profile.identityCardNumber}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <ShieldIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-4">
                        Identity not verified
                      </p>
                      <Button variant="outline" size="sm" className="mx-auto">
                        Verify Identity
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>

            {/* Reviews Card - New Section */}
            {showReviews && profile._id && (
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Reviews & Ratings</CardTitle>
                  <CardDescription>
                    What others are saying about {profile.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewSummary userId={profile._id.toString()} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {renderContent ? (
              renderContent()
            ) : (
              <Card className="h-full shadow-md border-0">
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>
                    Recent activity and updates from {profile.username}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-gray-500 py-12">
                  No recent activity to display
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
