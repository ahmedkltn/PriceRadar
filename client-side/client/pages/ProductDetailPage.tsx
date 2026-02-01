import { useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ExternalLinkIcon,
  TrendingUp,
  Heart,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Navbar } from "@/components/landing";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import {
  useGetOffersQuery,
  useGetPriceHistoryQuery,
  useGetProductByIdQuery,
} from "@/store/products/productApiSlice";
import { useSavedProducts } from "@/hooks/useSavedProducts";
import {
  useSaveProductMutation,
  useUnsaveProductMutation,
} from "@/store/auth/authApiSlice";
import { useToast } from "@/hooks/use-toast";
import { ReviewList } from "@/components/reviews/ReviewList";
import { StarRating } from "@/components/reviews/StarRating";
import { useGetReviewsQuery } from "@/store/reviews/reviewApiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth/authSlice";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  const { isProductSaved, isAuthenticated } = useSavedProducts();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId ?? "", { skip: !productId });

  const { data: priceHistory } = useGetPriceHistoryQuery(
    { productId: productId ?? "" },
    { skip: !productId },
  );

  const {
    data: offersResponse,
    isLoading: offersLoading,
  } = useGetOffersQuery(
    { productId, sort: "price_asc", limit: 50 },
    { skip: !productId },
  );

  const currentUser = useSelector(selectUser);
  const productIdNum = productId ? parseInt(productId, 10) : 0;
  
  // Get first page of reviews to find current user's review
  const { data: reviewsData } = useGetReviewsQuery(
    { productId: productIdNum, page: 1, limit: 100 },
    { skip: !productIdNum }
  );
  
  // Find current user's review from the reviews list
  const currentUserReview = currentUser && reviewsData?.reviews
    ? reviewsData.reviews.find((review) => review.user.id === currentUser.id) || null
    : null;

  const isSaved = productIdNum > 0 ? isProductSaved(productIdNum) : false;

  const [saveProduct, { isLoading: isSaving }] = useSaveProductMutation();
  const [unsaveProduct, { isLoading: isUnsaving }] = useUnsaveProductMutation();

  useEffect(() => {
    if (error && "status" in error && error.status === 404) {
      navigate("/search");
    }
  }, [error, navigate]);

  const offers = offersResponse?.offers || [];
  const cheapest = product?.cheapest_offer;

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    if (!productIdNum) return;

    try {
      if (isSaved) {
        await unsaveProduct(productIdNum).unwrap();
        toast({
          title: "Product Removed",
          description: "Product removed from your saved list",
        });
      } else {
        await saveProduct({ product_id: productIdNum }).unwrap();
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto p-8 md:px-8 py-[100px]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px]">Back</span>
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-4">
        {isLoading || !product ? (
          <div className="bg-card rounded-[20px] border border-border p-12 text-center">
            <p className="text-lg text-foreground">
              Loading product details...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div className="relative bg-card rounded-[24px] border border-border overflow-hidden aspect-square">
                  <ImageWithFallback
                    src={
                      product.image_url ||
                      "https://via.placeholder.com/600x600.png?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {cheapest?.price && (
                    <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full flex items-center gap-2">
                      <TrendingUp className="size-5" />
                      <span className="text-[16px]">
                        Best price: {Number(cheapest.price).toLocaleString()}{" "}
                        {product.currency || ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Category & Vendor */}
                <div className="flex items-center gap-3 flex-wrap">
                  {product.category && (
                    <span className="bg-muted px-4 py-2 rounded-full text-[14px] text-muted-foreground">
                      {product.category}
                    </span>
                  )}
                  {product.subcategory && (
                    <span className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 px-4 py-2 rounded-full text-[14px] text-primary">
                      {product.subcategory}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
                      {product.name}
                    </h1>
                    {product.review_stats && product.review_stats.total_reviews > 0 && (
                      <div className="flex items-center gap-2">
                        <StarRating
                          rating={product.review_stats.average_rating || 0}
                          size="sm"
                        />
                        <span className="text-sm text-muted-foreground">
                          ({product.review_stats.total_reviews} review{product.review_stats.total_reviews !== 1 ? "s" : ""})
                        </span>
                      </div>
                    )}
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={handleSaveToggle}
                      disabled={isSaving || isUnsaving}
                      className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      aria-label={isSaved ? "Remove from saved" : "Save product"}
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors ${
                          isSaved
                            ? "fill-accent text-accent"
                            : "text-muted-foreground hover:text-accent"
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Price */}
                <div className="bg-card rounded-[20px] border border-border p-6">
                  {cheapest ? (
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl md:text-5xl font-bold text-foreground">
                        {Number(cheapest.price).toLocaleString()}{" "}
                        {product.currency || ""}
                      </span>
                      <span className="text-[16px] text-muted-foreground">
                        at {cheapest.vendor}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg text-muted-foreground">
                      No pricing available yet.
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Description
                  </h3>
                  <p className="text-[16px] text-muted-foreground leading-relaxed">
                    {product.description || "No description available."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 items-center">
                  <Button
                    disabled={!cheapest?.url}
                    onClick={() => {
                      if (cheapest?.url) {
                        window.open(cheapest.url, "_blank", "noopener");
                      }
                    }}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-4 rounded-[14px] text-[16px] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    View Deal
                    <ExternalLink />
                  </Button>
                </div>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Vendor Prices
              </h2>
              <div className="bg-card rounded-[20px] border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  {offersLoading ? (
                    <div className="p-6">
                      <p className="text-[14px] text-muted-foreground">
                        Loading offers...
                      </p>
                    </div>
                  ) : offers.length === 0 ? (
                    <div className="p-6">
                      <p className="text-[14px] text-muted-foreground">
                        No vendor offers available yet.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-muted/30 border-b border-border">
                        <tr>
                          <th className="text-left py-4 px-4 md:px-6 text-[12px] md:text-[14px] text-muted-foreground whitespace-nowrap">
                            Vendor
                          </th>
                          <th className="text-left py-4 px-4 md:px-6 text-[12px] md:text-[14px] text-muted-foreground whitespace-nowrap">
                            Price
                          </th>
                          <th className="text-left py-4 px-4 md:px-6 text-[12px] md:text-[14px] text-muted-foreground whitespace-nowrap">
                            Updated
                          </th>
                          <th className="text-right py-4 px-4 md:px-6 text-[12px] md:text-[14px] text-muted-foreground whitespace-nowrap">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {offers.map((offer) => (
                          <tr
                            key={offer.offer_id}
                            className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-4 px-4 md:px-6">
                              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                <span className="text-[14px] md:text-[16px] text-foreground truncate">
                                  {offer.vendor}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 md:px-6">
                              <span className="text-[16px] md:text-[20px] font-semibold text-foreground whitespace-nowrap">
                                {Number(offer.price).toLocaleString()}{" "}
                                {offer.currency}
                              </span>
                            </td>
                            <td className="py-4 px-4 md:px-6">
                              <span className="text-[12px] md:text-[14px] text-muted-foreground whitespace-nowrap">
                                {offer.scraped_at
                                  ? new Date(
                                      offer.scraped_at,
                                    ).toLocaleDateString()
                                  : "--"}
                              </span>
                            </td>
                            <td className="py-4 px-4 md:px-6 text-right">
                              {offer.url ? (
                                <a
                                  href={offer.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-[12px] md:text-[14px] transition-all whitespace-nowrap bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                  Visit Store
                                  <ExternalLinkIcon className="size-4" />
                                </a>
                              ) : (
                                <span className="text-[12px] text-muted-foreground">
                                  No link
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="mb-12">
              <PriceHistoryChart
                priceHistory={priceHistory}
                currency={product.currency || "TND"}
                isLoading={isLoading}
              />
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
              <ReviewList
                productId={productIdNum}
                reviewStats={product.review_stats}
                currentUserReview={currentUserReview}
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
