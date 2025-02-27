"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
  Star,
  MessageSquare,
  ThumbsUp,
  User,
  Calendar,
  Filter,
} from "lucide-react";

import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchProfileByParams, selectMyProfile } from "@/store/profile.slice";
import {
  fetchMyReviews,
  markReviewAsHelpful,
  deleteReview,
  fetchUserReviews,
} from "@/store/review.slice";
import { IReview } from "@/models/profileI-interfaces";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import ReviewForm from "../ReviewForm";
import { useSession } from "next-auth/react";
import VerificationBadge from "@/app/profile/VerifiedBadge";

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
    dispatch(
      fetchUserReviews({ userId: paramsId, page: currentPage, limit: 10 })
    );
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

  // Filter reviews based on category and search term
  const filteredReviews = reviews.filter(
    (review: IReview) =>
      (filterCategory === "all" || review.role === filterCategory) &&
      (searchTerm === "" ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((acc: number, review: IReview) => acc + review.rating, 0) /
      reviews.length
    : 0;

  // Handle marking a review as helpful
  const handleMarkHelpful = (reviewId: string) => {
    dispatch(markReviewAsHelpful(reviewId));
  };

  // Handle deleting a review
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

  // Pagination handlers
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full mb-8 p-6 rounded-xl bg-gradient-to-b from-card/50 to-background border border-border/30 shadow-md"
      >
        <div className="flex-1 flex flex-col md:flex-row items-center gap-8 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar className="w-28 h-28 border-4 border-white shadow-xl ring-2 ring-primary/20">
              <AvatarImage
                src={
                  typeof activeProfile?.profilePicture === "object"
                    ? activeProfile.profilePicture.url
                    : activeProfile?.profilePicture || ""
                }
                alt={activeProfile?.fullName || ""}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-700 text-white text-3xl font-semibold">
                {activeProfile?.fullName?.charAt(0) || <User />}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 capitalize">
                {activeProfile?.fullName}
              </h1>
              <span>
                {activeProfile?.verified ? (
                  <VerificationBadge verified={true} />
                ) : (
                  <VerificationBadge size="sm" interactive={false} />
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="mt-6 md:mt-0 md:ml-auto p-2 flex items-center justify-end">
            <Button
              onClick={() => setIsReviewFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              size="lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Leave Feedback
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters and search row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select onValueChange={setFilterCategory} defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Both">All</SelectItem>
            <SelectItem value="Farmer">Farmer</SelectItem>
            <SelectItem value="Seller">Seller</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-h-[40vh] overflow-y-auto"
          >
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review: IReview) => (
                <motion.div key={review._id.toString()} variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.reviewerAvatar}
                              alt={review.authorName}
                            />
                            <AvatarFallback className="bg-primary/10">
                              {review.authorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {review.authorName}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {review.role === "Both"
                            ? "Farmer & Store Owner"
                            : review.role === "Seller"
                            ? "Store Owner"
                            : review.role}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.content}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs flex items-center gap-1"
                        onClick={() => handleMarkHelpful(review._id.toString())}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpful})
                      </Button>

                      {/* Only show delete button if user is the author */}
                      {activeProfile &&
                        activeProfile.userId === review.userId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive hover:text-destructive/80"
                            onClick={() => {
                              setReviewToDelete(review._id.toString());
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardDescription>
                    No reviews found matching your criteria
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setFilterCategory("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination controls */}
            {reviews.length > 0 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrevPage || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(
                    (r: IReview) => r.rating === rating
                  ).length;
                  const percentage = (count / reviews.length) * 100 || 0;

                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center w-16">
                        {rating}{" "}
                        <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-yellow-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <div className="w-16 text-right text-sm text-muted-foreground">
                        {count} ({percentage.toFixed(0)}%)
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Average Rating
                      </h3>
                      <p className="text-3xl font-bold">
                        {averageRating.toFixed(1)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Reviews
                      </h3>
                      <p className="text-3xl font-bold">
                        {pagination.totalDocs}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Most Common Category
                      </h3>
                      <p className="text-3xl font-bold">
                        {reviews.length
                          ? (Object.entries(
                              reviews.reduce<Record<string, number>>(
                                (acc, review: IReview) => {
                                  acc[review.role] =
                                    (acc[review.role] || 0) + 1;
                                  return acc;
                                },
                                {}
                              )
                            ).sort((a, b) => b[1] - a[1])[0][0] as string)
                          : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Review Form Dialog */}
      {activeProfile?.userId !== userId && activeProfile && (
        <ReviewForm
          recipientId={activeProfile._id.toString()}
          recipientName={activeProfile.fullName}
          isOpen={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
          onSuccess={loadReviews}
        />
      )}

      {/* Delete Confirmation Dialog */}
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
