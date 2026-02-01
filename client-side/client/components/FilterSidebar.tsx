import { CategoryItem, SearchFilters, VendorItem } from "@/types/product";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
  onClose?: () => void;
  categories: CategoryItem[];
  vendors: VendorItem[];
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  totalResults,
  onClose,
  categories,
  vendors,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    vendor: true,
    subcategory: false,
  });

  const isXSmallScreen = window.innerWidth < 450;
  const priceRange = { min: 0, max: 5000 };
  const selectedCategory = categories.find((c) => c.id === filters.categoryId);
  const subcategories = selectedCategory?.subcategories ?? [];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      query: filters.query, // Keep the search query text
      categoryId: undefined,
      subcategoryId: undefined,
      vendors: [],
      minPrice: undefined,
      maxPrice: undefined,
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
    ? "fixed inset-0 z-50 h-screen w-screen overflow-y-auto bg-background rounded-none border-none"
    : "bg-card rounded-[16px] border border-border h-fit sticky top-24";

  return (
    <div className={`p-6 ${mobileStyles}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Filters
          </h2>
          <p className="text-[14px] text-muted-foreground">
            {totalResults.toLocaleString()} results
          </p>
        </div>
        {/* Always show close button on mobile, conditionally on desktop */}
        {(isXSmallScreen || onClose) && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full mb-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg text-[14px] transition-all"
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
                key={category.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.categoryId === category.id}
                  onChange={() => {
                    updateFilter("categoryId", category.id);
                    updateFilter("subcategoryId", undefined);
                  }}
                  className="size-4 accent-primary focus:ring-primary cursor-pointer"
                />
                <span
                  className={`text-[14px] ${filters.categoryId !== category.id ? "text-foreground" : "text-primary"} group-hover:text-primary transition-colors`}
                >
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Subcategory Filter (only show if category is selected) */}
        {filters.categoryId && subcategories.length > 0 && (
          <FilterSection
            title="Subcategory"
            isExpanded={expandedSections.subcategory}
            onToggle={() => toggleSection("subcategory")}
          >
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <label
                  key={subcategory.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="subcategory"
                    checked={filters.subcategoryId === subcategory.id}
                    onChange={() =>
                      updateFilter(
                        "subcategoryId",
                        filters.subcategoryId === subcategory.id
                          ? undefined
                          : subcategory.id,
                      )
                    }
                    className="size-4 accent-primary focus:ring-primary cursor-pointer"
                  />
                  <span
                    className={`text-[14px] ${filters.subcategoryId !== subcategory.id ? "text-foreground" : "text-primary"} group-hover:text-primary transition-colors`}
                  >
                    {subcategory.name}
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
              <label className="block text-[12px] text-muted-foreground mb-2">
                Min Price: {filters.minPrice ?? priceRange.min}DT
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                value={filters.minPrice ?? priceRange.min}
                onChange={(e) =>
                  updateFilter("minPrice", Number(e.target.value))
                }
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="block text-[12px] text-muted-foreground mb-2">
                Max Price: {filters.maxPrice ?? priceRange.max}DT
              </label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                value={filters.maxPrice ?? priceRange.max}
                onChange={(e) =>
                  updateFilter("maxPrice", Number(e.target.value))
                }
                className="w-full accent-primary"
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
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                  min={0}
                />
              </div>
              <span className="text-muted-foreground shrink-0">-</span>
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
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
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
                key={vendor.name}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.vendors?.includes(vendor.name) || false}
                  onChange={() => {
                    const currentVendors = filters.vendors || [];
                    if (currentVendors.includes(vendor.name)) {
                      updateFilter(
                        "vendors",
                        currentVendors.filter((v) => v !== vendor.name),
                      );
                    } else {
                      updateFilter("vendors", [...currentVendors, vendor.name]);
                    }
                  }}
                  className="size-4 accent-primary focus:ring-primary rounded cursor-pointer"
                />
                <span
                  className={`text-[14px] ${!filters.vendors?.includes(vendor.name) ? "text-foreground" : "text-primary"} group-hover:text-primary transition-colors`}
                >
                  {vendor.display_name || vendor.name}
                </span>
              </label>
            ))}
          </div>
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
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="text-[16px] font-semibold text-foreground transition-colors">
          {title}
        </span>
        {isExpanded ? (
          <ChevronUp className="size-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-5 text-muted-foreground" />
        )}
      </button>
      {isExpanded && <div>{children}</div>}
    </div>
  );
}
