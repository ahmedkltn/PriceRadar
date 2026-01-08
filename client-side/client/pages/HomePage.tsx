import { SearchFilters } from "@/types/product";
import Header from "../components/Header";
import { useState } from "react";
import svgPaths from "../components/svg-gbk5prcr4x";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    { name: "Phones", icon: "phone", color: "#2b7fff" },
    { name: "Laptops", icon: "laptop", color: "#ad46ff" },
    { name: "Electronics", icon: "monitor", color: "#00c950" },
    { name: "Audio", icon: "headphones", color: "#ff6900" },
    { name: "Cameras", icon: "camera", color: "#f6339a" },
    { name: "Wearables", icon: "watch", color: "#00b8db" },
  ];

  const trendingItems = [
    "iPhone 15 Pro",
    "Samsung Galaxy S24",
    "MacBook Pro M3",
    "AirPods Pro",
    "PlayStation 5",
  ];

  const onSearch = (filters: SearchFilters) => {
    console.log("Search triggered:", filters);
    
    // Navigate to search page with filters as URL parameters
    const searchParams = new URLSearchParams();
    
    if (filters.query) {
      searchParams.set('q', filters.query);
    }
    
    if (filters.category) {
      searchParams.set('category', filters.category);
    }
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch({
        query: searchQuery,
        vendors: []
      });
    }
  };

  const handleTrendingClick = (item: string) => {
    onSearch({
      query: item,
      vendors: []
    });
  };

  const handleCategoryClick = (category: string) => {
    onSearch({
      query: searchQuery, category,
      vendors: []
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f8f9]">
      <Header />

      {/* Hero Section */}
      <div className="max-w-[896px] mx-auto px-4 pt-16 pb-24 text-center">
        {/* AI Badge */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-[rgba(3,2,19,0.1)] to-[rgba(173,70,255,0.1)] border border-[rgba(3,2,19,0.2)]">
            <svg className="size-4" fill="none" viewBox="0 0 16 16">
              <path
                d={svgPaths.p1d19c880}
                stroke="#030213"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.33333"
              />
              <path
                d="M13.3333 1.33333V4"
                stroke="#030213"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.33333"
              />
              <path
                d="M14.6667 2.66667H12"
                stroke="#030213"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.33333"
              />
              <path
                d={svgPaths.p22966600}
                stroke="#030213"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.33333"
              />
            </svg>
            <span className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
              AI-Powered Price Comparison
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-6">
          <span className="block font-['Arimo',sans-serif] text-[56px] md:text-[72px] leading-[1] bg-clip-text text-transparent bg-gradient-to-r from-[rgb(10,10,10)] to-[rgba(10,10,10,0.7)]">
            Find the Best Deals
          </span>
          <span className="block font-['Arimo',sans-serif] text-[56px] md:text-[72px] leading-[1] bg-clip-text text-transparent bg-gradient-to-r from-[rgb(10,10,10)] to-[rgba(10,10,10,0.7)] mt-2">
            Across the Web
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-['Arimo',sans-serif] text-[20px] text-[#717182] max-w-[672px] mx-auto mb-12">
          Our AI instantly compares prices from hundreds of retailers to help
          you save money on every purchase.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-[672px] mx-auto mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#030213] to-[#ad46ff] rounded-[16px] blur-xl opacity-20" />
          <div className="relative bg-white rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] border-2 border-[rgba(0,0,0,0.1)]">
            <div className="flex mx-2 items-center flex-col sm:flex-row gap-2 sm:gap-0">
              {window.innerWidth >= 640 && (<div className="pl-6 pr-4 pt-4 sm:pt-0">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M17.5 17.5L13.8833 13.8833"
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.66667"
                  />
                  <path
                    d={svgPaths.pcddfd00}
                    stroke="#717182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.66667"
                  />
                </svg>
              </div>)}
              <input
                type="text"
                placeholder="Search for products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent py-3 sm:py-4 px-4 sm:px-0 font-['Arimo',sans-serif] text-[14px] text-neutral-950 placeholder:text-[#717182] outline-none w-full"
              />
              <Button
                type="submit"
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 sm:px-8 py-2.5 rounded-[14px] m-2 transition-all font-['Arimo',sans-serif] text-[14px] w-full sm:w-auto"
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        {/* Trending */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
            Trending:
          </span>
          {trendingItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleTrendingClick(item)}
              className="bg-white hover:bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] px-[13px] py-1.5 rounded-full transition-all font-['Arimo',sans-serif] text-[14px] text-neutral-950"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Browse by Category */}
      <div className="max-w-[896px] mx-auto px-4 pb-24">
        <h2 className="font-['Arimo',sans-serif] text-[16px] text-[#717182] text-center mb-8">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white hover:shadow-lg border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 transition-all group"
            >
              <div
                className="size-12 rounded-[14px] mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: category.color }}
              >
                {getCategoryIcon(category.icon)}
              </div>
              <p className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
                {category.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-[rgba(0,0,0,0.1)] py-16">
        <div className="max-w-[896px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-['Arimo',sans-serif] text-[48px] text-neutral-950 mb-2">
                500+
              </div>
              <div className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                Retailers
              </div>
            </div>
            <div>
              <div className="font-['Arimo',sans-serif] text-[48px] text-neutral-950 mb-2">
                1M+
              </div>
              <div className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                Products
              </div>
            </div>
            <div>
              <div className="font-['Arimo',sans-serif] text-[48px] text-neutral-950 mb-2">
                $200M+
              </div>
              <div className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                Saved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#030213] text-white py-8">
        <div className="max-w-[896px] mx-auto px-4 text-center">
          <p className="font-['Arimo',sans-serif] text-[14px] text-[rgba(255,255,255,0.6)]">
            © 2025 PriceRadar. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(icon: string) {
  const iconProps = {
    className: "size-6",
    stroke: "white",
    strokeWidth: "2",
    fill: "none",
  };

  switch (icon) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path
            d={svgPaths.p1adf7700}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 18H12.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path
            d={svgPaths.p3b60e6c0}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.054 15.987H3.946"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "monitor":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path
            d={svgPaths.p2ebe5280}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 21H16" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17V21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "headphones":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path
            d={svgPaths.peb51200}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path
            d={svgPaths.p1b108500}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={svgPaths.p16b88f0}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "watch":
      return (
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path
            d="M12 10V12.2L13.6 13.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={svgPaths.peb59000}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={svgPaths.pce04680}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={svgPaths.p3c6311f0}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}