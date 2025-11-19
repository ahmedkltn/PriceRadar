import { Star, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  const handleViewDeal = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] overflow-hidden hover:shadow-lg transition-all group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f9]">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-[#d4183d] text-white px-3 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="size-3" />
            <span className="font-['Arimo',sans-serif] text-[12px]">
              {product.discount}% OFF
            </span>
          </div>
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="font-['Arimo',sans-serif] text-white text-[16px] bg-neutral-950 px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Vendor */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
            {product.vendor}
          </span>
          {product.category && (
            <>
              <span className="text-[#717182]">•</span>
              <span className="font-['Arimo',sans-serif] text-[12px] text-[#ad46ff]">
                {product.category}
              </span>
            </>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-['Arimo',sans-serif] text-[16px] text-neutral-950 mb-2 line-clamp-2 min-h-[3em]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-[#ff6900] text-[#ff6900]" />
            <span className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
            ({product.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-['Arimo',sans-serif] text-[24px] text-neutral-950">
            {product.price.toLocaleString()}DT
          </span>
          {hasDiscount && (
            <span className="font-['Arimo',sans-serif] text-[14px] text-[#717182] line-through">
              {product.originalPrice?.toLocaleString()}DT
            </span>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleViewDeal}
          className="w-full text-white py-3 rounded-[12px] font-['Arimo',sans-serif] text-[14px] transition-all"
        >
          View Deal
        </Button>
      </div>
    </div>
  );
}
