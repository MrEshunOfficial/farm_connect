import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  TractorIcon,
  StoreIcon,
  MapPin,
  ExternalLinkIcon,
  UserIcon,
  PhoneIcon,
  GlobeIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IUserProfile } from "@/models/profileI-interfaces";
import VerificationBadge from "./VerifiedBadge";

export interface ProfileStats {
  label: string;
  value: number;
}

export interface ProfileCardProps {
  profile: IUserProfile;
  stats?: ProfileStats[];
  isLoading?: boolean;
  renderContent?: () => React.ReactNode;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  stats = [],
  isLoading,
  renderContent,
  className = "",
}) => {
  // Loading state handler
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div>Loading profile...</div>
      </div>
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
    <main className={`w-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <div className="w-1/3 space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden relative">
            <div className="h-48 relative">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={getProfileImage()}
                  alt={profile.username}
                  className="object-cover"
                />
              </Avatar>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

              {/* Verification Badge */}
              <VerificationBadge
                verified={profile.verified ?? false}
                className="absolute top-4 right-4"
              />

              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                </div>
                <div className="flex items-center gap-2">
                  {profile.role === "Farmer" ? (
                    <TractorIcon className="w-4 h-4" />
                  ) : (
                    <StoreIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm">{profile.role}</span>
                  {profile.country && (
                    <>
                      <span className="w-1 h-1 bg-white rounded-full" />
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.country}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {stats.length > 0 && (
              <div className="grid grid-cols-4 gap-2 p-2 bg-white dark:bg-gray-800">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* About & Contact Card */}
          <Card className="bg-gray-50 dark:bg-yellow-800">
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
              {profile.bio && (
                <CardDescription className="mt-2">
                  {profile.bio}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact Information */}
              {(profile.phoneNumber || profile.gender) && (
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {profile.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span>{profile.phoneNumber}</span>
                      </div>
                    )}
                    {profile.gender && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span>{profile.gender}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              {profile.socialMediaLinks && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                      Social Media
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(profile.socialMediaLinks).map(
                        ([platform, url]) =>
                          typeof url === "string" && (
                            <div
                              key={platform}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <GlobeIcon className="w-4 h-4 text-gray-400" />
                                <span className="capitalize">{platform}</span>
                              </div>
                              <a
                                href={url}
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Profile
                                <ExternalLinkIcon className="w-3 h-3" />
                              </a>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Identity Verification */}
              {profile.identityCardType && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                      Identity Verification
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>ID Type:</span>
                        <span>{profile.identityCardType}</span>
                      </div>
                      {profile.identityCardNumber && (
                        <div className="flex items-center justify-between">
                          <span>ID Number:</span>
                          <span>{profile.identityCardNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">{renderContent && renderContent()}</div>
      </div>
    </main>
  );
};

export default ProfileCard;
