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
  Expand,
  MoveLeft,
  MoveRight,
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
import { DeletePostButton, EditPostButton } from "./DeletePostHandler";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";
import { useAppSelector } from "@/store/hooks";

interface BaseProduct {
  negotiable?: boolean;
  discount?: boolean;
  bulk_discount?: string;
}

export interface BasePostProfileProps {
  currentPost: IFarmPostDocument | IStorePostDocument;
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
  const reviews = useAppSelector((state) => state.review.reviews);

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

  const ImageGallery = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div className="w-full space-y-6">
        {/* Main Image Container */}
        <div
          className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Image */}
          <div
            className={`relative transition-all duration-300 ease-in-out
            ${isFullscreen ? "h-[80vh]" : "h-[500px]"}`}
          >
            <Image
              src={displayedImage}
              alt="Product Image"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>

          {/* Navigation Arrows */}
          <div
            className={`absolute inset-0 flex items-center justify-between px-4
            ${isHovered ? "opacity-100" : "opacity-0"} 
            transition-opacity duration-200`}
          >
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90
                dark:bg-black/50 dark:hover:bg-black/60"
              onClick={onPrevImage}
              disabled={allImages.length <= 1}
            >
              <MoveLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90
                dark:bg-black/50 dark:hover:bg-black/60"
              onClick={onNextImage}
              disabled={allImages.length <= 1}
            >
              <MoveRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="secondary"
            size="icon"
            className={`absolute top-4 right-4 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm
              hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/60
              ${isHovered ? "opacity-100" : "opacity-0"} 
              transition-opacity duration-200`}
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Expand className="h-4 w-4" />
          </Button>

          {/* Image Counter */}
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full
            bg-white/80 backdrop-blur-sm dark:bg-black/50
            ${isHovered ? "opacity-100" : "opacity-0"} 
            transition-opacity duration-200`}
          >
            <span className="text-sm font-medium">
              {currentImageIndex + 1} / {allImages.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="relative">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onPrevImage}
              disabled={allImages.length <= 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 overflow-hidden">
              <div className="flex gap-4 transition-transform duration-300 ease-in-out">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden
                      transition-all duration-200 ease-in-out
                      ${
                        currentImageIndex === index
                          ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                          : "hover:opacity-80"
                      }`}
                    onClick={() => onImageClick(index)}
                  >
                    <Image
                      src={image}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onNextImage}
              disabled={allImages.length <= 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {renderMoreProductData()}
      </div>
    );
  };

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
              {currentPost.userId !== userId && (
                <div className="flex items-center gap-2 w-full">
                  <Button
                    className="flex-1 flex items-center justify-between border-blue-500 text-blue-500"
                    variant="outline"
                  >
                    <span className="flex items-center">
                      <MessageCircleHeart size={18} className="mr-2" />{" "}
                      {reviews.length}
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
                    Report
                  </Button>
                </div>
              )}

              {currentPost.userId === userId && (
                <div className="flex items-center gap-2 w-full">
                  {currentPost.userId === userId && (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <Button className="flex-1" variant="secondary">
                          <Flag size={18} className="mr-2" />
                          Flag as Sold
                        </Button>
                        <DeletePostButton
                          postId={currentPost._id.toString()}
                          postType={postType}
                        />
                      </div>
                      <EditPostButton post={currentPost} postType={postType} />
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
