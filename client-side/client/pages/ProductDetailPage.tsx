import { useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ExternalLinkIcon,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  useGetOffersQuery,
  useGetPriceHistoryQuery,
  useGetProductByIdQuery,
} from "@/store/products/productApiSlice";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

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

  useEffect(() => {
    if (error && "status" in error && error.status === 404) {
      navigate("/search");
    }
  }, [error, navigate]);

  const offers = offersResponse?.offers || [];
  const cheapest = product?.cheapest_offer;

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
          <span className="font-['Arimo',sans-serif] text-[14px]">Back</span>
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-12">
        {isLoading || !product ? (
          <div className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] p-12 text-center">
            <p className="font-['Arimo',sans-serif] text-[18px] text-neutral-950">
              Loading product details...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div className="relative bg-white rounded-[24px] border border-[rgba(0,0,0,0.1)] overflow-hidden aspect-square">
                  <ImageWithFallback
                    src={
                      product.image_url ||
                      "https://via.placeholder.com/600x600.png?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {cheapest?.price && (
                    <div className="absolute top-6 right-6 bg-[#d4183d] text-white px-4 py-2 rounded-full flex items-center gap-2">
                      <TrendingUp className="size-5" />
                      <span className="font-['Arimo',sans-serif] text-[16px]">
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
                    <span className="bg-[#f3f3f5] px-4 py-2 rounded-full font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                      {product.category}
                    </span>
                  )}
                  {product.subcategory && (
                    <span className="bg-gradient-to-r from-[rgba(173,70,255,0.1)] to-[rgba(43,127,255,0.1)] border border-[rgba(173,70,255,0.2)] px-4 py-2 rounded-full font-['Arimo',sans-serif] text-[14px] text-[#ad46ff]">
                      {product.subcategory}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="font-['Arimo',sans-serif] text-[32px] md:text-[40px] text-neutral-950 leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="bg-gradient-to-br from-[#f8f8f9] to-white rounded-[20px] border border-[rgba(0,0,0,0.1)] p-6">
                  {cheapest ? (
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-['Arimo',sans-serif] text-[48px] text-neutral-950">
                        {Number(cheapest.price).toLocaleString()}{" "}
                        {product.currency || ""}
                      </span>
                      <span className="font-['Arimo',sans-serif] text-[16px] text-[#717182]">
                        at {cheapest.vendor}
                      </span>
                    </div>
                  ) : (
                    <span className="font-['Arimo',sans-serif] text-[18px] text-[#717182]">
                      No pricing available yet.
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-['Arimo',sans-serif] text-[18px] text-neutral-950 mb-3">
                    Description
                  </h3>
                  <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182] leading-relaxed">
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
                    className="flex-1 bg-gradient-to-r text-white bg-indigo-600 hover:text-white hover:bg-indigo-700 py-4 rounded-[14px] font-['Arimo',sans-serif] text-[16px] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    View Deal
                    <ExternalLink />
                  </Button>
                </div>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="mb-12">
              <h2 className="font-['Arimo',sans-serif] text-[28px] text-neutral-950 mb-6">
                Vendor Prices
              </h2>
              <div className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] overflow-hidden">
                <div className="overflow-x-auto">
                  {offersLoading ? (
                    <div className="p-6">
                      <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                        Loading offers...
                      </p>
                    </div>
                  ) : offers.length === 0 ? (
                    <div className="p-6">
                      <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                        No vendor offers available yet.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-[#f8f8f9] border-b border-[rgba(0,0,0,0.1)]">
                        <tr>
                          <th className="text-left py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                            Vendor
                          </th>
                          <th className="text-left py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                            Price
                          </th>
                          <th className="text-left py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                            Updated
                          </th>
                          <th className="text-right py-4 px-4 md:px-6 font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {offers.map((offer) => (
                          <tr
                            key={offer.offer_id}
                            className="border-b border-[rgba(0,0,0,0.05)] last:border-0"
                          >
                            <td className="py-4 px-4 md:px-6">
                              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                <span className="font-['Arimo',sans-serif] text-[14px] md:text-[16px] text-neutral-950 truncate">
                                  {offer.vendor}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 md:px-6">
                              <span className="font-['Arimo',sans-serif] text-[16px] md:text-[20px] text-neutral-950 whitespace-nowrap">
                                {Number(offer.price).toLocaleString()}{" "}
                                {offer.currency}
                              </span>
                            </td>
                            <td className="py-4 px-4 md:px-6">
                              <span className="font-['Arimo',sans-serif] text-[12px] md:text-[14px] text-[#717182] whitespace-nowrap">
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
                                  className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg font-['Arimo',sans-serif] text-[12px] md:text-[14px] transition-all whitespace-nowrap bg-[#030213] hover:bg-purple-800 text-white"
                                >
                                  Visit Store
                                  <ExternalLinkIcon className="size-4" />
                                </a>
                              ) : (
                                <span className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
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

            {/* Price History */}
            <div className="mb-12">
              <h2 className="font-['Arimo',sans-serif] text-[28px] text-neutral-950 mb-6">
                Price History
              </h2>
              <div className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] p-6">
                {priceHistory && priceHistory.history.length > 0 ? (
                  <div className="space-y-3">
                    {priceHistory.history.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b border-[rgba(0,0,0,0.05)] pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-['Arimo',sans-serif] text-[14px] text-neutral-950">
                            {Number(point.price).toLocaleString()}{" "}
                            {product.currency || ""}
                          </p>
                          <p className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
                            {point.vendor}
                          </p>
                        </div>
                        <span className="font-['Arimo',sans-serif] text-[12px] text-[#717182]">
                          {new Date(point.scraped_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                    No history available yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
