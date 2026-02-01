import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { useCreateReviewMutation, useDeleteReviewMutation } from "@/store/reviews/reviewApiSlice";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Review } from "@/types/review";
import { formatDistanceToNow } from "date-fns";

interface ReviewFormProps {
  productId: number;
  existingReview?: Review | null;
  onReviewSubmitted?: () => void;
  onReviewDeleted?: () => void;
}

export function ReviewForm({
  productId,
  existingReview,
  onReviewSubmitted,
  onReviewDeleted,
}: ReviewFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [comment, setComment] = useState<string>(existingReview?.comment || "");
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (existingReview) {
      toast({
        title: "Review Exists",
        description: "You already have a review. Please delete it first to create a new one.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReview({
        product_id: productId,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });

      setRating(0);
      setComment("");
      onReviewSubmitted?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    try {
      await deleteReview({ reviewId: existingReview.id, productId }).unwrap();
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted.",
      });
      setRating(0);
      setComment("");
      onReviewDeleted?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (existingReview) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Your Review</h3>
            <StarRating rating={existingReview.rating} size="md" />
            <p className="text-sm text-muted-foreground mt-2">
              Submitted {formatDistanceToNow(new Date(existingReview.created_at), { addSuffix: true })}
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="size-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
        {existingReview.comment && (
          <p className="text-foreground mt-4">{existingReview.comment}</p>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          You can delete this review and create a new one if you'd like to update it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Write a Review</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="rating" className="text-foreground mb-2 block">
            Rating *
          </Label>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <Label htmlFor="comment" className="text-foreground mb-2 block">
            Comment (Optional)
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="min-h-[120px] resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        <Button
          type="submit"
          disabled={isCreating || rating === 0}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
}
