import { useState, useEffect } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import FilterSidebar from "../components/FilterSidebar";
import { SearchFilters, SortOption } from "@/types/product";
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
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetVendorsQuery,
} from "@/store/products/productApiSlice";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const queryFromUrl = searchParams.get("q") || "";
  const categoryIdFromUrl = searchParams.get("category_id") || undefined;
  const categoryNameFromUrl = searchParams.get("category") || undefined;
  const subcategoryIdFromUrl = searchParams.get("subcategory_id") || undefined;
  const pageFromUrl = Number(searchParams.get("page") || 1);
  const [searchInput, setSearchInput] = useState(queryFromUrl);
  const [filters, setFilters] = useState<SearchFilters>({
    query: queryFromUrl || undefined,
    categoryId: categoryIdFromUrl,
    subcategoryId: subcategoryIdFromUrl,
    vendors: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [sortBy, setSortBy] = useState<SortOption>("price_asc");
  const [currentPage, setCurrentPage] = useState(Math.max(1, pageFromUrl));
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: vendorsData } = useGetVendorsQuery();

  // Get data by filters
  const {
    data: productsResponse,
    isLoading,
    isFetching,
    error,
  } = useGetProductsQuery({
    query: filters.query,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    vendors: filters.vendors,
    categoryId: filters.categoryId,
    subcategoryId: filters.subcategoryId,
    sort: sortBy,
    limit: resultsPerPage,
    page: currentPage,
  });

  // Update filters when URL parameters change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const categoryId = params.get("category_id") || undefined;
    const categoryName = params.get("category") || undefined;
    const subcategoryId = params.get("subcategory_id") || undefined;
    const pageFromUrl = Number(params.get("page") || 1);

    setFilters((prev) => ({
      ...prev,
      query: query || undefined,
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined,
    }));
    setSearchInput(query);
    setCurrentPage(Math.max(1, pageFromUrl));

    // If only category name is present (from older links), map it to id when categories are loaded
    if (!categoryId && categoryName && categoriesData?.categories) {
      const match = categoriesData.categories.find(
        (c) => c.name?.toLowerCase() === categoryName.toLowerCase(),
      );
      if (match) {
        const newParams = new URLSearchParams(params);
        newParams.set("category_id", match.id);
        newParams.delete("category");
        navigate(`/search?${newParams.toString()}`, { replace: true });
      }
    }
  }, [location.search, categoriesData, navigate]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, resultsPerPage]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);

    // Update URL with new filters
    const searchParams = new URLSearchParams();

    if (newFilters.query) searchParams.set("q", newFilters.query);
    if (newFilters.categoryId)
      searchParams.set("category_id", newFilters.categoryId);
    if (newFilters.subcategoryId)
      searchParams.set("subcategory_id", newFilters.subcategoryId);

    searchParams.set("page", "1");

    navigate(`/search?${searchParams.toString()}`, { replace: true });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    navigate(`/search?${params.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResultsPerPageChange = (perPage: number) => {
    setResultsPerPage(perPage);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages =
      Math.max(
        1,
        Math.ceil((productsResponse?.total || 0) / resultsPerPage),
      ) || 1;
    const current = Math.min(currentPage, totalPages);

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

  const products = productsResponse?.offers || [];
  const totalResults = productsResponse?.total || 0;
  const totalPages = Math.max(
    1,
    Math.ceil(totalResults / (productsResponse?.limit || resultsPerPage)),
  );
  const selectedCategoryName =
    categoriesData?.categories.find((c) => c.id === filters.categoryId)?.name ||
    undefined;

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
            {selectedCategoryName && ` in ${selectedCategoryName}`}
          </h1>
          <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182]">
            {isLoading && "Loading products..."}
            {!isLoading &&
              `${totalResults.toLocaleString()} product${
                totalResults === 1 ? "" : "s"
              } found`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              totalResults={totalResults}
              categories={categoriesData?.categories || []}
              vendors={vendorsData?.vendors || []}
            />
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
              <div className="absolute inset-y-0 left-0 w-[90%] max-w-[350px] bg-white overflow-y-auto">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  totalResults={totalResults}
                  onClose={() => setShowMobileFilters(false)}
                  categories={categoriesData?.categories || []}
                  vendors={vendorsData?.vendors || []}
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
                          const trimmed = searchInput.trim();
                          handleFiltersChange({
                            ...filters,
                            query: trimmed || undefined,
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
            {error ? (
              <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] p-12 text-center">
                <h3 className="font-['Arimo',sans-serif] text-[20px] text-neutral-950 mb-3">
                  Failed to load products
                </h3>
                <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182] mb-6">
                  Please check your connection or try again later.
                </p>
                <Button onClick={() => navigate(0)}>Retry</Button>
              </div>
            ) : isLoading || isFetching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[320px] bg-white rounded-[16px] border border-[rgba(0,0,0,0.05)] animate-pulse"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Page Info */}
                      <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182] text-center md:text-left">
                        Showing {(currentPage - 1) * resultsPerPage + 1} to{" "}
                        {Math.min(
                          currentPage * resultsPerPage,
                          totalResults,
                        )}{" "}
                        of {totalResults} results
                      </p>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
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
                          disabled={currentPage >= totalPages}
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
                    onClick={() =>
                      handleFiltersChange({
                        query: "",
                        categoryId: undefined,
                        subcategoryId: undefined,
                        vendors: [],
                        minPrice: undefined,
                        maxPrice: undefined,
                      })
                    }
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
