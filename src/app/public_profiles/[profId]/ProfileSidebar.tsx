// ProfileSidebar.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  MapPin,
  ExternalLink,
  User,
  Phone,
  Globe,
  Mail,
  Shield,
  Star,
  StarHalf,
  ChevronRight,
} from "lucide-react";

// Components
import VerificationBadge from "@/app/profile/VerifiedBadge";

// Redux actions
import { fetchUserReviews } from "@/store/review.slice";

// Import interfaces
import { IUserProfile, IReview } from "@/models/profileI-interfaces";
import { ExtendedUserProfile } from "./page";

// Helper component to render star ratings
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

// Fixed interface to match Redux state structure
interface ReviewStateType {
  reviews: IReview[];
  isLoading: boolean;
  pagination: {
    totalDocs: number;
  };
}

// User Reviews component
const UserReviews = ({
  userId,
  paramsId,
}: {
  userId: string;
  paramsId: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Changed to match Redux state structure
  const {
    reviews = [],
    isLoading,
    pagination = { totalDocs: 0 },
  } = useSelector((state: RootState) => state.review as ReviewStateType);

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchUserReviews({
          userId: paramsId,
        })
      );
    }
  }, [dispatch, paramsId, userId]);

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const navigateToReviews = () => {
    router.push(`/feedback/${paramsId}`);
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
                  <span className="text-sm font-medium">
                    {review.authorName || "Anonymous"}
                  </span>
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

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-1"
        onClick={navigateToReviews}
      >
        {reviews.length > 0 ? "View all reviews" : "Be the first to review"}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

const ProfileInfo = ({ profile }: { profile: ExtendedUserProfile }) => {
  // Get profile image with fallback
  const getProfileImage = () => {
    if (profile.profilePicture?.url) {
      return profile.profilePicture.url;
    }
    return "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600";
  };

  // Generate stats based on profile data
  const stats = [
    {
      label: "Listings",
      value: profile.listingsCount || 0,
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Ratings",
      value: profile.averageRating?.toFixed(1) || "0.0",
      icon: <Star className="w-4 h-4" />,
    },
    {
      label: "Verified",
      value: profile.verified ? "Yes" : "No",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      label: "Member Since",
      value: new Date(profile.createdAt).getFullYear().toString() || "N/A",
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <Card className="overflow-hidden shadow-md border-0">
      {/* Profile Header with Cover Image */}
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${getProfileImage()})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Verification Badge - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <VerificationBadge verified={profile?.verified || false} />
        </div>

        {/* Profile Picture - Overlapping position */}
        <div className="absolute -bottom-16 left-6">
          <Avatar className="w-24 h-24 border-1 border-white dark:border-gray-800 rounded-full overflow-hidden">
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
            <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
          )}

          {/* Stats Section */}
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
        </div>
      </CardContent>
    </Card>
  );
};

// Contact & Details Tabs
const ProfileDetails = ({ profile }: { profile: IUserProfile }) => {
  return (
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
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{profile.email}</span>
            </div>
          )}
          {profile.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{profile.phoneNumber}</span>
            </div>
          )}
          {profile.gender && (
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Gender: {profile.gender}</span>
            </div>
          )}
          {!profile.email && !profile.phoneNumber && !profile.gender && (
            <p className="text-sm text-gray-500 italic">
              No contact information available
            </p>
          )}
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="p-4 space-y-4">
          {profile.socialMediaLinks &&
          Object.entries(profile.socialMediaLinks).filter(
            ([_, url]) => url !== null && url !== undefined
          ).length > 0 ? (
            Object.entries(profile.socialMediaLinks).map(
              ([platform, url]) =>
                url && (
                  <div
                    key={platform}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="capitalize text-sm">{platform}</span>
                    </div>
                    <a
                      href={url}
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
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
                <Shield className="w-5 h-5 text-green-500" />
                <span className="font-medium">Verified Identity</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">ID Type:</span>
                <span>{profile.identityCardType}</span>
              </div>
              {profile.identityCardNumber && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">ID Number:</span>
                  <span>{profile.identityCardNumber.substring(0, 4)}****</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <Shield className="w-10 h-10 text-gray-300 mx-auto mb-2" />
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
  );
};

// Updated interface to include paramsId
interface ProfileSidebarProps {
  profile: ExtendedUserProfile;
  paramsId: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  paramsId,
}) => {
  return (
    <>
      {/* Profile Info Card */}
      <ProfileInfo profile={profile} />

      {/* Contact & Details */}
      <ProfileDetails profile={profile} />

      {/* Reviews Section */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reviews & Ratings</CardTitle>
          <CardDescription>
            What others are saying about {profile.username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserReviews userId={profile.userId} paramsId={paramsId} />
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileSidebar;
