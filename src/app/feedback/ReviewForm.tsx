import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createReview } from "@/store/review.slice";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";
import { selectMyProfile } from "@/store/profile.slice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";

// Define the review schema using Zod
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  content: z
    .string()
    .min(1, "Please provide feedback content")
    .max(1000, "Feedback content is too long"),
});

// TypeScript type from the Zod schema
type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  recipientId: string;
  recipientName: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  recipientId,
  recipientName,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();

  const userId = session?.user?.id as string;
  const activeProfile = useAppSelector(selectMyProfile);

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    if (!userId || !activeProfile) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createReview({
          recipientId,
          rating: values.rating,
          content: values.content,
          role: activeProfile.role || "",
        })
      ).unwrap();

      toast({
        title: "Feedback submitted",
        description: "Your feedback has been submitted successfully",
        variant: "default",
      });

      // Reset form
      form.reset();

      // Trigger success callback
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description:
          error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle star rating selection
  const handleRatingSelect = (rating: number) => {
    form.setValue("rating", rating, { shouldValidate: true });
  };

  const handleStarHover = (star: number) => {
    setHoveredStar(star);
  };

  const handleStarContainerMouseLeave = () => {
    setHoveredStar(0);
  };

  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Great";
      case 5:
        return "Excellent";
      default:
        return "Select a rating";
    }
  };

  const currentRating = hoveredStar || form.watch("rating") || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300">
                Rating
              </FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-1 relative"
                    onMouseLeave={handleStarContainerMouseLeave}
                  >
                    {/* Star rating container with better hover */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div
                          key={star}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative"
                        >
                          {/* Hitbox for better hover experience */}
                          <div
                            className="absolute inset-0 w-10 h-10 -left-1 -top-1 cursor-pointer"
                            onClick={() => handleRatingSelect(star)}
                            onMouseEnter={() => handleStarHover(star)}
                          />

                          {/* Actual star */}
                          <Star
                            className={`h-8 w-8 transition-all duration-200 ease-in-out ${
                              star <= currentRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Animated Rating Label */}
                    <motion.div
                      className="ml-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: currentRating > 0 ? 1 : 0,
                        x: currentRating > 0 ? 0 : -10,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentRating > 0 && (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                          {getRatingLabel(currentRating)}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300">
                Your Feedback
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Share your experience working with this person..."
                  className="resize-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:ring-blue-500/40 dark:focus:border-blue-500 h-48 p-3 text-gray-700 dark:text-gray-300"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {field.value.length}/1000 characters
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || !form.formState.isValid}
          className={`rounded-lg px-6 py-3 w-full font-medium transition-all mt-4 ${
            form.formState.isValid
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
