import { useState } from "react";
import { StarRating } from "./StarRating";
import { Review } from "@/types/review";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Trash2, Loader2 } from "lucide-react";
import { useVoteHelpfulMutation, useDeleteReviewMutation } from "@/store/reviews/reviewApiSlice";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth/authSlice";
import { cn } from "@/lib/utils";

interface ReviewItemProps {
  review: Review;
  productId: number;
  onDeleted?: () => void;
}

export function ReviewItem({ review, productId, onDeleted }: ReviewItemProps) {
  const { toast } = useToast();
  const currentUser = useSelector(selectUser);
  const [voteHelpful, { isLoading: isVoting }] = useVoteHelpfulMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const isOwnReview = currentUser?.id === review.user.id;
  const userVote = review.user_helpful_vote;

  const handleVote = async (isHelpful: boolean) => {
    if (isOwnReview) {
      toast({
        title: "Cannot Vote",
        description: "You cannot vote on your own review.",
        variant: "destructive",
      });
      return;
    }

    try {
      await voteHelpful({
        reviewId: review.id,
        is_helpful: isHelpful,
      }).unwrap();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!isOwnReview) return;

    try {
      await deleteReview({ reviewId: review.id, productId }).unwrap();
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted.",
      });
      onDeleted?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-semibold text-background">
                {review.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{review.user.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        {isOwnReview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        )}
      </div>

      {review.comment && (
        <p className="text-foreground mb-4 leading-relaxed">{review.comment}</p>
      )}

      {!isOwnReview && (
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Was this helpful?</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(true)}
              disabled={isVoting}
              className={cn(
                "h-8 px-3",
                userVote === true && "bg-primary/10 text-primary"
              )}
            >
              <ThumbsUp className="size-4 mr-1" />
              {review.helpful_count}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(false)}
              disabled={isVoting}
              className={cn(
                "h-8 px-3",
                userVote === false && "bg-destructive/10 text-destructive"
              )}
            >
              <ThumbsDown className="size-4 mr-1" />
              {review.not_helpful_count}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
