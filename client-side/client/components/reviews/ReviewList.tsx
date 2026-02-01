import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { ReviewItem } from "./ReviewItem";
import { ReviewForm } from "./ReviewForm";
import { useGetReviewsQuery } from "@/store/reviews/reviewApiSlice";
import { ReviewStats, Review } from "@/types/review";
import { Loader2, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/auth/authSlice";
import { useNavigate } from "react-router-dom";

interface ReviewListProps {
  productId: number;
  reviewStats?: ReviewStats | null;
  currentUserReview?: Review | null;
  onReviewSubmitted?: () => void;
  onReviewDeleted?: () => void;
}

export function ReviewList({
  productId,
  reviewStats,
  currentUserReview,
  onReviewSubmitted,
  onReviewDeleted,
}: ReviewListProps) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useGetReviewsQuery(
    { productId, page, limit },
    { skip: !productId }
  );

  // Fetch all reviews for accurate stats calculation
  const { data: allReviewsData } = useGetReviewsQuery(
    { productId, page: 1, limit: 1000 }, // Get all reviews for stats
    { skip: !productId }
  );

  // Filter out current user's review from the list if it exists (it's shown separately in the form)
  const reviews = reviewsData?.reviews.filter(
    (review) => !currentUserReview || review.id !== currentUserReview.id
  ) || [];
  const totalReviews = reviewsData?.total || 0;
  const totalPages = Math.ceil(totalReviews / limit);

  // Calculate review stats from ALL reviews (not just current page)
  const allReviews = allReviewsData?.reviews || [];
  const calculatedStats: ReviewStats | null = allReviews.length > 0 ? {
    average_rating: allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length,
    total_reviews: allReviewsData.total,
    rating_distribution: {
      1: allReviews.filter(r => r.rating === 1).length,
      2: allReviews.filter(r => r.rating === 2).length,
      3: allReviews.filter(r => r.rating === 3).length,
      4: allReviews.filter(r => r.rating === 4).length,
      5: allReviews.filter(r => r.rating === 5).length,
    },
  } : null;

  // Use calculated stats if available, otherwise fall back to prop
  const displayStats = calculatedStats || reviewStats;

  const handleReviewSubmitted = () => {
    refetch();
    onReviewSubmitted?.();
  };

  const handleReviewDeleted = () => {
    refetch();
    onReviewDeleted?.();
  };

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      {displayStats && displayStats.total_reviews > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-5" />
              Customer Reviews
            </CardTitle>
            <CardDescription>
              Based on {displayStats.total_reviews} review{displayStats.total_reviews !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {displayStats.average_rating && (
                    <>
                      <div className="text-4xl font-bold text-foreground">
                        {displayStats.average_rating.toFixed(1)}
                      </div>
                      <div>
                        <StarRating
                          rating={displayStats.average_rating}
                          size="lg"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Average Rating
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Rating Distribution
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = displayStats.rating_distribution[star] || 0;
                    const percentage =
                      displayStats.total_reviews > 0
                        ? (count / displayStats.total_reviews) * 100
                        : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-8">
                          {star}★
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {isAuthenticated ? (
        <ReviewForm
          productId={productId}
          existingReview={currentUserReview}
          onReviewSubmitted={handleReviewSubmitted}
          onReviewDeleted={handleReviewDeleted}
        />
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center mb-4">
              Sign in to write a review
            </p>
            <Button
              onClick={() => navigate("/signin")}
              className="w-full"
              variant="outline"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          All Reviews ({totalReviews})
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewItem
                      key={review.id}
                      review={review}
                      productId={productId}
                      onDeleted={handleReviewDeleted}
                    />
                  ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
