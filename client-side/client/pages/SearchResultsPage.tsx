import { useState, useEffect } from "react";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import FilterSidebar from "../components/FilterSidebar";
import { mockProducts } from "@/data/mockProducts";
import { SearchFilters, SortOption } from "@/types/product";
import {
  filterProducts,
  sortProducts,
  paginateProducts,
} from "@/lib/productFilters";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetProductsQuery } from "@/store/products/productApiSlice";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const queryFromUrl = searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || undefined;
  const [searchInput, setSearchInput] = useState(queryFromUrl);
  const [filters, setFilters] = useState<SearchFilters>({
    query: queryFromUrl,
    category: categoryFromUrl,
    categoryId: undefined,
    subcategory: undefined,
    subcategoryId: undefined,
    vendors: [],
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
  });

  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get data by filters
  const { data: products, isLoading, error } = useGetProductsQuery(filters);

  // Update filters when URL parameters change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || undefined;

    setFilters((prev) => ({
      ...prev,
      query,
      category,
    }));
    setCurrentPage(1);
  }, [location.search]);

  // Apply filters and sorting
  const filteredProducts = filterProducts(mockProducts, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);
  const paginatedResults = paginateProducts(
    sortedProducts,
    currentPage,
    resultsPerPage,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters, sortBy, resultsPerPage]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    const isCategoryChanged =
      newFilters.category && newFilters.category !== filters.category;
    setFilters(newFilters);

    // Update URL with new filters
    const searchParams = new URLSearchParams();

    if (newFilters.query) {
      searchParams.set("q", newFilters.query);
    }

    if (newFilters.category) {
      searchParams.set("category", newFilters.category);
    }
    if (isCategoryChanged)
      setFilters({ ...newFilters, subcategory: undefined });

    navigate(`/search?${searchParams.toString()}`, { replace: true });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResultsPerPageChange = (perPage: number) => {
    setResultsPerPage(perPage);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = paginatedResults.totalPages;
    const current = currentPage;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push("...");
      }

      // Show pages around current
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(totalPages - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-[#f8f8f9]">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="font-['Arimo',sans-serif] text-[32px] md:text-[40px] text-neutral-950 mb-2">
            {filters.query
              ? `Search results for "${filters.query}"`
              : "All Products"}
            {filters.category && ` in ${filters.category}`}
          </h1>
          <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182]">
            {paginatedResults.totalResults.toLocaleString()} products found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              totalResults={paginatedResults.totalResults}
            />
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
              <div className="absolute inset-y-0 left-0 w-[90%] max-w-[350px] bg-white overflow-y-auto">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  totalResults={paginatedResults.totalResults}
                  onClose={() => setShowMobileFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div>
            {/* Controls Bar */}
            <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="md:hidden flex items-center justify-center gap-2 bg-[#030213] text-white px-4 py-3 rounded-lg w-full"
                >
                  <Filter className="size-5" />
                  <span className="font-['Arimo',sans-serif] text-[14px]">
                    Filters
                  </span>
                </button>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full flex-wrap">
                  {/* Search by name - Wider input */}
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <Label className="font-['Arimo',sans-serif] text-[14px] text-[#717182] whitespace-nowrap shrink-0">
                      Search by name:
                    </Label>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFiltersChange({
                            ...filters,
                            query: searchInput.trim(),
                          });
                        }
                      }}
                      className="flex-1 min-w-0"
                      placeholder="Search products by name, brand, or model..."
                    />
                  </div>

                  {/* Right-aligned controls */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-wrap sm:ml-auto">
                    {/* Sort By */}
                    <div className="flex items-center gap-3">
                      <Label className="font-['Arimo',sans-serif] text-[14px] text-[#717182] whitespace-nowrap">
                        Sort by:
                      </Label>
                      <Select
                        value={sortBy}
                        onValueChange={(value) =>
                          handleSortChange(value as SortOption)
                        }
                      >
                        <SelectTrigger className="bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] rounded-lg px-4 py-2 font-['Arimo',sans-serif] text-[14px] text-neutral-950 outline-none focus:border-[#ad46ff] cursor-pointer min-w-[140px] h-10">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="price_asc">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price_desc">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Results Per Page */}
                    <div className="flex items-center gap-3">
                      <Label className="font-['Arimo',sans-serif] text-[14px] text-[#717182] whitespace-nowrap">
                        Show:
                      </Label>
                      <Select
                        value={resultsPerPage.toString()}
                        onValueChange={(value) =>
                          handleResultsPerPageChange(Number(value))
                        }
                      >
                        <SelectTrigger className="bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] rounded-lg px-4 py-2 font-['Arimo',sans-serif] text-[14px] text-neutral-950 outline-none focus:border-[#ad46ff] cursor-pointer min-w-[120px] h-10">
                          <SelectValue placeholder="Select per page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem defaultChecked value="10">
                            10 per page
                          </SelectItem>
                          <SelectItem value="25">25 per page</SelectItem>
                          <SelectItem value="50">50 per page</SelectItem>
                          <SelectItem value="100">100 per page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedResults.products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {paginatedResults.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {paginatedResults.totalPages > 1 && (
                  <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Page Info */}
                      <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182] text-center md:text-left">
                        Showing {(currentPage - 1) * resultsPerPage + 1} to{" "}
                        {Math.min(
                          currentPage * resultsPerPage,
                          paginatedResults.totalResults,
                        )}{" "}
                        of {paginatedResults.totalResults} results
                      </p>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!paginatedResults.hasPreviousPage}
                          className="p-2 rounded-lg border border-[rgba(0,0,0,0.1)] hover:bg-[#f3f3f5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft className="size-5" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                          {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-2 md:px-3 py-2 font-['Arimo',sans-serif] text-[14px] text-[#717182]"
                              >
                                ...
                              </span>
                            ) : (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`px-3 md:px-4 py-2 rounded-lg font-['Arimo',sans-serif] text-[14px] transition-all ${
                                  currentPage === page
                                    ? "bg-[#ad46ff] text-white"
                                    : "border border-[rgba(0,0,0,0.1)] hover:bg-[#f3f3f5]"
                                }`}
                              >
                                {page}
                              </button>
                            ),
                          )}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!paginatedResults.hasNextPage}
                          className="p-2 rounded-lg border border-[rgba(0,0,0,0.1)] hover:bg-[#f3f3f5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] p-12 text-center">
                <div className="max-w-[400px] mx-auto">
                  <div className="size-20 rounded-full bg-[#f3f3f5] flex items-center justify-center mx-auto mb-6">
                    <Filter className="size-10 text-[#717182]" />
                  </div>
                  <h3 className="font-['Arimo',sans-serif] text-[24px] text-neutral-950 mb-3">
                    No products found
                  </h3>
                  <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182] mb-6">
                    Try adjusting your filters or search query to find what
                    you're looking for.
                  </p>
                  <Button
                    onClick={() => navigate("/search")}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-['Arimo',sans-serif] text-[14px] transition-all"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
