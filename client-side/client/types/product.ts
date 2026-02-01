export interface Offer {
  offer_id: string;
  product_id: number | null;
  product_name: string;
  price: number | string;
  currency: string;
  vendor: string;
  product_image: string | null;
  url: string;
  scraped_at: string;
  category_id?: string | null;
  category?: string | null;
  subcategory_id?: string | null;
  subcategory?: string | null;
}

export interface ProductListItem {
  product_id: number;
  name: string;
  image_url?: string | null;
  price?: number | string | null;
  currency?: string | null;
  vendor?: string | null;
  url?: string | null;
  scraped_at?: string | null;
  offers_count: number;
}

export interface CheapestOffer {
  vendor: string;
  price: number | string;
  url: string;
  scraped_at: string;
  currency?: string | null;
}

import { ReviewStats } from "./review";

export interface ProductDetail {
  product_id: number;
  name: string;
  category?: string | null;
  category_id?: string | null;
  subcategory?: string | null;
  subcategory_id?: string | null;
  brand?: string | null;
  description?: string | null;
  image_url?: string | null;
  currency?: string | null;
  cheapest_offer: CheapestOffer | null;
  offers_count: number;
  review_stats?: ReviewStats | null;
}

export interface PriceHistoryPoint {
  vendor: string;
  price: number | string;
  scraped_at: string;
}

export interface PriceHistory {
  product_id: number;
  product_name: string;
  history: PriceHistoryPoint[];
}

export interface VendorItem {
  name: string;
  display_name: string;
  logo: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  vendors: string[];
  minPrice?: number;
  maxPrice?: number;
}

export type SortOption = "price_asc" | "price_desc" | "newest" | "relevance";

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  offers: T[]; // backend uses "offers" key even for products
}
