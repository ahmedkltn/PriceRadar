// src/store/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Map sort options to API format
const mapSortToApi = (sort: string) => {
  switch (sort) {
    case "price_asc":
      return "price_asc";
    case "price_desc":
      return "price_desc";
    case "newest":
      return "newest";
    default:
      return "relevance";
  }
};

const API_BASE_URL = import.meta.env.VITE_PRODUCT_API;
console.log('API Base URL:', API_BASE_URL);

export const productApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Product", "Vendor", "Category", "Subcategory", "PriceHistory"],
  endpoints: (builder) => ({
    // Fetch products with filters
    getProducts: builder.query({
      query: (
        filters: {
          query?: string;
          minPrice?: number;
          maxPrice?: number;
          vendor?: string;
          categoryId?: string;
          category?: string;
          subcategoryId?: string;
          subcategory?: string;
          sort?: string;
          limit?: number;
          page?: number;
        } = {},
      ) => {
        const params = new URLSearchParams();

        // Add all filters to params
        if (filters.query) params.append("q", filters.query);
        if (filters.minPrice)
          params.append("min_price", filters.minPrice.toString());
        if (filters.maxPrice)
          params.append("max_price", filters.maxPrice.toString());
        if (filters.vendor) params.append("vendor", filters.vendor);
        if (filters.categoryId)
          params.append("category_id", filters.categoryId);
        if (filters.category) params.append("category", filters.category);
        if (filters.subcategoryId)
          params.append("subcategory_id", filters.subcategoryId);
        if (filters.subcategory)
          params.append("subcategory", filters.subcategory);
        if (filters.sort) params.append("sort", mapSortToApi(filters.sort));
        if (filters.limit) params.append("limit", filters.limit.toString());
        if (filters.page) params.append("page", filters.page.toString());

        return `offers?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // Fetch single product
    getProductById: builder.query({
      query: (productId: string) => `products/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Fetch price history
    getPriceHistory: builder.query({
      query: ({
        productId,
        vendor,
      }: {
        productId: string;
        vendor?: string;
      }) => {
        const params = new URLSearchParams();
        if (vendor) params.append("vendor", vendor);

        return `products/${productId}/price-history?${params.toString()}`;
      },
      providesTags: (result, error, { productId }) => [
        { type: "PriceHistory", id: productId },
      ],
    }),

    // Fetch vendors
    getVendors: builder.query({
      query: () => "vendors",
      providesTags: ["Vendor"],
    }),

    // Fetch categories
    getCategories: builder.query({
      query: () => "categories",
      providesTags: ["Category"],
    }),

    // Fetch subcategories
    getSubcategories: builder.query({
      query: (categoryId: string) => `subcategories?category_id=${categoryId}`,
      providesTags: (result, error, categoryId) => [
        { type: "Subcategory", id: categoryId },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetPriceHistoryQuery,
  useGetVendorsQuery,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} = productApiSlice;
