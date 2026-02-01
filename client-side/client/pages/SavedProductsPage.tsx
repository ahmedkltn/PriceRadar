import { Navbar } from "@/components/landing";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useGetSavedProductsQuery, useUnsaveProductMutation } from "@/store/auth/authApiSlice";
import { Heart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ProductListItem } from "@/types/product";

export default function SavedProductsPage() {
  const { data, isLoading, error } = useGetSavedProductsQuery();
  const [unsaveProduct] = useUnsaveProductMutation();
  const { toast } = useToast();

  const handleRemove = async (productId: number) => {
    try {
      await unsaveProduct(productId).unwrap();
      toast({
        title: "Product Removed",
        description: "Product removed from your saved list",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.error || "Failed to remove product",
        variant: "destructive",
      });
    }
  };

  const savedProducts = data?.saved_products || [];
  const products: ProductListItem[] = savedProducts
    .filter((sp) => sp.product)
    .map((sp) => ({
      product_id: sp.product_id,
      name: sp.product!.name,
      image_url: sp.product!.image_url,
      price: sp.product!.price || sp.product!.cheapest_offer?.price,
      currency: sp.product!.currency,
      vendor: sp.product!.cheapest_offer?.vendor,
      offers_count: sp.product!.offers_count || 0,
      url: sp.product!.cheapest_offer?.url,
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Saved Products
            </h1>
          </div>
          <p className="text-[16px] text-muted-foreground">
            {isLoading
              ? "Loading your saved products..."
              : `${savedProducts.length} product${
                  savedProducts.length === 1 ? "" : "s"
                } saved`}
          </p>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-card rounded-[20px] border border-border p-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Failed to load saved products
            </h3>
            <p className="text-[16px] text-muted-foreground mb-6">
              Please check your connection or try again later.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[320px] bg-card rounded-[16px] border border-border animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.product_id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemove(product.product_id)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground transition-all z-10"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-[20px] border border-border p-12 text-center">
            <div className="max-w-[400px] mx-auto">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                No Saved Products Yet
              </h3>
              <p className="text-[16px] text-muted-foreground mb-6">
                Start saving products you're interested in by clicking the heart
                icon on any product.
              </p>
              <Button
                onClick={() => (window.location.href = "/search")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Browse Products
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
