import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  MessageCircle,
  MessageCircleHeart,
  Flag,
  Shield,
  ExternalLink,
  Expand,
  MoveLeft,
  MoveRight,
  ChevronRight,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { DeletePostButton, EditPostButton } from "./DeletePostHandler";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { selectAverageRating, fetchUserReviews } from "@/store/review.slice";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  const dispatch = useAppDispatch();
  // Get reviews specifically for the post creator
  const postCreatorId = currentPost.userProfile._id.toString();
  const isLoading = useAppSelector((state) => state.review.isLoading);

  const reviews = useAppSelector((state) => state.review.reviews);
  const averageRating = selectAverageRating(reviews);

  useEffect(() => {
    if (postCreatorId) {
      dispatch(fetchUserReviews({ userId: postCreatorId }));
    }
  }, [dispatch, postCreatorId]);

  useEffect(() => {
    if (allImages.length > 0 && currentImageIndex >= 0) {
      setDisplayedImage(allImages[currentImageIndex]);
    } else if (allImages.length > 0) {
      setDisplayedImage(allImages[0]);
    }
  }, [allImages, currentImageIndex]);

  // SafetyTips component with tooltip implementation
  const SafetyTips = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm p-4 space-y-2">
          <h4 className="font-semibold text-base">Safety Guidelines</h4>
          <Separator />
          <ul className="space-y-2">
            {safetyTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1.5 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0" />
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Gallery Section
  const ImageGallery = () => {
    return (
      <div className="w-full">
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

          {/* Controls Overlay */}
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

        {/* Thumbnail Strip */}
        <div className="relative mt-4">
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
              <div className="flex gap-2 transition-transform duration-300 ease-in-out">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden
                      transition-all duration-200 ease-in-out
                      ${
                        currentImageIndex === index
                          ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    onClick={() => onImageClick(index)}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
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
      </div>
    );
  };

  const OwnerSection = () => (
    <Card className="shadow-sm">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-medium">Posted by</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex items-center gap-3">
          {currentPost.userProfile.profilePicture && (
            <Avatar className="w-12 h-12 border">
              <AvatarImage
                src={currentPost.userProfile.profilePicture.url}
                alt={currentPost.userProfile.fullName}
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <Link
              href={
                currentPost.userProfile.userId === userId
                  ? "/profile"
                  : `/public_profiles/${currentPost.userProfile._id}`
              }
              className="font-medium hover:underline"
            >
              {currentPost.userProfile.fullName}
            </Link>
            <p className="text-sm text-muted-foreground">
              {currentPost.userProfile.email}
            </p>
            <div className="flex items-center mt-1">
              <MessageCircleHeart size={15} className="text-blue-500 mr-1" />
              <Link
                href={`/feedback/${currentPost.userProfile._id}`}
                className="text-xs text-blue-500 hover:underline flex items-center"
              >
                {isLoading ? "Loading..." : `${reviews.length} Reviews`}
                {averageRating > 0 && (
                  <span className="ml-1 text-xs">
                    • {averageRating.toFixed(1)} ★
                  </span>
                )}
                <ExternalLink size={10} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Actions Section
  const ActionsSection = () => (
    <div className="space-y-3">
      {currentPost.userId !== userId ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="w-full"
              variant="default"
              onClick={onToggleContact}
            >
              <Phone className="w-4 h-4 mr-2" />
              {isContactShown ? currentPost.userProfile.phoneNumber : "Contact"}
            </Button>
            <Button className="w-full" variant="outline">
              <Link
                href="#"
                className="w-full flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Message
              </Link>
            </Button>
          </div>
          <Button className="w-full" variant="ghost" size="sm">
            <Flag size={16} className="mr-2 text-red-500" />
            <span className="text-red-500">Report Listing</span>
          </Button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full" variant="default">
              <Flag size={16} className="mr-2" />
              Mark as Sold
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
  );

  return (
    <main className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image Gallery */}
        <div className="lg:col-span-2">
          <ImageGallery />
          <div className="mt-6">
            <Tabs
              defaultValue="details"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="safety">Safety & Information</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                {renderMoreProductData()}
              </TabsContent>
              <TabsContent value="safety" className="pt-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                  <h3 className="font-medium flex items-center">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                    Safety Guidelines
                  </h3>
                  <ul className="space-y-2">
                    {safetyTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1.5 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column - Details & Actions */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="shadow-sm">
            <CardHeader className="px-4 py-3 pb-0">
              <CardTitle className="text-lg font-semibold">
                {postType === "farm" ? "Farm Product" : "Store Item"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-4">
              {renderPriceSection()}
              {renderAdditionalDetails && (
                <div className="mt-4">{renderAdditionalDetails()}</div>
              )}
            </CardContent>
          </Card>

          {/* Contact & Actions */}
          <Card className="shadow-sm">
            <CardContent className="px-4 py-4">
              <ActionsSection />
            </CardContent>
          </Card>

          {/* Owner Info */}
          <OwnerSection />

          {/* Only show in mobile view when not on safety tab */}
          <div className="lg:hidden">
            {activeTab !== "safety" && <SafetyTips />}
          </div>

          {/* Only visible on desktop */}
          <div className="hidden lg:block">
            <SafetyTips />
          </div>

          <Toaster />
        </div>
      </div>
    </main>
  );
}
