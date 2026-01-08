import {
  getPriceRange,
  getUniqueCategories,
  getUniqueVendors,
  getUniqueSubcategories,
} from "@/data/mockProducts";
import { SearchFilters } from "@/types/product";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
  onClose?: () => void;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  totalResults,
  onClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    vendor: true,
    subcategory: false,
    stock: true,
  });

  const isXSmallScreen = window.innerWidth < 450;
  const priceRange = getPriceRange();
  const categories = getUniqueCategories();
  const vendors = getUniqueVendors();
  const subcategories = getUniqueSubcategories(filters.category);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      query: filters.query, // Keep the search query
      category: undefined,
      categoryId: undefined,
      subcategory: undefined,
      subcategoryId: undefined,
      vendors: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "query") return false;
    if (value === undefined || value === "") return false;

    // Special handling for vendors array - only count if it has items
    if (key === "vendors") {
      return Array.isArray(value) && value.length > 0;
    }

    return true;
  }).length;

  // Mobile styles
  const mobileStyles = isXSmallScreen
    ? "fixed inset-0 z-50 h-screen w-screen overflow-y-auto bg-white rounded-none border-none"
    : "bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] h-fit sticky top-24";

  return (
    <div className={`p-6 ${mobileStyles}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Arimo',sans-serif] text-[20px] text-neutral-950">
            Filters
          </h2>
          <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
            {totalResults.toLocaleString()} results
          </p>
        </div>
        {/* Always show close button on mobile, conditionally on desktop */}
        {(isXSmallScreen || onClose) && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f3f3f5] rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full mb-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-['Arimo',sans-serif] text-[14px] transition-all"
        >
          Clear all filters ({activeFiltersCount})
        </button>
      )}

      <div className="space-y-4">
        {/* Category Filter */}
        <FilterSection
          title="Category"
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection("category")}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => {
                    // Always set the category when clicked, even if it's the same one
                    updateFilter("category", category);
                  }}
                  className="size-4 accent-purple-700 focus:ring-purple-700 cursor-pointer"
                />
                <span
                  className={`font-['Arimo',sans-serif] text-[14px] ${filters.category !== category ? "text-neutral-950" : "text-purple-800"} group-hover:text-purple-800 transition-colors`}
                >
                  {category}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Subcategory Filter (only show if category is selected) */}
        {filters.category && subcategories.length > 0 && (
          <FilterSection
            title="Subcategory"
            isExpanded={expandedSections.subcategory}
            onToggle={() => toggleSection("subcategory")}
          >
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <label
                  key={subcategory}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="subcategory"
                    checked={filters.subcategory === subcategory}
                    onChange={() =>
                      updateFilter(
                        "subcategory",
                        filters.subcategory === subcategory
                          ? undefined
                          : subcategory,
                      )
                    }
                    className="size-4 accent-purple-700 focus:ring-purple-700 cursor-pointer"
                  />
                  <span
                    className={`font-['Arimo',sans-serif] text-[14px] ${filters.subcategory !== subcategory ? "text-neutral-950" : "text-purple-800"} group-hover:text-purple-800 transition-colors`}
                  >
                    {subcategory}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection("price")}
        >
          <div className="space-y-3">
            <div>
              <label className="block font-['Arimo',sans-serif] text-[12px] text-[#717182] mb-2">
                Min Price: {filters.minPrice || priceRange.min}DT
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                value={filters.minPrice || priceRange.min}
                onChange={(e) =>
                  updateFilter("minPrice", Number(e.target.value))
                }
                className="w-full accent-purple-700"
              />
            </div>
            <div>
              <label className="block font-['Arimo',sans-serif] text-[12px] text-[#717182] mb-2">
                Max Price: {filters.maxPrice || priceRange.max}DT
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                value={filters.maxPrice || priceRange.max}
                onChange={(e) =>
                  updateFilter("maxPrice", Number(e.target.value))
                }
                className="w-full accent-purple-700"
              />
            </div>
            {/* Fixed input section */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    updateFilter(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-full bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] rounded-lg px-3 py-2 font-['Arimo',sans-serif] text-[14px] outline-none focus:border-[#ad46ff]"
                  min={0}
                />
              </div>
              <span className="text-[#717182] shrink-0">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    updateFilter(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-full bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] rounded-lg px-3 py-2 font-['Arimo',sans-serif] text-[14px] outline-none focus:border-[#ad46ff]"
                  min={0}
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Vendor Filter */}
        <FilterSection
          title="Vendor"
          isExpanded={expandedSections.vendor}
          onToggle={() => toggleSection("vendor")}
        >
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {vendors.map((vendor) => (
              <label
                key={vendor}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.vendors?.includes(vendor) || false}
                  onChange={() => {
                    const currentVendors = filters.vendors || [];
                    if (currentVendors.includes(vendor)) {
                      // Remove vendor if already selected
                      updateFilter(
                        "vendors",
                        currentVendors.filter((v) => v !== vendor),
                      );
                    } else {
                      // Add vendor if not selected
                      updateFilter("vendors", [...currentVendors, vendor]);
                    }
                  }}
                  className="size-4 accent-purple-700 focus:ring-purple-700 rounded cursor-pointer"
                />
                <span
                  className={`font-['Arimo',sans-serif] text-[14px] ${!filters.vendors?.includes(vendor) ? "text-neutral-950" : "text-purple-800"} group-hover:text-purple-800 transition-colors`}
                >
                  {vendor}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Stock Filter */}
        <FilterSection
          title="Availability"
          isExpanded={expandedSections.stock}
          onToggle={() => toggleSection("stock")}
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={(e) =>
                updateFilter("inStock", e.target.checked ? true : undefined)
              }
              className="size-4 accent-purple-700 focus:ring-purple-700 rounded cursor-pointer"
            />
            <span
              className={`font-['Arimo',sans-serif] text-[14px] ${filters.inStock !== true ? "text-neutral-950" : "text-purple-800"} group-hover:text-purple-800 transition-colors`}
            >
              In Stock Only
            </span>
          </label>
        </FilterSection>
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-[rgba(0,0,0,0.1)] pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="font-['Arimo',sans-serif] text-[16px] text-neutral-950 transition-colors">
          {title}
        </span>
        {isExpanded ? (
          <ChevronUp className="size-5 text-[#717182]" />
        ) : (
          <ChevronDown className="size-5 text-[#717182]" />
        )}
      </button>
      {isExpanded && <div>{children}</div>}
    </div>
  );
}
