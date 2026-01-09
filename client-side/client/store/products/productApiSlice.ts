// src/store/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CategoryItem,
  Offer,
  PaginatedResponse,
  PriceHistory,
  ProductDetail,
  ProductListItem,
  VendorItem,
} from "@/types/product";

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
      return "price_asc";
  }
};

const envBase = import.meta.env.VITE_PRODUCT_API || "/api/v1/";
const API_BASE_URL = envBase.endsWith("/")
  ? envBase
  : `${envBase}/`;

export const productApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Product", "Vendor", "Category", "Subcategory", "PriceHistory"],
  endpoints: (builder) => ({
    // Fetch products with filters
    getProducts: builder.query<
      PaginatedResponse<ProductListItem>,
      {
        query?: string;
        minPrice?: number;
        maxPrice?: number;
        vendors?: string[];
        categoryId?: string;
        subcategoryId?: string;
        sort?: string;
        limit?: number;
        page?: number;
      } | void
    >({
      query: (
        filters: {
          query?: string;
          minPrice?: number;
          maxPrice?: number;
          vendors?: string[];
          categoryId?: string;
          subcategoryId?: string;
          sort?: string;
          limit?: number;
          page?: number;
        } = {},
      ) => {
        const params = new URLSearchParams();

        // Add all filters to params
        if (filters.query) params.append("q", filters.query);
        if (filters.minPrice !== undefined)
          params.append("min_price", filters.minPrice.toString());
        if (filters.maxPrice !== undefined)
          params.append("max_price", filters.maxPrice.toString());
        if (filters.vendors && filters.vendors.length > 0) {
          filters.vendors.forEach((v) => params.append("vendor", v));
        }
        if (filters.categoryId)
          params.append("category_id", filters.categoryId);
        if (filters.subcategoryId)
          params.append("subcategory_id", filters.subcategoryId);
        if (filters.sort) params.append("sort", mapSortToApi(filters.sort));
        if (filters.limit) params.append("limit", filters.limit.toString());
        if (filters.page) params.append("page", filters.page.toString());

        return `products?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // Fetch single product
    getProductById: builder.query<ProductDetail, string>({
      query: (productId: string) => `products/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Fetch price history
    getPriceHistory: builder.query<
      PriceHistory,
      {
        productId: string;
        vendor?: string;
      }
    >({
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

    // Fetch offers (e.g., for a specific product)
    getOffers: builder.query<
      PaginatedResponse<Offer>,
      {
        productId?: string | number;
        vendor?: string;
        categoryId?: string;
        subcategoryId?: string;
        page?: number;
        limit?: number;
        sort?: string;
      } | void
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.productId !== undefined) {
          params.append("product_id", String(filters.productId));
        }
        if (filters.vendor) params.append("vendor", filters.vendor);
        if (filters.categoryId)
          params.append("category_id", filters.categoryId);
        if (filters.subcategoryId)
          params.append("subcategory_id", filters.subcategoryId);
        if (filters.sort) params.append("sort", mapSortToApi(filters.sort));
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.page) params.append("page", String(filters.page));

        return `offers?${params.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // Fetch vendors
    getVendors: builder.query<{ vendors: VendorItem[] }, void>({
      query: () => "vendors",
      providesTags: ["Vendor"],
    }),

    // Fetch categories
    getCategories: builder.query<{ categories: CategoryItem[] }, void>({
      query: () => "categories",
      providesTags: ["Category"],
    }),

    // Fetch subcategories
    getSubcategories: builder.query<
      { subcategories: { id: string; name: string; category_id: string; category_name: string }[] },
      string
    >({
      query: (categoryId: string) =>
        `subcategories?category_id=${categoryId}`,
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
  useGetOffersQuery,
  useGetVendorsQuery,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} = productApiSlice;
