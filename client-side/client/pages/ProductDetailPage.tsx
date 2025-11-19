import { useEffect, useState } from "react";
import {
  Star,
  TrendingUp,
  Shield,
  Truck,
  ArrowLeft,
  ExternalLink,
  Heart,
  Share2,
  Check,
  ChevronDown,
  ExternalLinkIcon,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import Header from "../components/Header";

import { mockProducts } from "@/data/mockProducts";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isMobile = useIsMobile();
  const product = mockProducts.find((p) => p.id === productId) || null;
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate("/search");
    }
  }, [product, navigate]);

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const savingsAmount = hasDiscount
    ? product.originalPrice! - product.price
    : 0;

  // Mock additional images (in real app, these would come from the product data)
  const productImages = [product.image, product.image, product.image];

  // Mock related products
  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Mock competitor prices
  const competitorPrices = [
    {
      vendor: product.vendor,
      price: product.price,
      inStock: true,
      isBest: true,
    },
    {
      vendor: "Amazon",
      price: product.price + 50,
      inStock: true,
      isBest: false,
    },
    {
      vendor: "Best Buy",
      price: product.price + 30,
      inStock: true,
      isBest: false,
    },
    {
      vendor: "Walmart",
      price: product.price + 45,
      inStock: false,
      isBest: false,
    },
  ];

  // Mock specifications
  const specifications = [
    { label: "Brand", value: product.vendor },
    { label: "Category", value: product.category },
    { label: "Subcategory", value: product.subcategory || "N/A" },
    {
      label: "Stock Status",
      value: product.inStock ? "In Stock" : "Out of Stock",
    },
    { label: "Rating", value: `${product.rating}/5.0` },
    { label: "Reviews", value: product.reviewCount.toLocaleString() },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f9]">
      <Header />

      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#717182] hover:text-neutral-950 transition-colors group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-['Arimo',sans-serif] text-[14px]">
            Back
          </span>
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-[24px] border border-[rgba(0,0,0,0.1)] overflow-hidden aspect-square">
              <ImageWithFallback
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {hasDiscount && (
                <div className="absolute top-6 right-6 bg-[#d4183d] text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  <span className="font-['Arimo',sans-serif] text-[16px]">
                    {product.discount}% OFF
                  </span>
                </div>
              )}

              {!product.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="font-['Arimo',sans-serif] text-white text-[20px] bg-neutral-950 px-6 py-3 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative bg-white rounded-[12px] border-2 overflow-hidden aspect-square transition-all ${
                    selectedImage === index
                      ? "border-[#ad46ff] shadow-lg"
                      : "border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.3)]"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Category & Vendor */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-[#f3f3f5] px-4 py-2 rounded-full font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                {product.category}
              </span>
              <span className="bg-gradient-to-r from-[rgba(173,70,255,0.1)] to-[rgba(43,127,255,0.1)] border border-[rgba(173,70,255,0.2)] px-4 py-2 rounded-full font-['Arimo',sans-serif] text-[14px] text-[#ad46ff]">
                {product.vendor}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="font-['Arimo',sans-serif] text-[32px] md:text-[40px] text-neutral-950 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-[#ff6900] text-[#ff6900]"
                        : "fill-none text-[#e0e0e0]"
                    }`}
                  />
                ))}
              </div>
              <span className="font-['Arimo',sans-serif] text-[16px] text-neutral-950">
                {product.rating.toFixed(1)}
              </span>
              <span className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-[#f8f8f9] to-white rounded-[20px] border border-[rgba(0,0,0,0.1)] p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-['Arimo',sans-serif] text-[48px] text-neutral-950">
                  {product.price.toLocaleString()}DT
                </span>
                {hasDiscount && (
                  <span className="font-['Arimo',sans-serif] text-[24px] text-[#717182] line-through">
                    {product.originalPrice?.toLocaleString()}DT
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="font-['Arimo',sans-serif] text-[16px] text-[#00c950]">
                  You save {savingsAmount.toLocaleString()}DT (
                  {product.discount}% off)
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-['Arimo',sans-serif] text-[18px] text-neutral-950 mb-3">
                Description
              </h3>
              <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182] leading-relaxed">
                {product.description || ""}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] p-4">
                <div className="size-10 rounded-full bg-[#00c950]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="size-5 text-[#00c950]" />
                </div>
                <div>
                  <p className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
                    Verified
                  </p>
                  <p className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
                    Seller
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] p-4">
                <div className="size-10 rounded-full bg-[#2b7fff]/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="size-5 text-[#2b7fff]" />
                </div>
                <div>
                  <p className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
                    Free
                  </p>
                  <p className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
                    Shipping
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] p-4">
                <div className="size-10 rounded-full bg-[#ad46ff]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="size-5 text-[#ad46ff]" />
                </div>
                <div>
                  <p className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
                    Best
                  </p>
                  <p className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
                    Price
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 items-center">
              <Button
                onClick={() => navigate(product.url)}
                className="flex-1 bg-gradient-to-r text-white bg-indigo-600 hover:text-white hover:bg-indigo-700 py-4 rounded-[14px] font-['Arimo',sans-serif] text-[16px] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                View Deal
                <ExternalLink />
              </Button>
              <button className="flex items-center h-10 bg-white hover:bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] p-4 rounded-[14px] transition-all">
                <Heart className="text-[#717182]" />
              </button>
              <button className="flex items-center h-10 bg-white hover:bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] p-4 rounded-[14px] transition-all">
                <Share2 className="text-[#717182]" />
              </button>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mb-12">
          <h2 className="font-['Arimo',sans-serif] text-[28px] text-neutral-950 mb-6">
            Price Comparison
          </h2>
          <div className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f8f9] border-b border-[rgba(0,0,0,0.1)]">
                  <tr>
                    <th className="text-left py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                      Retailer
                    </th>
                    <th className="text-left py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                      Price
                    </th>
                    <th className="text-left py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-right py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competitorPrices.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-[rgba(0,0,0,0.05)] last:border-0 ${item.isBest ? "bg-purple-50" : ""}`}
                    >
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <span className="font-['Arimo',sans-serif] text-[14px] md:text-[16px] text-neutral-950 truncate">
                            {item.vendor}
                          </span>
                          {item.isBest && (
                            <span className="bg-[#00c950] text-white px-2 py-1 rounded-full text-[10px] md:text-[12px] whitespace-nowrap shrink-0">
                              Best Price
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 md:px-6">
                        <span className="font-['Arimo',sans-serif] text-[16px] md:text-[20px] text-neutral-950 whitespace-nowrap">
                          ${item.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 md:px-6">
                        <span
                          className={`font-['Arimo',sans-serif] text-[12px] md:text-[14px] whitespace-nowrap ${item.inStock ? "text-[#00c950]" : "text-[#717182]"}`}
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-4 px-4 md:px-6 text-right">
                        {isMobile ? (
                          <ExternalLinkIcon className="size-4" />
                        ) : (
                          <button
                            disabled={!item.inStock}
                            className={`px-4 md:px-6 py-2 rounded-lg font-['Arimo',sans-serif] text-[12px] md:text-[14px] transition-all whitespace-nowrap ${
                              item.inStock
                                ? "bg-[#030213] hover:bg-purple-800 text-white"
                                : "bg-[#f3f3f5] text-[#717182] cursor-not-allowed"
                            }`}
                          >
                            {item.inStock ? "Visit Store" : "Unavailable"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-12">
          <h2 className="font-['Arimo',sans-serif] text-[28px] text-neutral-950 mb-6">
            Specifications
          </h2>
          <div className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] p-6">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!showAllSpecs && "max-h-[200px] overflow-hidden"}`}
            >
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.05)]"
                >
                  <span className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                    {spec.label}
                  </span>
                  <span className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAllSpecs(!showAllSpecs)}
              className="mt-4 w-full flex items-center justify-center gap-2 text-[#ad46ff] hover:text-[#8a2fd9] transition-colors"
            >
              <span className="font-['Arimo',sans-serif] text-[14px]">
                {showAllSpecs ? "Show Less" : "Show More"}
              </span>
              <ChevronDown
                className={`size-5 transition-transform ${showAllSpecs ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-['Arimo',sans-serif] text-[28px] text-neutral-950 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <button
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] overflow-hidden hover:shadow-lg transition-all text-left group"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#f8f8f9]">
                    <ImageWithFallback
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-['Arimo',sans-serif] text-[14px] text-neutral-950 line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </p>
                    <p className="font-['Arimo',sans-serif] text-[20px] text-neutral-950">
                      {relatedProduct.price.toLocaleString()}DT
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
