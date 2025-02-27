import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createReview } from "@/store/review.slice";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Toaster } from "@/components/ui/toaster";

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
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  recipientId,
  recipientName,
  isOpen,
  onClose,
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
      });

      // Reset form
      form.reset();

      // Close dialog and trigger success callback
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Leave Feedback
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Share your experience with {recipientName}. Your feedback helps
            others make informed decisions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 py-4"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">
                    Rating
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-colors ${
                            star <= (hoveredStar || field.value)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                          onClick={() => handleRatingSelect(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">
                    Your Feedback
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your experience working with this person..."
                      className="resize-none border-gray-300 focus:ring-2 focus:ring-primary/40 h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="mr-2"
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 text-base"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
            <Toaster />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
