import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@/lib/auth";
import {
  Review,
  ReviewStats,
  CreateReviewRequest,
  VoteHelpfulRequest,
  PaginatedReviewsResponse,
} from "@/types/review";

const REVIEW_API_BASE_URL = "/api/";

export const reviewApiSlice = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: REVIEW_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Review", "ReviewStats"],
  endpoints: (builder) => ({
    getReviews: builder.query<
      PaginatedReviewsResponse,
      { productId: number; page?: number; limit?: number }
    >({
      query: ({ productId, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        params.append("product_id", productId.toString());
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        return `reviews/?${params.toString()}`;
      },
      providesTags: (result, error, { productId }) => [
        { type: "Review", id: `list-${productId}` },
      ],
    }),

    createReview: builder.mutation<Review, CreateReviewRequest>({
      query: (data) => ({
        url: "reviews/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: "Review", id: `list-${product_id}` },
        { type: "ReviewStats", id: product_id },
        // Also invalidate product detail to refresh review_stats
        { type: "Product", id: product_id },
      ],
    }),

    deleteReview: builder.mutation<{ detail: string }, { reviewId: number; productId: number }>({
      query: ({ reviewId }) => ({
        url: `reviews/${reviewId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Review", id: `list-${productId}` },
        { type: "ReviewStats", id: productId },
        // Also invalidate product detail to refresh review_stats
        { type: "Product", id: productId },
      ],
    }),

    voteHelpful: builder.mutation<
      { detail?: string; is_helpful?: boolean | null },
      { reviewId: number; is_helpful: boolean }
    >({
      query: ({ reviewId, is_helpful }) => ({
        url: `reviews/${reviewId}/helpful/`,
        method: "POST",
        body: { is_helpful },
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useVoteHelpfulMutation,
} = reviewApiSlice;
