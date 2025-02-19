import React from "react";
import { motion } from "framer-motion";
import { TractorIcon, StoreIcon, MapPin, ExternalLinkIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VerificationBadge from "@/app/profile/VerifiedBadge";
import { IUserProfile } from "@/models/profileI-interfaces";

export const ProfileHeader: React.FC<{ profile: IUserProfile }> = ({
  profile,
}) => (
  <div className="h-48 md:h-64 relative">
    <div className="absolute inset-0">
      <Avatar className="w-full h-full rounded-t-lg overflow-hidden rounded-md">
        <AvatarImage
          src={
            typeof profile?.profilePicture === "string"
              ? profile?.profilePicture
              : profile?.profilePicture?.url ||
                "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
          }
          alt={profile?.username || "Profile picture"}
          className="object-cover w-full h-full"
        />
      </Avatar>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
    </div>

    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <h1 className="flex flex-col gap-2 font-bold tracking-tight text-white">
            <span className="text-2xl md:text-4xl">{profile?.fullName}</span>
            <span className="text-sm opacity-90">
              {profile?.email}
              <br />
              {profile?.username}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white">
            <div className="flex items-center gap-2">
              {profile?.role === "Farmer" ? (
                <TractorIcon className="w-4 h-4" />
              ) : (
                <StoreIcon className="w-4 h-4" />
              )}
              <span>{profile?.role}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{profile?.country}</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VerificationBadge
            verified={profile.verified ?? false}
            className="absolute top-4 right-4"
          />
        </motion.div>
      </div>
    </div>
  </div>
);

export const ProfileDetails: React.FC<{ profile: IUserProfile }> = ({
  profile,
}) => (
  <CardContent className="p-6">
    {profile?.bio && (
      <div className="mb-6">
        <h3 className="font-semibold mb-2">About {profile.fullName}</h3>
        <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
      </div>
    )}

    <Separator className="my-6 dark:bg-gray-700" />

    <div className="w-full flex flex-col items-start justify-center gap-2">
      <div className="w-full space-y-4">
        <h3 className="font-semibold">Contact Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Phone:</span>
            <span>{profile?.phoneNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Gender:</span>
            <span>{profile?.gender}</span>
          </div>
        </div>
      </div>

      {profile?.socialMediaLinks && (
        <div className="w-full mt-4 space-y-4">
          <h3 className="font-semibold">Social Media</h3>
          <div className="space-y-2">
            {Object.entries(profile.socialMediaLinks).map(
              ([platform, url]) =>
                typeof url === "string" && (
                  <div
                    key={platform}
                    className="flex justify-between text-sm items-center"
                  >
                    <span className="text-gray-500 dark:text-gray-400 capitalize">
                      {platform}
                    </span>
                    <a
                      href={url}
                      className="text-[#6BAE40] hover:text-[#A4C639] dark:text-[#A4C639] dark:hover:text-[#F4A259] flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View</span>
                      <ExternalLinkIcon className="w-3 h-3" />
                    </a>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>

    {profile?.identityCardType && (
      <>
        <Separator className="my-6 dark:bg-gray-700" />
        <div className="space-y-4">
          <h3 className="font-semibold">Identity Verification</h3>
          <div className="space-y-2">
            <div className="flex justify-start gap-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400">ID Type:</span>
              <span>{profile.identityCardType}</span>
            </div>
          </div>
        </div>
      </>
    )}
  </CardContent>
);
