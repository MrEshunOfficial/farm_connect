"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { MessageSquare, Star } from "lucide-react";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchProfileByParams, selectMyProfile } from "@/store/profile.slice";
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

const UserFeedbackPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const paramsId = params.id as string;
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  // Selectors for state
  const activeProfile = useAppSelector(selectMyProfile);
  const reviews = useAppSelector((state) => state.review.reviews);
  const isLoading = useAppSelector((state) => state.review.isLoading);
  const pagination = useAppSelector((state) => state.review.pagination);
  const error = useAppSelector((state) => state.review.error);

  // Local state
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
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
      <main className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-primary tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
        Feedbacks and Ratings
      </h1>
      {activeProfile && (
        <ProfileHeader
          activeProfile={activeProfile}
          averageRating={averageRating}
          reviewsCount={reviews.length}
          reviews={reviews}
          onOpenReviewForm={() => setIsReviewFormOpen(true)}
        />
      )}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
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

        <TabsContent value="stats">
          <StatsSection
            reviews={reviews}
            averageRating={averageRating}
            pagination={pagination}
          />
        </TabsContent>
      </Tabs>

      {activeProfile?.userId !== userId && activeProfile && (
        <ReviewForm
          recipientId={activeProfile._id.toString()}
          recipientName={activeProfile.fullName}
          isOpen={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
          onSuccess={loadReviews}
        />
      )}

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
    </main>
  );
};

export default UserFeedbackPage;
