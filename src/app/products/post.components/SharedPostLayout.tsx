import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  MessageCircle,
  MessageCircleHeart,
  Flag,
  Trash2,
  Edit,
  Shield,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Types } from "mongoose";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PlaceAnOrder from "./PlaceAnOrder";
import { FaMapMarked } from "react-icons/fa";
import { DeletePostButton } from "./DeletePostHandler";

interface BaseUserProfile {
  _id: Types.ObjectId | string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: {
    url: string;
  };
}

interface BaseProduct {
  negotiable?: boolean;
  discount?: boolean;
  bulk_discount?: string;
}

export interface BasePostProfileProps {
  currentPost: {
    _id: Types.ObjectId | string;
    userId: Types.ObjectId | string;
    userProfile: BaseUserProfile;
    product: BaseProduct;
  };
  postType: "farm" | "store";
  mainImage: string;
  allImages: string[];
  currentImageIndex: number;
  isContactShown: boolean;
  userId?: string;
  onImageClick: (index: number) => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onToggleContact: () => void;
  renderPriceSection: () => React.ReactNode;
  renderAdditionalDetails?: () => React.ReactNode;
  renderMoreProductData: () => React.ReactNode;
  safetyTips: string[];
  avatarFallback: string;
}

export function BasePostProfile({
  currentPost,
  postType,
  allImages,
  currentImageIndex,
  isContactShown,
  userId,
  onImageClick,
  onPrevImage,
  onNextImage,
  onToggleContact,
  renderPriceSection,
  renderAdditionalDetails,
  renderMoreProductData,
  safetyTips,
  avatarFallback,
}: BasePostProfileProps) {
  const [displayedImage, setDisplayedImage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (allImages.length > 0 && currentImageIndex >= 0) {
      setDisplayedImage(allImages[currentImageIndex]);
    } else if (allImages.length > 0) {
      setDisplayedImage(allImages[0]);
    }
  }, [allImages, currentImageIndex]);

  const SafetyTips = () => (
    <div className="w-full h-full shadow-xl p-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between gap-2 p-4
            rounded-lg border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700
            transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-100 font-medium text-base">
                Safety Tips
              </span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full max-w-md p-3 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700
                  bg-white dark:bg-gray-800"
          align="center"
        >
          <DropdownMenuLabel className="px-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            Essential Guidelines
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:bg-gray-700 my-2" />
          <DropdownMenuGroup className="space-y-2">
            {safetyTips.map((tip, index) => (
              <DropdownMenuItem
                key={index}
                className="px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50
                cursor-default text-gray-700 dark:text-gray-300 text-sm leading-snug"
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1.5 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0" />
                  <span className="text-pretty">{tip}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const ImageGallery = () => (
    <div className="w-full space-y-4">
      <div className="relative group">
        <div className="relative w-full h-96 rounded-md overflow-hidden">
          <Image
            src={displayedImage}
            alt="Product Image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onPrevImage}
          disabled={allImages.length <= 1}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onNextImage}
          disabled={allImages.length <= 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <ThumbnailGrid />
      {renderMoreProductData()}
    </div>
  );

  const ThumbnailGrid = () => (
    <div className="flex items-center justify-start gap-2">
      {allImages.map(
        (image, index) =>
          index !== 0 && (
            <div
              key={index}
              className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer
              ${
                currentImageIndex === index
                  ? "ring-2 ring-blue-500"
                  : "hover:opacity-75"
              }`}
              onClick={() => onImageClick(index)}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          )
      )}
    </div>
  );

  return (
    <main className="w-full flex justify-between items-start p-2 space-x-2">
      <div className="flex-1 h-[88vh] overflow-auto ">
        <ImageGallery />
      </div>
      <Card className="min-w-80 h-[88vh] overflow-auto border rounded-md">
        <CardContent className="w-full flex flex-col gap-2 p-2">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full space-y-4 custom-shadow-styling p-2 rounded-md">
              {renderPriceSection()}
              {renderAdditionalDetails && renderAdditionalDetails()}

              <div className="space-y-4">
                <Button
                  className="w-full flex items-center border-gray-500"
                  variant="outline"
                  onClick={onToggleContact}
                >
                  {isContactShown ? (
                    <span className="text-sm">
                      {currentPost.userProfile.phoneNumber}
                    </span>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Show Contact
                    </>
                  )}
                </Button>
                <Button
                  className="w-full flex items-center border-blue-500 text-blue-500"
                  variant="outline"
                >
                  <Link
                    href="#"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Chat Directly
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 border rounded-md custom-shadow-styling p-3">
              {currentPost.userProfile.profilePicture && (
                <Avatar className="w-12 h-12 border">
                  <AvatarImage
                    src={currentPost.userProfile.profilePicture.url}
                    alt={currentPost.userProfile.fullName}
                    className="w-full h-full rounded-full"
                  />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              )}
              <Link
                href={`/public_profile/${currentPost.userProfile._id}`}
                className="space-y-2"
              >
                <p className="text-muted-foreground">
                  {currentPost.userProfile.fullName}
                  <small className="flex items-center">
                    <span className="text-sm">
                      {currentPost.userProfile.email}
                    </span>
                  </small>
                </p>
              </Link>
            </div>

            <div className="space-y-4 custom-shadow-styling p-2 rounded-md">
              <div className="flex items-center gap-2 w-full">
                <Button
                  className="flex-1 flex items-center justify-between border-blue-500 text-blue-500"
                  variant="outline"
                >
                  <span className="flex items-center">
                    <MessageCircleHeart size={18} className="mr-2" /> 0
                  </span>
                  <Link href={`/feedback/${currentPost.userProfile._id}`}>
                    <ExternalLink size={12} className="ml-2" />
                  </Link>
                </Button>
                <Button
                  className="flex-1 border-red-500 text-red-500"
                  variant="outline"
                  size={"sm"}
                >
                  <Flag size={18} className="mr-2" />
                </Button>
              </div>

              {currentPost.userId === userId && (
                <div className="flex items-center gap-2 w-full">
                  {currentPost.userId === userId && (
                    <div className="flex items-center gap-2 w-full">
                      <Button className="flex-1" variant="secondary">
                        <FaMapMarked size={18} className="mr-2" />
                        Flag as Sold
                      </Button>
                      <DeletePostButton
                        postId={currentPost._id.toString()}
                        postType={postType}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <SafetyTips />
        </CardContent>
      </Card>
      <Toaster />
    </main>
  );
}
