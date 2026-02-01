import { ImageWithFallback } from "./ImageWithFallback";
import { ProductListItem } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useSavedProducts } from "@/hooks/useSavedProducts";
import {
  useSaveProductMutation,
  useUnsaveProductMutation,
} from "@/store/auth/authApiSlice";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isProductSaved, isAuthenticated } = useSavedProducts();
  
  const isSaved = isProductSaved(product.product_id);
  
  const [saveProduct, { isLoading: isSaving }] = useSaveProductMutation();
  const [unsaveProduct, { isLoading: isUnsaving }] = useUnsaveProductMutation();

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    try {
      if (isSaved) {
        await unsaveProduct(product.product_id).unwrap();
        toast({
          title: "Product Removed",
          description: "Product removed from your saved list",
        });
      } else {
        await saveProduct({ product_id: product.product_id }).unwrap();
        toast({
          title: "Product Saved",
          description: "Product added to your saved list",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.error || "Failed to update saved products",
        variant: "destructive",
      });
    }
  };

  const handleViewDeal = () => {
    navigate(`/product/${product.product_id}`);
  };

  const priceValue =
    product.price !== null && product.price !== undefined
      ? Number(product.price)
      : null;

  return (
    <div className="bg-card rounded-[16px] border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <ImageWithFallback
          src={
            product.image_url ||
            "https://via.placeholder.com/400x400.png?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Save Button */}
        {isAuthenticated && (
          <button
            onClick={handleSaveToggle}
            disabled={isSaving || isUnsaving}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isSaved ? "Remove from saved" : "Save product"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isSaved
                  ? "fill-accent text-accent"
                  : "text-muted-foreground hover:text-accent"
              }`}
            />
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Vendor / offers */}
        <div className="flex items-center gap-2 mb-2">
          {product.vendor && (
            <span className="text-[12px] text-muted-foreground">
              {product.vendor}
            </span>
          )}
          {product.offers_count > 0 && (
            <>
              {product.vendor && <span className="text-muted-foreground">•</span>}
              <span className="text-[12px] text-primary">
                {product.offers_count} offer
                {product.offers_count === 1 ? "" : "s"}
              </span>
            </>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-[16px] font-semibold text-foreground mb-3 line-clamp-2 min-h-[3em]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          {priceValue !== null ? (
            <span className="text-2xl font-bold text-foreground">
              {priceValue.toLocaleString()} {product.currency || ""}
            </span>
          ) : (
            <span className="text-[14px] text-muted-foreground">
              Price not available
            </span>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleViewDeal}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-[12px] text-[14px] transition-all"
        >
          View Product
        </Button>
      </div>
    </div>
  );
}
