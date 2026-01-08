import { Product, SearchFilters, SortOption } from "../types/product";

export function filterProducts(
  products: Product[],
  filters: SearchFilters,
): Product[] {
  let filtered = [...products];

  // Search query filter
  if (filters.query && filters.query.trim()) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.vendor.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Category ID filter
  if (filters.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
  }

  // Subcategory filter
  if (filters.subcategory) {
    filtered = filtered.filter((p) => p.subcategory === filters.subcategory);
  }

  // Subcategory ID filter
  if (filters.subcategoryId) {
    filtered = filtered.filter(
      (p) => p.subcategoryId === filters.subcategoryId,
    );
  }

  // Vendor filter
  if (filters.vendors && filters.vendors.length > 0) {
    filtered = filtered.filter((p) => filters.vendors!.includes(p.vendor));
  }
  // Min price filter
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }

  // Max price filter
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  // In stock filter
  if (filters.inStock !== undefined) {
    filtered = filtered.filter((p) => p.inStock === filters.inStock);
  }

  return filtered;
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);

    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);

    case "newest":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

    case "relevance":
    default:
      // For relevance, keep the original order (can be enhanced with scoring)
      return sorted;
  }
}

export function paginateProducts(
  products: Product[],
  page: number,
  perPage: number,
) {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    products: products.slice(startIndex, endIndex),
    totalPages: Math.ceil(products.length / perPage),
    totalResults: products.length,
    currentPage: page,
    hasNextPage: endIndex < products.length,
    hasPreviousPage: page > 1,
  };
}
