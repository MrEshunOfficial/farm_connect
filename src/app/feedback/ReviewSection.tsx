"use client";

import { motion } from "framer-motion";
import { Filter, Calendar, Star, ThumbsUp, MessageSquare } from "lucide-react";
import { IReview } from "@/models/profileI-interfaces";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewsSectionProps {
  filteredReviews: IReview[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  pagination: any;
  currentPage: number;
  isLoading: boolean;
  activeProfile: any;
  handleMarkHelpful: (reviewId: string) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  onDeleteReview: (reviewId: string) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  filteredReviews,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  pagination,
  currentPage,
  isLoading,
  activeProfile,
  handleMarkHelpful,
  handlePrevPage,
  handleNextPage,
  onDeleteReview,
}) => {
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

  return (
    <>
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 max-h-[45vh] overflow-y-auto"
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
                  {activeProfile && activeProfile.userId === review.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive/80"
                      onClick={() => onDeleteReview(review._id.toString())}
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
        {filteredReviews.length > 0 && (
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
    </>
  );
};

export default ReviewsSection;
