"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { MessageSquare, Star } from "lucide-react";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import {
  fetchProfileByParams,
  selectViewedProfile,
} from "@/store/profile.slice";

import {
  fetchUserReviews,
  markReviewAsHelpful,
  deleteReview,
} from "@/store/review.slice";
import { IReview } from "@/models/profileI-interfaces";

import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewForm from "../ReviewForm";
import ProfileHeader from "../ReviewProfileHeader";
import ReviewsSection from "../ReviewSection";
import StatsSection from "../StatsSection";
import { ExtendedUserProfile } from "@/app/public_profiles/[profId]/page";

const UserFeedbackPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const paramsId = params.id as string;

  // Selectors for state
  const activeProfile = useAppSelector(
    selectViewedProfile
  ) as ExtendedUserProfile;

  const reviews = useAppSelector((state) => state.review.reviews);
  const isLoading = useAppSelector((state) => state.review.isLoading);
  const pagination = useAppSelector((state) => state.review.pagination);
  const error = useAppSelector((state) => state.review.error);

  // Local state
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadReviews = useCallback(() => {
    if (paramsId) {
      dispatch(
        fetchUserReviews({
          userId: paramsId,
          page: currentPage,
          limit: 10,
        })
      );
    }
  }, [dispatch, paramsId, currentPage]);

  useEffect(() => {
    if (paramsId) {
      dispatch(fetchProfileByParams(paramsId));
      loadReviews();
    }
  }, [dispatch, paramsId, currentPage, loadReviews]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const filteredReviews = reviews.filter(
    (review: IReview) =>
      (filterCategory === "all" || review.role === filterCategory) &&
      (searchTerm === "" ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const averageRating = reviews.length
    ? reviews.reduce((acc: number, review: IReview) => acc + review.rating, 0) /
      reviews.length
    : 0;

  const handleMarkHelpful = (reviewId: string) => {
    dispatch(markReviewAsHelpful(reviewId));
  };

  const handleDeleteReview = () => {
    if (reviewToDelete) {
      dispatch(deleteReview(reviewToDelete))
        .unwrap()
        .then(() => {
          toast({
            title: "Review deleted",
            description: "The review has been deleted successfully",
          });
          setReviewToDelete(null);
          setDeleteDialogOpen(false);
          loadReviews();
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete review",
            variant: "destructive",
          });
        });
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <main className="container max-w-6xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </main>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ProfileHeader
        paramsId={paramsId}
        averageRating={averageRating}
        reviewsCount={reviews.length}
        reviews={reviews}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column: Review form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <h2 className="text-xl font-bold text-white">Leave Feedback</h2>
              <p className="text-white/80 text-sm mt-1">
                Share your experience with {activeProfile?.fullName || ""}
              </p>
            </div>

            <div className="p-4">
              <ReviewForm
                recipientId={paramsId}
                recipientName={activeProfile?.fullName || ""}
                onSuccess={() => {
                  loadReviews();
                  toast({
                    title: "Feedback submitted",
                    description:
                      "Your feedback has been submitted successfully",
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Right column: Tabs with reviews and stats */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-0 pt-0">
              <ReviewsSection
                filteredReviews={filteredReviews}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                pagination={pagination}
                currentPage={currentPage}
                isLoading={isLoading}
                activeProfile={activeProfile}
                handleMarkHelpful={handleMarkHelpful}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                onDeleteReview={(reviewId) => {
                  setReviewToDelete(reviewId);
                  setDeleteDialogOpen(true);
                }}
              />
            </TabsContent>

            <TabsContent value="stats" className="mt-0 pt-0">
              <StatsSection
                reviews={reviews}
                averageRating={averageRating}
                pagination={pagination}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              review from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserFeedbackPage;
