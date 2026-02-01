import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/auth/authSlice";
import { useGetSavedProductsQuery } from "@/store/auth/authApiSlice";
import { isAuthenticated as checkAuth } from "@/lib/auth";

/**
 * Hook to get saved products and check if a product is saved
 * Fetches saved products once and provides a lookup function
 */
export function useSavedProducts() {
  const isAuthenticatedRedux = useSelector(selectIsAuthenticated);
  const hasTokens = checkAuth();
  const isAuthenticated = isAuthenticatedRedux || hasTokens;

  console.log({isAuthenticated, isAuthenticatedRedux, hasTokens});
  const { data, isLoading, error } = useGetSavedProductsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Create a Set of saved product IDs for O(1) lookup
  const savedProductIds = useMemo(() => {
    if (!data?.saved_products) return new Set<number>();
    return new Set(data.saved_products.map((sp) => sp.product_id));
  }, [data]);

  const isProductSaved = (productId: number): boolean => {
    return savedProductIds.has(productId);
  };

  return {
    savedProducts: data?.saved_products || [],
    savedProductIds,
    isProductSaved,
    isLoading,
    error,
    isAuthenticated,
  };
}
