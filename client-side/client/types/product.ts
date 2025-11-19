export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  vendorLogo?: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  subcategoryId?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  url: string;
  createdAt: string;
  discount?: number;
}

export interface SearchFilters {
  query: string;
  category?: string;
  categoryId?: string;
  subcategory?: string;
  subcategoryId?: string;
  vendors: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'relevance';

export interface SearchParams {
  filters: SearchFilters;
  sort: SortOption;
  page: number;
  perPage: number;
}
