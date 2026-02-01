export interface Review {
  id: number;
  user: {
    id: number;
    username: string;
  };
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  helpful_count: number;
  not_helpful_count: number;
  user_helpful_vote: boolean | null; // null if not voted, true/false if voted
}

export interface ReviewStats {
  average_rating: number | null;
  total_reviews: number;
  rating_distribution: { [key: number]: number }; // {1: 5, 2: 3, 3: 10, 4: 20, 5: 15}
}

export interface CreateReviewRequest {
  product_id: number;
  rating: number;
  comment?: string;
}

export interface VoteHelpfulRequest {
  is_helpful: boolean;
}

export interface PaginatedReviewsResponse {
  page: number;
  limit: number;
  total: number;
  reviews: Review[];
}
