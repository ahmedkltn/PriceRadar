import { ImageWithFallback } from "./ImageWithFallback";
import { ProductListItem } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const handleViewDeal = () => {
    navigate(`/product/${product.product_id}`);
  };

  const priceValue =
    product.price !== null && product.price !== undefined
      ? Number(product.price)
      : null;

  return (
    <div className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.1)] overflow-hidden hover:shadow-lg transition-all group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f9]">
        <ImageWithFallback
          src={
            product.image_url ||
            "https://via.placeholder.com/400x400.png?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Vendor / offers */}
        <div className="flex items-center gap-2 mb-2">
          {product.vendor && (
            <span className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
              {product.vendor}
            </span>
          )}
          {product.offers_count > 0 && (
            <>
              {product.vendor && <span className="text-[#717182]">•</span>}
              <span className="font-['Arimo',sans-serif] text-[12px] text-[#ad46ff]">
                {product.offers_count} offer
                {product.offers_count === 1 ? "" : "s"}
              </span>
            </>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-['Arimo',sans-serif] text-[16px] text-neutral-950 mb-3 line-clamp-2 min-h-[3em]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          {priceValue !== null ? (
            <span className="font-['Arimo',sans-serif] text-[24px] text-neutral-950">
              {priceValue.toLocaleString()} {product.currency || ""}
            </span>
          ) : (
            <span className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
              Price not available
            </span>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleViewDeal}
          className="w-full text-white py-3 rounded-[12px] font-['Arimo',sans-serif] text-[14px] transition-all"
        >
          View Product
        </Button>
      </div>
    </div>
  );
}
