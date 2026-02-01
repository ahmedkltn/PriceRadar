import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@/lib/auth";
import { ProductListItem } from "@/types/product";

// Types for auth API
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
  };
}

export interface VerifyEmailRequest {
  uid: string;
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface SavedProduct {
  id: number;
  product_id: number;
  saved_at: string;
  product?: ProductListItem;
}

export interface SavedProductsResponse {
  saved_products: SavedProduct[];
}

export interface SaveProductRequest {
  product_id: number;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password2: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// Use environment variable or default to relative path
// In development, you may need to set VITE_AUTH_API to the full backend URL
// e.g., VITE_AUTH_API=http://localhost:8000/api/auth/
const envAuthBase = import.meta.env.VITE_AUTH_API || "/api/auth/";
const AUTH_API_BASE_URL = envAuthBase.endsWith("/")
  ? envAuthBase
  : `${envAuthBase}/`;

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: AUTH_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "SavedProduct"],
  endpoints: (builder) => ({
    // User registration
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "register/",
        method: "POST",
        body: credentials,
      }),
    }),

    // User login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
    }),

    // Email verification
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: ({ uid, token }) => ({
        url: "verify-email/",
        method: "POST",
        body: { uid, token },
      }),
    }),

    // User profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "me/",
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (data) => ({
        url: "me/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "change-password/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Saved products
    getSavedProducts: builder.query<SavedProductsResponse, void>({
      query: () => "saved-products/",
      providesTags: ["SavedProduct"],
    }),

    saveProduct: builder.mutation<SavedProduct, SaveProductRequest>({
      query: ({ product_id }) => ({
        url: "saved-products/",
        method: "POST",
        body: { product_id },
      }),
      invalidatesTags: ["SavedProduct"],
    }),

    unsaveProduct: builder.mutation<{ message: string }, number>({
      query: (product_id) => ({
        url: `saved-products/${product_id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedProduct"],
    }),

    // Check if product is saved (uses getSavedProducts and filters)
    isProductSaved: builder.query<boolean, number>({
      queryFn: async (productId, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ("saved-products/");
        if (result.error) {
          return { error: result.error };
        }
        const data = result.data as SavedProductsResponse;
        const isSaved = data.saved_products.some(
          (sp) => sp.product_id === productId
        );
        return { data: isSaved };
      },
      providesTags: (result, error, productId) => [
        { type: "SavedProduct", id: productId },
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetSavedProductsQuery,
  useSaveProductMutation,
  useUnsaveProductMutation,
  useIsProductSavedQuery,
} = authApiSlice;
